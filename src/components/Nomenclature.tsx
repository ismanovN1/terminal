import React from 'react';
import { StyleSheet, View,TouchableOpacity, Image, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { setProduct,setProducts, setUIDInventory } from '../redux/mainSlice';
import { inventoryDone } from '../redux/mainThunk';
import globalStyles from '../utils/globalStyles';
import { useAppDispatch, useAppSelector } from '../utils/hooks';

const Nomenclature: React.FC = ()=>{
    const state = useAppSelector((state) => state.mainState)
    const dispatch = useAppDispatch()
    const style = styles(state.size, state.sizeHeight)
    const gStyle = globalStyles(state.size)

    return <View style={style.container}>
        <View style={style.header}><TouchableOpacity style={style.backButton} onPress={()=>{
                  dispatch(setProducts(null))
                  dispatch(setUIDInventory(null))
                }} ><Image source={require('../assets/backButton.png')} /></TouchableOpacity><Text style={style.headerText}>{state.opertype === 'inventoryHandover'? 'Сдать': state.opertype === 'inventoryAccepted'?'Принять': 'Перемещение товаров'}</Text></View>
        {state.mainInfo && (<View style={style.mainInfoContainer}>
           <View style={style.column}><Text style={style.param}>Number:</Text><Text style={style.info}>{state.mainInfo.number}</Text></View>
            <View style={style.column}><Text style={style.param}>Data:</Text><Text style={style.info}>{state.mainInfo.date}</Text></View>
            <View style={style.column}><Text style={style.param}>Склад пол:</Text><Text style={style.info}>{state.mainInfo.structuralUnit}</Text></View>
        </View>)}
        {
            state.additionalDetails && <View style={style.infoContainer}><ScrollView>
                {
                state.additionalDetails.map((item,index)=><View key={index} style={style.column}><Text style={style.param}>{item.name}</Text><Text style={style.info}>{item.value}</Text></View>)
            }
            </ScrollView>

            </View>
        }

        
        <View style={style.buttonContainer}>
        <TouchableOpacity
        disabled={state.loader}
        onPress={
            ()=>{
            dispatch(inventoryDone())
        }} style={[gStyle.button, style.button]} ><Text style={style.buttonText}>{state.loader? <ActivityIndicator size='small' color='green' /> : 'Отправить'}</Text></TouchableOpacity>
        </View>
    </View>
}

export default Nomenclature;

const styles = (sizeW: number, sizeH: number)=> StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        paddingTop:50*sizeH,
        paddingRight:30*sizeW,
        paddingBottom:30*sizeH,
        paddingLeft:30*sizeW,
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
        fontWeight:'bold',
        marginLeft:20*sizeW,
        fontSize:25*sizeW,
        width: Dimensions.get('window').width - 90*sizeW,
        textAlign:'center'
    },
    mainInfoContainer:{
        width:'100%',
        height:220*sizeH,
        paddingTop:40*sizeH,
        paddingBottom:30*sizeH,
        justifyContent:'space-between',
        borderBottomColor:'#EEF2FE',
        borderBottomWidth:2*sizeH,        
    },
    column:{
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        overflow:'hidden'
    },
    param:{
        color:'rgba(32, 37, 57, 0.5)',
        fontSize:16*sizeW,
        marginRight:12*sizeW,
    },
    info:{
        fontSize:16*sizeW,
        fontWeight:'normal'
    },
    infoContainer:{
        marginTop:25*sizeH,
        width:'100%',
        height:187*sizeH,
        justifyContent:'flex-start'
    },
    buttonContainer:{
        width:'100%',
        height:240*sizeH,
        justifyContent:'flex-end'
    },
    button:{
        backgroundColor:'#FDEB04',
    },
    buttonText:{
        color: '#FF794F',
        fontSize:20*sizeW,
        fontWeight:'bold'
    }
})