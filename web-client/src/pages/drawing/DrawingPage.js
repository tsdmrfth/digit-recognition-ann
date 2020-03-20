import React, {createRef, useReducer, useState} from 'react'
import {Animated, Image as RNImage, Text, TextInput, TouchableOpacity, View} from 'react-native'
import CanvasDraw from 'react-canvas-draw'
import reducer, {initialState} from "../../service/prediction/reducer";
import styles, {alertContainerWidth, drawingPreviewContainerWidth} from "./styles";
import strings from "../../../assets/strings";
import html2canvas from "html2canvas";
import {getPredictionForDrawing, resetState, setActualValueForDrawing} from "../../service/prediction/actions";
import loading from '../../../assets/loading.svg'
import closeIcon from '../../../assets/close.svg'
import colors from "../../../assets/colors"
import eraserIcon from '../../../assets/eraser.svg'

const {
    View: AnimatedView,
    spring,
    Value,
    timing
} = Animated
const errorContainerTranslateX = new Value(-alertContainerWidth)
const predictionContainerTranslateX = new Value(-alertContainerWidth)
const drawingPreviewContainerTranslateX = new Value(window.innerWidth + drawingPreviewContainerWidth)
const eraserIconOpacity = new Value(0)

export default function () {

    const [state, dispatch] = useReducer(reducer, initialState)
    const {error, prediction, percentage, isModelTrained} = state
    const [actualValue, setActualValue] = useState(undefined)
    const drawingPreviewDiv = createRef()
    const canvasDrawRef = createRef()
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
        closeIcon: closeIconStyle,
        drawingPreviewContainer,
        drawingPreview,
        eraserIconContainer,
        refreshIcon: refreshIconStyle,
        bottomButtonsContainer
    } = styles
    const {
        predictionForYourDrawing,
        submitActualValueIfPredictionIsWrong,
        actualValue: actualValue_,
        getPredictions,
        submit,
        prediction: prediction_,
        percentage: percentage_,
        refresh
    } = strings
    const {sky, lightSky} = colors

    if (isModelTrained) {
        startSpringAnimation(errorContainerTranslateX, -alertContainerWidth)
    } else if (error) {
        startSpringAnimation(errorContainerTranslateX, 20)
    }

    if (prediction !== null) {
        startSpringAnimation(predictionContainerTranslateX, 20)
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
    const drawingPreviewContainerAnimatedStyle = {
        transform: [
            {
                translateX: drawingPreviewContainerTranslateX
            }
        ]
    }
    const newGetPredictionButtonStyle = {backgroundColor: prediction ? lightSky : sky}
    const eraserIconAnimatedStyle = {opacity: eraserIconOpacity}
    const newSubmitButtonStyle = {opacity: actualValue ? 1 : 0.8}

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
                        onPress={submitActualValueForDrawing}
                        style={[submitActualValueButton, newSubmitButtonStyle]}>
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
                ref={canvasDrawRef}
                canvasHeight={600}
                brushColor={'white'}
                className="canvasDraw"
                disabled={!!prediction}
                backgroundColor={'black'}/>

            <AnimatedView style={[drawingPreviewContainer, drawingPreviewContainerAnimatedStyle]}>
                <div
                    ref={drawingPreviewDiv}
                    style={drawingPreview}/>
            </AnimatedView>

            <View style={bottomButtonsContainer}>

                <AnimatedView style={[eraserIconContainer, eraserIconAnimatedStyle]}>

                    <TouchableOpacity onPress={resetDrawingState}>
                        <RNImage
                            source={eraserIcon}
                            style={refreshIconStyle}/>
                    </TouchableOpacity>

                </AnimatedView>

                <TouchableOpacity
                    disabled={!!prediction}
                    onPress={handleButtonPress}
                    style={[getPredictionButton, newGetPredictionButtonStyle]}>
                    <Text style={buttonText}>
                        {getPredictions}
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    )

    async function handleButtonPress() {
        const canvas = await getCanvasFromDrawing()
        canvas.toBlob(getPredictionForDrawing(dispatch), 'image/png', 1)
        drawingPreviewDiv.current.appendChild(canvas)
        startSpringAnimation(drawingPreviewContainerTranslateX, 1)
        startTimingAnimation(eraserIconOpacity, 1)
    }

    function getCanvasFromDrawing() {
        return new Promise(resolve => {
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

                    resolve(canvas)
                }
            })
        })
    }

    function startSpringAnimation(animation, toValue, endCallback) {
        spring(animation, {toValue, tension: 20}).start(endCallback)
    }

    function startTimingAnimation(animation, toValue, duration = 500, endCallback) {
        timing(animation, {toValue, duration}).start(endCallback)
    }

    function removeDrawingPreview() {
        startSpringAnimation(drawingPreviewContainerTranslateX, window.innerWidth + 300)
        drawingPreviewDiv.current.removeChild(drawingPreviewDiv.current.lastChild)
    }

    function hidePredictionContainer() {
        startSpringAnimation(predictionContainerTranslateX, -alertContainerWidth)
    }

    function resetDrawingState() {
        startTimingAnimation(eraserIconOpacity, 0)
        removeDrawingPreview()
        startSpringAnimation(predictionContainerTranslateX, -alertContainerWidth)
        canvasDrawRef.current.clear()
        resetState(dispatch)
    }

    async function submitActualValueForDrawing() {
        if (actualValue) {
            const canvas = await getCanvasFromDrawing()
            canvas.toBlob(blob => setActualValueForDrawing(blob, actualValue), 'image/png', 1)
        } else {
            alert(strings.pleaseEnterActualValue)
        }
    }

}