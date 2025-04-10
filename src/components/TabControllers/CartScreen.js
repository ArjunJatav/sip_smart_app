import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  ActivityIndicator,
  requireNativeComponent,
  Alert
} from "react-native";

import backImage from "../../assets/images/other_icons/back.png";


import iconPlus from "../../assets/images/other_icons/iconPlus.png";
import iconMinus from "../../assets/images/other_icons/iconMinus.png";
import iconTrash from "../../assets/images/other_icons/iconTrash.png"
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import * as constants from "../../constants/Const";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import { TabActions, CommonActions,useIsFocused } from '@react-navigation/native';

const jumpToAction2 = TabActions.jumpTo('Market');


const CartScreen = ({ navigation }) => {
  var token = null;
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([])
  
  const CartList = async (check) => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);


    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {


        axios({
          method: "GET",
          url: constants.baseURL + constants.UserCartList,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token
          },

        })

          .then((response) => {

         
            setIsLoading(false);
            console.log(response.data.status)



            if (response.data.status == 200) {

              setData(response.data.data.cartData)

            }
            if (response.data.status == 400) {
              //Alert.alert("Alert", response.data.message);
              setData([])
            }
          })
          .catch(function (error) {
            setIsLoading(false);
          });
      }

    });
  }

  const decreseCartItem = async (id) => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
       // setIsLoading(true);

        axios({
          method: "post",
          url: constants.baseURL + constants.decreseCartItem,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token
          },
          data: {

            cartId: id,

          },


        })
          .then((response) => {
            setIsLoading(false);






            if (response.data.status == 200) {
              //Alert.alert("Alert", response.data.message);
              CartList(true)
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
  const IncreseCartItem = async (id) => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {

        axios({
          method: "post",
          url: constants.baseURL + constants.IncreseCartItem,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token
          },
          data: {

            cartId: id,

          },


        })
          .then((response) => {
            setIsLoading(false);



            if (response.data.status == 200) {
              //Alert.alert("Alert", response.data.message);
              CartList(true)
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
  const removeCartItem = async (id) => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {

        axios({
          method: "post",
          url: constants.baseURL + constants.removeCartItem,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token
          },
          data: {

            cartId: id,

          },


        })
          .then((response) => {
            setIsLoading(false);





            if (response.data.status == 200) {
            
            Alert.alert("Alert", response.data.message);
            CartList(true)

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


  const Checkout = async () => {
    setIsLoading(true);

    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {

        axios({
          method: "get",
          url: constants.baseURL + constants.cartcheckout,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token
          },


        })
          .then((response) => {
            setIsLoading(false);







            if (response.data.status == 200) {

              navigation.navigate("CheckoutScreen")

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
    setData([])
    CartList(false);

  
    //getToken();

  }, [isFocused]);

  const EmptyListMessage = ({ item }) => {
    return (
      <Text
        style={{
          padding: 10,
          fontSize: 18,
          textAlign: 'center',
        }}
      >
        Your cart is empty.
      </Text>
    );
  };
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
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
              Cart
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
          height: deviceHeight,
          alignItems: "center",
        }}
      >
        <FlatList
          style={{ marginBottom: 10 }}
          data={Data}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({ item }) => (
            //1
            <View
              style={{
                margin: 5,
                height: 150,
                padding: 5,
                width: deviceWidth - 30,
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
                  marginLeft: 10,
                  width: "32%",
                  height: "90%",
                  borderRadius: 10,
                  backgroundColor: "#F5EFEB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  resizeMode='cover'
                  style={{

                    height: "90%",
                    width: "90%",

                  }}
                  source={{ uri: item.product.images[0] }}
                />
              </View>

              <View
                style={{
                  marginLeft: 10,
                  width: "60%",
                  height: "90%",
                  flex: 1,

                  borderRadius: 10,
                  backgroundColor: "#fff",
                }}
              >
                <Text
                  style={{
                    marginTop: 5,
                    fontFamily: "HelveticaNeue",
                    marginLeft: 10,
                    marginRight: 10,
                    fontWeight: "700",
                    fontSize: 16,
                  }}
                  numberOfLines={2}
                >
                  {item.product.name.trim()}{" - "}{item.product.MFG}
                </Text>
                <Text
                  style={{
                    fontFamily: "HelveticaNeue",
                    fontSize: 12,
                    color: "#000",
                    fontWeight: "300",
                    marginLeft: 10,
                  }}
                >
                {"Sold by"} {item.product.user.name}
                </Text>
                <Text
                  style={{
                    flex: 1 / 2,

                    marginTop: 12,
                    fontFamily: "HelveticaNeue",
                    marginLeft: 10,
                    marginRight: 10,
                    fontWeight: "700",
                    fontSize: 16,
                  }}
                >
                  {"$" + item.product.sale_price}
                  <Text
                    style={{
                      marginTop: 8,
                      fontFamily: "HelveticaNeue",
                      marginLeft: 5,
                      marginRight: 10,
                      alignItems: "center",

                      fontWeight: "300",
                      color: "#9F2241",
                      fontSize: 12,
                    }}
                  >
                    {" " + "Per Unit"}
                  </Text>
                </Text>

                <View
                  style={{
                    flex: 1 / 3,

                    marginLeft: 10,
                    marginBottom: 5,
                    width: "90%",
                    height: 40,
                    flex: 1,
                    justifyContent: "center",

                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  <View
                    style={{
                      width: 119,
                      height: 30,
                      borderRadius: 4,
                      backgroundColor: "#F5EFEB",
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                    onPress={() => {
                      if(item.quantity>1){
                        decreseCartItem(item._id)

                      }
                    }}
                      style={{
                        width: "30%",
                        height: 30,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >

                     {item.quantity>1 && 
                        <Image
                          source={iconMinus}
                          style={{
                            height: 18,
                            width: 18,
                            resizeMode: "contain",
                            alignSelf: "center",
                          }}
                        />
                    }
                    </TouchableOpacity>

                    <View
                      style={{
                        width: "40%",
                        height: 30,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#9F2241",
                          fontWeight: "700",
                          fontSize: 14,
                        }}
                      >
                        {item.quantity}
                      </Text>
                    </View>

                    <TouchableOpacity onPress={() => { IncreseCartItem(item._id) }}
                      style={{
                        width: "30%",
                        height: 30,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >

                        <Image
                          source={iconPlus}
                          style={{
                            height: 18,
                            width: 18,
                            resizeMode: "contain",
                            alignSelf: "center",
                          }}
                        />
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginLeft: 30,
                      width: 30,
                      height: 30,
                      borderRadius: 5,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <TouchableOpacity onPress={() => { 
                    
                    Alert.alert(
                        '',
                     
                          'Are you sure you want to remove this item from cart ? ',
                        [
                          {
                            text: 'No',
                            onPress: () => console.log('Cancel Pressed'),
                      
                          },
                          {
                            text: 'Yes', onPress: () => {
                              removeCartItem(item._id) 
                            }
                          },
                        ]
                      );
                  
                  }
                  
                  
                  }>
                      <Image
                        source={iconTrash}
                        style={{
                          height: 30,
                          width: 30,
                          resizeMode: "contain",
                          alignSelf: "center",
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

        />
        <View style={{ marginBottom: "30%", width: "93%", borderRadius: 10, height: 50, backgroundColor: "#9F2241", alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.7}
            
            onPress={() => {
              if (Data.length <= 0) {

                navigation.pop()
                navigation.dispatch(jumpToAction2)

              } else {
                Checkout()

              }
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "500", fontSize: 18 }}>{Data.length <= 0 ? "Buy Now" : "Checkout"}</Text>
          </TouchableOpacity>
        </View>

      </View>
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

export default CartScreen;
