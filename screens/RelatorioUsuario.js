import { StyleSheet, View, Image, ScrollView } from "react-native";
import { ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import React, {useState, useEffect} from 'react';

export default function RelatorioUsuario(props){

    const [redacao, setRedacao] = useState({});
    const [inLoading, setLoadingState] = useState(true);

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