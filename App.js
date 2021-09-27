import * as React from 'react';
import { Modal, StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import HistoricoRelatorios from './screens/HistoricoRelatorios';

const Stack = createNativeStackNavigator();

function isSignedIn(){
  if(localStorage.getItem('access_token') != null){return true;}
  return false;
}

export default function App({navigation}) {

  return (
    <NavigationContainer>
        <Stack.Navigator>
        {isSignedIn() ? (
          <Stack.Screen name="Home" component={HistoricoRelatorios} ></Stack.Screen>)
        :(
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
        )}
        </Stack.Navigator>
    </NavigationContainer>
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
