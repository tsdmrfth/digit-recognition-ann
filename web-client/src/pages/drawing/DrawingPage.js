import React, {useReducer} from 'react'
import {Animated, Text, TouchableOpacity, View} from 'react-native'
import CanvasDraw from 'react-canvas-draw'
import reducer, {initialState} from "../../service/prediction/reducer";
import styles from "./styles";
import strings from "../../../assets/strings";
import html2canvas from "html2canvas";
import {getPredictionForDrawing} from "../../service/prediction/actions";
import loading from '../../../assets/loading.svg'

const {
    View: AnimatedView,
    spring
} = Animated

export default () => {

    const [{error, prediction}, dispatch] = useReducer(reducer, initialState);
    const {container, button, buttonText, canvasDraw, errorContainer, errorText} = styles
    const errorContainerTranslateX = new Animated.Value(-0)

    if (error) {
        spring(errorContainerTranslateX, {
            toValue: 20,
            tension: 40
        }).start()
    } else if (prediction) {
        alert(`Prediction for your drawing: ${prediction}`)
    }

    const errorContainerAnimatedStyle = {
        transform: [
            {
                translateX: errorContainerTranslateX
            }
        ]
    }

    return (
        <View style={container}>

            <AnimatedView style={[errorContainer, errorContainerAnimatedStyle]}>
                <Text style={errorText}>
                    {error}
                </Text>
                <img src={loading} alt={'Loading'}/>
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
                onPress={handleButtonPress}
                style={button}>
                <Text style={buttonText}>
                    {strings.getPredictions}
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


}