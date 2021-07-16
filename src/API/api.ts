import {Alert, ToastAndroid} from 'react-native';

// basic url
const basicUrl = 'https://apex.lavina.uz/apex/hs/';
//const headers = new Headers();
export default (path:string, method:string, token:string, data:object|undefined ) => {
  const headers = {
    Authorization: 'Basic ' + token,
    'Content-Type': 'application/json',
  };

//  headers.set('Authorization', `Basic ${token}`);

  return new Promise((resolve, reject) => {
    RESTAPI(path, method, headers, data)
      .then(async (res) => {
        if (res.status === 200) {
          resolve(
           res.json(),
          );
        } else if (res.status === 401) {
          ToastAndroid.show(
            'вы неправильно ввели имя или пароль ',
            ToastAndroid.SHORT,
          );

          reject('status code: ' + res.status);
        } else {
          ToastAndroid.show('status code: ' + res.status, ToastAndroid.SHORT);
          const text = await res.text();
          Alert.alert('error!!!', text);
          reject(res.status);
        }
      })
      .catch((e) => {
        ToastAndroid.show('Network Error', ToastAndroid.SHORT);
        reject(e);
      });
  });
};
const RESTAPI = (path:string, method:string, headers:any, data:object|undefined) => {
  switch (method) {
    case 'GET':
      return fetch(
        `${basicUrl}${path}`,
        {method: method, headers: headers},
      );
    case 'POST':
      return fetch(
        `${basicUrl}${path}`,
        {
          method: method,
          body: JSON.stringify(data),
          headers: headers,
        },
      );
    default:
      return fetch(`${basicUrl}${path}`, {
        method: method,
        body: JSON.stringify(data),
        headers: headers,
      });
  }
};