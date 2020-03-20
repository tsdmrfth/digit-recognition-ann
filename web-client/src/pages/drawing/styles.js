import colors from "../../../assets/colors";

export const errorContainerWidth = 450

export default {
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.midnight,
        alignItems: 'center',
        paddingTop: 100
    },
    button: {
        padding: 5,
        marginTop: 20,
        height: 40,
        borderRadius: 5,
        backgroundColor: colors.sun,
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
        borderColor: colors.sun,
        borderRadius: 10,
        shadowOpacity: 0.9,
        shadowColor: 'black',
        shadowOffset: {
            width: 2,
            height: 2
        }
    },
    errorContainer: {
        width: errorContainerWidth,
        height: 100,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: colors.red,
        position: 'absolute',
        left: 0,
        borderRadius: 10
    },
    errorText: {
        fontSize: 22,
        color: 'white',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 20,
        height: 20
    }
}