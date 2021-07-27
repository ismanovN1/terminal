import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View,TouchableOpacity, Image,TextInput, Text, FlatList, ActivityIndicator } from 'react-native';
import Scaner from '../Pages/Scaner';
import { setIndex, setProduct } from '../redux/mainSlice';
import globalStyles from '../utils/globalStyles';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { prod } from '../utils/interfaces';


const Products: React.FC<any> = (props)=>{
    const state = useAppSelector((state) => state.mainState)
    const [search , setSearch] = useState('')
    const [scaner , setScaner] = useState(false)
    const data = state.products ? state.products.filter((product:prod) => String(product.Barcode).includes(search)|| product.Nomenclature.toLowerCase().includes(search.toLowerCase()) ):null
    const dispatch = useAppDispatch()
    const style = styles(state.size, state.sizeHeight)
    const gStyle = globalStyles(state.size)
    const flatRef = useRef<FlatList | null>(null);

    useEffect(() => {
        if (flatRef?.current) {
            flatRef.current.scrollToOffset({ animated: false, offset: state.offset });
            
        }
    }, [state.offset]);
    const keyExtractor = (item:prod, index:number)=>index+ String(item.UID)+String(item.Updated)
    const renderItem = useCallback(({ item, index } )=>{
        return <Product item={item} index={index}/>
    }, [])

    if(scaner) return <Scaner setScanning={setScaner} />
    return <View style={style.container}>
        <View style={style.header}><TouchableOpacity onPress={props.back} style={style.backButton} ><Image source={require('../assets/backButton.png')} /></TouchableOpacity><Text style={style.headerText}>Наменклатура</Text></View>
        <View style={style.searchContainer}>
            <View style={style.inputSearchContainer}>
                <Image style={style.searchIcon} source={require('../assets/search.png')} />
                <TextInput
            placeholder='Поиск'
            disableFullscreenUI={false}
            style={style.input}
            value={search}
            onChangeText={t=>setSearch(t)}
            />
            </View>
            <TouchableOpacity onPress={()=>setScaner(true)} style={style.scan} ><Image source={require('../assets/Scan.png')} /></TouchableOpacity>
        </View>
        {data?
        <FlatList
        ref={flatRef}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        data={data}
        showsVerticalScrollIndicator={false}
        />:<View/>}
        
      
    </View>
}

export default React.memo((props)=><Products {...props}/>);

const Product = React.memo((props:{item:prod, index: number})=>{
    const item:prod = props.item

    const state = useAppSelector((state) => state.mainState)
    const dispatch = useAppDispatch()
    const style = styles(state.size, state.sizeHeight)
    return <TouchableOpacity  onPress={()=>{
        dispatch(setProduct(item))
        dispatch(setIndex(props.index))
        
    }} style={style.productContainer}>
        <View style={style.productInnerContainer}>
            <Text style={style.productName}>{item.Nomenclature}</Text>
            <View style={style.numContainer}>
                <Text style={style.amount}>{item.QuantityRecorded}</Text>
                <Text style={style.amountFact}>{item.ActualQuantity}</Text>
            </View>
        </View>
            <View style={[style.indicator,item.Difference === 0? style.green: style.red ]}><Text style={style.check}>{item.loader? <ActivityIndicator size='small' color='white' /> : item.Updated  ?'✓':''}</Text></View>

    </TouchableOpacity>
})

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
        width: 30 * sizeW,
        height: 12 * sizeH,
    },
    headerText:{
        fontWeight:'bold',
        fontSize:25*sizeW
    },
    searchContainer:{
        width:'100%',
        height: 40*sizeW,
        marginTop:15*sizeW,
        marginBottom:22*sizeW,
        flexDirection:'row',
        paddingBottom:1,
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomColor:'#EEF2FE',
        borderBottomWidth:.5*sizeH,        
    },
    inputSearchContainer:{
        width:257*sizeW,
        height:40*sizeW,
        paddingLeft:12*sizeW,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#EEF2FE',
        borderColor:'#E2E7F3',
        borderWidth:1*sizeW,
        borderRadius:10*sizeW
    },
    searchIcon:{
        width:13*sizeW,
        height:13*sizeW,
        marginRight:12*sizeW,
        resizeMode: 'cover'
    },
    input:{
        width:220*sizeW,
        height:35*sizeW,
        padding:0,
        borderWidth:0
    },
    scan:{
        width:40*sizeW,
        height:40*sizeW,
        alignItems:'center',
        justifyContent:'center',
        color:'rgba(32, 37, 57, 0.5)',
        fontSize:16*sizeW,
        marginLeft:12*sizeW,
        borderColor:'#E2E7F3',
        borderWidth:1*sizeW,
        borderRadius:10*sizeW,
        backgroundColor:'#EEF2FE',
    },
    productContainer:{
        width:'100%',
        paddingTop:8*sizeW,
        marginTop:15*sizeH
    },
    productInnerContainer:{
        width:'100%',
        height: 72*sizeH,
        borderColor:'#E2E7F3',
        borderWidth:1*sizeW,
        borderRadius:10*sizeW,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingRight:20*sizeW,
        paddingLeft:20*sizeW,

    },
    productName:{
        fontSize: 14*sizeW,
        fontWeight:'bold',
        maxWidth:170*sizeW
    },
    numContainer:{
        maxWidth:100*sizeW,
        height: 44*sizeH,
        justifyContent:'space-between',
        alignItems:'flex-end'
    },
    amount:{
        fontSize: 14*sizeW,
        
    },
    amountFact:{
        fontSize:12*sizeW,
        color:'#8F929C'
    },
    indicator:{
        position:'absolute',
        width:17*sizeW,
        height:17*sizeW,
        borderRadius:8*sizeW,
        top:0,
        right:0,
        justifyContent:'center',
        alignItems:'center'
    },
    red:{
        backgroundColor:'#FD4040'
    },
    green:{
        backgroundColor:'#61D64E'
    },
    check:{
        fontSize:10*sizeW,
        color:'white'
    }

})