import React from 'react'
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native'
import styles from './styles'
import strings from "../../../../../assets/strings"
import loadingIcon from '../../../../../assets/loading.svg'
import tickIcon from '../../../../../assets/tick.svg'

export default class Feedback extends React.Component {

    state = {
        actualValue: '',
        isLoading: false,
        isSubmitSuccess: false
    }

    render() {
        const {
            actualValue: actualValue_,
            submit,
        } = strings
        const {
            feedbackContainer,
            buttonText,
            actualValueInput,
            submitActualValueButton
        } = styles
        const {
            state: {actualValue},
            submitActualValue,
            renderSubmitStatusImage
        } = this

        return (
            <View style={feedbackContainer}>

                <TextInput
                    maxLength={1}
                    value={actualValue}
                    style={actualValueInput}
                    placeholder={actualValue_}
                    onChangeText={text => this.setState({actualValue: text})}/>

                {renderSubmitStatusImage()}

                <TouchableOpacity
                    style={submitActualValueButton}
                    onPress={submitActualValue}>
                    <Text style={buttonText}>
                        {submit}
                    </Text>
                </TouchableOpacity>

            </View>
        )
    }

    submitActualValue = () => this.props.onSubmit(this.state.actualValue)

    renderSubmitStatusImage = () => {
        const {isLoading, isSubmitSuccess} = this.state
        let imageSource

        if (isLoading) {
            imageSource = loadingIcon
        } else if (isSubmitSuccess) {
            imageSource = tickIcon
        }

        if (imageSource) {
            return (
                <Image
                    source={imageSource}
                    style={styles.submitStatusImage}/>
            )
        }
    }

    updateState(newState) {
        this.setState({...newState})
    }

    resetState() {
        this.setState({
            actualValue: '',
            isLoading: false,
            isSubmitSuccess: false
        })
    }

}