import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Switch,
  StyleSheet,
} from "react-native";

import backImage from "../../assets/images/other_icons/back.png";
import ModalDropdown from "react-native-modal-dropdown";
import axios from "axios";
import * as constants from "../../constants/Const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import { TextField } from "rn-material-ui-textfield";

const Settings = ({ route, navigation }) => {
 const {notificationkey} = route.params||{ notificationkey:true}
  const data = [
    {
      id: 1,
      name: "Privacy Policy",
      img: require("../../assets/images/other_icons/iconPrivacy.png"),
      img1: require("../../assets/images/Profile_icons/arrow1.png"),
    },
    {
      id: 2,
      name: "FAQ",
      img: require("../../assets/images/other_icons/iconFAQ.png"),
      img1: require("../../assets/images/Profile_icons/arrow1.png"),
    },
    {
      id: 3,
      name: "How It Work",
      img: require("../../assets/images/other_icons/iconHow.png"),
      img1: require("../../assets/images/Profile_icons/arrow1.png"),
    },
    {
      id: 3,
      name: "Notifications",
      img: require("../../assets/images/other_icons/iconNotification.png"),
      img1: require("../../assets/images/Profile_icons/arrow1.png"),
    },
    {
      id: 4,
      name: "Change Mobile Number",
      img: require("../../assets/images/other_icons/iconPhone.png"),
      img1: require("../../assets/images/Profile_icons/arrow1.png"),
    },
    {
      id: 5,
      name: "Change Password",
      img: require("../../assets/images/other_icons/iconCPassword.png"),
      img1: require("../../assets/images/Profile_icons/arrow1.png"),
    },
  ];
  const [IsLoading, setIsLoading] = useState(true);

  const [isEnabled, setIsEnabled] = useState(notificationkey);

  const toggleSwitch = () => {
    console.log(isEnabled)
    ChangeNotify_Status()};
  const ChangeNotify_Status = async () => {

    var  token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
       
        setIsLoading(true);
        axios({
          method: "post",
          url: constants.baseURL + constants.NotificationStatus,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization:"Bearer " + token
          },
          data:{
            status:!isEnabled
          }
         
          
        
        })
          .then(function (response) {
          
            setIsLoading(false);
            console.log(response.data)

            if (response.data.status == 200) {
              setIsEnabled((previousState) => !previousState)

            
            }
            else{

            }

          
          })

          .catch(function (error) {
            console.log(error)

            setIsLoading(false);

          });

      };
    }

    );
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
                fontFamily: "HelveticaNeue",
                fontSize: 18,
                color: "#000",
                alignSelf: "center",
                fontWeight: "bold",
                alignSelf: "center",
                textAlign: "center",
              }}
            >
              Settings
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
            height: "89%",
            width: "90%",
            backgroundColor: "#fff",
            marginTop: 5,
            borderRadius: 10,
          }}
        >
          <FlatList
            data={data}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => {
              if (index == 0) {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("TermsCondition", {
                        PageName: constants.policiesTitle,
                        PageURL: constants.policies,
                      })
                    }
                  >
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
                              fontFamily: "HelveticaNeue",
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
              } else if (index == 1) {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("TermsCondition", {
                        PageName: constants.faqTitle,
                        PageURL: constants.faq,
                      })
                    }
                  >
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
                              fontFamily: "HelveticaNeue",
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
              } else if (index == 2) {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("TermsCondition", {
                        PageName: constants.howItWorks,
                        PageURL: constants.howWork,
                      })
                    }
                  >
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
                              fontFamily: "HelveticaNeue",
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
                          width: "65%",
                          height: "100%",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "HelveticaNeue",
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
                          width: "20%",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Switch
                          thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
                          ios_backgroundColor="gray"
                          onValueChange={toggleSwitch}
                          value={isEnabled}
                        />
                      </View>
                    </View>
                  </View>
                );
              } else if (index == 4) {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ChangeNumber")
                    }
                  >
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
                            fontFamily: "HelveticaNeue",
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
              } else if (index == 5) {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ChangePassword")
                    }
                  >
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
                            fontFamily: "HelveticaNeue",
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Settings;
