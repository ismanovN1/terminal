import React from 'react';
import {ActivityIndicator, Dimensions, View } from 'react-native';

const Loader:React.FC = ()=>{
    const size = Dimensions.get('window')
    return <View style={{width:size.width, height: size.height, alignItems:'center', justifyContent:'center'}}>
        <ActivityIndicator size="large" color="#00ff00" />
    </View>
}

export default React.memo(()=><Loader/>)