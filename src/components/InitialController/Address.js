import React, { Component, useState, useEffect } from "react";
import {

  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import backImage from "../../assets/images/other_icons/back.png";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import * as constants from "../../constants/Const";
import AsyncStorage from "@react-native-async-storage/async-storage";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import checkImage from "../../assets/images/other_icons/check.png";
import uncheckImage from "../../assets/images/other_icons/uncheck.png";
import iconLocation from "../../assets/images/other_icons/location.png";
import { _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import { EventRegister } from "react-native-event-listeners";

import { TextField } from "rn-material-ui-textfield";

var img = null;
var type = "";

const Address = ({ route, navigation }) => {
  var token = "";

  type = route.params.type;
  const [address, setAddress] = useState("");
  const [address_lineValue, setAddress_lineValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [postcodeValue, setPostcodeValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const markAsDefault = () => {
    img = showImage ? checkImage : uncheckImage;
    return <Image style={styles.presentAddressIcon} source={img} />;
  };

  const getToken = async () => {
    token = await AsyncStorage.getItem("Token");
  };

  const SaveAddress = async () => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", "No Internet Connection");
        return;
      } else {
        if (address === "") {
          Alert.alert("Alert", "Address 1 field is required");
          return;
        } else if (cityValue === "") {
          Alert.alert("Alert", "City field is required");
          return;
        } else if (countryValue === "") {
          Alert.alert("Alert", "Country field is required");
          return;
        } else if (postcodeValue === "") {
          Alert.alert("Alert", "Postcode field is required");
          return;
        }
          else if(isNaN(postcodeValue)) {
            Alert.alert("Alert", "Postcode field is not valid");
            return;
          
        } else {
          setIsLoading(true);
          axios({
            method: "post",
            url: constants.baseURL + constants.setAddressApi,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
            data: {
              address: address,
              address_line1: address_lineValue,
              city: cityValue,
              country: countryValue,
              postcode: postcodeValue,
              default: showImage,
              lat: "cecevvvveevv",
              long: "sdsdvee",
              default: showImage
            },
          })
            .then((response) => {
              setIsLoading(false);
              console.log("response");
              console.log(response.data);
              console.log(response.data.status);
              if (response.data.status == 200) {
                



                if (type === 'register') {
                  navigation.navigate("BankDetail");
                }
                else {
                  navigation.navigate("MyAddress");
                }



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

  useEffect(() => {
    getToken();

    const list = EventRegister.addEventListener('add address', (data) => {
    
        setAddress(data.address);
        setAddress_lineValue(data.address1)
        setCountryValue(data.country)
        setPostcodeValue(data.postcode)
        setCityValue(data.city)
        

      
      
      }




    )
    return () => {


      EventRegister.removeEventListener(list);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F5EFEB" }}>
      <SafeAreaView style={{ flex: 1 }}>
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
                Address
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
                  height: "80%",
                  width: "90%",
                  backgroundColor: "#fff",
                  marginTop: 15,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 70,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    containerStyle={{
                      width: deviceWidth - 100,
                      marginLeft: 10,
                    }}
                    label="Address "
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

                  <TouchableOpacity
                    style={{
                      width: 48,
                      height: 55,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 0.7,
                      borderColor: "lightgray",
                    }}
                    onPress={() => {
                      {
                        navigation.navigate("GooglePlacesInput")
                        
                      }
                    }}
                  >
                    <Image
                      source={iconLocation}
                      style={{
                        height: 22,
                        width: 22,
                        resizeMode: "contain",
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <TextField
                  containerStyle={{
                    width: deviceWidth - 60,
                    marginLeft: 10,
                  }}
                  label="Address Line 1"
                  style={{ width: "100%" }}
                  onChangeText={(addressLine) => {
                    setAddress_lineValue(addressLine);
                  }}
                  value={address_lineValue}
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
                    width: deviceWidth - 60,
                    marginLeft: 10,
                  }}
                  label="City"
                  style={{ width: "100%" }}
                  onChangeText={(cityV) => {
                    setCityValue(cityV);
                  }}
                  value={cityValue}
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
                    width: deviceWidth - 60,
                    marginLeft: 10,
                  }}
                  label="Country"
                  style={{ width: "100%" }}
                  onChangeText={(country) => {
                    setCountryValue(country);
                  }}
                  value={countryValue}
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
                    width: deviceWidth - 60,
                    marginLeft: 10,
                  }}
                  label="Postcode"
                  style={{ width: "100%" }}
                  onChangeText={(postcodeVal) => {
                    setPostcodeValue(postcodeVal);
                  }}
                  value={postcodeValue}
                  textColor={"#9F2241"}
                  tintColor="black"
                  baseColor="black"
                  lineWidth={1}
                  keyboardType={"number-pad"}
                  activeLineWidth={1}
                  disabledLineWidth={1}
                  returnKeyType="done"
                  labelTextStyle={{
                    fontFamily: "HelveticaNeue",
                    fontWeight: "300",
                  }}
                />

                <View
                  style={{
                    width: "100%",
                    height: 50,
                    marginTop: 10,
                    marginBottom: 10,
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      height: 20,
                      width: 20,
                      margin: 10,
                    }}
                    onPress={() => setShowImage(!showImage)}
                  >
                    {markAsDefault()}
                  </TouchableOpacity>

                  <Text style={{ marginTop: 10 }}>Mark as default</Text>
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
                  style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}
                  activeOpacity={0.7}
                  onPress={() => SaveAddress()}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 18, fontWeight: "normal" }}
                  >
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

const styles = StyleSheet.create({
  presentAddressIcon: {
    height: 20,
    width: 20,
    justifyContent: "flex-start",
    padding: 7,
    bottom: 2,
    flexDirection: "row",
    resizeMode: "contain",
  },
});

export default Address;
