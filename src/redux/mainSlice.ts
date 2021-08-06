import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dimensions } from 'react-native'
import { prod } from '../utils/interfaces'
import type { RootState } from './store'

interface mainState {
    size: number,
    sizeHeight: number,
    token: string | null,
    pin: string | null,
    currentToken: string | null,
    currentValueCalc: string,
    unlock: boolean,
    UIDInventory: string | null,
    opertype: string | null,
    products:null|Array<prod>,
    product: prod | null,
    lastIndex: number,
    loader:boolean,
    additionalDetails: {name: string, value: string}[]|null,
    mainInfo:{date:string, number:string,structuralUnit:string}|null,
    offset: number,
    withLinking:boolean,
    fromLinkData:any,
    isBoss:boolean,
    refreshDate: Date|null
    
}

const initialState: mainState = {
    token: null,
    size: Dimensions.get('window').width * 0.266667 / 100,
    sizeHeight: Dimensions.get('window').height * 0.123 / 100,
    currentValueCalc: '',
    unlock:false,
    refreshDate: null,
    currentToken:null,
    pin:null,
    UIDInventory: null,
    opertype:'',
    withLinking:false,
    fromLinkData:null,
    products:null ,
    product: null,
    lastIndex:0,
    loader:false,
    offset:0,
    additionalDetails:null,
    mainInfo:null,
    isBoss:false
}

export const counterSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setIsBoss: (state, action: PayloadAction<boolean|any>) => {
            state.isBoss = action.payload
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
        },
        setRefreshDate: (state, action: PayloadAction<Date>) => {
            state.refreshDate = action.payload
        },
        setFromLinkData: (state, action: PayloadAction<object|null>) => {
            state.fromLinkData = action.payload
        },
        setWithLinking: (state, action: PayloadAction<boolean>) => {
            state.withLinking = action.payload
        },
        setOffset: (state, action: PayloadAction<number>) => {
            state.offset = action.payload
        },
        setLoader: (state, action: PayloadAction<boolean>) => {
            state.loader = action.payload
        },
        setIndex: (state, action: PayloadAction<number>) => {
            state.lastIndex = action.payload
        },
        
        setMainInfo: (state, action: PayloadAction<{date:string, number:string,structuralUnit:string}|null>) => {
            state.mainInfo = action.payload
        },
        
        setAdditionalDetails: (state, action: PayloadAction<{name: string, value: string}[]|null>) => {
            state.additionalDetails = action.payload
        },
        
        setProduct: (state, action: PayloadAction<prod|null>) => {
            state.product = action.payload
        },
        setProducts: (state, action: PayloadAction<prod[]|null>) => {
            state.products = action.payload
        },
        append: (state, action: PayloadAction<string>) => {
            switch (action.payload) {
                
                case '.':
                    if ((state.currentValueCalc.split('+').slice(-1)[0].includes('.')))
                        break;
                default:
                    state.currentValueCalc += action.payload
            }

        },
        appendPlus: (state,) => {
            if ((state.currentValueCalc.slice(-1) && state.currentValueCalc.slice(-1) !== '+'))
                state.currentValueCalc += "+"
        },
        clear: (state) => {
            if (state.currentValueCalc)
                state.currentValueCalc = state.currentValueCalc.slice(0, -1)
        },
        reset: (state) => {
            if (state.currentValueCalc)
                state.currentValueCalc = ''
        },
        setCurrentToken: (state, action: PayloadAction<string|null>) => {
                state.currentToken = action.payload
        },
        updateProducts: (state, action: PayloadAction<prod>)=>{
            
            state.products?.forEach((product:prod, index:number)=>{
                if(product.UIDProduct === action.payload.UIDProduct){
                    if(state.products)
                    state.products[index] =  {...product, ...action.payload, Difference: Number(action.payload.actualAmount) - action.payload.amount } 
                }
                
            })
        },
        setLoaderProduct: (state, action: PayloadAction<{UID:string, loader:boolean}>)=>{
            
            state.products?.forEach((product:prod, index:number)=>{
                if(product.UID === action.payload.UID){
                    if(state.products)
                    state.products[index] =  {...product,loader:action.payload.loader}
                }
                
            })
        },
        setUnlock: (state, action: PayloadAction<boolean>) => {
                state.unlock = action.payload
        },
        setPinCode: (state, action: PayloadAction<string|null>) => {
                state.pin = action.payload
        },
        setOpertype: (state, action: PayloadAction<string|null>) => {
                state.opertype = action.payload
        },
        setUIDInventory: (state, action: PayloadAction<string|null>) => {
                state.UIDInventory = action.payload
        },

    },
})

export const { setToken,setIndex,setIsBoss,setRefreshDate, setOffset,setFromLinkData,setWithLinking ,setLoader,setAdditionalDetails,setLoaderProduct, setMainInfo, updateProducts, setProducts, setPinCode,setCurrentToken, setUnlock, append, appendPlus, clear, reset, setOpertype, setProduct, setUIDInventory } = counterSlice.actions
export default counterSlice.reducer