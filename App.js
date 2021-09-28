import * as React from 'react';
import { Modal, StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import HistoricoRelatorios from './screens/HistoricoRelatorios';
import { ActivityIndicator } from 'react-native-paper';
import RelatorioUsuario from './screens/RelatorioUsuario';
import axios from 'axios';

const Stack = createNativeStackNavigator();
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

        dispatch({ type: 'SIGN_IN', token: await localStorage('access_token') });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    []
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await localStorage.getItem('access_token');
      } catch (e) {
        console.log('Error on restore Token');
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);
  
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
            <Stack.Screen name="Home" component={HistoricoRelatorios}></Stack.Screen>
            <Stack.Screen name="RelatorioUsuario" component={RelatorioUsuario}></Stack.Screen>
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
