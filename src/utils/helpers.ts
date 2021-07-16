import { ToastAndroid } from 'react-native';
import base64 from 'react-native-base64';
export const Sum = (expression: string): number => {
console.log(expression);

    return !expression
        ? 0
        : String(expression).split('+').filter(a => a && a !== '.').reduce((a, b) => Number(a) + Number(b), 0);
}


export const Parser = (str:any,token:string|null=null) => {
    const data = str.split("separator@")
    try {
        const d =  JSON.parse(base64.decode(data[1]))
    if (d.user) {
        if(d.user === token){
            return d.data
        }else {
            ToastAndroid.show('Пользователи не совпадают ',ToastAndroid.SHORT)
            return false
        }
    }else if(d.UID) return d
    else return false
    } catch (error) {
        console.log(error);
        
        return false
    }
 
}

