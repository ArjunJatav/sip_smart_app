import React, { Component, useState, useEffect } from "react";
import {
  
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import backImage from "../../assets/images/other_icons/back.png";
import { TextField } from "rn-material-ui-textfield";
import iconPlus from "../../assets/images/other_icons/iconPlus.png";
import iconMinus from "../../assets/images/other_icons/iconMinus.png";
import iconTrash from "../../assets/images/other_icons/iconTrash.png";
import iconNav from "../../assets/images/other_icons/iconNav.png";
import CheckBox from '@react-native-community/checkbox';
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import * as constants from "../../constants/Const";
import { EventRegister } from 'react-native-event-listeners';


var userId = ""
const CheckoutScreen = ({ navigation, route }) => {

  const [isSelected, setSelection] = useState(true);
  var token = null;
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([])
  const [promocode, setPromocode] = useState("")
  const [discount, setDiscount] = useState("$0")
  const [TotalAmount, setTotalAmount] = useState(0.0)
  const [cartvalue, setCartValue] = useState(0.0)
  const [promocodeerror, setPromocodeerror] = useState("")
  const [adressid,setAdressId]=useState("")
  const [biladdressid,setAdressIdbil]=useState("")
  const [address, setAdress] = useState("")
  const [address1, setAdres1] = useState("")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [postcode, setpostcode] = useState("")
  const [biladdress, setAdressbil] = useState("")
  const [biladdress1, setAdres1bil] = useState("")
  const [bilcountry, setCountrybil] = useState("")
  const [bilpostcode, setpostcodebil] = useState("")
  const [bilcity, setCitybil] = useState("")
  const [seller, setSeller] = useState("")


  const PromocodeChange = (text) => {
    setPromocodeerror("")
    setPromocode(text)
  }
  const CartList = async (check) => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);
    userId = await AsyncStorage.getItem("userId");
  


    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        if(!check){
          setIsLoading(true);

        }


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
            console.log("cart",response.data)
            setData(response.data.data.cartData)

            
            if (response.data.status == 200) {
              setTotalAmount((response.data.data.cartData.reduce((a, v) => a = a + v.totalPrice, 0)))
              if (promocode.length <= 0) {
                setCartValue((response.data.data.cartData.reduce((a, v) => a = a + v.totalPrice, 0)))
              }
              else {
                ApplyPromocode((response.data.data.cartData.reduce((a, v) => a = a + v.totalPrice, 0)), true)

              }
              if (response.data.data.cartData.length > 0) {
                setSeller(response.data.data.cartData[0].seller)
              }
              else {
                navigation.navigate("CartScreen")
              }
              if (!check) {
                if (response.data.data.address != null) {
                  setAdressId(response.data.data.address._id)
                  setAdress(response.data.data.address.address + " ");
                  setAdres1(response.data.data.address.address_line1 + ", ")
                  setCountry(response.data.data.address.country + ", ")
                  setCity(response.data.data.address.city + ", ")

                  setpostcode(response.data.data.address.postcode)
                  if (isSelected) {
                    setAdressIdbil(response.data.data.address._id)

                    setAdressbil(response.data.data.address.address + " ");
                    setAdres1bil(response.data.data.address.address_line1 + ", ")
                    setCountrybil(response.data.data.address.country + ", ")
                    setpostcodebil(response.data.data.address.postcode)
                    setCitybil(response.data.data.address.city + ", ")

                  }
                }

              }


            }
            if (response.data.status == 400) {
              Alert.alert("Alert", response.data.message);
              navigation.navigate("CartScreen")
            }
          })
          .catch(function (error) {
            setIsLoading(false);
          });
      }

    });
  };

  const decreseCartItem = async (id) => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
      

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
  const ApplyPromocode = async (amount, check) => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        if (promocode.length <= 0) {
          Alert.alert("", 'Enter Promocode');

        }
        else {
          setIsLoading(true);

          axios({
            method: "post",
            url: constants.baseURL + constants.promocodeapply,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",

              Authorization: "Bearer " + token
            },
            data: {

              promocode: promocode,
              price: amount

            },


          })
            .then((response) => {
             




              setIsLoading(false);

              if (response.data.status == 200) {
                if (!check) {
                  Alert.alert("Alert", response.data.message);

                }
                setCartValue(response.data.data.finalAmount)
                setDiscount(response.data.data.discountValue)

              }
              if (response.data.status == 400) {
                setPromocodeerror(response.data.message)
              }
            })
            .catch(function (error) {
              setIsLoading(false);
            });
        }
      }
    });


  }


  const FinalCheckout = async () => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        if (address.length <= 0) {
          Alert.alert("Alert", 'Enter Delivery Address.');

        }
        else if (biladdress.length <= 0) {
          Alert.alert("Alert", 'Enter billing Address.');

        }
        else {
          setIsLoading(true);

          axios({
            method: "post",
            url: constants.baseURL + constants.finalCheckout,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",

              Authorization: "Bearer " + token
            },
            data: {
              //seller: seller,
              amount: TotalAmount,
              discount_value: discount,
              discount: TotalAmount - cartvalue,
              final_amount: cartvalue,
              promocode: promocode,
              shippingAddress:adressid,
              billingAddress:biladdressid

            },


          })
            .then((response) => {
              console.log(">>>>>>>>>>>>>>>>>>>",response.data)
              setIsLoading(false);
            



              if (response.data.status == 200) {
                navigation.navigate('Payment', {
                  header: 'Payment',
                  //url: "https://wine.betademo.net/payment?&cartId=" + response.data.data.cartId,
                  url:'https://wine.betademo.net/paymentTesting?&cartId='+ response.data.data.cartId
                });



              }
              if (response.data.status == 400) {
                setPromocodeerror(response.data.message)
              }
            })
            .catch(function (error) {
              setIsLoading(false);
            });
        }
      }
    });

  }

  useEffect(() => {

    CartList(false);
    const list = EventRegister.addEventListener('address updated', (data) => {
    console.log(data.type,data.selected)
      if (data.type === "deliver") {
        setAdressId(data.id)
        setAdress(data.address);
        setAdres1(data.address1)
        setCountry(data.country)
        setpostcode(data.postcode)
        setCity(data.city)
        if (data.selected) {
          setAdressIdbil(data.id)
          setAdressbil(data.address);
          setAdres1bil(data.address1)
          setCountrybil(data.country)
          setpostcodebil(data.postcode)
          setCitybil(data.city)

        }

      }
      else {
        setAdressIdbil(data.id)

        setAdressbil(data.address);
        setAdres1bil(data.address1)
        setCountrybil(data.country)
        setpostcodebil(data.postcode)
        setCitybil(data.city)

        if (data.selected) {
          setAdressId(data.id)

          setAdress(data.address);
          setAdres1(data.address1)
          setCountry(data.country)
          setpostcode(data.postcode)
          setCity(data.city)

        }
      }




    })
    return () => {


      EventRegister.removeEventListener(list);
    }
  }, []);
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
              Checkout
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
      <KeyboardAvoidingView
                     keyboardVerticalOffset={20}
                     enabled behavior={Platform.OS === 'ios' ? 'padding' : "padding"}
                    >



          <ScrollView
       
    
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
      <View
        style={{
          backgroundColor: "#F5EFEB",
         flex:1,
          alignItems: "center",
        }}
      >
        <FlatList
          style={{ marginBottom: 10 }}
          data={Data}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index}
         
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

                    <TouchableOpacity
                    onPress={() => { IncreseCartItem(item._id) }}
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
                    <TouchableOpacity onPress={() => {  Alert.alert(
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
                      );}}>
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

