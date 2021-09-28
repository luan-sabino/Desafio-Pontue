import { useNavigation } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import React, {useState, useRef, useEffect} from 'react';
import { TextInput, StyleSheet, View, Button, Pressable, Image, ScrollView } from "react-native";
import { createStackNavigator, createAppContainer } from 'react-native-screens';
import { ActivityIndicator } from 'react-native-paper';

export default function RelatorioUsuario(props){

    const getRedacao = async()=>{
        let userToken = JSON.parse(localStorage.getItem('access_token'));
        let request;
        await axios.get(`https://desafio.pontue.com.br/redacao/${props.route.params.redacaoId}`,{
            headers:{
                'Authorization': 'Bearer ' + userToken
            }
        })
        .then(response => response.data)
        .then(data => request = data)
        .catch(err => request = false);
        setRedacao(request.data);
        setLoadingState(false);
    }

    const [redacao, setRedacao] = useState({});
    const [inLoading, setLoadingState] = useState(true);

    useEffect(()=>{
        getRedacao()
    }, [])
    
    function renderRedacao(){
        let urls = redacao.urls;
        return (<Image 
            style={{height: '100%', width: '100%', resizeMode:'cover', aspectRatio: (1191/1648)}}
            source={{uri:urls[0].url}} 
            key={urls[0].id}
            ></Image>)
    }

    if(inLoading){
        return(
            <View style={styles.containerLoading}>
                <ActivityIndicator size='large' inLoading={inLoading}></ActivityIndicator>
            </View>
        )
    }
    return(
        <View style={styles.container} >
            <ScrollView style={styles.scrollView} contentContainerStyle={{alignItems:'center', flexGrow: 1}}>
                    {renderRedacao()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    containerLoading: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#EFEEF4',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    container:{
        flex: 1,
        backgroundColor: '#EFEEF4',
        margin: 0
    },
    scrollView:{
        flexGrow: 1,
    },
    img:{
        width: '100%',
        resizeMode: 'cover'
    }
});