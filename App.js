/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import "react-native-gesture-handler";

 import React, { useState, useEffect,useRef } from "react";
 import { View, Title, Image,alert } from "react-native";
 
 import { createStackNavigator } from "@react-navigation/stack";
 import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
 
 // import SplashScreen from 'react-native-splash-screen';
 import { SafeAreaView } from "react-native-safe-area-context";
 import { SafeAreaProvider } from "react-native-safe-area-context";
 
 import { NavigationContainer } from "@react-navigation/native";
 import {
   saveData,
   _retrieveData,
   AUTH_TOKEN,
   IsFirstLaunch,
 } from "./src/helpers/helper";
 import { navigationRef } from './src/components/TabControllers/RootNavigation';
 import UserProfile from "./src/components/TabControllers/UserProfile";
 import EditProfile from "./src/components/TabControllers/EditProfile";
 import Settings from "./src/components/TabControllers/Settings";
 import WineDetailScreen from "./src/components/TabControllers/WineDetailScreen";
 import InventryWineDetails from "./src/components/TabControllers/InventryWineDetails";
 import AddWineScreen from "./src/components/TabControllers/AddWineScreen";
 import CustomerOrders from "./src/components/TabControllers/CustomerOrders";
 import MyOrder from "./src/components/TabControllers/MyOrder";
 import CartScreen from './src/components/TabControllers/CartScreen'
 import CheckoutScreen from "./src/components/TabControllers/CheckoutScreen";
 import MyAddress from "./src/components/TabControllers/MyAddress";
 import Filter from "./src/components/TabControllers/Filter";
 import EditAddress from "./src/components/InitialController/EditAddress";
 import EditWine from './src/components/TabControllers/EditWine'

 //TermsCondition
 import TermsCondition from "./src/components/TabControllers/TermsCondition";
 import ChangePassword from "./src/components/TabControllers/ChangePassword";
 import ChangeNumber from "./src/components/TabControllers/ChangeNumber";
 
 //TabBar Tab Icons Unselected
 import homeIcon from "./src/assets/images/TabBar_icons/Unselected/HomeInActive.png";
 import plantIcon from "./src/assets/images/TabBar_icons/Unselected/SomeliarInActive.png";
 import friendIcon from "./src/assets/images/TabBar_icons/Selected/ScanBottleActive.png";
 import settingIcon from "./src/assets/images/TabBar_icons/Unselected/MarketInActive.png";
 import profileIcon from "./src/assets/images/TabBar_icons/Unselected/BellinActive.png";
 
 //TabBar Tab Icons Selected
 import homeIconActive from "./src/assets/images/TabBar_icons/Selected/HomeActive.png";
 import plantIconActive from "./src/assets/images/TabBar_icons/Selected/SomeliarActive.png";
 import friendIconActive from "./src/assets/images/TabBar_icons/Selected/ScanBottleActive.png";
 import settingIconActive from "./src/assets/images/TabBar_icons/Selected/MarketActive.png";
 import profileIconActive from "./src/assets/images/TabBar_icons/Selected/BellActive.png";
 
 //Tab Component files
 import HomeTab from "./src/components/TabControllers/HomeTab";
 import SomelierTab from "./src/components/TabControllers/SomelierTab";
 import ScanerTab from "./src/components/TabControllers/ScanerTab";
 import MarketTab from "./src/components/TabControllers/MarketTab";
 import NotificationsTab from "./src/components/TabControllers/NotificationsTab";
 
 //Auth Navigator Files
 import ForgotPassword from "./src/components/InitialController/ForgotPassword";
 import Login from "./src/components/InitialController/Login";
 import Register from "./src/components/InitialController/Register";
 import OTP from "./src/components/InitialController/otp.js";
 import ResetPassword from "./src/components/InitialController/ResetPassword.js";
 import Address from "./src/components/InitialController/Address";
 import BankDetail from "./src/components/InitialController/BankDetail";
 import Onboarding from "./src/components/InitialController/Onboarding";
 import Vieworder from "./src/components/TabControllers/ViewOrder"
 import Payment from "./src/components/TabControllers/Payment";
 import GooglePlacesInput from './src/components/TabControllers/GoogleplacesInput'
 import { EventRegister } from 'react-native-event-listeners'
 //import PushNotification, { Importance } from "react-native-push-notification";


 import firebase from '@react-native-firebase/app'
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
 const Stack = createStackNavigator();
 const Tab = createBottomTabNavigator();
 
 var Token = "";
 
 function getToken() {
   return _retrieveData(AUTH_TOKEN);
 }
 
 function getLaunch() {
   console.log("Get Launch Value", IsFirstLaunch);
 
   return _retrieveData(IsFirstLaunch);
 }
 
 export default function App() {
   const [Auth_Token, setAuth_Token] = useState("");
   const [isFirstLaunch, setLaunchValue] = useState("");
  
   const [IsLoading, setIsLoading] = useState(true);
 
   getToken().then((token) => {
     setAuth_Token(token);
     Token = token;
     setIsLoading(false);
   });
 
   getLaunch().then((isLaunch) => {
     if (isLaunch == null) {
       setLaunchValue("true");
       console.log("after set get value", isFirstLaunch);
     } else {
       console.log("this is else block");
       setLaunchValue("false");
     }
   });
 
   useEffect(() => {
    requestUserPermission();

    messageListener();
   


     setTimeout(() => {
       // console.log('working on ishow');
       // SplashScreen.hide();
     }, 1000);
   }, []);



   const checkStoragePermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  
    } else {
      requestStoragePermission();
    }
  }
  const getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('tokenssss',fcmToken)
  
  
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('tokenssssppppppppp',fcmToken)
  
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }
  
  const requestStoragePermission = async () => {
    try {
      await checkStoragePermission();
    } catch (error) {
      // User has rejected permissions
    }
  }
  
  
  
  const requestUserPermission = async () => {
  
  
  
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus) {
      getFcmToken();
    }
  }
  
  
  const notificationPressActionEventListener = async ({
    type,
    detail
  }) => {
    try {

      const { navigate } = navigationRef.current;
      comsole.log("presss")

     console.log("Notification Tapped By User")
      console.log(navigationRef.current.getCurrentRoute())

      setTimeout(() => {
        navigationRef.current.navigate("Notification")
      }, 4000);
      

    //  navigationRef.current.navigate("Notification")
    // navigate('EditProfile');
  // const { navigate } =  videoplaterref.current.getRootState();
  // navigate(navigationRef.current.getCurrentRoute(), {
  //   screen: 'EditProfile',
   
  // })



      // switch (type) {
      //   case type.PRESS:
      //     console.log('jjcjcncnnjvnjvnb')
      //      // navigate('SampleStackScreen');
      //     break;
      //   default:
      //     break;
      // }
    } catch (error) {
      console.log('Error in navigation', error);
    }
    return null;
  };
  
    
  
  
  
  
    const messageListener = async () => {
     
  
      messaging().onMessage(async remoteMessage => {
        console.log(remoteMessage)
        const { title, body } = remoteMessage.notification;
        console.log("android foreground PN")
  
        console.log("title````", title)
        //console.log("body~~~", JSON.parse(body))

  

    
        if (Platform.OS === 'ios') 
        {
          notifee.displayNotification({
            title: title,
           // body: JSON.parse(body).text,
           body: body,
            android: {
              channelId: 'defult',
            },
          });
          
          notifee.onForegroundEvent(
         notificationPressActionEventListener
     );

        notifee.onBackgroundEvent(

          notificationPressActionEventListener
        );

        messaging().getInitialNotification().then((remoteNotification)=>{ this.navigator.dispatch(NavigationActions.navigate({ routeName: 'Notification'}));}) .catch((err)=>{ alert(err); })
        

          messaging().onNotificationOpenedApp(remoteMessage => {

            console.log("Notification Tapped. When App is in background")
            console.log(navigationRef.current.getCurrentRoute())

             setTimeout(() => {
              navigationRef.current.navigate("Notification")
            }, 1000);

           });

           messaging().on





        }
        else {

          
 
        

  
        }
  
  
  
  
      });
     
   
  
    
    }
  
  
  
  
  
  







 
   if (IsLoading) {
     return <View></View>;
   } else {
     console.log("token", Auth_Token);
     console.log("First Launch", isFirstLaunch);
 
     if (isFirstLaunch == "true" || isFirstLaunch == "") {
       return (
         <NavigationContainer
         ref={navigationRef}
         
         >
           <Stack.Navigator
             screenOptions={{
               headerShown: Platform.OS == "false" ? true : false,
             }}
           >
             <Stack.Screen
               name="OnboardStack"
               component={OnboardStack}
               navigation={Stack.navigation}
               options={{ headerShown: false, gestureEnabled: false }}
             />
             <Stack.Screen
               name="HomeNavigator"
               component={AppNavigator}
               navigation={Stack.navigation}
               options={{ headerShown: false, gestureEnabled: false }}
             />
             <Stack.Screen
               name="AuthStack"
               component={AuthStack}
               navigation={Stack.navigation}
               options={{ headerShown: false, gestureEnabled: false }}
             />
           </Stack.Navigator>
         </NavigationContainer>
       );
     } else {
       if (Auth_Token != null && Auth_Token != "") {
         console.log(1);
         return (
           <NavigationContainer
           ref={navigationRef}
           
           >
             <Stack.Navigator
               screenOptions={{
                 headerShown: Platform.OS == "false" ? true : false,
               }}
             >
               <Stack.Screen
                 name="HomeNavigator"
                 component={AppNavigator}
                 navigation={Stack.navigation}
                 options={{ headerShown: false, gestureEnabled: false }}
               />
               <Stack.Screen
                 name="AuthStack"
                 component={AuthStack}
                 navigation={Stack.navigation}
                 options={{ headerShown: false, gestureEnabled: false }}
               />
             </Stack.Navigator>
           </NavigationContainer>
         );
       } else {
         console.log(2);
 
         return (
           <NavigationContainer
           ref={navigationRef}
           
           >
             <Stack.Navigator
               screenOptions={{
                 headerShown: Platform.OS == "false" ? true : false,
               }}
             >
               <Stack.Screen
                 name="AuthStack"
                 component={AuthStack}
                 navigation={Stack.navigation}
                 options={{ headerShown: false, gestureEnabled: false }}
               />
               <Stack.Screen
                 name="HomeNavigator"
                 component={AppNavigator}
                 navigation={Stack.navigation}
                 options={{ headerShown: false, gestureEnabled: false }}
               />
             </Stack.Navigator>
           </NavigationContainer>
         );
       }
     }
   }
 }
 
 function AppNavigator(props) {
   {
     console.log("This is in App Navigator");
   }
   return (
     <Stack.Navigator
       screenOptions={{
         headerShown: false,
       }}
     >
       <Stack.Screen
         name="MainScreenNavigator"
         component={MainScreenNavigator}
         navigation={Stack.navigation}
         options={{ gestureEnabled: false }}
       />
 
       <Stack.Screen
         name="UserProfile"
         component={UserProfile}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
 
       {/* WineDetailScreen */}
       <Stack.Screen
         name="WineDetailScreen"
         component={WineDetailScreen}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
       
 
  <Stack.Screen
         name="InventryWineDetails"
         component={InventryWineDetails}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
      
       {/* AddWineScreen */}
       <Stack.Screen
         name="AddWineScreen"
         component={AddWineScreen}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
 
       {/* MyOrder */}
       <Stack.Screen
         name="MyOrder"
         component={MyOrder}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
 
       {/* CustomerOrders */}
       <Stack.Screen
         name="CustomerOrders"
         component={CustomerOrders}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
 
       {/* EditProfile */}
       <Stack.Screen
         name="EditProfile"
         component={EditProfile}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
 
       {/* CheckoutScreen */}
       <Stack.Screen
         name="CheckoutScreen"
         component={CheckoutScreen}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
 
 <Stack.Screen
         name="MyAddress"
         component={MyAddress}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
       
 <Stack.Screen
         name="EditAddress"
         component={EditAddress}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
      
      <Stack.Screen
         name="Filter"
         component={Filter}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
 
      
 {/* CartScreen */}
 <Stack.Screen
         name="CartScreen"
         component={CartScreen}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
  
 
       {/* Settings */}
       <Stack.Screen
         name="Settings"
         component={Settings}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
 
       <Stack.Screen
         name="OTP"
         component={OTP}
         navigation={Stack.navigation}
         options={{ headerShown: false }}
       />
 
       <Stack.Screen
         name="Address"
         component={Address}
         navigation={Stack.navigation}
         options={{ headerShown: false }}
       />
 
       {/* BankDetail */}
       <Stack.Screen
         name="BankDetail"
         component={BankDetail}
         navigation={Stack.navigation}
         options={{ headerShown: false }}
       />
 
       {/* TermsCondition */}
       <Stack.Screen
         name="TermsCondition"
         component={TermsCondition}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
 
       {/* ChangeNumber */}
       <Stack.Screen
         name="ChangeNumber"
         component={ChangeNumber}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
 
       {/* ChangePassword */}
       <Stack.Screen
         name="ChangePassword"
         component={ChangePassword}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
 <Stack.Screen
         name="Vieworder"
         component={Vieworder}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
       <Stack.Screen
         name="Payment"
         component={Payment}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
 
 
 <Stack.Screen
         name="GooglePlacesInput"
         component={GooglePlacesInput}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
       
       
 <Stack.Screen
         name="EditWine"
         component={EditWine}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
     </Stack.Navigator>
   );
 }
 
 function MainScreenNavigator() {
   {
     console.log("This is in Main Screen Navigator");
   }
 
 
 
   const tabBarListeners = ({ navigation, route }) => ({
 
 
     tabPress: () => {
 
 
      /*
       EventRegister.emit('filter updated', {
         sorting: '0',
         categorylist: [],
         city: '',
         pricefrom: '',
         priceTo: '',
         vintage: '',
         priceid: ''
       });
       */
 
     }
 
 
     //navigation.navigate('hometab'),
   });
 
   return (
     <SafeAreaProvider>
       <Tab.Navigator
         tabBarOptions={{
           activeTintColor: "#9F2241",
           inactiveTintColor: "gray",
           style: {
             color: "#fff",
             borderColor: "#DCC7B7",
             borderTopColor: "#DCC7B7",
             backgroundColor: "#fff",
             borderTopLeftRadius: 30,
             borderTopRightRadius: 30,
             borderTopWidth: 1,
             borderWidth: 1,
           },
           keyboardHidesTabBar: true,
         }}
         screenOptions={({ route }) => ({
           tabBarIcon: ({ focused, color, size }) => {
             let iconName;
 
             if (route.name === "Home") {
               iconName = focused ? homeIconActive : homeIcon;
             } else if (route.name === "Sommelier") {
               iconName = focused ? plantIconActive : plantIcon;
             } else if (route.name === " ") {
               iconName = focused ? friendIconActive : friendIcon;
 
               return (
                 <Image
                   source={iconName}
                   resizeMode="contain"
                   style={{ height: 60, width: 60, marginBottom: 25 }}
                 />
               );
             } else if (route.name === "Market") {
               iconName = focused ? settingIconActive : settingIcon;
             } else if (route.name === "Notification") {
               iconName = focused ? profileIconActive : profileIcon;
             }
             return (
               <Image
                 source={iconName}
                 resizeMode="contain"
                 style={{ height: 20, width: 20 }}
               />
             );
           },
         })}
       >
         <Tab.Screen name="Home" component={HomeStack}></Tab.Screen>
         <Tab.Screen name="Sommelier" component={SomeliarStack}></Tab.Screen>
         <Tab.Screen name=" " component={ScannerStack}></Tab.Screen>
         <Tab.Screen name="Market" component={MarketStack} listeners={tabBarListeners} ></Tab.Screen>
         <Tab.Screen
           name="Notification"
           component={NotificationStack}
         ></Tab.Screen>
       </Tab.Navigator>
     </SafeAreaProvider>
   );
 }
 
 const HomeStack = () => {
   return (
     <Stack.Navigator
       screenOptions={{
         headerShown: false,
       }}
     >
       <Stack.Screen
         name="HomeTab"
         component={HomeTab}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
     
     </Stack.Navigator>
   );
 };
 
 const SomeliarStack = () => {
   return (
     <Stack.Navigator
       screenOptions={{
         headerShown: false,
       }}
     >
       <Stack.Screen
         name="SomelierTab"
         component={SomelierTab}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
     </Stack.Navigator>
   );
 };
 
 const ScannerStack = () => {
   return (
     <Stack.Navigator
       screenOptions={{
         headerShown: false,
       }}
     >
       <Stack.Screen
         name="ScanerTab"
         component={ScanerTab}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
     </Stack.Navigator>
   );
 };
 
 const MarketStack = () => {
   return (
     <Stack.Navigator
       screenOptions={{
         headerShown: false,
       }}
     >
       <Stack.Screen
         name="MarketTab"
         component={MarketTab}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
     </Stack.Navigator>
   );
 };
 
 const NotificationStack = () => {
   return (
     <Stack.Navigator
       screenOptions={{
         headerShown: false,
       }}
     >
       <Stack.Screen
         name="NotificationsTab"
         component={NotificationsTab}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
     </Stack.Navigator>
   );
 };
 
 const OnboardStack = () => {
   return (
     <Stack.Navigator>
       {/* Onboarding */}
 
       <Stack.Screen
         name="Onboarding"
         component={Onboarding}
         navigation={Stack.navigation}
         options={{ headerShown: false }}
       />
       <Stack.Screen
         name="AuthStack"
         component={AuthStack}
         navigation={Stack.navigation}
         options={{ headerShown: false, gestureEnabled: false }}
       />
     </Stack.Navigator>
   );
 };
 
 const AuthStack = () => {
   return (
     <Stack.Navigator>
       {/* Onboarding */}
 
       {/* <Stack.Screen
         name="Onboarding"
         component={Onboarding}
         navigation={Stack.navigation}
         options={{ headerShown: false }}
       /> */}
 
       <Stack.Screen
         name="Login"
         component={Login}
         navigation={Stack.navigation}
         options={{ headerShown: false }}
       />
       <Stack.Screen
         name="Register"
         component={Register}
         navigation={Stack.navigation}
         options={{ headerShown: false }}
       />
       <Stack.Screen
         name="ForgotPassword"
         component={ForgotPassword}
         navigation={Stack.navigation}
         options={{ headerShown: false }}
       />
       <Stack.Screen
         name="OTP"
         component={OTP}
         navigation={Stack.navigation}
         options={{ headerShown: false }}
       />
       <Stack.Screen
         name="ResetPassword"
         component={ResetPassword}
         navigation={Stack.navigation}
         options={{ headerShown: false }}
       />
 
       {/* Address */}
       <Stack.Screen
         name="Address"
         component={Address}
         navigation={Stack.navigation}
         options={{ headerShown: false }}
       />
 <Stack.Screen
         name="GooglePlacesInput"
         component={GooglePlacesInput}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
       {/* BankDetail */}
       <Stack.Screen
         name="BankDetail"
         component={BankDetail}
         navigation={Stack.navigation}
         options={{ headerShown: false }}
       />
 
       <Stack.Screen
         name="TermsCondition"
         component={TermsCondition}
         options={{ gestureEnabled: false, headerShown: false }}
         navigation={Stack.navigation}
       />
     </Stack.Navigator>
   );
 };
 