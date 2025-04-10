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
  ScrollView,
  FlatList,
  Alert, KeyboardAvoidingView,
  TouchableWithoutFeedback

} from "react-native";

import backImage from "../../assets/images/other_icons/back.png";
import { CommonActions } from "@react-navigation/native";
import CountryPicker from "react-native-country-picker-modal";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import * as constants from "../../constants/Const";
import DateTimePicker from '@react-native-community/datetimepicker';
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import { _retrieveData, AUTH_TOKEN } from "../../helpers/helper";

import { TextField } from "rn-material-ui-textfield";
import { color } from "react-native-reanimated";
import renderIf from "../InitialController/renderIf";

const Vieworder = ({ route, navigation }) => {
  var token = "";

  const [showModal, setShowModal] = useState(false);

  const [date, setDate] = useState(new Date(Date.now()));

  const [mode, setMode] = useState('date');
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const orderId = route.params.orderId;
  const name = route.params.name;
  const buttonName = route.params.buttonName;
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [orderdata, setOrderData] = useState({})
  const [sellername,setSellername]=useState("")
  const onChange = (event, selectedValue) => {
    setShow(Platform.OS === 'ios');
    if (mode == 'date') {
      const currentDate = selectedValue || new Date();
      setDate(currentDate);
      setMode('time');
      setShow(Platform.OS !== 'ios'); // to show the picker again in time mode
    } else {
      const selectedTime = selectedValue || new Date();
      setTime(selectedTime);
      setShow(Platform.OS === 'ios');
      setMode('date');
    }
  };


  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);


  };



  const showDatepicker = () => {
    showMode('date');

  };

  const showTimepicker = () => {
    showMode('time');
  };
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() +
      1}/${date.getFullYear()} `;
  };
  const formatTime = (time) => {
    return ` ${time.getHours()}:${time.getMinutes()}`;
  };
  const CancelOrder = async (id) => {


    token = await AsyncStorage.getItem(AUTH_TOKEN);
    console.log("detailis saved", id)

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
            orderId: id
          }
        })
          .then((response) => {
            setIsLoading(false);

            //setData(response.data.data);
            //console.log("hhhhhhhhhhhhhhhhhhhhhhh", response.data);
            //  console.log(response.data)

            if (response.data.status == 200) {
              Vieworder()
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
  const formatDateapi = (date) => {
    return `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()} `;
  };
  const orderpickup = async (id) => {
    console.log(id)
    setShowModal(!showModal)

    token = await AsyncStorage.getItem(AUTH_TOKEN);
     console.log("detailis saved",id)

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
          data:{
            orderId:id,
            pickupDate:formatDateapi(date),
            pickupTime:formatTime( time),
          }
        })
          .then((response) => {
            setIsLoading(false);
            console.log("response",response.data)
          
            if (response.data.status == 200) {
              
              Vieworder()
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
  const Vieworder = async (id) => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);
        axios({
          method: "post",
          url: constants.baseURL + constants.viewOrderDetail,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            //  Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2MGY1OGFkODQzNzVlOTMyZjMzOGUxYTYiLCJ1c2VyTmFtZSI6ImVlZWVlIiwianRpIjoiNDQyMmVhY2UtODMxMy00YmM5LTlhMDUtZjRjOGI4ZDI0MWU3IiwiaWF0IjoxNjI4MDUzMTk3LCJleHAiOjE2MjgxMzk1OTd9.e3LGeYaNZ_Fc9W-44b_tFmG2AxVzBJYMiaZAnBLTfSM"

            Authorization: "Bearer " + token
          },
          data: {
            orderId: orderId
          },

        })
          .then((response) => {
            setIsLoading(false);

            console.log(token)
            console.log("respons>>>>>>>>>>>.", response.data.data);

            // setProductId(response.data.data)
            setData(response.data.data.ItemDetails)
            setOrderData(response.data.data.OrderDetails)
            setSellername(response.data.data.OrderDetails.seller.name)




            setIsLoading(false);

            if (response.data.status == 200) {

              //   Alert.alert("Alert ", response.data.message);

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

  }
  useEffect(() => {
    console.log("jjjjjjjjjjjjjjjj", route.params.orderId)
    Vieworder();
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
              {name}
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
            height: "100%",
            //  height: deviceHeight - 50,
            //  justifyContent: "center",
            justifyContent: "space-between"
            // alignItems:"center"
          }}
        >
          <View style={{
            backgroundColor: "#FFFFFF",
            marginHorizontal: 16,
            padding: 16, borderRadius: 10,

            justifyContent: "center"
          }} >
            <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "300", }}>
              Shipping Address
            </Text>
            <Text style={{ fontFamily: "HelveticaNeue", fontSize: 18, fontWeight: "300", marginTop: 4 }}>
              {orderdata.shipping_address}{" "}{orderdata.shipping_address_line1}{", "}{orderdata.shipping_city}{", "}{orderdata.shipping_country}{" "}{orderdata.shipping_postcode}
            </Text>
            <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "300", marginTop: 8 }}>
              Shipping Method
            </Text>
            <Text style={{ fontFamily: "HelveticaNeue", fontSize: 18, fontWeight: "300", marginTop: 4 }}>
            Standard Delivery
            </Text>
            <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "300", marginTop: 8 }}>
              Payment Mode
            </Text>
            <Text style={{ fontFamily: "HelveticaNeue", fontSize: 18, fontWeight: "300", marginTop: 4 }}>
              {"Card"}
            </Text>
            <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "300", marginTop: 8 }}>
              {"Order Date"}
            </Text>
            <Text style={{ fontFamily: "HelveticaNeue", fontSize: 18, fontWeight: "300", marginTop: 4 }}>
              {moment(orderdata.createdAt).format("DD MMMM YYYY")}
            </Text>
            <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "300", marginTop: 8 }}>
              Order No:
            </Text>
            <Text style={{ fontFamily: "HelveticaNeue", fontSize: 18, fontWeight: "300", marginTop: 4 }}>
              {orderdata.order_id}
            </Text>
            {
            buttonName === "Enter Pickup" && renderIf(orderdata.pickup_date != "",
              <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "300", marginTop: 8 }}>
              Pickup Date & Time
            </Text>
              )}
              {buttonName === "Enter Pickup" && renderIf(orderdata.pickup_date != "",
              <Text style={{ fontFamily: "HelveticaNeue", fontSize: 18, fontWeight: "300", marginTop: 4 }}>
              {moment(orderdata.pickup_date).format(
                            "DD MMM YYYY"
                          )} {orderdata.pickup_time}
            </Text>
              )}
            <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "300", marginTop: 8 }}>
              Expected Delivery
            </Text>
            <Text style={{ fontFamily: "HelveticaNeue", fontSize: 18, fontWeight: "300", marginTop: 4 }}>
              {orderdata.delivery_expected_date==="TBA"?orderdata.delivery_expected_date:moment(orderdata.delivery_expected_date).format("DD MMMM YYYY")}
            </Text>


            {buttonName === "Cancel Order" && <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "300",marginTop: 8  }}>
              Sold by
            </Text>}
            {buttonName === "Cancel Order" && <Text style={{ fontFamily: "HelveticaNeue", fontSize: 18, fontWeight: "300", marginTop: 4 }}>
              {sellername}
            </Text>}

          </View>

          <FlatList
            data={Data}
            keyExtractor={(item, index) => index}

            renderItem={({ item }) => (
              //1





              <View style={{
                margin: 16,
                width:deviceWidth-30,


                borderRadius: 10,
                flex:1,
                paddingBottom:15,

                flexDirection: "row",
                backgroundColor: "#FFFFFF",

              }}  >
                {/* 2 */}


                {/* 2.1 */}
                <View style={{
                  marginTop: 16, backgroundColor: '#DCC7B7',
                  justifyContent: "center", borderRadius: 10,
                  
                  height: 100, width: 100, marginLeft: 16
                }}>
                  <Image style={{
                    height: 100, width: 100,
                    alignSelf: "center", borderRadius: 12
                  }}
                    // source={require("../../assets/images/Bottle/Img1.png")}
                    source={{ uri: item.productId.images[0] }}
                  />


                </View>
                {/* 2.2 */}
                <View style={{ marginTop: 16,flex:1 }}>

               
                    <Text numberOfLines={2} ellipsizeMode='tail'
                      style={{ fontFamily: "HelveticaNeue", fontSize: 16, fontWeight: "700",marginLeft:10,marginRight:21 }}>{" "}{item.productId.name} </Text>


               
                  <View
                    style={{
                      marginTop:5,
                      marginLeft: 10,
                    flexDirection: "row",

                    }}
                  >
                   
                    <Text
                      style={{
                        color: "#9F2241",
                        alignItems: "center",
                        fontFamily: "HelveticaNeue",
                      }}
                    >
                      {""}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        alignItems: "center",
                        fontFamily: "HelveticaNeue",
                        
                        marginLeft: 5,
                      }}
                    >
                    ${item.productId.sale_price}{" "}
                    </Text>
                    <Text
                      style={{
                        color: "#9F2241",
                        alignItems: "center",
                        fontFamily: "HelveticaNeue",
                      }}
                    >
                      {" "}
                      Per Unit
                    </Text>
                  </View>


                  <View style={{
                    marginLeft: 10, flexDirection: "row", marginTop: 10,

                  }}>
                    <Text style={{ fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "300", color: "#1D1D1D" }}>{" "}Quantity : </Text>
                    <Text style={{ fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "700", color: "#1D1D1D" }}>{item.quantity} </Text>

                  </View>





                </View>

              </View>






            )}
          />
         {orderdata.status!="Cancelled" ? <View style={{
            backgroundColor: "transparent",
            marginHorizontal: 10,

            borderRadius: 10,
            paddingLeft: 16,


          }} >
            <Text style={{ color: "black", fontFamily: "HelveticaNeue", fontSize: 18, fontWeight: "700", marginTop: 20 }}>
              Order Status
            </Text>

            <View style={{
              flexDirection: "column", marginTop: 16,

            }}>
              <View style={{
                flexDirection: "row",

              }}>
                <Image style={{
                  height: 20, width: 20,
                  alignSelf: "center", borderRadius: 12
                }}
                  source={require("../../assets/images/other_icons/greencheck.png")}
                //  source={{ uri: item.productId.images[0] }}
                />
                <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "700", marginLeft: 16 }}>
                Order is Received
                </Text>


              </View>
              <View style={{
                height: 38, marginLeft: 9,
                width: 0.3,
                borderStyle:'dashed',
                borderWidth:1, borderStyle:'dashed', borderRadius:1,
                borderColor:'green',
              }} />
            </View>
            <View style={{
              flexDirection: "column", marginTop: 0,

            }}>
              <View style={{
                flexDirection: "row",

              }}>
                {orderdata.status==="Prepared" || orderdata.status==="Dispatched" || orderdata.status==="Shipped" || orderdata.status==="Completed"?<Image style={{
                  height: 20, width: 20,
                  alignSelf: "center", borderRadius: 12
                }}
                  source={require("../../assets/images/other_icons/greencheck.png")}
                //  source={{ uri: item.productId.images[0] }}
                />:<Image style={{
                  height: 20, width: 20,
                  alignSelf: "center", borderRadius: 12
                }}
                  source={require("../../assets/images/other_icons/greycheck.png")}
                //  source={{ uri: item.productId.images[0] }}
                />}
                <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "700", marginLeft: 16 }}>
                Order is Being Prepared
                </Text>


              </View>
              <View style={{
                height: 38, marginLeft: 9,
                width: 0.3,
                borderStyle:'dashed',
                borderWidth:1, borderStyle:'dashed', borderRadius:1,
                borderColor:orderdata.status==="Prepared" || orderdata.status==="Dispatched" || orderdata.status==="Shipped" || orderdata.status==="Completed"?'green':'#AEAEAE',
              }} />
            </View>


            <View style={{
              flexDirection: "column",

            }}>
              <View style={{
                flexDirection: "row",

              }}>
                {orderdata.status==="Dispatched" || orderdata.status==="Shipped" || orderdata.status==="Completed"?
                <Image style={{
                  height: 20, width: 20,
                  alignSelf: "center", borderRadius: 12
                }}
                  source={require("../../assets/images/other_icons/greencheck.png")}
                //  source={{ uri: item.productId.images[0] }}
                />: <Image style={{
                  height: 20, width: 20,
                  alignSelf: "center", borderRadius: 12
                }}
                  source={require("../../assets/images/other_icons/greycheck.png")}
                //  source={{ uri: item.productId.images[0] }}
                />}
                <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "700", marginLeft: 16 }}>
                Order is Being Dispatched
                </Text>


              </View>
              <View style={{
                height: 38, marginLeft: 9,
                width: 0.3,
                borderStyle:'dashed',
                borderWidth:1, borderStyle:'dashed', borderRadius:1,
                borderColor: orderdata.status==="Dispatched" || orderdata.status==="Shipped" || orderdata.status==="Completed"?'green':"#AEAEAE",
              }} />
            </View>
            <View style={{
              flexDirection: "column"
            }}>
              <View style={{
                flexDirection: "row",

              }}>
               { orderdata.status==="Shipped" || orderdata.status==="Completed"?
               <Image style={{
                  height: 20, width: 20,
                  alignSelf: "center", borderRadius: 12
                }}
                  source={require("../../assets/images/other_icons/greencheck.png")}
                //  source={{ uri: item.productId.images[0] }}
                />:<Image style={{
                  height: 20, width: 20,
                  alignSelf: "center", borderRadius: 12
                }}
                  source={require("../../assets/images/other_icons/greycheck.png")}
                //  source={{ uri: item.productId.images[0] }}
                />}
                <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "700", marginLeft: 16 }}>
                Order is Out For Delivery
                </Text>


              </View>
              <View style={{
                height: 38, marginLeft: 9,
                width: 0.3,
                borderStyle:'dashed',
                borderWidth:1, borderStyle:'dashed', borderRadius:1,
                borderColor: orderdata.status==="Shipped" || orderdata.status==="Completed"?'green':"#AEAEAE",
              }} />
            </View>
            <View style={{
              flexDirection: "column"
            }}>
              <View style={{
                flexDirection: "row",

              }}>
               {  orderdata.status==="Completed"?
               <Image style={{
                  height: 20, width: 20,
                  alignSelf: "center", borderRadius: 12
                }}
                  source={require("../../assets/images/other_icons/greencheck.png")}
                //  source={{ uri: item.productId.images[0] }}
                />:<Image style={{
                  height: 20, width: 20,
                  alignSelf: "center", borderRadius: 12
                }}
                  source={require("../../assets/images/other_icons/greycheck.png")}
                //  source={{ uri: item.productId.images[0] }}
                />}
                <Text style={{ color: "#9f2241", fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "700", marginLeft: 16 }}>
                Order is Completed
                </Text>


              </View>
            
            </View>

          </View>:<View style={{alignItems:"center",
        width:deviceWidth}}><Text style={{ color: "black", fontFamily: "HelveticaNeue", fontSize: 16, fontWeight: "700", marginTop: 20,justifyContent:"center" }}>
              Order is Cancelled
            </Text></View>}

          <View style={{
            backgroundColor: "#FFFFFF",
            marginHorizontal: 16,
            marginTop: 30,
            borderRadius: 10,
            flexDirection:"row",
            paddingLeft: 16,
            alignItems:"center",
            height: 55
          }}>

            <Text style={{ fontFamily: "HelveticaNeue", fontSize: 18, fontWeight: "300",flex:1 }}> Total Amount</Text>
            <View
            style={{flex:1,alignItems:"flex-end",marginRight:10}}
            >
            <Text style={{ fontFamily: "HelveticaNeue", fontSize: 18, fontWeight: "300" ,alignContent:"flex-end",fontWeight: "bold",
}}>{"$"}{orderdata.final_amount}</Text>
</View>

          </View>

          <Modal
                animationType={'slide'}
      
                transparent={true}
                visible={showModal}
                onRequestClose={() => {setShowModal(false)}}
              
              >
               <TouchableOpacity 
               onPress={()=>setShowModal(false)}
               style={{    flex: 1,
                backgroundColor: `rgba(0,0,0,0.4)`,
         }}>
            <TouchableWithoutFeedback

            onPress={()=>{

            }}
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
              borderRadius:8,
              width: deviceWidth * 0.9,
                backgroundColor: "#F5EFEB",
           
               }}
            >
                <View 
                onPress={()=>{
                  
                }}
                
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
         borderRadius:8,
         width: deviceWidth * 0.9,
           backgroundColor: "#F5EFEB",
      
          }}>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems:"center",
                   
                        
                    
                
                      
                      }}
                    >
                      <Image
                        style={{
                     
                           
                          position:'absolute',
                        resizeMode: "contain",
                        
                        }}
                        source={require("../../assets/images/Pickupscreen/S.png")}
                      />
                    </View>
                    <View style= {{justifyContent:'center',alignSelf:"center"}}>
                      <Text style= {{textAlign:"center",    
                          fontFamily: "HelveticaNeue",
                          marginLeft: 10,
                          marginRight: 10,
                          fontWeight: "700",
                          fontSize: 25,
                       
                      
                          paddingTop:70}}>
                      Pickup Date!
                      </Text>
                      <Text style={{textAlign:"center",    
                          fontFamily: "HelveticaNeue",
                          marginLeft: 10,
                          marginTop:5,
                          marginRight: 10,
                           color:"#1D1D1D",
                          fontSize: 16,}}>Please choose a Date & Time when we should collect the wines from you.</Text>
                      <View
                    style={{
                      width: "100%",
                      height: 70,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >

                    <TouchableOpacity
                     onPress={showDatepicker} 
                    >
      
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
                     value={formatDate(date )}
                      textColor={"#9F2241"}
                      tintColor="black"
                      baseColor="black"
                     
                      labelTextStyle={{
                        fontFamily: "HelveticaNeue",
                        fontWeight: "300",
                        fontSize:14
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
                    <TouchableOpacity
                                          onPress={showTimepicker}

                    >


                  
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
                      
                    value={formatTime( time)}
                      textColor={"#9F2241"}
                      tintColor="black"
                      baseColor="black"
                     
                      labelTextStyle={{
                        fontFamily: "HelveticaNeue",
                        fontWeight: "300",
                        fontSize:14
                      }}
                    />
        </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 48,
                        height: 55,
                        paddingBottom:10,
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
                    marginBottom:20,
                    borderRadius: 10,
                    marginHorizontal:79,
                    //alignItems: "center",
                    justifyContent: "center",
                  }}
                >  
               
                  <TouchableOpacity
                    style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}
                    activeOpacity={0.7}
                    //onPress={() => SaveAddress()}
                     onPress={() => {

                      Alert.alert(
                        '',
                     
                          'Are you sure you to set this Pickup date. Once set you cannot change this? ',
                        [
                          {
                            text: 'No',
                            onPress: () => console.log('Cancel Pressed'),
                      
                          },
                          {
                            text: 'Yes', onPress: () => {
                              orderpickup(orderdata.order_id)
                            }
                          },
                        ]
                      );
                      
                     
                      //setShowModal(!showModal);
                    }}
                  >
                    <Text
                      style={{ color: "#fff", fontSize: 18, fontWeight: "normal",}}
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

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // marginHorizontal: 10,
              // marginVertical: 10,
              marginTop: 30,
              marginBottom: "15%",


            }}
          >


            {orderdata.status === "Confirmed" ||orderdata.status === "Confirmed" ? <TouchableOpacity onPress={() => {
              if (buttonName === "Cancel Order") {

                Alert.alert(
                  '',

                  'Are you sure you want to cancel this order ? ',
                  [
                    {
                      text: 'No',
                      onPress: () => console.log('Cancel Pressed'),

                    },
                    {
                      text: 'Yes', onPress: () =>
                        CancelOrder(orderdata._id)

                    }
                  ]
                );
              } else {
                setShowModal(!showModal);

              }
            }}>
              <Text style={{
                height: 40, width: 148, borderRadius: 8, color: "white", fontSize: 16,
                fontFamily: "HelveticaNeue",
                paddingTop: 10,
                textAlign: "center",
                backgroundColor: "#9F2241"

              }}>{buttonName} </Text>
            </TouchableOpacity>:<View></View>}

          </View>
        </View>

      </ScrollView>


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

export default Vieworder;
{/* <View   style={{ 
                   backgroundColor: "#FFFFFF",
                 marginHorizontal:16,
                
                   borderRadius: 10,
                    paddingLeft:16,
                    
                
                   }} >
                        <Text style= {{color:"black",  fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "700",marginTop:36 }}>
                        Order Status
                        </Text>
                        <Text style= {{color:"#9f2241",  fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "700",marginTop:18 }}>
                        Order Placed 
                        </Text>
                        <Text style= {{color:"#9f2241",  fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "700",marginTop:36}}>
                         Order Accepted
                        </Text>
                   
                        <Text style= {{color:"#9f2241",  fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "700", marginTop:36}}>
                        Out for Delivery
                        </Text>
                        <Text style= {{color:"#9f2241",  fontFamily: "HelveticaNeue", fontSize: 14, fontWeight: "700",marginVertical:36}}>
                        Order Delivered
                        </Text>
                       
                        
                        
                    </View> */}

