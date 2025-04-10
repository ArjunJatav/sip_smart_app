import React, { useEffect, useContext, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import { View, Title } from 'react-native';

//Settings Tab Component files

const Stack = createStackNavigator();
const AppNavContainer = () => {

  const [isLogin, setState] = useState(false);
  const [isInitialized, setInitialization] = useState(false);
  const getloginStatus = async () => {
    try {
      // AsyncStorage.removeItem('Token')
      const value = await AsyncStorage.getItem('Token')
      console.log("this is token", value);
      console.log(value)
      if (value) {
        setState(true)
        setInitialization(true);
      }
      else {
        setState(false)
        setInitialization(true);
      }
    } catch (e) {
      // error reading value
      setState(false)
      setInitialization(true);
    }
  }
  useEffect(() => {
    getloginStatus();
  }, [])


  if (!isInitialized) {
    return null;
  }

  return (

    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        {(isLogin == true) ?
          <Stack.Screen name="HomeNavigator1" component={Mainstack} navigation={Stack.navigation} options={{ gestureEnabled: false }} />
          :
          <Stack.Screen name="AuthNavigator1" component={Authstack} navigation={Stack.navigation} options={{ gestureEnabled: false }} />
        }
      </Stack.Navigator>
    </NavigationContainer>

  );
};
function Mainstack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeNavigator" component={HomeNavigator} navigation={Stack.navigation} options={{ gestureEnabled: false }} />

      <Stack.Screen name="AuthNavigator" component={AuthNavigator} navigation={Stack.navigation} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  )
}

function Authstack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >




      <Stack.Screen name="AuthNavigator" component={AuthNavigator} navigation={Stack.navigation} options={{ gestureEnabled: false }} />
      <Stack.Screen name="HomeNavigator" component={HomeNavigator} navigation={Stack.navigation} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  )
}

export default AppNavContainer;