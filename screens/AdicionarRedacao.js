import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Platform } from "react-native";
import DataTable from "react-data-table-component";
import { ActivityIndicator, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as DocumentPicker from 'expo-document-picker';

export default function AdicionarRedacao(){

    async function createFormData(file){
        const data = new FormData();
        await data.append("file[]",{
            uri: file.uri,
            type: (file.name.includes('.pdf') ? 'application/pdf' : 'image/jpeg'),
            name: file.name
        });

        console.log(data['file[]']);
        return data;
      };
    
    const [singleFile, setSingleFile] = useState('');

    const criaRedacao = async(redacao)=>{
        let userToken = JSON.parse(localStorage.getItem('access_token'));
        console.log(redacao);
        await axios.post(`https://desafio.pontue.com.br/alunos/redacao/create`,
            redacao,{
            headers:{
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
            //setLoadingState(true);
        }catch(err){console.log(err)}
    }

    async function callFormSend(){
        let file = await createFormData(singleFile);
        console.log(file[0]);
        criaRedacao(file);
    }

    if(singleFile != ''){
        callFormSend();
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