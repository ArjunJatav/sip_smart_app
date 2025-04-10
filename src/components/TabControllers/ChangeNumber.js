import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  Alert, KeyboardAvoidingView
} from "react-native";

import backImage from "../../assets/images/other_icons/back.png";
import { CommonActions } from "@react-navigation/native";
import CountryPicker from "react-native-country-picker-modal";

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import * as constants from "../../constants/Const";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import { _retrieveData, AUTH_TOKEN } from "../../helpers/helper";

import { TextField } from "rn-material-ui-textfield";

const ChangeMobileNumber = ({ route, navigation }) => {
  var token = "";
  const [loading, setIsLoading] = useState(false);
  const [showCountryPicker, setCountryPicker] = useState(false);

  const [cca2, setcca2] = useState("");

  const [CountryCallingCode, setCountryCallingCode] = useState("91");
  const [new_mobile, setNewmobile] = useState("");
  const [password, setPassword] = useState("");

  const getToken = async () => {
    token = await AsyncStorage.getItem("Token");
  };
  const SubmitClick = async () => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);
  

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      }
      setIsLoading(true);
      axios({
        method: "post",
        url: constants.baseURL + constants.changeMobileNumber,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,

        },
        data: {
          country_code: CountryCallingCode,
          new_mobile: new_mobile,
          password: password,
        },
      })
        .then((response) => {
        
          setIsLoading(false);
          if (response.data.status == 200) {
            Alert.alert("Alert", response.data.message);


            navigation.navigate("OTP", {
              MobileVal: new_mobile,
              countryCode: CountryCallingCode,
              isFromSignup: false,
              isFromChangeNumber: true,
              otptype:'changenumber'
            });
          }
          if (response.data.status == 400) {
            Alert.alert("Alert", response.data.message);
          }
        })
        .catch((error) => {
         
          setIsLoading(false);
          return;
        });
    });
  };
  useEffect(() => {
    getToken();
  }, []);
  return (
    <SafeAreaView style={{ backgroundColor: "#F5EFEB" }}>
    <KeyboardAvoidingView
          enabled
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flex: 1 }}
        >
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
              Change Mobile Number
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
            marginTop: 16,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              //  flexDirection: "row",
              marginTop: 16,
              // justifyContent: "center",
              //  height: 57,
              marginLeft: 10,
              marginRight: 10,
              justifyContent: "flex-start",
              alignSelf: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#1D1D1D",
                alignSelf: "center",
                fontWeight: "300",
                alignSelf: "center",
                textAlign: "center",
                fontFamily: "HelveticaNeue",
                fontStyle: "normal",
              }}
            >
              Mobile Number
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: -20,
              justifyContent: "center",
              height: 57,
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <TouchableOpacity
              style={{
                width: "18%",
                borderBottomWidth: 1.0,
                borderBottomColor: "#9F2241",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.7}
              onPress={() => {
                setCountryPicker(!showCountryPicker);
              }}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: 18,
                  fontSize: 17,
                  color: "#9F2241",
                  //  tintColor:"#9F2241",
                  //  baseColor:"#9F2241",
                  alignSelf: "flex-end",
                  // textColor:"#9F2241",
                  fontFamily: "HelveticaNeue",
                  fontWeight: "300",
                }}
              >
                +{CountryCallingCode}
              </Text>
            </TouchableOpacity>

            <TextField
              containerStyle={{
                width: "78%",
                marginLeft: "4%",
                alignSelf: "center",
              }}
              // label="Mobile Number"
              keyboardType="phone-pad"
              style={{ width: "100%" }}
              onChangeText={(addressStr) => setNewmobile(addressStr)}
              // formatText ={address}

              //Text = {address}
              value={new_mobile}
              textColor={"#9F2241"}
              tintColor="#9F2241"
              baseColor="#9F2241"
              lineWidth={1}
              activeLineWidth={1}
              labelTextStyle={{
                fontFamily: "HelveticaNeue",
                fontWeight: "300",
              }}
              returnKeyLabel="Done"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>

          <TextField
            containerStyle={{
              marginLeft: 30,
              marginRight: 30,
              alignSelf: "center",
              width: deviceWidth - 60,
            }}
            label="Password"
            style={{ width: "100%" }}
            onChangeText={(addressStr) => setPassword(addressStr)}
            value={password}
            //   onChangeText={(fullName) => this.setState({ fullName })}
            textColor={"#9F2241"}
            secureTextEntry={true}
            tintColor="black"
            baseColor="black"
            lineWidth={1}
            activeLineWidth={1}
            disabledLineWidth={1}
            labelTextStyle={{
              fontFamily: "HelveticaNeue",
              fontWeight: "300",
            }}
          />
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
          <TouchableOpacity activeOpacity={0.7} onPress={() => SubmitClick()}>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "normal" }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View
            style={{
              position: "absolute",

              height: "100%",
              width: "100%",
             
              flex: 1,
              marginTop:'60%'
            }}
          >
            <ActivityIndicator color="#9F2241" size="large"></ActivityIndicator>
          </View>
        )}

        <CountryPicker
          onSelect={(value) => {
            setCountryCallingCode(value.callingCode.toString()),
              setcca2(value.callingCode),
              setCountryPicker(false);
          }}
          cca2={cca2}
          placeholder=""
          placeholderTextColor="9F2241"
          withCountryNameButton={true}
          withCallingCode={true}
          withAlphaFilter={true}
          visible={showCountryPicker}
          onClose={(value) => {
            setCountryPicker(false);
          }}
        />
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loading_cont: {
    width: 80,
    height: 80,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default ChangeMobileNumber;
