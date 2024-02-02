import {KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import AppNavigation from "./navigation/appNavigation";

export default function App() {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <AppNavigation/>
        </TouchableWithoutFeedback>
    );
}

