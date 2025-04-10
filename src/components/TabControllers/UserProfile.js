import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";

import axios from "axios";
import * as constants from "../../constants/Const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

import EditProfile from "../../assets/images/other_icons/iconeditPro.png";
import backImage from "../../assets/images/other_icons/back.png";
import UserImage from "../../assets/images/other_icons/dummyUser.png";

import iconMobile from "../../assets/images/other_icons/iconMobile.png";
import iconEmail from "../../assets/images/other_icons/iconEmail.png";
import iconLocation from "../../assets/images/Profile_icons/customerOrder.png";

import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import { useIsFocused } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const UserProfile = ({ props, navigation }) => {
  const [IsLoading, setIsLoading] = useState(true);
  const [notification,setNotification]=useState(false)
  const [countryCode, setCountryCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [UserName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [MyImage, setImage] = useState("");

  const isFocused = useIsFocused();

  const imgs = [
    {
      img: require("../../assets/images/Profile_icons/Profile.jpg"),
      id: 1,
      name: "Sam Sukkar",
      mob: " + 91 9821220212",
      email: "samneeshm21032gmail.com",
      address: " 705/2 Shastri Nagar Meerut",
    },
  ];
  const data = [
    {
      id: 1,
      name: "My Orders",
      img: require("../../assets/images/Profile_icons/myOrder.png"),
      img1: require("../../assets/images/Profile_icons/arrow1.png"),
    },
    {
      id: 2,
      name: "Customer Orders",
      img: require("../../assets/images/Profile_icons/package1.png"),
      img1: require("../../assets/images/Profile_icons/arrow1.png"),
    },
    {
      id: 3,
      name: "My Address",
      img: require("../../assets/images/Profile_icons/customerOrder.png"),
      img1: require("../../assets/images/Profile_icons/arrow1.png"),
    },
    {
      id: 3,
      name: "Settings",
      img: require("../../assets/images/Profile_icons/settings.png"),
      img1: require("../../assets/images/Profile_icons/arrow1.png"),
    },
    {
      id: 4,
      name: "Logout",
      img: require("../../assets/images/Profile_icons/logout.png"),
    },
  ];

  const Logout = async () => {

    var  token = await AsyncStorage.getItem(AUTH_TOKEN);
    console.log("url", constants.baseURL + constants.logout)

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
       
        setIsLoading(true);
        axios({
          method: "get",
          url: constants.baseURL + constants.logout,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization:"Bearer " + token
          },
         
          
        
        })
          .then(function (response) {
          
            setIsLoading(false);
            console.log(response.data)

              AsyncStorage.removeItem("Token");
              AsyncStorage.removeItem("token");
              AsyncStorage.removeItem("auth_token");
            //  AsyncStorage.removeItem("fcmToken");
              AsyncStorage.removeItem("userId");
              const resetAction = CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: "AuthStack",
                  },
                ],
              });
              navigation.dispatch(resetAction);


          
          })

          .catch(function (error) {
            console.log(error)

            setIsLoading(false);
            AsyncStorage.removeItem("Token");
            AsyncStorage.removeItem("token");
            AsyncStorage.removeItem("auth_token");
            AsyncStorage.removeItem("fcmToken");
            AsyncStorage.removeItem("userId");
            const resetAction = CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "AuthStack",
                },
              ],
            });
            navigation.dispatch(resetAction);
          });

      };
    }

    );
  };
 

  useEffect(async () => {

    var Token = await AsyncStorage.getItem(AUTH_TOKEN);
    console.log("GetProfileDataAPI");

    if(isFocused){ 

      setIsLoading(true);

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
          setIsLoading(false);
          console.log("response:- ", response.data.data);
          var addressArr = response.data.data.address;
          setCountryCode(response.data.data.country_code);
          setMobile(response.data.data.mobile);
  
          console.log("Address:- ", response.data.data.address)

          if (addressArr.length == 0) {
            setAddress("N/A");
          } else {
            setAddress(addressArr[0].address);
          }
  
          setEmail(response.data.data.email);
          setName(response.data.data.name);
          setImage(response.data.data.image);
          setNotification(response.data.data.notification)
  
          console.log("Full Name:- ", response.data.data.name);
          console.log("Mobile Number:- ", response.data.data.mobile);
          console.log("Email Address:- ", response.data.data.email);

          if(response.data.status ==401){
            setIsLoading(false);
            console.log(response.data)

              AsyncStorage.removeItem("Token");
              AsyncStorage.removeItem("token");
              AsyncStorage.removeItem("auth_token");
              AsyncStorage.removeItem("fcmToken");
              AsyncStorage.removeItem("userId");
              const resetAction = CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: "AuthStack",
                  },
                ],
              });
              navigation.dispatch(resetAction);
              Alert.alert("Alert", response.data.message);

          }
        })
        .catch((error) => {
          console.log(error);
  
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

    }
  }, [props, isFocused]);

  return (
    <SafeAreaView style={{ flex:1}}>
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
          <View style={{ height: "100%", width: "15%" }}>
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
              My Profile
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
          >
            <TouchableOpacity
              style={{
                width: 50,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Image
                source={EditProfile}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* -----------------------------------Top Navigation Bar End------------------------------------------------ */}

      <View
        style={{
          width: "100%",
          height: deviceHeight - 50,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <View style={{ width: "90%", height: "95%" }}>
            <FlatList
              data={data}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index}
              ListHeaderComponent={
                <View
                  style={{
                    height: 320,
                    width: "100%",
                   
                  }}
                >
                  <Image
                    source={{ uri: MyImage }}
                    resizeMode="cover"
                    style={{
                      width: '35%',
                      height: '30%',
                      
                      marginTop: 30,
                      borderRadius: 18,
                      alignSelf: "center",
                    }}
                  />

                  <View
                    style={{
                      width: "100%",
                      marginTop: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        margin: 7,
                        fontWeight: "bold",
                        fontSize: 22,
                        color: "#9F2241",
                      }}
                    >
                      {UserName}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      margin: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      source={iconMobile}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: "contain",
                        alignSelf: "center",
                      }}
                    />

                    <Text
                      style={{
                        alignSelf: "center",
                        margin: 5,
                        fontSize: 15,
                      }}
                    >
                      +{countryCode}-{mobile}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      margin: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      source={iconEmail}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: "contain",
                        alignSelf: "center",
                      }}
                    />

                    <Text
                      style={{
                        alignSelf: "center",
                        margin: 5,
                        fontSize: 15,
                      }}
                    >
                      {email}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      margin: 5,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      source={iconLocation}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: "contain",
                        alignSelf: "center",
                      }}
                    />

                    <Text
                      style={{
                        alignSelf: "center",
                        margin: 5,
                        fontSize: 15,
                      }}
                    >
                      {address}
                    </Text>
                  </View>
                </View>
              }
              renderItem={({ item, index }) => {
                if (index == 0) {
                  return (
                    <View
                      style={{
                        height: 50,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#F5EFEB",
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                      }}
                    >
                    
                    <TouchableOpacity
                    onPress={() => navigation.navigate("MyOrder")}
                    activeOpacity={1.0}
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
                        <View
                          style={{
                            height: "100%",
                            width: "15%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={item.img}
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: "contain",
                              alignSelf: "center",
                            }}
                          />
                        </View>

                        <View
                          style={{
                            width: "70%",
                            height: "100%",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 18,
                              color: "#000",
                            }}
                          >
                            {item.name}
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
                        >
                          <Image
                            source={item.img1}
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: "contain",
                              alignSelf: "center",
                            }}
                          />
                        </View>
                      </View>
                      </TouchableOpacity>
                    </View>
                  );
                } else if (index == 1) {
                  return (
                    <View
                      style={{
                        height: 50,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#F5EFEB",
                      }}
                    >
                    <TouchableOpacity
                    onPress={() => navigation.navigate("CustomerOrders")}
                    activeOpacity={1.0}

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
                        <View
                          style={{
                            height: "100%",
                            width: "15%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={item.img}
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: "contain",
                              alignSelf: "center",
                            }}
                          />
                        </View>

                        <View
                          style={{
                            width: "70%",
                            height: "100%",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 18,
                              color: "#000",
                            }}
                          >
                            {item.name}
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
                        >
                          <Image
                            source={item.img1}
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: "contain",
                              alignSelf: "center",
                            }}
                          />
                        </View>
                      </View>
                      </TouchableOpacity>
                    </View>
                  );
                } else if (index == 2) {
                  return (
                    <TouchableOpacity
                     onPress={() => navigation.navigate("MyAddress",{type:"no"}
                      // {
                      // Address:address,
                    
                      // }
                    )}
                   // onPress={() => console.log("Do Nothing")}
                    activeOpacity={1.0}

                    >
                      <View
                        style={{
                          height: 50,
                          width: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#F5EFEB",
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
                          <View
                            style={{
                              height: "100%",
                              width: "15%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Image
                              source={item.img}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: "contain",
                                alignSelf: "center",
                              }}
                            />
                          </View>

                          <View
                            style={{
                              width: "70%",
                              height: "100%",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 18,
                                color: "#000",
                              }}
                            >
                              {item.name}
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
                          >
                            <Image
                              source={item.img1}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: "contain",
                                alignSelf: "center",
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }
                if (index == 3) {
                  return (
                    <View
                      style={{
                        height: 50,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#F5EFEB",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        activeOpacity={1.0}
                        onPress={() => navigation.navigate("Settings",{
                          notificationkey:notification
                        })}
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
                          <View
                            style={{
                              height: "100%",
                              width: "15%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Image
                              source={item.img}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: "contain",
                                alignSelf: "center",
                              }}
                            />
                          </View>

                          <View
                            style={{
                              width: "70%",
                              height: "100%",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 18,
                                color: "#000",
                              }}
                            >
                              {item.name}
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
                          >
                            <Image
                              source={item.img1}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: "contain",
                                alignSelf: "center",
                              }}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                } else if (index == 4) {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "Alert",
                          "Are you sure you want to logout ?",
                          [
                            {
                              text: "Cancel",
                              onPress: () => console.log("Cancel Pressed"),
                              style: "cancel",
                            },
                            {
                              text: "OK",
                              onPress: () => {
                               Logout()

                                // }}
                                // navigation.navigate("AuthStack")
                              },
                            },
                          ]
                        );
                      }}
                    >
                      <View
                        style={{
                          height: 50,
                          width: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#F5EFEB",
                          borderBottomLeftRadius: 15,
                          borderBottomRightRadius: 15,
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
                          <View
                            style={{
                              height: "100%",
                              width: "15%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Image
                              source={item.img}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: "contain",
                                alignSelf: "center",
                              }}
                            />
                          </View>

                          <View
                            style={{
                              width: "70%",
                              height: "100%",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 18,
                                color: "#000",
                              }}
                            >
                              {item.name}
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
                          >
                            <Image
                              source={item.img1}
                              style={{
                                height: 20,
                                width: 20,
                                resizeMode: "contain",
                                alignSelf: "center",
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }
              }}
            />
          </View>
        </View>
      </View>

      {IsLoading && (
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
  loading_cont: {
    width: 80,
    height: 80,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default UserProfile;
