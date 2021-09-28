import { StyleSheet, TouchableOpacity, View, Text, Platform } from "react-native";
import { ActivityIndicator } from 'react-native-paper';
import React, { useState } from 'react';
import { RFValue } from "react-native-responsive-fontsize";
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DocumentPicker from 'expo-document-picker';

export default function AtualizarRedacao(){
    
    const [inLoading, setLoadingState] = useState(false);
    const [singleFile, setSingleFile] = useState('');
    const [selectedRedacao, setSelectedRedacao] = useState();
    
    var redacoes = JSON.parse(localStorage.getItem('redacoes'));

    const createFormData = async(file) => {
        const data = new FormData();
        await data.append("urls[]", selectedRedacao);
        await data.append("file[]", {
          name: file.name,
          type: (file.name.includes('.pdf') ? 'application/pdf' : 'image/jpeg'),
          uri:
            Platform.OS === "android" ? file.uri : file.uri.replace("file://", "")
        });
        return data;
      };

    const selectSingleFile = async ()=>{
        try{
            const req = await DocumentPicker.getDocumentAsync({type: ['image/*', "application/pdf"], copyToCacheDirectory: true, multiple: false})
            setSingleFile(req);
        }catch(err){console.log(err)}
    }

    const atualizaRedacao = async(id,redacao)=>{
        let userToken = JSON.parse(localStorage.getItem('access_token'));
        await axios.post(`https://desafio.pontue.com.br/redacao/${id}/update`,
            redacao,{
            headers:{
                'Authorization': 'Bearer ' + userToken
            }
        })
        .then(response => response.data)
        .then(data => console.log("Success"))
        .catch(err => console.log(err));;
    }

    if(singleFile != ''){
        let file = createFormData(singleFile);
        atualizaRedacao(selectedRedacao,file);
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
                <Text style={styles.text}>Selecione a redação</Text>
                <Picker 
                    selectedValue={selectedRedacao}
                    onValueChange={(itemValue, itemIndex) =>
                    setSelectedRedacao(itemValue)}>
                        {redacoes.map((row)=>{
                            return (<Picker.Item label={row.numero.toString()} value={row.id} key={row.id}/>)
                        })}
                </Picker>
                <Text style={styles.text}>Selecione o arquivo para enviar</Text>
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
        textAlign: 'center',
        paddingVertical: 20,
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