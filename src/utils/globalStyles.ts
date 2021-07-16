import { StyleSheet } from "react-native";

export default (size: number) => StyleSheet.create({
    button: {
        width: 315 * size,
        height: 60 * size,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15 * size
    }

});