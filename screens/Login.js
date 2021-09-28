import React, {useState, useRef, useContext} from 'react';
import { TextInput, StyleSheet, View, Button, Pressable, Platform } from "react-native";
import { AuthContext } from '../App'

export default function Login(props){
    const [inFocus, setFocus] = useState(false);
    const [inPSWFocus, setPSWFocus] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useContext(AuthContext);

    return(
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <TextInput
                    style={[styles.input, inFocus ? styles.inputOnFocus : '', {...Platform.select({web:{outlineColor: 'transparent'}})}]}
                    placeholder="Email"
                    onBlur={()=>setFocus(false)}
                    onFocus={()=>setFocus(true)}
                    value={email}
                    onChangeText={text=>setEmail(text)}
                    ></TextInput>
                    <TextInput
                    style={[styles.input, inPSWFocus ? styles.inputOnFocus : '', {...Platform.select({web:{outlineColor: 'transparent'}})}]}
                    placeholder="Senha"
                    onBlur={()=>setPSWFocus(false)}
                    onFocus={()=>setPSWFocus(true)}
                    secureTextEntry={true}
                    textContentType='password'
                    onChangeText={text =>setPassword(text)}
                    value={password}
                    ></TextInput>
                    <View style={styles.marginFive}>
                    <Button title='Entrar' color='#CF007F' onPress={()=> signIn(email, password)}></Button>
                    </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    input:{
        padding: 5,
        backgroundColor: '#21212110',
        borderBottomWidth: 2,
        borderBottomColor: '#21212111',
        borderTopEndRadius: 4,
        borderTopStartRadius: 4,
        padding: 10,
        margin: 5,
    },
    inputOnFocus:{
        borderBottomColor: '#CF007F'
    },
    marginFive:{margin: 5},
    wrapper:{
        width: 300,
        height: 'justify-content',
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#EFEEF4',
        alignItems: 'center',
        justifyContent: 'center',
      }
});