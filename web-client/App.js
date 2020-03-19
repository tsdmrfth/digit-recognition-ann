import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import './src/App.css'
import html2canvas from 'html2canvas'
import CanvasDraw from 'react-canvas-draw'

export default function App() {

    const {container, button, buttonText, canvasDraw} = styles

    return (
        <View style={container}>

            <CanvasDraw
                hideGrid
                hideInterface
                brushRadius={30}
                canvasWidth={600}
                canvasHeight={600}
                brushColor={'white'}
                className="canvasDraw"
                backgroundColor={'black'}/>

            <TouchableOpacity
                onPress={handleButtonPress}
                style={button}>
                <Text style={buttonText}>
                    GET
                </Text>
            </TouchableOpacity>

            <a id="link"/>

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

                const link = document.getElementById('link')
                link.setAttribute('download', 'MintyPaper.png')
                link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
                )
                link.click()
            }
        })
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#7b7a7a',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: 120,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#d7d8e7',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    buttonText: {
        color: '#241616',
        fontSize: 22,
        fontWeight: 'bold'
    },
    canvasDraw: {
        transform: [
            {
                scale: 200
            }
        ]
    }
})
