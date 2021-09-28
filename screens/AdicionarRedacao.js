import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Platform } from "react-native";
import DataTable from "react-data-table-component";
import { ActivityIndicator, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as DocumentPicker from 'expo-document-picker';
import * as RNFS from 'react-native-fs';

export default function AdicionarRedacao(){

    const createFormData = async(file) => {
        const data = new FormData();
        console.log(file.uri);
        data.append("file[]", {
          name: file.name,
          type: (file.name.includes('.pdf') ? 'application/pdf' : 'image/jpeg'),
          uri:
            Platform.OS === "android" ? file.uri : file.uri.replace("file://", "")
        });
        return data;
      };
    
    const [singleFile, setSingleFile] = useState('');

    const criaRedacao = async(redacao)=>{
        let userId = JSON.parse(localStorage.getItem('aluno_id'));
        let userToken = JSON.parse(localStorage.getItem('access_token'));
        let request;
        await axios.post(`https://desafio.pontue.com.br/alunos/redacao/create`,
            redacao,{
            crossdomain : true,
            headers:{
                'Access-Control-Allow-Origin': '*',
                'Accept': '*/*',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + userToken
            }
        })
        .then(response => response.data)
        .then(data => console.log(data))
        .catch(err => console.log(err));
        //setLoadingState(false);
    }

    const [inLoading, setLoadingState] = useState(false);

    const selectSingleFile = async ()=>{
        try{
            const req = await DocumentPicker.getDocumentAsync({type: ['image/*', "application/pdf"], copyToCacheDirectory: true, multiple: false})
            setSingleFile(req);
        }catch(err){console.log(err)}
    }

    if(singleFile != ''){
        //setLoadingState(true);
        let file = createFormData(singleFile);
        console.log(file);
        criaRedacao(file);
    }

    if(inLoading){
        return(
            <View style={styles.container}>
                <ActivityIndicator size='large' inLoading={inLoading}></ActivityIndicator>
            </View>
        )
    }

    return(
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.text}>Selecione o arquivo</Text>
                <TouchableOpacity style={styles.button} onPress={selectSingleFile}>
                    <Icon name='plus' size={128}></Icon>
                </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEEF4',
        alignItems: 'center',
        justifyContent: 'center',
      },
    card:{
        width: '50%',
        height: '50%',
        backgroundColor: '#FFFFFF',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    button:{
        borderRadius: 4,
        backgroundColor: 'rgba(151, 31, 183, 0.10)',
    },
    text:{
        fontFamily: 'Segoe UI',
        fontSize: RFValue(24, 980)
    }
});