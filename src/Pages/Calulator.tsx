import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
    Touchable,
    Alert,
    ImageBackground,
    BackHandler,
} from 'react-native';
import { append, appendPlus, clear, reset, setOffset, setProduct, updateProducts } from '../redux/mainSlice';
import { inventoryAdd } from '../redux/mainThunk';
import { AppDispatch } from '../redux/store';
import { Sum } from '../utils/helpers';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import {prod} from '../utils/interfaces'

const Calculator: React.FC<{product:prod}> = (props:{product:prod}) => {
    const {product} = props
    const state = useAppSelector((state) => state.mainState)
    const dispatch = useAppDispatch()
    const style = styles(state.size, state.sizeHeight)
    const [done, setDone] = useState(false)

    useEffect(() => {
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          goBack
        );
    
        return () => backHandler.remove();
      }, []);
    
    useEffect(() => {
        if(done) {
            if(String(product.amount) !== String(Sum(state.currentValueCalc)))
            Alert.alert(
                "",
                "Ваши количество не совпадают",
                [
                  {
                    text: "Пересчитать",
                    onPress: () => setDone(false),
                    style: "cancel"
                  },
                  { text: "Продолжить", onPress: () =>{
                    updateQuantity()
                    setDone(false)
                  } }
                ]
              );
              else{
                updateQuantity()
                setDone(false)
              }
            
        }
    }, [done]);
    const updateQuantity = () => {        
        dispatch(inventoryAdd(product.UIDProduct,product.amount ,Sum(state.currentValueCalc)))
        dispatch(setProduct(null))
        dispatch(reset())
        dispatch(setOffset(state.lastIndex*90*state.sizeHeight))
    }
    const keyboardItems = [[['7', '8', '9'], ['4', '5', '6'], ['1', '2', '3'], ['0', '.']], [require('../assets/clear.png'), require('../assets/plus.png'), require('../assets/done.png')]]
    const KeyboardNumbers = useCallback(() => <Numbers dispatch={dispatch} state={state} numbers={keyboardItems[0]} style={style} />, [])
    const KeyboardButtons = useCallback(() => <Buttons setDone={setDone} dispatch={dispatch} state={state} product={product} uri={keyboardItems[1]} style={style} />, [])

    const goBack = ()=>{
        dispatch(setProduct(null))
        dispatch(reset())
        dispatch(setOffset(state.lastIndex*90*state.sizeHeight))
        return true;
    }

    return <View style={style.container}>
        <TouchableOpacity style={style.backButton} onPress={goBack}><Image source={require('../assets/backButton.png')} /></TouchableOpacity>
        <View style={style.imageContainer}><Image
        source={{
            uri:`https://apex.lavina.uz/apex/hs/common/images?uid=${product.UIDProduct}`,
            cache: 'force-cache',
            headers: {
              Authorization:` Basic ${state.token}`,
            }
          }} resizeMode="stretch" style={style.image}
        /></View>
        <View style={style.infoContainer}>
            <Text style={style.name} numberOfLines={1} >{product.nomenclature}</Text>
            <Text style={style.amount} numberOfLines={1}>{product.amount}</Text>
        </View>
        <View  style={style.outputContainer} >
            <Text style={[style.output,{fontSize: (state.currentValueCalc.length < 18 ? 30: state.currentValueCalc.length < 22?24:18) * state.size,}]} numberOfLines={3} >{state.currentValueCalc || '0'}</Text>
            <Text style={style.result} numberOfLines={1}>={String(Sum(state.currentValueCalc))}</Text>
        </View>
        <View style={style.keyboardContainer}>
            <KeyboardNumbers />
            <KeyboardButtons />
        </View>

    </View>
}

export default React.memo((props:{product:prod})=><Calculator product={props.product}/>)

const Numbers = React.memo((props:{
    dispatch:AppDispatch,
    numbers : Array<number|string|any> ,
    style: any,
    state:any
}) => {
    const { numbers, dispatch, style } = props
    return <View style={style.numbersContainer}>
        {numbers.map((item, index: number) => <View key={index} style={style.column}>
            {
            item.map((num: string, index: number) => <TouchableOpacity key={index} onPress={() => dispatch(append(num))} style={[style.numberButtons, num === '0' ? style.large : {}]}>
                <Text style={style.number}>{num}</Text></TouchableOpacity>)}
                </View>)}</View>
})

const Buttons = React.memo((props:{
    dispatch:AppDispatch,
    uri : any ,
    style: any,
    product:prod,
    state:any,
    setDone:any
}) => {
    const { setDone,uri, style, dispatch, product, state } = props
   
    return <View style={style.buttonContainer}>
        <TouchableOpacity onLongPress={() => dispatch(reset())} onPress={() => dispatch(clear())} style={style.numberButtons}><Image style={style.clearIcon} source={uri[0]} /></TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch(appendPlus())} style={[style.numberButtons, style.largeByH]}><Image style={style.plusIcon} source={uri[1]} /></TouchableOpacity>
        <TouchableOpacity onPress={()=>setDone(true)} style={[style.numberButtons, style.done]}><Image style={style.doneIcon} source={uri[2]} /></TouchableOpacity>
    </View>
})

const styles = (sizeW: number, sizeH: number) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingRight: 30 * sizeW,
        paddingLeft: 30 * sizeW,
        justifyContent: 'space-between',

    },
    backButton: {
        width: 80 * sizeW,
        height: 15 * sizeH,
        marginTop: 30 * sizeH,
        marginBottom: 15 * sizeH,
    },
    imageContainer: {
        width: '100%',
        height: 160 * sizeH,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:30*sizeH
    },
    image:{
        width: 150*sizeW,
        height: 150*sizeW,
        borderRadius:5*sizeW
    },
    infoContainer: {
        width: '100%',
        height: 35 * sizeH,
        justifyContent: 'space-between'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16 * sizeW,
    },
    amount: {
        fontSize: 16 * sizeW,
        color: 'rgba(32, 37, 57, 0.5)'
    },
    outputContainer: {
        width: '100%',
        height: 146 * sizeH,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginBottom: 25 * sizeH,
        
    },
    output: {
        fontWeight: 'bold',
        textAlign: 'right',
        textAlignVertical: 'bottom'

    },
    result: {
        fontWeight: 'bold',
        fontSize: 25 * sizeW,
        color: 'rgba(0,0,0,.4)',
    },
    keyboardContainer: {
        width: 316 * sizeW,
        height: 316 * sizeH,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 50 * sizeH
    },
    numbersContainer: {
        width: 234 * sizeW,
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
})