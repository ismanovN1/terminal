import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
    Animated,
    ImageBackground,
    ToastAndroid,
    Vibration,
    Dimensions,
} from 'react-native';
import { append, appendPlus, clear, reset, setCurrentToken, setPinCode, setToken, setUnlock } from '../redux/mainSlice';
import { Sum } from '../utils/helpers';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check } from '../redux/mainThunk';


const PinScreen: React.FC<any> = (props) => {
    const state = useAppSelector((state) => state.mainState)
    const dispatch = useAppDispatch()
    const style = useMemo(()=>styles(state.size, state.sizeHeight),[])
    const [pin, setPin] = useState('')
    const [pass, setPass] = useState('')
    const [star, setStar] = useState('')
    const [lock, setLock] = useState(false)
    const [show, setShow] = useState(false)
    const [text, setText] = useState('')
    const [ attempt, setAttempt ] = useState(0)
    const [ time, setTime ] = useState(10)
    const shakeAnimation =  useRef(new Animated.Value(0)).current
    useEffect( () => {
        state.pin?.length === 5 && authCurrent()
        state.pin?.length ? setText('Bведите ПИН-код'): setText('Bведите новый PIN-код') 
         return ()=>FingerprintScanner.release();
    }, []);
    
    useEffect( () => {
         if(lock){
            setTimeout(() => {
                setTime(prev=>prev-1)
            }, 1000);
            if(time === 0){
                setLock(false),
                setTime(10)
                setAttempt(prev=>prev-1)
            }
         }
    }, [time,lock]);

    
    useEffect( () => {
        console.log(pass);
        if (pass.length === 5) main()
   }, [pass]);
   const main = ()=>{
    
        if(state.pin){
            if(state.pin === pass) {
                dispatch(check(state.currentToken))
                remove()
            }
        else {
            if(attempt > 4) {
                setLock(true)
            }
            startShake()
            Vibration.vibrate(1000)
            remove()
            setAttempt(prev=>prev+1)
            ToastAndroid.show(
                'Bы неправильно ввели PIN ',
                ToastAndroid.SHORT,
              );
        }
        }else{
            if(pin){
                if(pin === pass){
                    AsyncStorage.setItem('@pin', pin).then(()=>dispatch(setUnlock(true)))
                    
                }else{
                    startShake()
                    Vibration.vibrate(1000)
                    remove()
                    setText('Bведите новый PIN-код')
                    setPin('')
                    ToastAndroid.show('PIN-коды не совпадают ',ToastAndroid.SHORT);
                }
            }else{
                remove()
                setPin(pass)
                setText('Повторите PIN код')
            }
        }
   } 
   const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
 }

 

    const authCurrent = ()=> {
        
        FingerprintScanner
          .authenticate({ title: 'Log in with Biometrics' })
          .then((Biometrics) =>{
            dispatch(check(state.currentToken));
          })
          .catch(error => console.log(error))
        }
    
    const onType = (symbol: string) => {
        if(pass.length <5 && !lock)
        {
            setPass((prev:string)=>prev+symbol)
            setStar((prev:string)=>prev+'*')
        }
    }

    
    const clear = () => {
            setPass(prev=>prev.slice(0,-1))
            setStar(prev=>prev.slice(0,-1))
    }
    const remove = () => {
        setPass('')
        setStar('')
    }
    const exit = async() =>{
        
            await AsyncStorage.setItem('@pin', '')
            await AsyncStorage.setItem('@token', '')
            dispatch(setPinCode(''))
            dispatch(setCurrentToken(''))
            dispatch(setToken(''))
            props.exit && props.exit()
        
    }
    
    const keyboardItems = [[['1', '2', '3'], ['4', '5', '6'],['7', '8', '9'] ], [require('../assets/clear.png'), require('../assets/plus.png'), require('../assets/done.png')]]
    const KeyboardNumbers = useCallback(() => <Numbers authCurrent={authCurrent} remove={remove} onType={onType} clear={clear} state={state} numbers={keyboardItems[0]} style={style} />, [])
    
    
    return <ImageBackground source={require('../assets/backImage.jpg')} style={style.container}>
          {state.pin ?<TouchableOpacity onPress={exit} style={style.header}><View style={style.backButton} ><Image style={style.Icon} source={require('../assets/forgotPass.png')} /></View><Text style={style.headerText}>Забыли ПИН-код?</Text></TouchableOpacity>:<View style={style.header}/>}

        <View style={style.outputContainer} >
            <Text style={style.text}>{text}</Text>
            <Animated.View style={[style.inputContainer , { transform: [{translateX: shakeAnimation}] }]}>
            {
                !show?
                <TouchableOpacity onPress={()=>{
                setShow(true)
                setTimeout(() => {
                    setShow(false)
                }, 2500);
            }}><Image style={style.showIcon} source={require('../assets/show.png')} /></TouchableOpacity>:<Text style={style.showIcon}/>
            }
            <Text style={style.password}>{show? pass: star}</Text>
            <Text style={style.showIcon}/>
            </Animated.View>
            <View>

            </View>
        </View>
        <View style={style.keyboardContainer}>
            <KeyboardNumbers />
        </View>
       {lock? <View style={style.lockContainer}>
            <Text style={style.alert}>слишком много попыток,</Text>
            <Text style={style.alert}> повторите через {time} сек</Text>
        </View>:<View/>}

    </ImageBackground>
}

