import React, { Component, useState, useEffect } from "react";
import {
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import backImage from "../../assets/images/other_icons/back.png";
import CountryPicker from "react-native-country-picker-modal";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import * as constants from "../../constants/Const";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import { _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import ActionSheet from 'react-native-action-sheet';
import {
  useIsFocused,
  CommonActions,
  TabActions,
} from "@react-navigation/native";

import { TextField } from "rn-material-ui-textfield";
import { color } from "react-native-reanimated";

const MyOrder = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const [isDataFetch, setDatafetch] = useState(false);

  var token = "";
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);

  var BUTTONSiOS = [
    'All',
    'Confirmed',
    'Cancelled',
    'Prepared',
    'Dispatched',
    'Shipped',
    'Completed',
    'Cancel'
  ];
  var CANCEL_INDEX = 7;
  const [statusVal,setStatusvalue]=useState("")

  const MyOrder = async (status) => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);
    // console.log("detailis saved")

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);
        axios({
          method: "POST",
          url: constants.baseURL + constants.myOrder,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          data:{
            status :status
          }
        })
          .then((response) => {
            setIsLoading(false);

            setData(response.data.data);
            console.log("hhhhhhhhhhhhhhhhhhhhhhh", response.data);
            //  console.log(response.data)
            setDatafetch(true);
            if (response.data.status == 200) {
              //setData(response.data.data)
              // Alert.alert("Alert", response.data.message);
            }
            if (response.data.status == 400) {
              Alert.alert("Alert", response.data.message);
            }
          })
          .catch(function (error) {
            console.log(error);

            setIsLoading(false);
          });
      }
    });
  };
  const CancelOrder = async (id) => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);
    console.log("detailis saved", id);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        // setIsLoading(true);
        axios({
          method: "post",
          url: constants.baseURL + constants.OrderCancel,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          data: {
            orderId: id,
          },
        })
          .then((response) => {
            setIsLoading(false);

            //setData(response.data.data);
            //console.log("hhhhhhhhhhhhhhhhhhhhhhh", response.data);
            //  console.log(response.data)

            if (response.data.status == 200) {
              MyOrder(statusVal);
              //setData(response.data.data)
              // Alert.alert("Alert", response.data.message);
            }
            if (response.data.status == 400) {
              Alert.alert("Alert", response.data.message);
            }
          })
          .catch(function (error) {
            console.log(error);

            setIsLoading(false);
          });
      }
    });
  };

  const sortOptionClicked = () => {
   
    console.log("Sort Option clicked")
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONSiOS,
      cancelButtonIndex: CANCEL_INDEX,
      tintColor: 'black'
    },
    (buttonIndex) => {
      console.log('button clicked :', buttonIndex);
      if(buttonIndex == 0)
      {
        setStatusvalue("");
        MyOrder("");
      }
      else if(buttonIndex == 1)
      {
        //Confirmed
        setStatusvalue("Confirmed");
        MyOrder("Confirmed");
      }
      else if(buttonIndex == 2)
      {
        //Cancelled
        setStatusvalue("Cancelled");
        MyOrder("Cancelled");
      }
      else if(buttonIndex == 3)
      {
        //Prepared
        setStatusvalue("Prepared");
        MyOrder("Prepared");
      }
      else if(buttonIndex == 4)
      {
        //Dispatched
        setStatusvalue("Dispatched");
        MyOrder( "Dispatched");
      }
      else if(buttonIndex == 5)
      {
        //Shipped
        setStatusvalue("Shipped");
        MyOrder("Shipped");
      }
      else if(buttonIndex == 6)
      {
        //Completed
        setStatusvalue("Completed");
        MyOrder("Completed");
      }

    });
  };


  useEffect(() => {
    setDatafetch(false);
    
    MyOrder(statusVal);
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
                My Orders
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
                  //backgroundColor:"pink",
                  justifyContent: "center",
                }}
                activeOpacity={0.7}
                 onPress={() => sortOptionClicked()}
              >
               {statusVal===""?<Image
                  source={require("../../assets/images/other_icons/filter.png")}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                />:<Image
                source={require("../../assets/images/other_icons/filtershiglight.png")}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
              }
              </TouchableOpacity>
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
                    paddingRight: 10,
                    paddingLeft: 10,
                    textAlign: "center",
                  }}
                >
                  {" "}
                  {isDataFetch && statusVal == "" ? "You have not placed any order yet." : "No Records Found."}
                </Text>
              </View>
            );
          }}
          renderItem={({ item }) => (
            //1
            <View
              style={{
                flex: 1,
                margin: 16,
                paddingBottom: 10,
                borderRadius: 10,

                flexDirection: "column",
                backgroundColor: "#FFFFFF",
              }}
            >
              {/* 2 */}

              <View
                style={{
                  //  alignItems: 'center',

                  //  width: "100%",
                  flexDirection: "row",
                  alignContent: "center",
                  // alignItems:"center",
                  //  shadowColor: 'black',
                  flex: 1,
                  borderRadius: 6,
                  backgroundColor: "#FFFFFF",
                  flexDirection: "row",
                }}
              >
                {/* 2.1 */}
                <View
                  style={{
                    marginTop: 16,
                    backgroundColor: "#DCC7B7",
                    justifyContent: "center",
                    borderRadius: 10,
                    height: 80,
                    width: 80,
                    marginLeft: 16,
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "HelveticaNeue",
                      fontSize: 14,
                      fontWeight: "700",
                      color: "#1D1D1D",
                    }}
                  >
                    {moment(item.createdAt).format("ddd D")}
                  </Text>
                </View>
                {/* 2.2 */}
                <View style={{ width: deviceWidth - 144, marginLeft: 15 }}>
                  <View
                    style={{
                      marginLeft: 10,
                      width: deviceWidth - 200,
                     flexWrap:true,
                      flexDirection: "row",
                      marginTop: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "HelveticaNeue",
                        fontSize: 14,

                        fontWeight: "300",
                        color: "#1D1D1D",
                      }}
                    >
                      Order No :{" "}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "HelveticaNeue",
                        fontSize: 14,
                        fontWeight: "700",

                        color: "#1D1D1D",
                      }}
                    >{item.order_id}
                    </Text>
                  </View>

                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: "row",
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "HelveticaNeue",
                        fontSize: 14,
                        fontWeight: "300",
                        color: "#1D1D1D",
                      }}
                    >
                      Item Count :{" "}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "HelveticaNeue",
                        fontSize: 14,
                        fontWeight: "300",
                        color: "#1D1D1D",
                      }}
                    >
                      {item.itemCount}
                    </Text>
                  </View>

                  <View
                    style={{
                      marginLeft: 10,
                      marginTop: 5,
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "HelveticaNeue",
                        fontSize: 14,
                        fontWeight: "300",
                        color: "#1D1D1D",
                      }}
                    >
                      Status :{" "}
                    </Text>
                    <TouchableOpacity>
                      <Text
                        style={{
                          fontFamily: "HelveticaNeue",
                          fontSize: 14,
                          fontWeight: "300",
                          color: "#9f2241",
                        }}
                      >
                        {item.status}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: "row",
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "HelveticaNeue",
                        fontSize: 14,
                        fontWeight: "300",
                        color: "#1D1D1D",
                      }}
                    >
                      Exp Delivery :{" "}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "HelveticaNeue",
                        fontSize: 14,
                        fontWeight: "300",
                        color: "#1D1D1D",
                      }}
                    >
                      {item.delivery_expected_date === "TBA"
                        ? item.delivery_expected_date
                        : moment(item.delivery_expected_date).format(
                            "DD MMM YYYY"
                          )}
                    </Text>
                  </View>

                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: "row",
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "HelveticaNeue",
                        fontSize: 14,
                        fontWeight: "300",
                        color: "#1D1D1D",
                      }}
                    >
                      Total Amount :{" "}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "HelveticaNeue",
                        fontSize: 14,
                        fontWeight: "300",
                        color: "#1D1D1D",
                      }}
                    >
                      {"$"}
                      {item.final_amount}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  // marginHorizontal: 10,
                  // marginVertical: 10,
                  marginLeft: 16,
                  marginTop: 18,
                  justifyContent: "space-between",
                  marginRight: 16,
                }}
              >
                <View style={{ width: "49%" }}>
                  {item.status === "Confirmed" ||
                  item.status === "confirmed" ? (
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          "",

                          "Are you sure you want to cancel this order ? ",
                          [
                            {
                              text: "No",
                              onPress: () => console.log("Cancel Pressed"),
                            },
                            {
                              text: "Yes",
                              onPress: () => CancelOrder(item._id),
                            },
                          ]
                        );
                      }}
                    >
                      <Text
                        style={{
                          height: 40,
                          width: "100%",
                          borderRadius: 8,
                          textAlign: "center",
                          fontSize: 16,
                          color: "black",
                          alignSelf: "center",
                          fontFamily: "HelveticaNeue",
                          paddingTop: 10,
                          borderWidth: 1,
                          borderColor: "#1D1D1D",
                        }}
                      >
                        {" "}
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View></View>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    console.log(item._id);
                    navigation.navigate("Vieworder", {
                      orderId: item._id,
                      name: "View Orders",
                      buttonName: "Cancel Order",
                    });
                  }}
                  style= {{width:"49%"}}
                >
                  <Text
                    style={{
                      height: 40,
                      width: "100%",
                      borderRadius: 8,
                      color: "white",
                      fontSize: 16,
                      fontFamily: "HelveticaNeue",
                      alignSelf: "center",
                      paddingTop: 10,
                      textAlign: "center",
                      backgroundColor: "#9F2241",
                    }}
                  >
                    {" "}
                    View Order
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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

export default MyOrder;
