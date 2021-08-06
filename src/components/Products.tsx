import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View,TouchableOpacity, Image,TextInput, Text, FlatList, ActivityIndicator, BackHandler } from 'react-native';
import Scaner from '../Pages/Scaner';
import { setIndex, setProduct } from '../redux/mainSlice';
import { operation } from '../redux/mainThunk';
import globalStyles from '../utils/globalStyles';
import { ParseDate, sortData } from '../utils/helpers';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { prod } from '../utils/interfaces';


const Products: React.FC<any> = (props:any)=>{
    const state = useAppSelector((state) => state.mainState)
    const [search , setSearch] = useState('')
    const [scaner , setScaner] = useState(false)
    const [refreshing , setRefreshing] = useState(false)
    const [loader , setLoader] = useState(false)
    const data =state.products ? state.products.filter((product:prod) => String(product.barcode).includes(search)|| product.nomenclature.toLowerCase().includes(search.toLowerCase()) ):null
    const dispatch = useAppDispatch()
    const style = styles(state.size, state.sizeHeight)
    const gStyle = globalStyles(state.size)
    const flatRef = useRef<FlatList | null>(null);

    useEffect(()=>{
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            props.back
          );
      
          return () => backHandler.remove();
    },[])


    useEffect(() => {
        if (flatRef?.current) {
            flatRef.current.scrollToOffset({ animated: false, offset: state.offset });
            
        }
    }, [state.offset]);
    const keyExtractor = (item:prod, index:number)=>index+ String(item.UIDProduct)+String(item.updated)
    const renderItem = useCallback(({ item, index } )=>{
        return <Product item={item} index={index}/>
    }, [])

    if(scaner) return <Scaner setScanning={setScaner} />
    return <View style={style.container}>
        <View style={style.header}>
            <TouchableOpacity onPress={props.back} style={style.backButton} >
                <Image source={require('../assets/backButton.png')} />
        </TouchableOpacity>
        <Text style={style.headerText}>Наменклатура</Text>
           
        </View>
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
        refreshing={refreshing}
        onRefresh={() =>{
            setRefreshing(true)
            dispatch(operation(()=>setRefreshing(false)))}}
        ref={flatRef}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        data={sortData(data)}
        showsVerticalScrollIndicator={false}
        />:<View/>}
        
        <TouchableOpacity
        onPress={()=>{
            setLoader(true)
            dispatch(operation(()=>setLoader(false)))
        }}
        disabled={loader}
            style={style.refreshContainer}
            >
                {loader? <ActivityIndicator size='small' color='green'/>:<View style={style.refreshIcon}><Image style={{width:15*state.size, height:15*state.size}} resizeMode='stretch' source={require('../assets/refresh.png')} /></View>}
                {state.refreshDate && <Text style={style.refreshDate}>{ParseDate(state.refreshDate)}</Text>}
            </TouchableOpacity>
    </View>
}

export default React.memo((props:any)=><Products {...props}/>);

const Product = React.memo((props:{item:prod, index: number})=>{
    const item:prod = props.item

    const state = useAppSelector((state) => state.mainState)
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true)
    const style = styles(state.size, state.sizeHeight)
    return <TouchableOpacity  onPress={()=>{
        dispatch(setProduct(item))
        dispatch(setIndex(props.index))
        
    }} style={style.productContainer}>
        <View style={style.productInnerContainer}>
            <View style={style.imageContainer}>
            <Image source={
{
    uri:`https://apex.lavina.uz/apex/hs/common/images?uid=${item.UIDProduct}`,
    cache: 'force-cache',
    headers: {
      Authorization:` Basic ${state.token}`,
    },
  }
            } style={style.image}
                                   resizeMode={"contain"} onLoadStart={() => setLoading(true)}
                                   onLoadEnd={() => {
                                       setLoading(false)
    }}/>
    {loading && <LoadingView/>}
            </View>
            <View style={style.infoContainer}>
            <Text style={style.productName} numberOfLines={1}>{item.nomenclature}</Text>
            <View style={style.numContainer}>
                <Text style={style.amount}>{item.amount}  {item.updated&&<Text style={style.amountFact}>{"/"+item.actualAmount}</Text>}</Text>
               
            </View>
            </View>
        </View>
            <View style={[style.indicator,item.Difference === 0? style.green: style.red ]}><Text style={style.check}>{item.loader? <ActivityIndicator size='small' color='white' /> : item.updated  ?'✓':''}</Text></View>

    </TouchableOpacity>
})

const  LoadingView = ()=> {
    
        return (
            <View style={styles(0,0).loader}>
                <ActivityIndicator size="small" color="#FFD700"/>
            </View>
        );
    
}


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
    refreshContainer:{
        position:'absolute',
        right:10*sizeW,
        top:35*sizeW,
        width:100*sizeW,
        height:43*sizeH,
        justifyContent:'space-around',
        alignItems:'center'
    },
    refreshIcon:{
        width:15*sizeW,
        height:15*sizeW,
        justifyContent:'center',
        alignItems:'center'
    },
    refreshDate:{
        fontSize:10*sizeW
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
        paddingLeft:5*sizeW,

    },
    productName:{
        fontSize: 11*sizeW,
        fontWeight:'bold',
        maxWidth:170*sizeW,
        overflow:'hidden'
    },
    numContainer:{
        maxWidth:100*sizeW,
        alignItems:'flex-start'
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
    },
    imageContainer:{
        width:50*sizeW,
        height:"100%",
        alignItems:'center',
        justifyContent:'center',
        marginRight:15*sizeW
    },
    image:{
        width:40*sizeW,
        height:40*sizeW,
        resizeMode:'contain'
    },
    infoContainer:{
        width:250*sizeW,
        justifyContent:'space-between',
        height:70*sizeH,
        paddingTop:10*sizeH,
        paddingBottom:10*sizeH,
    },
    loader:{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.7,
        justifyContent: "center",
        alignItems: "center",
    }
    

})