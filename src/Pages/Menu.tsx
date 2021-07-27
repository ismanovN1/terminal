import React, { useEffect, useState } from 'react';
import { View, Image, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Text, Dimensions, ActivityIndicator } from 'react-native';
import globalStyles from '../utils/globalStyles';
import { useAppSelector, useAppDispatch } from '../utils/hooks'
import Scaner from './Scaner';
const Menu: React.FC = () => {
    const state = useAppSelector((state) => state.mainState)
    const dispatch = useAppDispatch()
    const [scanning, setScanning] = useState(false)
    const gStyle = globalStyles(state.size)
    const style = styles(state.size)

    if(scanning) return <Scaner setScanning={setScanning}/>
    return <View style={[style.container]}>
        <Image source={require('../assets/logo.png')} style={style.logo} />
        <View style={style.buttonContainer}>
            <TouchableOpacity disabled={state.loader} onPress={()=>setScanning(true)} style={[gStyle.button, style.button]}>
                <Text style={{ color: 'white', fontSize: 20 * state.size, fontWeight: "bold" }}>QR-Код</Text>
                {state.loader?<ActivityIndicator size='small' color='blue' />:<Image source={require('../assets/Arrow.png')} style={style.Arrow} />}
                
            </TouchableOpacity>
        </View>
    </View>


}

export default React.memo(()=><Menu/>);

const styles = (size: number) => StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FDEB04',
        height: Dimensions.get('window').height,
        flexDirection: "column",
        justifyContent: 'space-between',
        alignItems: 'center',
        resizeMode: "cover",
    },

    Arrow: {
        width: 24 * size,
        height: 10 * size,

    },
    logo: {
        marginTop: 122 * size,
        width: 256 * size,
        height: 253 * size,
    },

    buttonContainer: {
        marginBottom: 40 * size,
        alignItems: 'center',

    },
    button: {
        paddingLeft: 30 * size,
        paddingRight: 30 * size,
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }

});