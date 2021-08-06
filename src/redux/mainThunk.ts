import { prod } from './../utils/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';
import api from "../API/api";
import { setAdditionalDetails, setIsBoss, setLoader, setLoaderProduct, setMainInfo, setProducts, setRefreshDate, setToken, setUIDInventory, setUnlock, updateProducts } from "./mainSlice";
import { AppDispatch, RootState } from "./store";
import Products from '../components/Products';

export const getOption = (token:string) => (dispatch:AppDispatch, getState:any) => {
  dispatch(setLoader(true))
    api('deskrmk1/getoptions', 'GET', token,undefined)
      .then(async(res:any) => {
        if (res) {
          try {
            await AsyncStorage.setItem('@token', token)
            dispatch(setToken(token));
            dispatch(setIsBoss(res.ЭтоБосс));
  dispatch(setLoader(false))
          } catch (e) {
            console.log(e);
  dispatch(setLoader(false))
          }
        }
        }
        )
      .catch((e) => {
        console.log(e)
  dispatch(setLoader(false))

      });
  };

export const check = (token:string|null) => (dispatch:AppDispatch, getState:any) => {
    if(typeof token === 'string')
    api('deskrmk1/getoptions', 'GET', token,undefined)
      .then(async(res:any) => {
        if (res) {
          dispatch(setToken(token))
          dispatch(setUnlock(true))
          dispatch(setIsBoss(res.ЭтоБосс));
        }

      })
      .catch((e) => console.log(e));
  };

  
export const operation = (func:any=null) => (dispatch:AppDispatch, getState:any) => {
  dispatch(setLoader(true))
  const { opertype,UIDInventory, token} = getState().mainState;


  const body = {
    UID:UIDInventory,opertype
  }
  console.log(body);
  
  api('terminal/operations', 'POST', token,body)
    .then((res:any) => {
      if(res.ok){
        dispatch(setProducts(res.result.products.map((product:any)=>({...product,Difference: product.actualAmount - product.amount , loader:false}))))
        dispatch(setMainInfo({
          date: res.result.date,
          number: res.result.number,
          structuralUnit: res.result.structuralUnit,
        }))
        dispatch(setAdditionalDetails(res.result.additionalDetails))
        dispatch(setRefreshDate(new Date()))
      }
      func && func(false)
  dispatch(setLoader(false))
    })
    .catch((e) => {
      console.log(e);
      func && func(false)
      dispatch(setLoader(false))
    });
};


export const inventoryDone = () => (dispatch:AppDispatch, getState:any) => {
  dispatch(setLoader(true))

  const {UIDInventory,opertype,  token} = getState().mainState;


  const body = {
    UID:UIDInventory,
    opertype

  }
  api('terminal/close', 'POST', token, body).then((res:any)=>{
    if(res.ok){
      ToastAndroid.show('✔️', ToastAndroid.SHORT);
      dispatch(setProducts(null))
      dispatch(setUIDInventory(null))
      dispatch(setLoader(false))
    }
  }).catch(e=>{
    console.log(e);
  dispatch(setLoader(false))
  })

}
export const inventoryAdd = (UIDProduct:string,Amount:number,actualAmount:number) => (dispatch:AppDispatch, getState:any) => {
  dispatch(setLoaderProduct({UID:UIDProduct, loader:true}))
  const {UIDInventory, opertype, token} = getState().mainState;

  const body = {
    UID: UIDInventory,
    UIDProduct,
    Amount,
    actualAmount,
    opertype: opertype
  }
  api('terminal/update', 'POST', token, body).then((res:any)=>{
    if(res.ok){
      dispatch(updateProducts(res.result))
      ToastAndroid.show('✔️', ToastAndroid.SHORT);
    }
  }).catch(e=>{
    console.log(e);
  dispatch(setLoaderProduct({UID:UIDProduct, loader:false}))
  })

}