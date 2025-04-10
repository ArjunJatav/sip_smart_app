import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";

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

import { TextField } from "rn-material-ui-textfield";

var img = null;

const EditAddress = ({ route, navigation }) => {

  var token = "";
  const [receiveAddress, setReceiveAddress] = useState("")
  const [Address, setAddress] = useState("")

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


  const EditAddress = async (id) => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);


    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);
        axios({
          method: "post",
          url: constants.baseURL + constants.getUserUpdateAddress,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token
          },
          data: {
            addressId: receiveAddress,
            address: Address,
            address_line1: address_lineValue,
            city: cityValue,
            country: countryValue,
            postcode: postcodeValue,
            default: showImage,
            lat: "0.0",
            long: "0.0"




          },

        })
          .then((response) => {
            setIsLoading(false);



            if (response.data.status == 200) {
              Alert.alert("Alert", response.data.message);
              navigation.navigate("MyAddress")

            }
            if (response.data.status == 400) {
              Alert.alert("Alert", response.data.message);
            }
          })
          .catch(function (error) {
            setIsLoading(false);
          });
      }

    });
  };


  useEffect(() => {
    setReceiveAddress(route.params.addressid)
    setAddress(route.params.Address)
    setAddress_lineValue(route.params.address_lineValue);
    setCountryValue(route.params.countryValue);
    setCityValue(route.params.cityValue)
    setPostcodeValue(route.params.postcodeVal);
    setShowImage(route.params.default)
  }, []);

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
              EditAddress
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
      <ScrollView>
        <View
          style={{
            backgroundColor: "#F5EFEB",
            width: "100%",
            height: deviceHeight - 100,
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
                value={Address}
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
              labelTextStyle={{
                fontFamily: "HelveticaNeue",
                fontWeight: "300",
              }}
            />

            <View
              style={{
                width: "100%",
                height: 50,
                marginTop: 25,
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
              onPress={() => EditAddress()}
            >
              <Text
                style={{ color: "#fff", fontSize: 18, fontWeight: "normal" }}
              >

                Update
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isLoading}
        animationType={"none"}
        transparent={true}
        onRequestClose={() => { }}
      >
        <View
          style={[
            {
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `rgba(0,0,0,0.4)`,
            },
          ]}
        >
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <ActivityIndicator
              animating={isLoading}
              size={"large"}
              color="#9f2241"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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

export default EditAddress;
