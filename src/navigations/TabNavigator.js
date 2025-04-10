import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigator from "./HomeNavigator";


const TabNavigator = () => {

  const HomeStack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  return (
    <SafeAreaProvider>
      <Tab.Navigator>
        <Stack.Screen name="Home" component={HomeNavigator}></Stack.Screen>
      </Tab.Navigator>

    </SafeAreaProvider>

  );
}

export default TabNavigator;