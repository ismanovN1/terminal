import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../redux/store'
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native'


export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useKeyboard = (): [number] => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    function onKeyboardDidShow(e: KeyboardEvent): void {
        setKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide(): void {
        setKeyboardHeight(0);
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return (): void => {
            Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
        };
    }, []);

    return [keyboardHeight];
};