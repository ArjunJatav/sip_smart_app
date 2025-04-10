import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";

import backImage from "../../assets/images/other_icons/back.png";
import * as constants from "../../constants/Const";

import NetInfo from "@react-native-community/netinfo";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import hide from "../../assets/images/other_icons/hidden.png";
import view from "../../assets/images/other_icons/view.png";
import { TextField } from "rn-material-ui-textfield";

let token;

const ChangePassword = ({ route, navigation }) => {
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword,setShowpassword]=useState(true)
  const [showNewPassword,setNewPassword]=useState(true)
  const [showConPassword,setConPassword]=useState(true)


  const _UpdatePassword = async () => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);
   
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", "No Internet Connection");
        return;
      } else {
        if (oldPassword === "") {
          Alert.alert("Alert", "Old password is required");
          return;
        } else if (newPassword === "") {
          Alert.alert("Alert", "New password is required");
          return;
        } else if (confirmPassword === "") {
          Alert.alert("Alert", "Confirm password is required");
          return;
        } else if (confirmPassword != newPassword) {
          Alert.alert("Alert", "Password doesn't match");
          return;
        } else {
          setIsLoading(true);
          axios({
            method: "post",
            url: constants.baseURL + constants.changePasswordAPI,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
            data: {
              new_password: newPassword,
              password: oldPassword,
            },
          })
            .then((response) => {
              setIsLoading(false);
            
              if (response.data.status == 200) {
                Alert.alert("Alert", response.data.message);
                navigation.goBack();
              }
              if (response.data.status == 400) {
                Alert.alert("Alert", response.data.message);
              }
            })
            .catch(function (error) {
              setIsLoading(false);
            });
        }
      }
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#F5EFEB" }}>
      {/* -----------------------------------Top Navigation Bar start------------------------------------------------ */}
      <View
        style={{
          height: 50,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 48,
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ height: 48, width: "15%" }}>
            <TouchableOpacity
              style={{
                width: 50,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={backImage}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{ width: "70%", height: "100%", justifyContent: "center" }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#000",
                alignSelf: "center",
                fontWeight: "bold",
                alignSelf: "center",
                textAlign: "center",
              }}
            >
              Change Password
            </Text>
          </View>
          <View
            style={{
              height: "100%",
              width: "15%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
        </View>
      </View>
      {/* -----------------------------------Top Navigation Bar End------------------------------------------------ */}

      <View
        style={{
          backgroundColor: "#F5EFEB",
          width: "100%",
          height: deviceHeight - 50,
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: "75%",
            width: "90%",
            backgroundColor: "#fff",
            marginTop: 15,
            borderRadius: 10,
          }}
        >
           <View
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent:"center",
                 
                }}
              >
                 <TextField
            containerStyle={{
             
              alignSelf: "center",
              width: "85%",
            }}
            label="Enter Old Password"
            style={{ width: "100%" }}
            textColor={"#9F2241"}
            tintColor="black"
            baseColor="black"
            lineWidth={1}
            secureTextEntry={showPassword}
            activeLineWidth={1}
            disabledLineWidth={1}
            value={oldPassword}
            onChangeText={(oldPassword) => {
              setoldPassword(oldPassword);
            }}
            labelTextStyle={{
              fontFamily: "HelveticaNeue",
              fontWeight: "300",
            }}
          />

<TouchableOpacity
                style={{alignSelf:"center"}}
                onPress={()=>{setShowpassword(!showPassword)}}
                >
                {showPassword ? <Image
                  source={hide}
                  style={{
                    height: 20,
                    width: 20,
                    marginRight:10,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                />:<Image
                source={view}
                style={{
                  height: 20,
                  width: 20,
                  marginRight:10,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
}
</TouchableOpacity>
                </View>
         
                <View
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent:"center",
                 
                }}
              >
          <TextField
            containerStyle={{
              
              alignSelf: "center",
              width: "85%",
            }}
            label="Enter New Password"
            style={{ width: "100%" }}
            textColor={"#9F2241"}
            tintColor="black"
            baseColor="black"
            lineWidth={1}
            secureTextEntry={showNewPassword}
            activeLineWidth={1}
            disabledLineWidth={1}
            value={newPassword}
            onChangeText={(newPassword) => {
              setnewPassword(newPassword);
            }}
            labelTextStyle={{
              fontFamily: "HelveticaNeue",
              fontWeight: "300",
            }}
          />
          <TouchableOpacity
                style={{alignSelf:"center"}}
                onPress={()=>{setNewPassword(!showNewPassword)}}
                >
                {showNewPassword ? <Image
                  source={hide}
                  style={{
                    height: 20,
                    width: 20,
                    marginRight:10,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                />:<Image
                source={view}
                style={{
                  height: 20,
                  width: 20,
                  marginRight:10,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
}
</TouchableOpacity>
</View>
<View
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent:"center",
                 
                }}
              >
          <TextField
            containerStyle={{
              
              alignSelf: "center",
              width: "85%",
            }}
            label="Confirm Password"
            style={{ width: "100%" }}
            textColor={"#9F2241"}
            tintColor="black"
            baseColor="black"
            lineWidth={1}
            secureTextEntry={showConPassword}
            activeLineWidth={1}
            disabledLineWidth={1}
            value={confirmPassword}
            onChangeText={(confirmPassword) => {
              setconfirmPassword(confirmPassword);
            }}
            labelTextStyle={{
              fontFamily: "HelveticaNeue",
              fontWeight: "300",
            }}
          />
            <TouchableOpacity
                style={{alignSelf:"center"}}
                onPress={()=>{setConPassword(!showConPassword)}}
                >
                {showConPassword ? <Image
                  source={hide}
                  style={{
                    height: 20,
                    width: 20,
                    marginRight:10,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                />:<Image
                source={view}
                style={{
                  height: 20,
                  width: 20,
                  marginRight:10,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
}
</TouchableOpacity>
</View>
        </View>

        <View
          style={{
            height: 50,
            width: "90%",
            backgroundColor: "#9F2241",
            marginTop: 15,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => _UpdatePassword()}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "normal" }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && (
          <View
            style={{
              position: "absolute",

              height: "100%",
              width: "100%",
              alignContent: "center",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color="#9F2241" size="large"></ActivityIndicator>
          </View>
        )}
    </SafeAreaView>
  );
};

export default ChangePassword;
