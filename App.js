import axios from 'axios';
import * as React from 'react';
import { StyleSheet, View, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HistoricoRelatorios from './screens/HistoricoRelatorios';
import AdicionarRedacao from './screens/AdicionarRedacao'
import RelatorioUsuario from './screens/RelatorioUsuario';
import AtualizarRedacao from './screens/AtualizarRedacao';
import ExcluirRedacao from './screens/ExcluirRedacao';
import Login from './screens/Login';


const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();
export const AuthContext = React.createContext();

export default function App({navigation}) {

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (user,psw) => {
        console.log('Try to Log');
        let request;
        await axios.post('https://desafio.pontue.com.br/auth/login', {
            email: user,
            password: psw
        }).then(response => response.data)
        .then(data => {
            localStorage.setItem('access_token', JSON.stringify(data['access_token']))
            localStorage.setItem('aluno_id', JSON.stringify(data['aluno_id']))
        })
        .catch(err => request = 'error');

        dispatch({ type: 'SIGN_IN', token: await localStorage.getItem('access_token') });
      },
      signOut: () => {
        localStorage.clear();
        dispatch({ type: 'SIGN_OUT' })},
    }),
    []
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await localStorage.getItem('access_token');
      } catch (e) {
        console.log('Error on restore Token');
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  function Hub(){
    return(
      <Tab.Navigator shifting={true}>
        <Tab.Screen name="Historico" options={{tabBarIcon: 'text-box-multiple-outline', title:"Historico", tabBarColor:'rgb(209,3,127)'}} component={HistoricoRelatorios}></Tab.Screen>
        <Tab.Screen name="Criar" options={{tabBarIcon: 'file-plus-outline', title:"Criar", tabBarColor:'rgb(138,2,126)'}} component={AdicionarRedacao}></Tab.Screen>
        <Tab.Screen name="Atualizar" options={{tabBarIcon: 'file-refresh-outline', title:"Atualizar", tabBarColor:'rgb(86,1,125)'}} component={AtualizarRedacao}></Tab.Screen>
        <Tab.Screen name="Deletar" options={{tabBarIcon: 'close', title:"Excluir", tabBarColor:'rgb(46,1,124)'}} component={ExcluirRedacao}></Tab.Screen>
      </Tab.Navigator>
    )
  }
  
  if(state.isLoading){
    return(
      <View style={styles.container}>
          <ActivityIndicator size='large'></ActivityIndicator>
      </View>
    )
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
          <Stack.Navigator>
          {state.userToken != null ? (
            <>
              <Stack.Screen 
                  name="Hub" 
                  component={Hub}
                  options={{
                    headerTitle: ()=>(<Image style={{width:100, height:100, resizeMode: 'contain'}} source={require('./img/pontue.png')}></Image>),
                    headerRight: (props)=>(
                      <View style={{marginRight: 10}}><Button title='Sair' color='#CF007F' onPress={()=>{authContext.signOut()}}/></View>)

                  }}></Stack.Screen>
            <Stack.Screen name="Redação" component={RelatorioUsuario}></Stack.Screen>
            </>
            )
          :(
            <Stack.Screen name="Login" options={{headerShown:false}} component={Login}></Stack.Screen>
          )}
          </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEEF4',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
