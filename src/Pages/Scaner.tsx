'use strict';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    AppRegistry,
    BackHandler,
    Dimensions,
    Easing,
    Image,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { setOpertype, setProduct, setUIDInventory } from '../redux/mainSlice';
import { Parser } from '../utils/helpers';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { prod } from '../utils/interfaces';

const Scaner: React.FC<any> = (props:any) => {
    const state = useAppSelector((state) => state.mainState)

    const [torch, setTorch] = useState(false);
    const [wait, setWait] = useState(false);
    const dispatch = useAppDispatch()
    const styles = style(state.size, state.sizeHeight)
    const animatedValue = new Animated.Value(0)
    const barType = !(state.products && state.products.length >0) ? RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE : RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.EAN_13


    React.useEffect(() => {
        animate()
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            goBack
          );
      
          return () => backHandler.remove();
    }, [])
    React.useEffect(() => {
        animate()
    }, [torch])


// for animation scaner (red line)
    const animate = () => {
        animatedValue.setValue(0)
        Animated.timing(
            animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: false

            }
        ).start(() => animate())

    }
    const movingMargin = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 360 * state.sizeHeight, 0]
    })

    const onRead = async (scd) => {
        const {barcodes} = scd
        if(barcodes.length > 0){
            setWait(true)
            let e = barcodes[0]

            if(!state.loader){
           
                if(state.products && state.products.length >0){
                    const product = state.products.find((item:prod)=>String(item.barcode).includes(String(e.data)) && e.data.length >11 )
                    console.log(scd)
                    if(product) {
                        dispatch(setProduct(product))
                        props.setScanning(false)
                    }else{
                        ToastAndroid.show(
                            'T???????? ???? ????????????',
                            ToastAndroid.SHORT,
                          );
                          console.log(e.data);
                          
                        //props.setScanning(false)
                    }
                    
                }else{
                    const data = await Parser(e.data, state.token, state.isBoss)
                    console.log(data)
                    if(data)
                    { 
                        dispatch(setOpertype(data.opertype))
                        dispatch(setUIDInventory(data.UID))
                    }
                }
               }
               setWait(false)
        }
    };

    const goBack = ()=>{
if(!(state.products && state.products.length >0)){
    dispatch(setUIDInventory(null))
    dispatch(setOpertype(null))
}
        props.setScanning(false)
        return true
    }
    return (
        <View style={styles.container}>
            <RNCamera
                style={styles.preview}
                flashMode={
                    torch
                        ? RNCamera.Constants.FlashMode.torch
                        : RNCamera.Constants.FlashMode.off
                }
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
                // onBarCodeRead={onRead}
                //googleVisionBarcodeType={barType} 
                //googleVisionBarcodeType={ RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.EAN_13 } 
                onGoogleVisionBarcodesDetected={wait && state.loader ? ()=>{} : onRead}
            />
            
            <View style={styles.cloth} />
            <View style={styles.line} >
                <Animated.View                 // Special animatable View
                    style={[styles.redLine, { top: movingMargin }]}
                /></View>
            {/* <TouchableOpacity
                style={styles.cancel}
            >
            </TouchableOpacity> */}
            <TouchableOpacity onPress={goBack} style={styles.back} ><Image style={styles.logo}  source={require('../assets/logo.png')} /></TouchableOpacity>
            <TouchableOpacity
                style={styles.torch}
                onPress={() => setTorch((prev) => !prev)}>
                <Text style={torch ? styles.torchOn : styles.torchOff}>
                    {torch ? '??? On' : '??? Off'}
                </Text>
            </TouchableOpacity>
            {
                state.loader ? <Image style={styles.loader} source={require('../assets/loader.gif')} />:<Text style={styles.info}>??? ???????????????????????? {state.products?'??????????':'QR'}-??????</Text>
            }

        </View>
    );
};

export default Scaner;

const style = (size: number, sizeH: number) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,.5)',
        justifyContent: 'center',
    },
    cancel: {
        position: 'absolute',
        width: 60 * size,
        height: 40 * size,
        left: 20 * size,
        top: 30 * size,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,.2)',
    },
    preview: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    scaning: {
        width: 250 * size,
        height: 250 * size,
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    torch: {
        position: 'absolute',
        width: 80 * size,
        height: 40 * size,
        right: 20 * size,
        top: 30 * size,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 20 * size,
        backgroundColor: 'rgba(255,255,255,.7)',
    },
    back:{
        position: 'absolute',
        left: 20 * size,
        top: 30 * size,
    },
    logo: {   
        width: 40 * size,
        height: 40 * size,
        resizeMode:'stretch'
    },
    torchOff: {
        color: 'black',
        fontSize: 24 * size,
    },
    torchOn: {
        color: 'white',
        fontSize: 24 * size,
    },
    redLine: {
        width: '100%',
        height: 2 * sizeH,
        position: 'relative',
        backgroundColor: 'red'
    },
    cloth: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderColor: 'rgba(130, 122, 122,.7)',
        borderTopWidth: 177 * sizeH,
        borderRightWidth: 42 * size,
        borderBottomWidth: 273 * sizeH,
        borderLeftWidth: 42 * size,
    },
    line: {
        position: 'absolute',
        top: 177 * sizeH,
        left: 42 * size,
        width: 291 * size,
        height: 362 * sizeH,
        borderRadius: 20 * size

    },
    loader: {
        position: 'absolute',
        top: 580 * sizeH,
        left: 152 * size,
        width: 70 * size,
        height: 80 * size,
        resizeMode: 'stretch',
    },
    info:{
        color:'white',
        fontWeight:'bold',
        fontStyle:'italic',
        position: 'absolute',
        top: 580 * sizeH,
        left:0,
        width:'100%',
        textAlign:'center',
        fontSize:15*size
    }
});

