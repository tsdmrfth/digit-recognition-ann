import colors from "../../../assets/colors";

export const alertContainerWidth = 450

export default {
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.midnight,
        alignItems: 'center',
        paddingTop: 100
    },
    getPredictionButton: {
        padding: 5,
        marginTop: 20,
        height: 40,
        borderRadius: 5,
        backgroundColor: colors.sky,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold'
    },
    canvasDraw: {
        borderStyle: 'solid',
        borderColor: colors.light,
        borderRadius: 10,
        shadowOpacity: 0.9,
        shadowColor: 'black',
        shadowOffset: {
            width: 2,
            height: 2
        }
    },
    errorContainer: {
        width: alertContainerWidth,
        height: 100,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: colors.light,
        position: 'absolute',
        left: 0,
        borderRadius: 10
    },
    alertText: {
        fontSize: 22,
        color: 'white',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderColor: colors.midnight,
        paddingBottom: 10
    },
    predictionContainer: {
        padding: 10,
        width: alertContainerWidth,
        alignItems: 'flex-start',
        backgroundColor: colors.river,
        position: 'absolute',
        left: 0,
        borderRadius: 10
    },
    predictionTitleText: {
        fontWeight: '900',
        borderBottomWidth: 0,
        paddingBottom: 0
    },
    feedbackContainer: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    actualValueInput: {
        fontWeight: '700',
        borderRadius: 5,
        width: '%50',
        color: colors.river,
        height: 40,
        backgroundColor: 'white',
        padding: 5
    },
    submitActualValueButton: {
        padding: 5,
        height: 40,
        borderRadius: 5,
        backgroundColor: colors.light,
        justifyContent: 'center',
        alignItems: 'center',
    },
    predictionText: {
        fontWeight: '400',
        marginBottom: 10,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderColor: colors.midnight,
        paddingBottom: 10
    },
    closeIconContainer: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    closeIcon: {
        width: 24,
        height: 24
    }
}