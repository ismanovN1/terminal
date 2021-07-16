
import React, { useEffect, useState } from 'react';
import { View, StatusBar, Linking } from 'react-native';
import Auth from './src/Pages/Auth';
import Calculator from './src/Pages/Calulator';
import Menu from './src/Pages/Menu';
import Main from './src/Pages/Main';
import Scaner from './src/Pages/Scaner';
import { useAppDispatch, useAppSelector, useKeyboard } from './src/utils/hooks';
import PinScreen from './src/Pages/PinScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './src/components/Loader';
import { setCurrentToken, setPinCode, setUnlock } from './src/redux/mainSlice';
import { operation } from './src/redux/mainThunk';
import SplashScreen from 'react-native-splash-screen'
import {Parser} from './src/utils/helpers'

const App = () => {
  const {token,unlock , currentToken,UIDInventory,products} = useAppSelector((state) => state.mainState)
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(<Loader/>)

  useEffect(() => {
    SplashScreen.hide();
    Linking.getInitialURL().then(url => {
      if(url){
        const data = Parser(url, token)
        if(data){
            dispatch(setUIDInventory(data.UID))
            dispatch(setOpertype(data.opertype))
        }
        
      }
      
    });
    Linking.addEventListener('url', handleOpenURL);

    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem('@token');
        if(token){
         if(!unlock){
          dispatch(setCurrentToken(token))
          const pin = await AsyncStorage.getItem('@pin')
          if (pin) {
            dispatch(setPinCode(pin))
            setPage(<PinScreen exit={()=>setPage(<Auth/>)} />)
          }else{
            setPage(<Auth/>)
          }
         }else{
          if(products) setPage(<Main/>)
          else setPage(<Menu/>)
         }
        }else{
          setPage(<Auth/>)
        }
      } catch(e) {
        setPage(<Auth/>)
        console.log(e);  
      }

      
    }
    getData();
    return ()=>{
      dispatch(setUnlock(false))
      Linking.removeEventListener('url', handleUrl)
    }
  }, []);

  useEffect(() => {
    if(token && unlock){
      if(products && products.length > 0) setPage(<Main/>)
      else setPage(<Menu/>)
    }else if(token){
      setPage(<PinScreen exit={()=>setPage(<Auth/>)} />)
    }
  }, [token, unlock, products]);
  



  useEffect(() => {
    if(UIDInventory) dispatch(operation())    
  }, [UIDInventory]);

  const handleOpenURL = (event: any) => { // D
    console.log(event.url);
    
  } 

  const [keyboardHeight] = useKeyboard();
  return (
    <View style={{ flex: 1, marginBottom: -keyboardHeight }}>
      <StatusBar  hidden = {true}  translucent backgroundColor="transparent" />
      {page}
    </View>
  );
};

export default App;
