import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";

import backImage from "../../assets/images/other_icons/back.png";
import iconCamera from "../../assets/images/other_icons/camera.png";
import ImagePicker from "react-native-image-picker";

import ModalDropdown from "react-native-modal-dropdown";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import { TextField } from "rn-material-ui-textfield";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import axios from "axios";
import * as constants from "../../constants/Const";
import NetInfo from "@react-native-community/netinfo";
import { useIsFocused } from '@react-navigation/native';


var Token = ""

const EditProfile = ({ route, navigation }) => {

  const [image, setImage] = useState(
    "https://flutterappdemo.s3.us-west-2.amazonaws.com/1626692070087image-1626692070012.jpg"
  );
  const [resource, setResourcePath] = useState({});
  const [fullName, setName] = useState();
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(async () => {

  

    Token = await AsyncStorage.getItem(AUTH_TOKEN);
    setIsLoading(true)
    axios({
      method: "GET",
      url: constants.baseURL + constants.getUserDetail,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + Token,
      },
    })
      .then((response) => {

        setEmail(response.data.data.email);
        setName(response.data.data.name);
        setImage(response.data.data.image);

        setIsLoading(false)

      
      })
      .catch((error) => {

        Alert.alert(
          "Alert",
          constants.serverError,
          [
            {
              text: "OK",
              onPress: () => {
                setIsLoading(false);
              },
            },
          ],
          { cancelable: false }
        );

        return;
      });
  }, []);

  const imageGalleryLaunch = () => {
    var options = {
      title: "Select Image",

      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.showImagePicker(options, (res) => {

      if (res.didCancel) {
        console.log("User cancelled image picker");
      } else if (res.error) {
        console.log("ImagePicker Error: ", res.error);
      } else if (res.customButton) {
        console.log("User tapped custom button: ", res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        var base64Img = res.type + ";base64," + res.data;
        setResourcePath(source);
        setImage(res.uri);
      }
    });
  };

  const SubmitClicked = () => {


    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        if (fullName.trim().length == 0) {
          Alert.alert("Alert", constants.fullNameRequired);
          return;
        }
        if (email.trim().length == 0) {
          Alert.alert("Alert", constants.emailAddressRequired);
          return;
        }

        setIsLoading(true)

        const data = new FormData();

        data.append('image', {
          uri: image,
          type: 'image/jpeg', // or photo.type
          name: 'userImage.jpg',
        });
        data.append('name', fullName);
        data.append('email', email);

        

      //  this.setState({ loading: true });

        axios({
          method: "post",
          url: constants.baseURL + constants.editProfile,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + Token
          },
          data: data,
        })
          .then((response) => {
            if (response.data.status != 200) {

              setIsLoading(false)
         
              Alert.alert("Alert", response.data.message);
              return;
            } else {
              setIsLoading(false)
             Alert.alert("Alert", response.data.message);

           navigation.goBack()
            }
          })
          .catch((error) => {
          
            setIsLoading(false)
            Alert.alert("Alert", constants.serverError);
            return;
          });
      }
    });

  }

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
              Edit Profile
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
          <View style={styles.container}>
            <View style={styles.rect}>
              <View
                style={{
                  alignItems: "center",
                  width: "100%",
                  flexDirection: "column",
                }}
              >
                {image == null || image == "" ? (
                  <Image
                    style={{
                      marginTop: 20,
                      width: 140,
                      height: 140,
                      borderRadius: 170 / 2,
                      overflow: "hidden",
                    }}
                    source={{ uri: image }}
                  ></Image>
                ) : (
                  // source={require('../../assets/images/other_icons/dummyUser.png')}></Image>

                  <Image
                  resizeMode='cover'
                    style={{
                      marginTop: 20,
                      width: 140,
                      height: 140,
                      borderRadius: 170 / 2,
                      overflow: "hidden",
                    }}
                    source={{ uri: image }}
                  ></Image>
                )}
              </View>

              <View
                style={{
                  marginTop: 97,
                  alignItems: "center",
                  width: "100%",
                  marginLeft: 175 / 2.9,
                  position: "absolute",
                }}
              >
                <TouchableOpacity
                  style={{
                    height: "100%",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  activeOpacity={0.7}
                  onPress={() => imageGalleryLaunch()}
                >
                  <Image
                    style={{
                      backgroundColor: "white",
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                    }}
                    source={require("../../assets/images/other_icons/camera.png")}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TextField
            containerStyle={{
              marginLeft: 30,
              marginRight: 30,
              alignSelf: "center",
              width: deviceWidth - 60,
            }}
            label="Full Name"
            style={{ width: "100%" }}
            onChangeText={(addressStr) => {
              setName(addressStr);
            }}
            value={fullName}
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
            label="Email"
            style={{ width: "100%" }}
            onChangeText={(emailStr) => {
              setEmail(emailStr);
            }}
            value={email}
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
            marginTop: 15,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => SubmitClicked()}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "normal" }}>
              Update Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>


      {isLoading && (
          <View
            style={{
              position: "absolute",
              backgroundColor: 'rgba(52, 52, 52, 0.5)',
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 180,
  },
  rect: {
    width: "100%",
    height: 180,
  },
  image: {
    width: 128,
    height: 128,
  },
  image_imageStyle: {},
  rect2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(230, 230, 230,1)",
  },
  loading_cont: {
    width: 80,
    height: 80,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default EditProfile;