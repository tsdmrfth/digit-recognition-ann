import colors from "../../../../../assets/colors";

export default {
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
    buttonText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold'
    },
    submitStatusImage: {
        width: 40,
        height: 40
    }
}