import React, {useReducer, useState} from 'react'
import {Animated, Image as RNImage, Text, TextInput, TouchableOpacity, View} from 'react-native'
import CanvasDraw from 'react-canvas-draw'
import reducer, {initialState} from "../../service/prediction/reducer";
import styles, {alertContainerWidth} from "./styles";
import strings from "../../../assets/strings";
import html2canvas from "html2canvas";
import {getPredictionForDrawing} from "../../service/prediction/actions";
import loading from '../../../assets/loading.svg'
import closeIcon from '../../../assets/close.svg'

const {
    View: AnimatedView,
    spring
} = Animated
const errorContainerTranslateX = new Animated.Value(-alertContainerWidth)
const predictionContainerTranslateX = new Animated.Value(-alertContainerWidth)

export default () => {

    const [state, dispatch] = useReducer(reducer, initialState)
    const {error, prediction, percentage, isModelTrained} = state
    const [actualValue, setActualValue] = useState(undefined)
    const {
        container,
        getPredictionButton,
        buttonText,
        canvasDraw,
        errorContainer,
        alertText,
        predictionContainer,
        predictionTitleText,
        predictionText,
        feedbackContainer,
        actualValueInput,
        submitActualValueButton,
        closeIconContainer,
        closeIcon: closeIconStyle
    } = styles
    const {
        predictionForYourDrawing,
        submitActualValueIfPredictionIsWrong,
        actualValue: actualValue_,
        getPredictions,
        submit,
        prediction: prediction_,
        percentage: percentage_
    } = strings

    if (isModelTrained) {
        startAnimation(errorContainerTranslateX, -alertContainerWidth)
    } else if (error) {
        startAnimation(errorContainerTranslateX, 20)
    }

    if (prediction) {
        startAnimation(predictionContainerTranslateX, 20)
    }

    const errorContainerAnimatedStyle = {
        transform: [
            {
                translateX: errorContainerTranslateX
            }
        ]
    }

    const predictionContainerAnimatedStyle = {
        transform: [
            {
                translateX: predictionContainerTranslateX
            }
        ]
    }

    return (
        <View style={container}>

            <AnimatedView style={[errorContainer, errorContainerAnimatedStyle]}>
                <Text style={alertText}>
                    {error}
                </Text>
                <img src={loading} alt={'Loading'}/>
            </AnimatedView>

            <AnimatedView style={[predictionContainer, predictionContainerAnimatedStyle]}>

                <Text style={[alertText, predictionTitleText]}>
                    {predictionForYourDrawing}
                </Text>

                <Text style={[alertText, predictionText]}>
                    {`${prediction_}: ${prediction} ${percentage_}: ${percentage}`}
                </Text>

                <Text style={alertText}>
                    {submitActualValueIfPredictionIsWrong}
                </Text>

                <View style={feedbackContainer}>

                    <TextInput
                        maxLength={1}
                        value={actualValue}
                        style={actualValueInput}
                        placeholder={actualValue_}
                        onChangeText={text => setActualValue(Number(text))}/>

                    <TouchableOpacity
                        style={submitActualValueButton}>
                        <Text style={buttonText}>
                            {submit}
                        </Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity
                    style={closeIconContainer}
                    onPress={hidePredictionContainer}>
                    <RNImage
                        source={closeIcon}
                        style={closeIconStyle}/>
                </TouchableOpacity>

            </AnimatedView>

            <CanvasDraw
                hideGrid
                hideInterface
                brushRadius={30}
                canvasWidth={600}
                style={canvasDraw}
                canvasHeight={600}
                brushColor={'white'}
                className="canvasDraw"
                backgroundColor={'black'}/>

            <TouchableOpacity
                style={getPredictionButton}
                onPress={handleButtonPress}>
                <Text style={buttonText}>
                    {getPredictions}
                </Text>
            </TouchableOpacity>

        </View>
    )

    function handleButtonPress() {
        html2canvas(document.getElementsByClassName('canvasDraw').item(0)).then(canvas => {
            const imageString = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
            const image = new Image()
            image.src = imageString
            image.onload = function (event) {
                const loadedImage = event.path[0]
                const MAX_WIDTH = 8
                const MAX_HEIGHT = 8
                let width = loadedImage.naturalWidth
                let height = loadedImage.naturalHeight

                if ((width > MAX_WIDTH) || (height > MAX_HEIGHT)) {
                    if ((width / height) > (MAX_WIDTH / MAX_HEIGHT)) {
                        height *= MAX_WIDTH / width
                        width = MAX_WIDTH
                    } else {
                        width *= MAX_HEIGHT / height
                        height = MAX_HEIGHT
                    }

                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(image, 0, 0, width, height)
                }

                canvas.toBlob(getPredictionForDrawing(dispatch), 'image/png', 1)
            }
        })
    }

    function startAnimation(animation, toValue) {
        spring(animation, {toValue, tension: 40}).start()
    }

    function hidePredictionContainer() {
        startAnimation(predictionContainerTranslateX, -alertContainerWidth)
    }

}