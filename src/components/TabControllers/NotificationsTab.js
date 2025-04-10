import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  StyleSheet,
  Button,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import ProfileIcon from "../../assets/images/other_icons/iconProfile.png";
import CartIcon from "../../assets/images/other_icons/iconCart.png";

import ModalDropdown from "react-native-modal-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import * as constants from "../../constants/Const";
import { _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import moment from "moment";
import IconBadge from "react-native-icon-badge";

import { TextField } from "rn-material-ui-textfield";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import {
  useIsFocused,
  CommonActions,
  TabActions,
} from "@react-navigation/native";
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const NotificationsTab = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);

  const [date, setDate] = useState(new Date(Date.now()));
  const [refreshing, setRefreshing] = React.useState(false);
  const [mode, setMode] = useState("date");
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const [Data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataFetch, setDatafetch] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  var token = "";
  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   setShow(Platform.OS === 'ios');
  //   setDate(currentDate);
  // };

  const onRefresh = React.useCallback(() => {
    setDatafetch(false);
    Notification();
    wait(300).then(() => setRefreshing(false));
  }, []);

  const onChange = (event, selectedValue) => {
    setShow(Platform.OS === "ios");
    if (mode == "date") {
      const currentDate = selectedValue || new Date();
      setDate(currentDate);
      setMode("time");
      setShow(Platform.OS !== "ios"); // to show the picker again in time mode
    } else {
      const selectedTime = selectedValue || new Date();
      setTime(selectedTime);
      setShow(Platform.OS === "ios");
      setMode("date");
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} `;
  };
  const formatTime = (time) => {
    return ` ${time.getHours()}:${time.getMinutes()}`;
  };

  const cartcount = async () => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
       axios({
          method: "get",
          url: constants.baseURL + constants.cartcount,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token
          },
          
        })
          .then((response) => {
            setIsLoading(false);
            console.log(response.data)
            setCartCount(response.data.data.count.data)







            if (response.data.status == 200) {
             
            }
            if (response.data.status == 400) {
            }
          })
          .catch(function (error) {
            setIsLoading(false);
          });
      }

    });

  }

  const Notification = async () => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);
    // console.log("detailis saved")

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);
        axios({
          method: "GET",
          url: constants.baseURL + constants.getUserNotification,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        })
          .then((response) => {
            setIsLoading(false);

            setData(response.data.data);
            console.log("hhhhhhhhhhhhhhhhhhhhhhh", response.data);
            //  console.log(response.data)

            if (response.data.status == 200) {
              setDatafetch(true);
              //setData(response.data.data)
              // Alert.alert("Alert", response.data.message);
            }
            if (response.data.status == 400) {
              Alert.alert("Alert", response.data.message);
            }
            cartcount()
            // if(response.data.status ==401){
            //   setIsLoading(false);
            //   console.log(response.data)

            //     AsyncStorage.removeItem("Token");
            //     AsyncStorage.removeItem("token");
            //     AsyncStorage.removeItem("auth_token");
            //     AsyncStorage.removeItem("fcmToken");
            //     AsyncStorage.removeItem("userId");
            //     const resetAction = CommonActions.reset({
            //       index: 0,
            //       routes: [
            //         {
            //           name: "AuthStack",
            //         },
            //       ],
            //     });
            //     navigation.dispatch(resetAction);
            //     Alert.alert("Alert", response.data.message);

            // }
          })
          .catch(function (error) {
            console.log(error);

            setIsLoading(false);
          });
      }
    });
  };
  const isFocused = useIsFocused();
  useEffect(() => {
    setDatafetch(false);
    Notification();
  }, [isFocused]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F5EFEB" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="rgba(73,176,54,1)"
          barStyle="dark-content"
        />
        {/* -----------------------------------Top Navigation Bar start------------------------------------------------ */}
        <View
          style={{
            height: 50,
            width: "100%",
            backgroundColor:"#FFFFFF",
            borderBottomLeftRadius:25,
            borderBottomRightRadius:25,
            borderColor: "#DCC7B7",
            borderWidth: 1,
  
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
            <View style={{ height: 48, width: "15%" }}></View>

            <View
              style={{ width: "55%", height: "100%", justifyContent: "center" }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "#000",
                  marginLeft: "15%",
                  alignSelf: "center",
                  fontWeight: "bold",
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                Notifications
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
              <View style={{ height: "100%", width: "50%" }}>
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 48,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate("UserProfile")}
                >
                  <Image
                    source={ProfileIcon}
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: "contain",
                      alignSelf: "center",
                    }}
                  />
                </TouchableOpacity>
              </View>

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
                  onPress={() => navigation.navigate("CartScreen")}
                >
                    <IconBadge
                    MainElement={
                      <Image
                        source={CartIcon}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: "contain",
                          alignSelf: "center",
                        }}
                      />
                    }
                    BadgeElement={<Text style={{ color: "#FFFFFF" }}>{cartCount}</Text>}
                    IconBadgeStyle={{
                      position: "absolute",
                      top: -10,
                      right: -12,
                      minWidth: 20,
                      height: 20,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#FF0000",
                    }}
                     Hidden={cartCount == 0}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        {/* -----------------------------------Top Navigation Bar End------------------------------------------------ */}

        <FlatList
          data={Data}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                  marginTop: "50%",
                }}
              >
                <Text
                  style={{
                    color: "#9F2241",
                    fontSize: 20,
                    fontFamily: "HelveticaNeue",
                  }}
                >
                  {" "}
                  {isDataFetch ? "No Record Found." : ""}
                </Text>
              </View>
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={"#9F2241"}
              colors={["#9F2241", "#9F2241", "#9F2241"]}
              onRefresh={onRefresh}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                console.log(item);

                console.warn(item.type);

                if (
                  item.type === "Confirmed" ||
                  item.type === "Prepared" ||
                  item.type === "Dispatched" ||
                  item.type === "Shipped" ||
                  item.type === "Completed" ||
                  item.type === "Cancelled" 
                ) {
                  if (item._id === "") {
                  } else {
                     navigation.navigate("Vieworder", {
                                    orderId: item.orderId,
                                    name: "View Orders",
                                    buttonName: "Cancel Order",
                                  })
                  }
                } else if (item.type === "Addwine") {
                  navigation.navigate("WineDetailScreen", {
                    productId: item.wineId,
                    button: "Add To Cart",
                    api: constants.WineDetails,
                  });
                } else if(item.type==="Received"){
                  console.log("HERE")
                  navigation.navigate("Vieworder", {
                    orderId: item.orderId,
                    name: "View Orders",
                    buttonName: "Enter Pickup",
                  })
                }
                else{

                }

                //setShowModal(!showModal);
              }}
            >
              <View
                style={{
                  margin: 15,
                  flex:1,
                  padding:10,
                  flexDirection: "row",
                  justifyContent: "center",
                  shadowColor: "black",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowRadius: 8,
                  borderRadius: 10,
                  backgroundColor: "#fff",
                }}
              >
                <View
                  style={{
                    width: 70,
                    height: 80,
                    marginLeft:10,
                    borderRadius: 10,
                    backgroundColor: "#9f2241",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={{
                      height: "70%",
                      resizeMode: "contain",
                    }}
                    // source={item.img}
                    source={require("../../assets/images/Bottle/Img1.png")}
                  />
                </View>

                <View
                  style={{
                    flex:1,
                    marginLeft: 10,
                    borderRadius: 10,
                    backgroundColor: "#FFF",
                  }}
                >
                  <Text
                    style={{
                      marginTop: 2,
                      fontFamily: "HelveticaNeue",
                      marginLeft: 10,
                      marginRight: 10,
                      fontWeight: "700",
                      fontSize: 16,
                    }}
                    
                  >
                    {item.text}
                  </Text>

                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: "HelveticaNeue",
                      marginLeft: 10,
                      marginRight: 10,
                      fontWeight: "300",
                      fontSize: 14,
                    }}
                  >
                    {moment(item.createdAt).format("D") +
                      " " +
                      moment(item.createdAt).format("MMM") +
                      " " +
                      moment(item.createdAt).format("yyyy") +
                      "|" +
                      moment(item.createdAt).format("h:mm:ss a")}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        <Modal animationType={"slide"} transparent visible={showModal}>
          {/*All views of Modal*/}
          {/*Animation can be slide, slide, none*/}
          <View
            style={{
              flex: 1,

              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: "30%",
              left: "45%",
              elevation: 5,
              transform: [
                { translateX: -(deviceWidth * 0.4) },
                { translateY: -90 },
              ],
              height: 360,
              width: deviceWidth * 0.9,
              backgroundColor: "#fff",
              backgroundColor: "#F5EFEB",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  position: "absolute",
                  resizeMode: "contain",
                }}
                source={require("../../assets/images/Pickupscreen/S.png")}
              />
            </View>
            <View style={{ justifyContent: "center", alignSelf: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "HelveticaNeue",
                  marginLeft: 10,
                  marginRight: 10,
                  fontWeight: "700",
                  fontSize: 30,

                  paddingTop: 50,
                }}
              >
                Pickup Date!
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "HelveticaNeue",
                  marginLeft: 10,
                  marginRight: 10,
                  color: "#1D1D1D",
                  fontSize: 18,
                }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry
              </Text>
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
                  label="Select Date"
                  style={{ width: "100%" }}
                  //// onChangeText={(addressStr) => {
                  //   setAddress(addressStr);
                  // }}
                  value={formatDate(date)}
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
                  onPress={showDatepicker}
                >
                  <Image
                    source={require("../../assets/images/Pickupscreen/su.png")}
                    style={{
                      height: 22,
                      width: 22,
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
              </View>
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
                  label="Select Time"
                  style={{ width: "100%" }}
                  //  onChangeText={(addressStr) => {
                  //    setAddress(addressStr);
                  //  }}

                  value={formatTime(time)}
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
                  // onPress={() => {
                  //   {
                  //     {
                  //       console.log("aagya");
                  //     }
                  //   }
                  // }}
                  onPress={showTimepicker}
                >
                  <Image
                    source={require("../../assets/images/Pickupscreen/time.png")}
                    style={{
                      height: 22,
                      width: 22,
                      resizeMode: "contain",
                    }}
                  />
                </TouchableOpacity>
              </View>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  format="YYYY-MM-DD HH:mm"
                  display="default"
                  onChange={onChange}
                />
              )}

              <View
                style={{
                  height: 49,
                  width: 185,
                  backgroundColor: "#9F2241",
                  marginTop: 15,
                  borderRadius: 10,
                  marginHorizontal: 79,
                  //alignItems: "center",
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
                  //onPress={() => SaveAddress()}
                  onPress={() => {
                    setShowModal(!showModal);
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: "normal",
                    }}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  loading_cont: {
    width: 80,
    height: 80,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default NotificationsTab;
