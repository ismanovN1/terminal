import { ToastAndroid } from 'react-native';
import base64 from 'react-native-base64';
export const Sum = (expression: string): number => {
console.log(expression);

    return !expression
        ? 0
        : String(expression).split('+').filter(a => a && a !== '.').reduce((a, b) => Number(a) + Number(b), 0);
}


export const Parser =async (str:any,token:string|null=null, isBoss:boolean=false) => {
    const data = str.split("separator@")
    try {
        const d = await JSON.parse(base64.decode(data[1]))
        
    if (d.user) {
        if((d.user === token) || isBoss){
            
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

export const sortData = (list: Array<any>) => {
  const n1:any = [];
  const n2:any = [];
  const n3:any = [];
  if (list && list.length) {
    list.forEach((item:any) => {
      if (item.updated) {
        if (item.Difference === 0) n3.push(item);
        else n2.push(item);
      } else n1.push(item);
    });
    return [...n1, ...n2, ...n3];
  } else return [];
};

export const ParseDate = (date:Date) =>{
  const hour = date.getHours() > 9 ? date.getHours() :'0'+ date.getHours();
  const min = date.getMinutes() > 9 ? date.getMinutes(): '0'+ date.getMinutes();
  const year = date ? date.getFullYear() : '?';
  const month =
    date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
  const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
  return `${year}/${month}/${day} ${hour}:${min}`;
}