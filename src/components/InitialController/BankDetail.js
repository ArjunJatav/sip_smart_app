import React, { Component, useState, useEffect } from "react";
import {

  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView

} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import * as constants from "../../constants/Const";
import AsyncStorage from "@react-native-async-storage/async-storage";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import { CommonActions } from "@react-navigation/native";

import { TextField } from "rn-material-ui-textfield";

const BankDetail = ({ route, navigation }) => {
  var token = "";

  const [userbankName, setBankNamer] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [iban, setIban] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const SkipButton = async () => {



    const resetAction = CommonActions.reset({
      routes: [{ name: "HomeNavigator" }],
    });
    navigation.dispatch(resetAction);
  };

  const SaveBankDetail = async () => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);
    

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", "No Internet Connection");
        return;
      } else {
        if (userbankName === "") {
          Alert.alert("Alert", "Bank name field is required");
          return;
        } else if (bankAccountNumber === "") {
          Alert.alert("Alert", "Account number field is required");
          return;
        } else if (iban === "") {
          Alert.alert("Alert", "IBAN field is required");
          return;
        } else if (address === "") {
          Alert.alert("Alert", "Address field is required");
          return;
        } else {
          setIsLoading(true);
          axios({
            method: "post",
            url: constants.baseURL + constants.setBankAPI,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
            data: {
              bank_name: userbankName,
              bank_account_number: bankAccountNumber,
              IBAN_Number: iban,
              branch_address: address,
            },
          })
            .then((response) => {
              setIsLoading(false);

              if (response.data.status == 200) {
                Alert.alert("Alert", response.data.message);

                const resetAction = CommonActions.reset({
                  routes: [{ name: "HomeNavigator" }],
                });
                navigation.dispatch(resetAction);
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
    <View style={{ flex: 1, backgroundColor: "#F5EFEB" }}>
      <SafeAreaView style={{ flex: 1 }}>
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
                onPress={() => console.log("Do Nothing")}
              >

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
                Bank Details
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

        <KeyboardAvoidingView
          keyboardVerticalOffset={0}
        >


          <ScrollView


            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', marginBottom: 50, }}
            >
              <View
                style={{
                  height: "70%",
                  width: "90%",
                  backgroundColor: "#fff",
                  marginTop: 15,
                  borderRadius: 10,
                }}
              >

                <TextField
                  containerStyle={{
                    marginLeft: 30,
                    marginRight: 30,
                    alignSelf: "center",
                    width: deviceWidth - 60,
                  }}
                  label="Bank Name"
                  style={{ width: "100%" }}
                  onChangeText={(NameBank) => {
                    setBankNamer(NameBank);
                  }}
                  value={userbankName}
                  textColor={"#9F2241"}
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

                <TextField
                  containerStyle={{
                    marginLeft: 30,
                    marginRight: 30,
                    alignSelf: "center",
                    width: deviceWidth - 60,
                  }}
                  label="Account Number"
                  style={{ width: "100%" }}
                  onChangeText={(accNumVal) => {
                    setBankAccountNumber(accNumVal);
                  }}
                  value={bankAccountNumber}
                  textColor={"#9F2241"}
                  tintColor="black"
                  keyboardType={"number-pad"}
                  baseColor="black"
                  lineWidth={1}
                  activeLineWidth={1}
                  disabledLineWidth={1}
                  labelTextStyle={{
                    fontFamily: "HelveticaNeue",
                    fontWeight: "300",
                  }}
                />

                <TextField
                  containerStyle={{
                    marginLeft: 30,
                    marginRight: 30,
                    alignSelf: "center",
                    width: deviceWidth - 60,
                  }}
                  label="IBAN Number"
                  style={{ width: "100%" }}
                  onChangeText={(accountNumVal) => {
                    setIban(accountNumVal);
                  }}
                  value={iban}
                  textColor={"#9F2241"}
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

                <TextField
                  containerStyle={{
                    marginLeft: 30,
                    marginRight: 30,
                    alignSelf: "center",
                    width: deviceWidth - 60,
                  }}
                  label="Bank Address"
                  style={{ width: "100%" }}
                  onChangeText={(addressStr) => {
                    setAddress(addressStr);
                  }}
                  value={address}
                  textColor={"#9F2241"}
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
                  marginTop: 25,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  activeOpacity={0.7}
                  onPress={() => SkipButton()}
                >
                  <Text style={{ color: "#fff", fontSize: 18, fontWeight: "normal" }}>
                    Skip
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  height: 50,
                  width: "90%",
                  backgroundColor: "#9F2241",
                  marginTop: 10,
                  borderRadius: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  activeOpacity={0.7}
                  onPress={() => SaveBankDetail()}
                >
                  <Text style={{ color: "#fff", fontSize: 18, fontWeight: "normal" }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>


          </ScrollView>
        </KeyboardAvoidingView>
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
    </View>
  );
};

export default BankDetail;
