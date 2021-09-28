import { ActivityIndicator } from 'react-native-paper';
import { RFValue } from "react-native-responsive-fontsize";
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from "react-native";
import axios from 'axios';
import DataTable from "react-data-table-component";

export default function HistoricoRedacao(props){

    const [tableItems, setTableItems] = useState(null);
    const [inLoading, setLoadingState] = useState(true);

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
        localStorage.setItem('redacoes', JSON.stringify(request.data));
        setLoadingState(false);
    }

    useEffect(()=>{
        getRedacoes()
    }, [])

    const columns = [
        {
          id: 2,
          name: "Numero",
          keyField: (row) => row.id,
          selector: (row) => row.numero,
          sortable: true,
          reorder: true
        },
        {
          id: 1,
          name: "Data",
          selector: (row) => row.created_at,
          sortable: true,
          right: true,
          reorder: true
        }
      ];

    function renderTableWithContent(){
        return(
            <DataTable 
                title="Redações"
                columns={columns}
                data={Object.values(tableItems)}
                defaultSortFieldId={1}
                pagination
                fixedHeader
                fixedHeaderScrollHeight
                customStyles={customStyles}
                onRowClicked={(row)=>{props.navigation.navigate('Redação', {redacaoId:row.id})}}
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
      },
    text:{
        fontFamily: 'Segoe UI',
        fontSize: RFValue(12, 980)
    }
});

const customStyles = {
    rows:{
        style:{
            fontFamily: 'Segoe UI',
        }
    },
    header:{
        style:{
            fontFamily: 'Segoe UI',
        }
    },
    headCells:{
        style:{
            fontFamily: 'Segoe UI',
        }
    },
    pagination:{
        style:{
            fontFamily: 'Segoe UI',
        }
    }
}