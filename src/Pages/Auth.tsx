import React, { useEffect, useState } from 'react';
import { View, Image, TextInput, ImageBackground, StyleSheet, TouchableOpacity, Text, Dimensions, ActivityIndicator } from 'react-native';
import globalStyles from '../utils/globalStyles';
import { useAppSelector, useAppDispatch } from '../utils/hooks'
import base64 from 'react-native-base64';
import utf8 from 'utf8';
import { getOption } from '../redux/mainThunk';


const Auth = () => {
    const state = useAppSelector((state) => state.mainState)
    const dispatch = useAppDispatch()
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const gStyle = globalStyles(state.size)
    const style = styles(state.size) 
    
      const Submit = () => {
        const bytes = utf8.encode(user.toLowerCase() + ':' + pass.toLowerCase());
        const token = base64.encode(bytes);    
        dispatch(getOption(token));
      };


    return <ImageBackground source={require('../assets/backImage.jpg')} style={[style.container]}>
        <View style={style.content1}>
            <Text style={style.text}>Авторизация</Text>
            <View style={style.inputContainer}>
                <Image source={require('../assets/user.png')} style={style.inputLogo} />
                <TextInput
                    style={style.input}
                    value={user}
                    placeholder='Логин'
                    onChangeText={text => setUser(text)}
                />
            </View>
            <View style={style.inputContainer}>
                <Image source={require('../assets/pass.png')} style={style.inputLogo} />
                <TextInput
                    style={style.input}
                    value={pass}
                    secureTextEntry={true}
                    placeholder='Пароль'
                    onChangeText={text => setPass(text)}
                />
            </View>
        </View>
        <View style={style.content2}>
            <TouchableOpacity disabled={state.loader} style={[gStyle.button, { backgroundColor: '#FDEB04' }]} onPress={Submit}>
                <Text style={{ color: '#FF794F', fontSize: 20 * state.size, fontWeight: "bold" }}>{state.loader ? <ActivityIndicator size='small' color='blue' /> : 'Войти'}</Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>


}

export default Auth;

const styles = (size: number) => StyleSheet.create({
    container: {
        width: '100%',
        height: Dimensions.get('window').height,
        flexDirection: "column",
        justifyContent: 'space-between',
        alignItems: 'center',
        resizeMode: "cover",
    },
    text: {
        margin: 30 * size,
        fontSize: 30 * size,
        fontWeight: "bold",
    },
    inputContainer: {
        width: 312 * size,
        height: 50 * size,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1 * size,
        borderColor: '#EEF2FE',
        borderRadius: 10 * size,
        marginBottom: 20 * size,
        paddingLeft: 17 * size

    },
    inputLogo: {
        width: 22 * size,
        height: 22 * size,
        marginRight: 15 * size,
    },
    input: {
        width: 250 * size,
        borderWidth: 0,
        padding: 0,
    },

    content1: {
        marginTop: 130 * size,
    },

    content2: {
        marginBottom: 40 * size,
        alignItems: 'center',
        justifyContent: 'center'
    },

});