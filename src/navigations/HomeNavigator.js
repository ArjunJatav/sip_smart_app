import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Title, Image } from 'react-native';
import UserProfile from "../components/TabControllers/UserProfile";
import EditScreen from "../components/TabControllers/EditProfile";
import Listed from "../components/TabControllers/Listed"
//TabBar Tab Icons Unselected

// import homeIcon from '../../src/assets/images/TabBar_icons/Unselected'

import homeIcon from '../assets/images/TabBar_icons/Unselected/HomeInActive.png'
import plantIcon from '../assets/images/TabBar_icons/Unselected/SomeliarInActive.png'
import friendIcon from '../assets/images/TabBar_icons/Selected/ScanBottleActive.png'
import settingIcon from '../assets/images/TabBar_icons/Unselected/MarketInActive.png'
import profileIcon from '../assets/images/TabBar_icons/Unselected/BellinActive.png'

//TabBar Tab Icons Selected
import homeIconActive from '../assets/images/TabBar_icons/Selected/HomeActive.png'
import plantIconActive from '../assets/images/TabBar_icons/Selected/SomeliarActive.png'
import friendIconActive from '../assets/images/TabBar_icons/Selected/ScanBottleActive.png'
import settingIconActive from '../assets/images/TabBar_icons/Selected/MarketActive.png'
import profileIconActive from '../assets/images/TabBar_icons/Selected/BellActive.png'

//Tab Component files
import HomeScreen from "../components/TabControllers/HomeScreen";
import PlantsScreen from "../components/TabControllers/PlantsScreen";
import FriendsScreen from "../components/TabControllers/FriendsScreen";
import SettingsScreen from "../components/TabControllers/SettingsScreen";
import ProfileScreen from "../components/TabControllers/ProfileScreen";

const Stack = createStackNavigator();

const HomeNavigator = () => {

  const Tab = createBottomTabNavigator();

  return (
    <SafeAreaProvider>
      
      <Tab.Navigator tabBarOptions={{
        activeTintColor: '#9F2241',
        inactiveTintColor: 'gray',
        style: {
          color:"#fff",
          borderColor:"#DCC7B7",
          borderTopColor:"#DCC7B7",
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderTopWidth : 1,
        borderWidth :1

        },
        keyboardHidesTabBar: true
      }}

        screenOptions={({ route }) => ({

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? homeIconActive
                : homeIcon;
            }
            else if (route.name === 'Sommelier') {
              iconName = focused
                ? plantIconActive
                : plantIcon;
            }
            else if (route.name === ' ') {
              iconName = focused
                ? friendIconActive
                : friendIcon;

                return <Image
              source={iconName}
              resizeMode = "contain"
              style={{ height: 60, width: 60, marginBottom:25 }} />;

            }
            else if (route.name === 'Market') {
              iconName = focused
                ? settingIconActive
                : settingIcon;
            }
            else if (route.name === 'Notification') {
              iconName = focused
              ? profileIconActive
                : profileIcon;

            }
            // You can return any component that you like here!
            return <Image
              source={iconName}
              resizeMode = "contain"
              style={{ height: 20, width: 20 }} />;
          },

        })}

      >
        <Tab.Screen name="Home" component={HomeStack}></Tab.Screen>
        <Tab.Screen name="Sommelier" component={PlantStack}></Tab.Screen>
        <Tab.Screen name=" " component={FriendsStack}></Tab.Screen>
        <Tab.Screen name="Market" component={ProfileStack}></Tab.Screen>
        <Tab.Screen name="Notification" component={SettingsStack}></Tab.Screen>

      </Tab.Navigator>

    </SafeAreaProvider>

  );
}

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>

      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ gestureEnabled: false, headerShown: false,title:"MyCeller" }}
        navigation={Stack.navigation}
      />
        <Stack.Screen
        name="Listed"
        component={Listed}
        options={{ gestureEnabled: false, headerShown: false,title:"MyCeller" }}
        navigation={Stack.navigation}
      />


<Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ gestureEnabled: false, headerShown:false,title:"My Profile" }}
        navigation={Stack.navigation}
      />
      <Stack.Screen
        name="EditScreen"
        component={EditScreen}
        options={{ gestureEnabled: false, headerShown:true,title:"Edit Profile" }}
        navigation={Stack.navigation}
      />
    </Stack.Navigator>
  );
};

const PlantStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>

      <Stack.Screen
        name="PlantsScreen"
        component={PlantsScreen}
        options={{ gestureEnabled: false, headerShown: false }}
        navigation={Stack.navigation}
      />

    </Stack.Navigator>
  );
};

const FriendsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>

      <Stack.Screen
        name="FriendsScreen"
        component={FriendsScreen}
        options={{ gestureEnabled: false, headerShown: false }}
        navigation={Stack.navigation}
      />

    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>

      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ gestureEnabled: false, headerShown: false }}
        navigation={Stack.navigation}
      />

    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>

      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ gestureEnabled: false, headerShown: false }}
        navigation={Stack.navigation}
      />

      

    </Stack.Navigator>
  );
};

export default HomeNavigator;