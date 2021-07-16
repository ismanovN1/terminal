import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Image, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Text, Dimensions, ScrollView } from 'react-native';
import globalStyles from '../utils/globalStyles';
import { useAppSelector, useAppDispatch } from '../utils/hooks'
import Nomenclature from '../components/Nomenclature'
import Products from '../components/Products'
import Calculator from './Calulator';

const Main: React.FC<any> = (props) => {
    const {product} = useAppSelector((state) => state.mainState)
    const scrollRef = useRef<ScrollView | null>(null);
    const width = Dimensions.get('window').width
    const height = Dimensions.get('window').height

    const ScrollEnd = useCallback((e) => {
        if (scrollRef?.current) {
            if (e.nativeEvent.contentOffset.x < width / 2) {
                scrollRef.current.scrollTo({
                    x: 0,
                    animated: true,
                })
            } else {
                scrollRef.current.scrollTo({
                    x: width,
                    animated: true,
                })

            }

        }
    },[])

    const ProductsUC = useCallback((props)=><Products {...props}/>, [])

    return <>
        <View style = {{flex:1,display: product ? 'flex':'none'}}>{product?<Calculator product={product}/>:<View/>}</View>
        <View style = {{flex:1,display: !product ? 'flex':'none'}}>
        <ScrollView
        ref={scrollRef}
        horizontal={true}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={ScrollEnd}
    >
        <View style={{ width, height,}}>
            <Nomenclature/>
        </View>
        <View style={{ width, height}}>
        <ProductsUC back={()=>{
             if (scrollRef?.current) {
                scrollRef.current.scrollTo({
                    x: 0,
                    animated: true,
                })
            }
        }}/>
        </View>

    </ScrollView>
        </View>
</>

}

export default React.memo(()=><Main/>);

