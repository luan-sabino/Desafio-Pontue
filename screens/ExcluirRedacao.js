import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { ActivityIndicator } from 'react-native-paper';
import { RFValue } from "react-native-responsive-fontsize";
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function ExcluirRedacao(){

    var redacoes = JSON.parse(localStorage.getItem('redacoes'));

    const [inLoading, setLoadingState] = useState(false);
    const [selectedRedacao, setSelectedRedacao] = useState(redacoes[0].id);

    const excluirRedacao = async(id)=>{
        setLoadingState(true);

        let userToken = JSON.parse(localStorage.getItem('access_token'));
        
        await axios.delete(`https://desafio.pontue.com.br/redacao/${id}/delete`,
            {
            headers:{
                'Authorization': 'Bearer ' + userToken
            }
        })
        .then(response => response.data)
        .then(data => {console.log(data); redacoes.shift();})
        .catch(err => console.log(err));

        setLoadingState(false);
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
                <TouchableOpacity style={styles.button} onPress={()=>excluirRedacao(selectedRedacao)}>
                    <Text style={[styles.text, {fontWeight: 'bold', color:'#FFFFFF'}]}>DELETAR</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 4,
        backgroundColor: 'rgb(151, 31, 183)',
        verticalAlign: 'middle'
    },
    text:{
        fontFamily: 'Segoe UI',
        fontSize: RFValue(24, 980)
    }
});