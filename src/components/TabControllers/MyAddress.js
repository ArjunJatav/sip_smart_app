import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Keyboard,
  Modal,
  ActivityIndicator,
  Alert
} from "react-native";
import PlusIcon from "../../assets/images/Wineapp/plus.png";
import backImage from "../../assets/images/other_icons/back.png";
import ModalDropdown from "react-native-modal-dropdown";
import { EventRegister } from "react-native-event-listeners";

import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from "rn-material-ui-textfield";
import iconeditPro from "../../assets/images/Wineapp/edit.png";
import iconTrash from "../../assets/images/Wineapp/trash.png";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import * as constants from "../../constants/Const";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import { useIsFocused, CommonActions } from "@react-navigation/native";
const MyAddress = ({ route, navigation }) => {
  var token = null;

  const [Data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const GetUserAddress = async () => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);
        axios({
          method: "GET",
          url: constants.baseURL + constants.getUserAddress,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            //  Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2MGY1OGFkODQzNzVlOTMyZjMzOGUxYTYiLCJ1c2VyTmFtZSI6ImVlZWVlIiwianRpIjoiNDQyMmVhY2UtODMxMy00YmM5LTlhMDUtZjRjOGI4ZDI0MWU3IiwiaWF0IjoxNjI4MDUzMTk3LCJleHAiOjE2MjgxMzk1OTd9.e3LGeYaNZ_Fc9W-44b_tFmG2AxVzBJYMiaZAnBLTfSM"

            Authorization: "Bearer " + token,
          },
        })
          .then((response) => {
            setIsLoading(false);

            setData(response.data.data);
            console.log(" Address aa gya",response.data.data)

            // setIsLoading(false);

            if (response.data.status == 200) {
              //Alert.alert("Alert", response.data.message);
              //  SaveAddress();
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
  const removeAddress = async (addressId) => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        // setIsLoading(true);
        axios({
          method: "post",
          url: constants.baseURL + constants.removeAddress,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          data: {
            addressId: addressId,
          },
        })
          .then((response) => {
            setIsLoading(false);

            console.log(" Address aa gyadddddddddddddddddddd", response.data);
            //setData(response.data)

            setIsLoading(false);

            if (response.data.status == 200) {
              // Alert.alert("Alert", response.data.message);
              GetUserAddress(Data);
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
  const isFocused = useIsFocused();
  useEffect(() => {
    GetUserAddress(Data);
    //getToken();
  }, [isFocused]);
  return (
    <SafeAreaView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
      {/* -----------------------------------Top Navigation Bar start------------------------------------------------ */}
      <View
        style={{
          height: 50,
          width: "100%",
          backgroundColor: "#F5EFEB",
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
              My Address
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
            <View style={{ height: "100%", width: "50%" }}>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                activeOpacity={0.7}
                // CartScreen
                onPress={() =>
                  navigation.navigate(
                    "Address",

                    {
                      type: "myaddress",
                    }
                  )
                }
              >
                <Image
                  source={PlusIcon}
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
      </View>
      {/* -----------------------------------Top Navigation Bar End------------------------------------------------ */}

      <View
        style={{
          // backgroundColor: "#F5EFEB",
          backgroundColor: "#FFFFFF",
          width: "100%",
          height: deviceHeight - 100,
          // alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FlatList
          style={{ marginBottom: "10%" }}
          data={Data}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            <View
              style={{
                margin: 16,
                height: 48,

                borderWidth: 0.7,
                width: deviceWidth - 30,
                justifyContent: "center",
                shadowColor: "black",

                alignItems: "center",

                borderRadius: 8,
                backgroundColor: "#FFFFFF",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  // Pass and merge params back to home screen

                  if (route.params?.type == "no") {
                  } else {
                    EventRegister.emit("address updated", {
                      type: route.params?.type,
                      selected:route.params?.selected,
                      id:item._id,
                      address: item.address + " ",
                      address1: item.address_line1 + ", ",
                      city: item.city + ", ",
                      country: item.country + ", ",
                      postcode: item.postcode,
                    });
                    navigation.pop();
                  }
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginLeft: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: "black",
                      textAlign: "center",
                      alignSelf: "center",
                      width: "70%",
                      fontWeight: "300",
                    }}
                  >
                    {item.address +
                      " ," +
                      item.address_line1 +
                      " ," +
                      item.city +
                      " ," +
                      item.country +
                      " ," +
                      item.postcode}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginLeft: 16,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        alignItems: "center",
                        justifyContent: "center",

                        borderColor: "lightgray",
                        flexDirection: "row",
                      }}
                      onPress={() => {
                        navigation.navigate("EditAddress", {
                          addressid: item._id,
                          Address: item.address,
                          address_lineValue: item.address_line1,
                          cityValue: item.city,
                          countryValue: item.country,
                          postcodeVal: item.postcode,
                          default: item.default,
                        });

                        //console.log("pressed")
                      }}
                    >
                      <Image
                        source={iconeditPro}
                        style={{
                          height: 22,
                          width: 22,
                          resizeMode: "contain",
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        alignItems: "center",
                        justifyContent: "center",

                        flexDirection: "row",
                      }}
                      onPress={() => {
                        {

                          Alert.alert(
                            '',
                         
                              'Are you sure you want to remove this address ? ',
                            [
                              {
                                text: 'No',
                                onPress: () => console.log('Cancel Pressed'),
                          
                              },
                              {
                                text: 'Yes', onPress: () => {
                                  removeAddress(item._id);
                                }
                              },
                            ]
                          );
                        }
                      }}
                    >
                      <Image
                        source={iconTrash}
                        style={{
                          height: 22,
                          width: 22,
                          marginLeft: 14,
                          resizeMode: "contain",
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <Modal
        visible={isLoading}
        animationType={"none"}
        transparent={true}
        onRequestClose={() => {}}
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

export default MyAddress;
