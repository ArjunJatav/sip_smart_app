import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ForgotPassword from "../components/InitialController/ForgotPassword";
import Login from "../components/InitialController/Login";
import Register from "../components/InitialController/Register";
import OTP from "../components/InitialController/otp.js";
import ResetPassword from "../components/InitialController/ResetPassword.js";

import ProfileScreen from "../components/TabControllers/ProfileScreen";
const AuthenticationNavigator = () => {

    const AuthStack = createStackNavigator();

    return (

        <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={Login} navigation={AuthStack.navigation} options={{ headerShown: false }} />
            <AuthStack.Screen name="Register" component={Register} navigation={AuthStack.navigation} options={{ headerShown: false }} />
            <AuthStack.Screen name="ForgotPassword" component={ForgotPassword}
             navigation={AuthStack.navigation} options={{  title: 'Forgot Password'}} />
            <AuthStack.Screen name="OTP" component={OTP} navigation={AuthStack.navigation} options={{ headerShown: true,title:"Verification" }} />
            <AuthStack.Screen name="ResetPassword" component={ResetPassword} navigation={AuthStack.navigation} options={{ title: 'Reset Password' }} />
            <AuthStack.Screen name=" ProfileScreen" component={ ProfileScreen} navigation={AuthStack.navigation} options={{headerShown: false }} />
        </AuthStack.Navigator>
    );
}

export default AuthenticationNavigator;