<View
              style={{
                width: "100%",
                marginBottom:150,
                backgroundColor: "#F5EFEB",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  marginTop: 10,
                  width: "96%",
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "85%", borderRadius: 8 }}>
                  <TouchableOpacity

                  >
                    <Text
                      style={{
                        margin: 10,
                        fontSize: 12,
                        fontWeight: "300",
                        color: "#9f2241",

                      }}
                    >
                      Delivery Address
                    </Text>

                    {address.length <= 0 ?
                      <Text style={{ marginLeft: 8, marginBottom: 10 }}>Choose Address
                      </Text>
                      : <Text style={{ marginLeft: 8, marginBottom: 10 }}> {address}
                        {address1}{city}{country}
                        {postcode}
                      </Text>}
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: "15%",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("MyAddress", { type: "deliver",selected:isSelected })}
                  >
                    <Image
                      source={iconNav}
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

              <View
                style={{
                  marginTop: 10,
                  width: "96%",
                  height: 25,
                  borderRadius: 8,
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
             
                <CheckBox
                  value={isSelected}
                  onValueChange={(value) => {
                    console.log(value)
                    setSelection(!isSelected)
                    if (value) {

                      setAdressbil(address);
                      setAdres1bil(address1)
                      setCountrybil(country)
                      setpostcodebil(postcode)
                      setCitybil(city)


                    }
                  }}
                // style={styles.checkbox}
                />


                <Text
                  style={{ marginLeft: 5, fontSize: 12, fontWeight: "300" }}
                >
                  Same as shipping address?
                </Text>
              </View>

              <View
                style={{
                  marginTop: 10,
                  width: "96%",
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "85%", borderRadius: 8 }}>

                  <Text
                    style={{
                      margin: 10,
                      fontSize: 12,
                      fontWeight: "300",
                      color: "#9f2241",
                    }}
                  >
                    Billing Address
                  </Text>

                  <Text
                    style={{ marginLeft: 10, marginBottom: 8, fontSize: 15, fontWeight: "300" }}
                  >
                    {biladdress}
                    {biladdress1}{bilcity}{bilcountry}
                    {bilpostcode}
                  </Text>

                </View>
                <View
                  style={{
                    width: "15%",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {

                      navigation.navigate("MyAddress", { type: "billing",selected:isSelected })
                    }}
                  >
                    <Image
                      source={iconNav}
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

              <View
                style={{
                  marginTop: 10,
                  width: "96%",
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    width: "60%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >








                  <TextField
                    containerStyle={{
                      width: "90%",
                      alignSelf: "center",
                    }}

                    label="Enter Promocode"
                    style={{ width: "100%" }}
                    textColor={"#9F2241"}
                    tintColor="black"
                    baseColor="black"
                    error={promocodeerror}
                    lineWidth={0}
                    activeLineWidth={0}
                    onChangeText={(code) =>{

                      


                     
                   
                     PromocodeChange(code)
                    }}
                    value={promocode}
                    labelTextStyle={{
                      fontFamily: "HelveticaNeue",
                      fontWeight: "300",
                    }}
                    returnKeyLabel="Done"
                  />
                </View>

                <View
                  style={{
                    width: "40%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: "93%",
                      borderRadius: 5,
                      height: 45,
                      backgroundColor: "#9F2241",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      activeOpacity={0.7}
                      // CheckoutScreen
                      onPress={() => ApplyPromocode(TotalAmount, false)}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "500",
                          fontSize: 15,
                        }}
                      >
                        Apply
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
            
            
            
            
              </View>

              <View
                style={{
                  marginTop: 10,
                  width: "96%",
                  backgroundColor: "#fff",
                  height: 150,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 45,
                    borderRadius: 8,
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ marginLeft: 10, width: "50%", fontWeight: "300" }}>Total Amount</Text>
                  <Text style={{ marginLeft: -20, width: "50%", fontWeight: "800", textAlign: "right" }}>{"$" + TotalAmount}</Text>
                </View>

                <View
                  style={{
                    width: "100%",
                    height: 45,
                    borderRadius: 8,
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ marginLeft: 10, width: "50%", fontWeight: "300" }}>Promocode Discount</Text>
                  <Text style={{ marginLeft: -20, width: "50%", fontWeight: "800", textAlign: "right" }}>{discount}</Text>

                </View>

                <View
                  style={{
                    width: "100%",
                    height: 45,
                    borderRadius: 8,
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ marginLeft: 10, width: "50%", fontWeight: "300" }}>Total Amount</Text>
                  <Text style={{ marginLeft: -20, width: "50%", fontWeight: "800", textAlign: "right" }}>{"$" + cartvalue}</Text>

                </View>
              </View>
            </View>
        

        
      </View>
     
     </ScrollView>
     </KeyboardAvoidingView>


     <View
          style={{
          
            width: "93%",
            borderRadius: 10,
            height: 50,
            position:'absolute',
            bottom:30,
            backgroundColor: "#9F2241",
           alignSelf:"center",
            justifyContent: "center",
           
          }}
        >
          <TouchableOpacity
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.7}
            onPress={() => FinalCheckout()}
          >
            <Text style={{ color: "#fff", fontWeight: "500", fontSize: 18 }}>
              Make Payment
            </Text>
          </TouchableOpacity>
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
  </View>
  
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxInput: {
    flexDirection: "row",
    marginBottom: 20,
  },
  label: {
    margin: 8,
  },
});