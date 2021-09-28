import { useNavigation } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import React, {useState, useRef, useEffect} from 'react';
import { TextInput, StyleSheet, View, Button, Pressable } from "react-native";
import { createStackNavigator, createAppContainer } from 'react-native-screens';
import DataTable from "react-data-table-component";
import { ActivityIndicator } from 'react-native-paper';

export default function HistoricoRelatorios(props){

    const getRedacoes = async()=>{
        let userId = JSON.parse(localStorage.getItem('aluno_id'));
        let userToken = JSON.parse(localStorage.getItem('access_token'));
        let request;
        await axios.get(`https://desafio.pontue.com.br/index/aluno/${userId}`,{
            headers:{
                'Authorization': 'Bearer ' + userToken
            }
        })
        .then(response => response.data)
        .then(data => request = data)
        .catch(err => request = false);
        setTableItems(request.data);
        setLoadingState(false);
    }

    const [tableItems, setTableItems] = useState(null);
    const [inLoading, setLoadingState] = useState(true);

    useEffect(()=>{
        getRedacoes()
    }, [])

    const columns = [
        {
          id: 1,
          name: "ID",
          keyField: (row) => row.id,
          selector: (row) => row.id,
          sortable: true,
          reorder: true
        },
        {
          id: 2,
          name: "Numero",
          selector: (row) => row.numero,
          sortable: true,
          reorder: true
        },
        {
          id: 3,
          name: "Data",
          selector: (row) => row.created_at,
          sortable: true,
          right: true,
          reorder: true
        }
      ];


    console.log(props);
    function renderTableWithContent(){

        return(
            <DataTable
                title="Redações"
                columns={columns}
                data={Object.values(tableItems)}
                defaultSortFieldId={1}
                sortIcon='🔽'
                pagination
                fixedHeader
                fixedHeaderScrollHeight
                onRowClicked={(row)=>{props.navigation.navigate('RelatorioUsuario', {redacaoId:row.id})}}
                >
            </DataTable>
        );
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
                {tableItems != null ? renderTableWithContent() : <h1>Não tem!!</h1>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEEF4',
        alignItems: 'center',
        justifyContent: 'center',
      }
});