export default PinScreen

const Numbers = React.memo(({authCurrent,state, numbers,remove, onType, clear, style }) => {
    return <View style={style.numbersContainer}>
        {numbers.map((item, index: number) => <View key={index} style={style.column}>
            {item.map((num: string, index: number) => <TouchableOpacity key={index} onPress={() => onType(num)} style={[style.numberButtons]}>
                <Text style={style.number}>{num}</Text>
                </TouchableOpacity>)}
                </View>)}
                <View  style={style.column}>
                {state.pin?.length===5 ? <TouchableOpacity  onPress={authCurrent} style={[style.numberButtons, {backgroundColor:'rgba(67, 240, 70,.6)'}]}>
                        <Image style={style.Icon2} source={require('../assets/fingerprint.png')} />
                    </TouchableOpacity>:<View style={{width:70*state.size}}/>}
                    <TouchableOpacity  onPress={() => onType('0')} style={[style.numberButtons]}>
                        <Text style={style.number}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onLongPress={remove}  onPress={clear} style={[style.numberButtons]}>
                        <Image style={style.Icon} source={require('../assets/clr.png')} />
                    </TouchableOpacity>
                </View>
        </View>
})


const styles = (sizeW: number, sizeH: number) => StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        paddingTop: 50 * sizeW,
        paddingRight: 30 * sizeW,
        paddingLeft: 30 * sizeW,
        justifyContent: 'space-between',

    },
    lockContainer:{
        position:'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        left:0,
        backgroundColor:'rgba(0,0,0,.7)',
        top:0,
        alignItems:'center',
        justifyContent:'center'
    },

    header:{
        width:'100%',
        height:43*sizeH,
        flexDirection:'row',
        alignItems:'center',

    },
    backButton: {
        width: 6 * sizeW,
        height: 12 * sizeH,
    },
    headerText:{
        marginTop:12*sizeW,
        marginLeft:30*sizeW,
        fontSize:16*sizeW,
        color:'black'
    },
    text:{
        fontSize:24*sizeW,
        marginBottom:30*sizeH
    },

    outputContainer: {
        width: '100%',
        height: 100 * sizeH,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40 * sizeH,
        marginBottom: 50 * sizeH
    },
    inputContainer:{
        width:257*sizeW,
        height:40*sizeW,
        paddingLeft:12*sizeW,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#EEF2FE',
        borderColor:'#E2E7F3',
        borderWidth:1*sizeW,
        borderRadius:128*sizeW
    },
    result: {
        fontWeight: 'bold',
        fontSize: 25 * sizeW,
        color: 'rgba(114, 138, 183,0.5)'
    },
    keyboardContainer: {
        width: 316 * sizeW,
        height: 316 * sizeH,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        marginBottom: 50 * sizeH
    },
    numbersContainer: {
        width: 250 * sizeW,
        height: 316 * sizeH,
        justifyContent: 'space-between'
    },
    column: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonContainer: {
        width: 70 * sizeW,
        height: 316 * sizeH,
        justifyContent: 'space-between',
    },
    numberButtons: {
        width: 70 * sizeW,
        height: 70 * sizeH,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10 * sizeW,
        borderColor: 'rgba(225, 230, 242, 0.5)',
        borderWidth: 2 * sizeW
    },
    large: {
        width: 152 * sizeW
    },
    largeByH: {
        height: 152 * sizeH
    },
    number: {
        color: '#5D6BA3',
        fontSize: 36 * sizeW,
    },
    done: {
        backgroundColor: '#2DD3C5'
    },
    clearIcon: {
        width: 22.5 * sizeW,
        height: 13.75 * sizeH,
        resizeMode: 'stretch',
    },
    Icon: {
        width: 22.5 * sizeW,
        height: 22.5 * sizeW,
        resizeMode: 'stretch',
    },
    Icon2: {
        width: 30 * sizeW,
        height: 30 * sizeW,
        resizeMode: 'stretch',
    },
    plusIcon: {
        width: 16 * sizeW,
        height: 16 * sizeH,
        resizeMode: 'stretch',
    },
    doneIcon: {
        width: 29 * sizeW,
        height: 20 * sizeH,
        resizeMode: 'stretch',
    },
    w:{
        width:70*sizeW
    },
    showIcon:{
        width: 16 * sizeW,
        height: 16 * sizeH,
    },
    password:{
        fontWeight:'bold',
        fontSize:18*sizeW
    },
    alert:{
        textAlign:'center',
        fontSize:18*sizeW,
        color: 'white'
    }
})