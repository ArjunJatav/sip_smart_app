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
  FlatList,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import {
  useIsFocused,
  CommonActions,
  TabActions,
} from "@react-navigation/native";

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

import { TextField } from "rn-material-ui-textfield";
import { color } from "react-native-reanimated";
import DateTimePicker from "@react-native-community/datetimepicker";
import renderIf from "../InitialController/renderIf";
import ActionSheet from 'react-native-action-sheet';

const MyOrder = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const [isDataFetch, setDatafetch] = useState(false);

  var token = "";
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderpickupid, setOrderpickupid] = useState("");

  const [date, setDate] = useState(new Date(Date.now()));

  const [mode, setMode] = useState("date");
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);
  const [statusVal,setStatusvalue]=useState("")

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
 // var statusVal = "";

  const onChange = (event, selectedValue) => {
    console.log(selectedValue);
    setShow(Platform.OS === "ios");
    if (mode == "date") {
      const currentDate = selectedValue || new Date();
      setDate(currentDate);
      //setMode('time');
      setShow(Platform.OS !== "ios"); // to show the picker again in time mode
    } else {
      const selectedTime = selectedValue || new Date();

      setTime(selectedTime);
      setShow(Platform.OS === "ios");
      //setMode('date');
    }
  };

  const sortOptionClicked = () => {
   
    console.log("Sort Option clicked")
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONSiOS,
      cancelButtonIndex: CANCEL_INDEX,
      tintColor: 'black',
    },
    (buttonIndex) => {
      console.log('button clicked :', buttonIndex);
      if(buttonIndex == 0)
      {
        setStatusvalue("") 
        MyOrder("");
      }
      else if(buttonIndex == 1)
      {
        //Confirmed
        setStatusvalue("Confirmed")
        MyOrder("Confirmed");
      }
      else if(buttonIndex == 2)
      {
        //Cancelled
        setStatusvalue("Cancelled")
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
        MyOrder("Dispatched");
      }
      else if(buttonIndex == 5)
      {
        //Shipped
        setStatusvalue("Shipped")
        MyOrder("Shipped");
      }
      else if(buttonIndex == 6)
      {
        //Completed
        setStatusvalue("Completed")
        MyOrder("Completed");
      }

    });
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
  const formatDateapi = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} `;
  };
  const formatTime = (time) => {
    return moment(time).format("HH:mm a");
  };

  const orderpickup = async (id) => {
    console.log(id);
    setShowModal(!showModal);

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
          url: constants.baseURL + constants.orderPickupDate,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          data: {
            orderId: id,
            pickupDate: formatDateapi(date),
            pickupTime: formatTime(time),
          },
        })
          .then((response) => {
            setIsLoading(false);
            console.log("pickup", response.data);

            if (response.data.status == 200) {
              MyOrder(statusVal);
              Alert.alert("Alert", response.data.message);

              //  Alert.alert("Alert", response.data.message);
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
  const MyOrder = async (status) => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);
    console.log("api hit succesfullyt");

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);
        axios({
          method: "POST",
          url: constants.baseURL + constants.getCustomerOrder,
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
            console.log("hhhhhhhhhhhhhhhhhhhhhhh", response.data.data);

            setData(response.data.data);
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
  useEffect(() => {
    setDatafetch(false);
    MyOrder(statusVal);
  }, [isFocused]);

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
              Customer Orders
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
              onPress={() => sortOptionClicked()}
            >
              <Image
                 source={require("../../assets/images/other_icons/filter.png")}
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
          backgroundColor: "#F5EFEB",
          width: "100%",
          height: deviceHeight - 50,
          justifyContent: "center",
          // alignItems:"center"
        }}
      >
        <FlatList
          data={Data}
          keyExtractor={(item, index) => index}
          style={{
            marginBottom: Platform.OS === "ios" && deviceHeight > 811 ? 60 : 10,
          }}
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
                  {isDataFetch && statusVal != ""? "You have not received any order yet." : "No Records Found. "}
                </Text>
              </View>
            );
          }}
          renderItem={({ item }) => (
            //1
            <View
              style={{
                margin: 16,

                flex: 1,

                borderRadius: 10,
                paddingBottom: 10,

                flexDirection: "column",
                backgroundColor: "#FFFFFF",
              }}
            >
              {/* 2 */}

              <View
                style={{
                  //  alignItems: 'center',

                  flex: 1,
                  //  width: "100%",
                  flexDirection: "row",
                  alignContent: "center",
                  // alignItems:"center",
                  //  shadowColor: 'black',
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
                      textAlign: "center",
                    }}
                  >
                    {moment(item.createdAt).format("ddd") +
                      moment(item.createdAt).format(" D")}
                  </Text>
                </View>
                {/* 2.2 */}
                <View style={{ marginLeft: 10 }}>
                  <View
                    style={{
                      width: deviceWidth - 164,
                     flexWrap: true,

                      marginLeft: 10,
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
                      Order No:{" "}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "HelveticaNeue",
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#1D1D1D",
                      }}
                    >
                      {item.order_id}
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
                      {item.itemCount}{" "}
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
                        {item.status}{" "}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: "row",
                      marginTop: 5,
                      flexWrap: true,
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

                  {renderIf(item.pickup_date != "",

                  <View
                    style={{
                      marginLeft: 10,
                      flexDirection: "row",
                      marginTop: 5,
                     flexWrap: true,
                      width : deviceWidth - 170
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
                      Pickup Date :
                    </Text>
                    <Text
                      style={{
                        fontFamily: "HelveticaNeue",
                        fontSize: 14,
                        fontWeight: "300",
                        color: "#1D1D1D",
                      }}
                    > {moment(item.pickup_date).format(
                            "DD MMM YYYY"
                          )}
                    </Text>
                  </View>

                  )}

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
                      {item.final_amount}{" "}
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
                <TouchableOpacity
                  style={{
                    backgroundColor: "#9F2241",
                    borderRadius: 8,
                    width: "49%",
                  }}
                  onPress={() =>
                    navigation.navigate("Vieworder", {
                      orderId: item._id,
                      name: "Order Detail",
                      buttonName: "Enter Pickup",
                      quantity: item._id,
                    })
                  }
                >
                  <Text
                    style={{
                      height: 40,
                      width: "100%",
                      borderRadius: 8,
                      textAlign: "center",
                      fontSize: 16,
                      color: "white",
                      alignSelf: "center",
                      fontFamily: "HelveticaNeue",
                      paddingTop: 10,
                    }}
                  >
                    View Order
                  </Text>
                </TouchableOpacity>

                <Modal
                  animationType={"slide"}
                  transparent={true}
                  visible={showModal}
                >
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    style={{ flex: 1, backgroundColor: `rgba(0,0,0,0.4)` }}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => {}}
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: "30%",
                        left: "45%",
                        elevation: 0.8,
                        transform: [
                          { translateX: -(deviceWidth * 0.4) },
                          { translateY: -90 },
                        ],
                        height: 380,
                        borderRadius: 8,
                        width: deviceWidth * 0.9,
                        backgroundColor: "#F5EFEB",
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          top: "30%",
                          left: "45%",
                          elevation: 0.8,
                          transform: [
                            { translateX: -(deviceWidth * 0.4) },
                            { translateY: -90 },
                          ],
                          height: 380,
                          borderRadius: 8,
                          width: deviceWidth * 0.9,
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
                        <View
                          style={{
                            justifyContent: "center",
                            alignSelf: "center",
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              fontFamily: "HelveticaNeue",
                              marginLeft: 10,
                              marginRight: 10,
                              fontWeight: "700",
                              fontSize: 25,

                              paddingTop: 70,
                            }}
                          >
                            Pickup Date!
                          </Text>
                          <Text
                            style={{
                              textAlign: "center",
                              fontFamily: "HelveticaNeue",
                              marginLeft: 10,
                              marginTop: 5,
                              marginRight: 10,
                              color: "#1D1D1D",
                              fontSize: 16,
                            }}
                          >
                            Please choose a Date & Time when we should collect
                            the wines from you.
                          </Text>
                          <View
                            style={{
                              width: "100%",
                              height: 70,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <TouchableOpacity onPress={showDatepicker}>
                              <TextField
                                containerStyle={{
                                  width: deviceWidth - 100,
                                  marginLeft: 10,
                                }}
                                label="Select Date"
                                style={{ width: "100%" }}
                                editable={false}
                                //// onChangeText={(addressStr) => {
                                //   setAddress(addressStr);
                                // }}
                                value={formatDate(date)}
                                textColor={"#9F2241"}
                                tintColor="black"
                                baseColor="black"
                                labelTextStyle={{
                                  fontFamily: "HelveticaNeue",
                                  fontWeight: "300",
                                  fontSize: 14,
                                }}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                width: 48,
                                height: 55,
                                alignItems: "center",
                                justifyContent: "center",
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
                            <TouchableOpacity onPress={showTimepicker}>
                              <TextField
                                containerStyle={{
                                  width: deviceWidth - 100,
                                  marginLeft: 10,
                                }}
                                editable={false}
                                label="Select Time"
                                style={{ width: "100%" }}
                                //  onChangeText={(addressStr) => {
                                //    setAddress(addressStr);
                                //  }}

                                value={formatTime(time)}
                                textColor={"#9F2241"}
                                tintColor="black"
                                baseColor="black"
                                labelTextStyle={{
                                  fontFamily: "HelveticaNeue",
                                  fontWeight: "300",
                                  fontSize: 14,
                                }}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                width: 48,
                                height: 55,
                                paddingBottom: 10,
                                alignItems: "center",
                                justifyContent: "center",
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
                              display="compact"
                              minimumDate={Date.now()}
                              mode={mode}
                              is24Hour={false}
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
                              marginTop: 20,
                              marginBottom: 20,
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
                                Alert.alert(
                                  "",

                                  "Are you sure you to set this Pickup date. Once set you cannot change this? ",
                                  [
                                    {
                                      text: "No",
                                      onPress: () =>
                                        console.log("Cancel Pressed"),
                                    },
                                    {
                                      text: "Yes",
                                      onPress: () => {
                                        orderpickup(orderpickupid);
                                      },
                                    },
                                  ]
                                );
                                //setShowModal(!showModal);
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
                    </TouchableWithoutFeedback>
                  </TouchableOpacity>
                </Modal>

                {item.status === "Confirmed" && (
                  <TouchableOpacity
                    onPress={() => {
                      setOrderpickupid(item.order_id);
                      setShowModal(!showModal);
                    }}
                    style={{ width: "49%" }}
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
                      Enter Pickup
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      </View>
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

export default MyOrder;
