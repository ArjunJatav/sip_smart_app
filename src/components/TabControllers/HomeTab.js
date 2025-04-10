import React, { Component, useState, useEffect } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Button,
  ImageBackground,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import IconBadge from "react-native-icon-badge";
import { Image } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import iconAddAction from "../../assets/images/other_icons/iconAddAction.png";
import ProfileIcon from "../../assets/images/other_icons/iconProfile.png";
import CartIcon from "../../assets/images/other_icons/iconCart.png";
import { Rating } from "react-native-ratings";
import close from "../../assets/images/other_icons/close.png";
import { FlatList } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import * as constants from "../../constants/Const";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import { useIsFocused, CommonActions,TabActions } from "@react-navigation/native";
import { TextField } from "rn-material-ui-textfield";
var pageNumber = 1;
var extra = [];
var pageNumber1 = 1;
var extra1 = [];
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const jumpToAction2 = TabActions.jumpTo(" ");
const HomeTab = ({ route, navigation }) => {
  var token = "";

  const [inventory, setInventory] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
const [inactive,setinactive]=useState(false);
  const [productId, setProductId] = useState("");

  const [Data, setData] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [modalSelect, setmodalSelect] = useState(false);
  const [isDataFetch,setDatafetch]=useState(false)
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
  const GetInventory = async (type) => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);
    console.log("detailis saved");

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {

        setIsLoading(true);

        axios({
          method: "post",
          url: constants.baseURL + constants.userProductList,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token,
          },
          data: {
            sale: type,
            page: pageNumber,
          },
        })
          .then((response) => {
            setIsLoading(false);
            console.log("inventopry",response.data)
            setDatafetch(true)

            if (response.data.status == 200) {
              const recnames = response.data.data.wineList.map((obj) => {
                extra.push(obj);
                return obj;
              });

              setData(response.data.data.wineList);
             
              //setCartCount(response.data.data.cartCount)


            }
            if (response.data.status === 400) {
              Alert.alert("Alert", response.data.message);
            }
            if(response.data.status ===401){
              setinactive(true)

              Alert.alert("Alert", response.data.message);
              const resetAction = CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: "AuthStack",
                  },
                ],
              });
              navigation.dispatch(resetAction);
              
              AsyncStorage.removeItem("Token");
              AsyncStorage.removeItem("token");
              AsyncStorage.removeItem("auth_token");
              AsyncStorage.removeItem("fcmToken");
              AsyncStorage.removeItem("userId");
             

          }
          cartcount()

          })
          .catch(function (error) {
            setIsLoading(false);
          });
      }
    });
  };

  const GetListed = async (type) => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);

        axios({
          method: "post",
          url: constants.baseURL + constants.userProductList,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token,
          },
          data: {
            sale: type,
            page: pageNumber1,
          },
        })
          .then((response) => {
            setIsLoading(false);
            console.log("inventopry",response.data)

            if (response.data.status == 200) {
              setDatafetch(true)
              console.log("list",isDataFetch)

              const recnames = response.data.data.wineList.map((obj) => {
                extra1.push(obj);
                return obj;
              });

              setData(response.data.data.wineList);
              //setCartCount(response.data.data.cartCount)



            }
            if (response.data.status == 400) {
              Alert.alert("Alert", response.data.message);
            }
            if(response.data.status ===401){
              setinactive(true)

              Alert.alert("Alert", response.data.message);
              const resetAction = CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: "AuthStack",
                  },
                ],
              });
              navigation.dispatch(resetAction);
              
              AsyncStorage.removeItem("Token");
              AsyncStorage.removeItem("token");
              AsyncStorage.removeItem("auth_token");
              AsyncStorage.removeItem("fcmToken");
              AsyncStorage.removeItem("userId");
             

          }
          cartcount()

          })
          .catch(function (error) {
            setIsLoading(false);
          });
      }
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    pageNumber1 = 1;
    extra1 = [];
    pageNumber = 1;
    setData([]);
    extra = [];
    GetInventory(false);
    GetListed(true);
    wait(300).then(() => setRefreshing(false));
  }, []);

  const model = (id, type) => {
    setModalVisible(type);
    setProductId(id);
  };
  const AddToListed = async () => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);
    console.log("detailis saved");

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);

        axios({
          method: "post",
          url: constants.baseURL + constants.ProductSellToMarket,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token,
          },
          data: {
            quantity: quantity,

            price: price,

            productId: productId,
          },
        })
          .then((response) => {
            setIsLoading(false);


            console.log(response.data)

            if (response.data.status == 200)
             {
              setProductId("");
              setQuantity("");
              setPrice("");
              Alert.alert("Alert", response.data.message);
              setIsLoading(false);
              setDatafetch(false)
              setInventory(true);
              pageNumber = 1;
              setData([]);
              extra = [];
              GetInventory(false);


            }
            else{
              Alert.alert("Alert", response.data.message);
            }
            
          })
          .catch(function (error) {
            setIsLoading(false);
          });
      }
    });
  };

  const Inventrycall = () => {
    setIsLoading(false);
    setDatafetch(false)
    setInventory(true);
    pageNumber = 1;
    setData([]);
    extra = [];
    GetInventory(false);
  };
  const Listedcall = () => {

    setDatafetch(false)
    setIsLoading(false);
    setInventory(false);

    setData([]);
    pageNumber1 = 1;
    extra1 = [];
    GetListed(true);
  };

  const deleteitem = async (id) => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);
        axios({
          method: "post",
          url: constants.baseURL + constants.productmoveFromMarket,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token,
          },
          data: {
            productId: id,
          },
        })
          .then((response) => {
            setIsLoading(false);
          


            if (response.data.status == 200) {
              Alert.alert("Alert ", response.data.message);

              pageNumber1 = 1;
              extra1 = [];
              pageNumber = 1;
              setData([]);
              extra = [];
              GetInventory(false);
              GetListed(true);
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
    if(inactive){

    }else{
      pageNumber1 = 1;
      extra1 = [];
      pageNumber = 1;
      setData([]);
      extra = [];
      setDatafetch(false)
      GetInventory(false);
      GetListed(true);
    }
   
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
                fontFamily: "HelveticaNeue",
              }}
            >
              My Cellar
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

      <View
        style={{
          backgroundColor: "#F5EFEB",
          marginLeft: 20,
          marginRight: 20,
          borderRadius: 14,
          height: 60,
          justifyContent: "center",
          borderColor: "#f9ece8",
          borderWidth: 0.5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            // marginHorizontal: 10,
            // marginVertical: 10,
            
          }}
        >
          <TouchableOpacity onPress={() => Inventrycall()}>
            <View>
              <Text
                style={{
                  height: 41,
                  width: (deviceWidth - 40) / 2,
                  borderRadius: 8,
                  backgroundColor: inventory == true ? "#9f2241" : "#FFFFFF",
                  textAlign: "center",
                  fontSize: 16,
                  overflow: "hidden",
                  color: inventory == true ? "#fff" : "#000",
                  alignSelf: "center",
                  fontFamily: "HelveticaNeue",
                  paddingTop: 10,
                }}
              >
                {" "}
                Inventory
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Listedcall()}>
            <Text
              style={{
                height: 41,
                width: (deviceWidth - 40) / 2,
                borderRadius: 8,
                color: inventory == false ? "#fff" : "#000",
                fontSize: 16,
                overflow: "hidden",
                fontFamily: "HelveticaNeue",
                alignSelf: "center",
                paddingTop: 10,
                textAlign: "center",
                backgroundColor: inventory == false ? "#9f2241" : "#FFFFFF",
              }}
            >
              {" "}
              Listed
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {inventory ? (
        <FlatList
          data={extra}
          showsVerticalScrollIndicator={false}
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
                  {isDataFetch?"No Wine Added yet.":""}
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
          onEndReachedThreshold={0}
          onEndReached={
            () => {
              if (pageNumber == 1) {
                //  setLoader2(false)
              } else {
                // setLoader2(true)
              }

              pageNumber = pageNumber + 1;

              GetInventory(false);
            }

            //   onEndReached = true;  // on end reached
          }
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{
                  borderTopWidth: 0.0,
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  padding: 1,
                  marginBottom: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  width: "100%",
                  flexDirection: "row",
                }}
                onPress={() =>
                  navigation.navigate("WineDetailScreen", {
                    productId: item._id,
                    button: "Sell",
                    api: constants.userProductDetails,
                  })
                }
                activeOpacity={0.9}
              >
                <View style={styles.formOuter}>
                  <View
                    style={{
                      margin: 16,
                      height: 170,
                      width: "90%",
                      flexDirection: "row",
                      shadowColor: "black",
                      borderRadius: 10,
                      backgroundColor: "#F5EFEB",
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        marginTop: 17,
                        marginLeft: "5%",
                        width: "30%",
                      }}
                    >
                      <Image
                        resizeMode="cover"
                        style={{
                          height: "96%",
                          width: "100%",
                        }}
                        // source={item.img}
                        PlaceholderContent={
                          <ActivityIndicator
                            animating={true}
                            size={"small"}
                            color="#000000"
                          />
                        }
                        source={{ uri: item.images[0] }}
                      />
                    </View>

                    <View
                      style={{
                        height: 104,
                        width: "55%",
                        elevation: 5,
                        borderRadius: 10,
                        backgroundColor: "#FFFFFF",
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            height: 25,
                            width: 25,
                            borderRadius: 6,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 17,
                            backgroundColor: "#F5EFEB",
                          }}
                        >
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: "contain",
                              alignSelf: "center",
                            }}
                            // source={item.img1}
                            source={require("../../assets/images/Bottle/Img1.png")}
                          />
                        </View>
                        <Text
                          style={{
                            marginTop: 15,
                            fontFamily: "HelveticaNeue",
                            marginLeft: 5,
                            fontSize: 12,
                          }}
                        >
                          No.of Units{" "}
                        </Text>
                        <Text
                          style={{
                            color: "#9F2241",
                            fontFamily: "HelveticaNeue",
                            marginTop: 15,

                            marginLeft: 5,
                            // width:40,
                            fontSize: 12,
                            textAlign: "center",
                          }}
                        >
                          {item.quantity}
                        </Text>
                      </View>
                      <View pointerEvents="none">
                        <Rating
                          type="custom"
                          ratingColor="#9f2241"
                          ratingBackgroundColor="#c8c7c8"
                          ratingCount={5}
                          imageSize={15}
                          startingValue={item.star_rating}
                          // onFinishRating={this.ratingCompleted}
                          style={{
                            paddingVertical: 10,
                            marginLeft: 12,
                            marginRight: 12,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          paddingBottom: 22,
                          marginRight: 12,
                          justifyContent: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            alignItems: "center",
                            fontFamily: "HelveticaNeue",
                            marginLeft: 5,
                          }}
                        >
                          ${item.price}{" "}
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
                    </View>
                  </View>

                  <Text
                    style={{
                      fontFamily: "HelveticaNeue",
                      fontSize: 18,
                      color: "#000",
                      fontWeight: "bold",
                      marginHorizontal: 16,
                    }}
                  >
                    {item.name.trim()}{" - "}{item.MFG}
                  </Text>

                  <TouchableOpacity
                    onPress={() => model(item._id, true)}
                    style={{
                      height: 38,
                      width: 110,
                      marginTop: 10,
                      marginLeft: 16,
                      paddingBottom: 40,
                      backgroundColor: "#9f2241",
                      marginBottom: 15,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        height: 38,
                        width: 110,

                        textAlign: "center",
                        fontSize: 16,
                        color: "#ffffff",
                        alignSelf: "center",
                        fontFamily: "HelveticaNeue",
                        paddingTop: 10,
                        marginBottom: 15,
                      }}
                    >
                      {" "}
                      Sell
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <FlatList
        
          data={extra1}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={"#9F2241"}
              colors={["#9F2241", "#9F2241", "#9F2241"]}
              onRefresh={onRefresh}
            />
          }
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
                  {isDataFetch?"No Wine Added yet.":""}
                </Text>
              </View>
            );
          }}
          onEndReachedThreshold={0}
          //  onMomentumScrollBegin = {() => {onEndReached = false;}}
          onEndReached={
            () => {
              if (pageNumber1 == 1) {
                //  setLoader2(false)
              } else {
                // setLoader2(true)
              }

              pageNumber1 = pageNumber1 + 1;

              GetListed(true);
            }

            //   onEndReached = true;  // on end reached
          }
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{
                  borderTopWidth: 0.0,
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  padding: 1,
                  marginBottom: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  flexDirection: "row",
                }}
                onPress={() =>
                  navigation.navigate("WineDetailScreen", {
                    productId: item._id,
                    button: "Delete",
                    api: constants.userProductDetails,
                  })
                }
                activeOpacity={0.9}
              >
                <View style={styles.formOuter}>
                  <View
                    style={{
                      margin: 16,
                      height: 170,
                      width: "90%",
                      flexDirection: "row",
                      shadowColor: "black",
                      borderRadius: 10,
                      backgroundColor: "#F5EFEB",
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        marginTop: 17,
                        marginLeft: "5%",
                        width: "30%",
                      }}
                    >
                      <Image
                        resizeMode="cover"
                        style={{
                          height: "96%",
                          width: "100%",
                        }}
                        PlaceholderContent={
                          <ActivityIndicator
                            animating={true}
                            size={"small"}
                            color="#000000"
                          />
                        }
                        // source={item.img}
                        source={{ uri: item.images[0] }}
                      />
                    </View>

                    <View
                      style={{
                        height: 104,
                        width: "55%",
                        elevation: 5,
                        borderRadius: 10,
                        backgroundColor: "#FFFFFF",
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            height: 25,
                            width: 25,
                            borderRadius: 6,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 17,
                            backgroundColor: "#F5EFEB",
                          }}
                        >
                          <Image
                            style={{
                              height: 20,
                              width: 20,
                              resizeMode: "contain",
                              alignSelf: "center",
                            }}
                            // source={item.img1}
                            source={require("../../assets/images/Bottle/Img1.png")}
                          />
                        </View>
                        <Text
                          style={{
                            marginTop: 15,
                            fontFamily: "HelveticaNeue",
                            marginLeft: 5,
                            fontSize: 12,
                                                    }}
                        >
                          No.of Units{" "}
                        </Text>
                        <Text
                          style={{
                            color: "#9F2241",
                            fontFamily: "HelveticaNeue",
                            marginTop: 15,

                            marginLeft: 5,
                            // width:40,
                            fontSize: 12,
                                                        textAlign: "center",
                          }}
                        >
                          {item.sale_quantity}
                        </Text>
                      </View>
                      <View pointerEvents="none">
                        <Rating
                          type="custom"
                          ratingColor="#9f2241"
                          ratingBackgroundColor="#c8c7c8"
                          ratingCount={5}
                          imageSize={15}
                          startingValue={item.star_rating}
                          // onFinishRating={this.ratingCompleted}
                          style={{
                            paddingVertical: 10,
                            marginLeft: 12,
                            marginRight: 12,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          paddingBottom: 22,
                          marginRight: 12,
                          justifyContent: "center",
                          flexDirection: "row",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            alignItems: "center",
                            fontFamily: "HelveticaNeue",
                            marginLeft: 5,
                          }}
                        >
                          ${item.sale_price}{" "}
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
                    </View>
                  </View>

                  <Text
                    style={{
                      fontFamily: "HelveticaNeue",
                      fontSize: 18,
                      color: "#000",
                      fontWeight: "bold",
                      marginHorizontal: 16,
                    }}
                  >
                    {item.name.trim()}{" - "}{item.MFG}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "",

                        "Are you sure you want to delete this item from market ? ",
                        [
                          {
                            text: "No",
                            onPress: () => console.log("Cancel Pressed"),
                          },
                          {
                            text: "Yes",
                            onPress: () => {
                              deleteitem(item._id);
                            },
                          },
                        ]
                      );
                    }}
                    style={{
                      height: 38,
                      width: 110,
                      marginTop: 10,
                      marginLeft: 16,
                      paddingBottom: 40,
                      backgroundColor: "#9f2241",
                      marginBottom: 15,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        height: 38,
                        width: 110,

                        textAlign: "center",
                        fontSize: 16,
                        color: "#ffffff",
                        alignSelf: "center",
                        fontFamily: "HelveticaNeue",
                        paddingTop: 10,
                        marginBottom: 15,
                      }}
                    >
                      {" "}
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
 <View
        style={{
          position: "absolute",
          height: 100,
          width: 100,
     alignSelf:'flex-end',
         
          bottom: 15,
         
        }}
      >
        <TouchableOpacity
          style={{ width: "100%", width: "100%" }}
          activeOpacity={0.9}
          onPress={() => {
            
            setmodalSelect(!modalVisible)
            
            
         //   navigation.navigate("AddWineScreen")
          
          
          }}
        >
          <Image
            source={iconAddAction}
            style={{
              height: 80,
              width: 80,
              resizeMode: "cover",
              alignSelf: "center",
            }}
          />
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" transparent visible={modalSelect}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >


          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              borderRadius:20,
              elevation: 5,
              transform: [
                { translateX: -(deviceWidth * 0.4) },
                { translateY: -90 },
              ],
              height: 200,
              width: deviceWidth * 0.8,
              backgroundColor: "#fff",
            }}
          >

<TouchableOpacity
        onPress={() => {
          setmodalSelect(!modalSelect)
        }}
        style={{
          height: 25,
          width: 25,
          marginTop: -80,
          alignSelf:'flex-end',
         
          backgroundColor: "#9F2241",
          borderRadius: 12,
        }}
      >
        <Image
          source={close}
          style={{ height: "100%", width: "100%" }}
        ></Image>
      </TouchableOpacity>





            <View style={{ alignItems:'center'}}>
                    <Text
                          style={{
                         
                            fontFamily: "HelveticaNeue",
                            marginLeft: 5,
                            fontSize: 22,
                            color:'black',
                            fontWeight:'bold'
                          }}
                        >
                          Select One
                        </Text>



                        <TouchableOpacity 
                        
                        onPress={() => {
                          setmodalSelect(!modalSelect)
                          navigation.dispatch(jumpToAction2)
                        }}
                        
                        >
                        <Text
                          style={{
                            marginTop: 25,
                            fontFamily: "HelveticaNeue",
                            marginLeft: 5,
                            fontSize: 16,
                            color:'#9F2241',
                            fontWeight:'bold'
                          }}
                        >
                          Add Wine By Scanning Label
                        </Text>
                        </TouchableOpacity>

                        <TouchableOpacity  onPress={() => {

                          setmodalSelect(!modalSelect)
                          navigation.navigate("AddWineScreen",{
                          type:'home',
                          MFG:"",
                          alcohal_prec:"",
                          category:"",
                          history:"",
                          images:[],
                          ingredients:"",
                          name:"",
                          relevant_links:"",
                          star_rating:0,
                          catname:"",



                          


                          })
        }}>
                        <Text
                          style={{
                            marginTop: 25,
                            fontFamily: "HelveticaNeue",
                            marginLeft: 5,
                            fontSize: 16,
                            color:'#9F2241',
                            fontWeight:'bold'
                          }}
                        >
                          Add Wine Manually
                        </Text>
                        </TouchableOpacity>


                     

            
            </View>

         

           </View>
        </View>
      </Modal>







      <Modal animationType="slide" transparent visible={modalVisible}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: "30%",
              left: "50%",
              elevation: 5,
              borderRadius:20,
              transform: [
                { translateX: -(deviceWidth * 0.4) },
                { translateY: -90 },
              ],
              height: 200,
              width: deviceWidth * 0.8,
              backgroundColor: "#fff",
            }}
          >
            <View style={{ alignItems: "center", width: "100%" }}>
              <TextField
                containerStyle={{
                  width: deviceWidth - 100,
                  marginLeft: 10,
                }}
                label="Quantity for Sell"
                style={{ width: "100%" }}
                onChangeText={(addressStr) => {
                  setQuantity(addressStr);
                }}
                value={quantity}
                textColor={"#9F2241"}
                tintColor="black"
                baseColor="black"
                lineWidth={1}
                activeLineWidth={1}
                keyboardType="phone-pad"
                disabledLineWidth={1}
                returnKeyLabel="Done"
                returnKeyType="done"
                labelTextStyle={{
                  fontFamily: "HelveticaNeue",
                  fontWeight: "300",
                }}
              />

              <TextField
                containerStyle={{
                  width: deviceWidth - 100,
                  marginLeft: 10,
                }}
                label="Price Per Unit"
                style={{ width: "100%" }}
                onChangeText={(addressStr) => {
                  setPrice(addressStr);
                }}
                value={price}
                textColor={"#9F2241"}
                tintColor="black"
                baseColor="black"
                lineWidth={1}
                keyboardType="phone-pad"
                activeLineWidth={1}
                disabledLineWidth={1}
                returnKeyLabel="Done"
                returnKeyType="done"
                labelTextStyle={{
                  fontFamily: "HelveticaNeue",
                  fontWeight: "300",
                }}
              />
            </View>

       
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,

                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  marginRight: 16,
                  alignItems: "flex-start",
                  width: "30%",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setProductId("");
                    setQuantity("");
                    setPrice("");
                  }}
                  style={{
                    width: "100%",
                    height: 30,
                    marginRight: 10,
                    width: 80,
                    borderRadius: 20,
                    color: "white",

                    justifyContent: "center",
                    backgroundColor: "#9f2241",

                    padding: 5,
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 14,
                      fontFamily: "HelveticaNeue",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  marginLeft: 16,
                  alignItems: "flex-end",
                  width: "50%",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (quantity === "") {
                      Alert.alert("Alert", "Please enter quantity for sell");
                    } else if (price === "") {
                      Alert.alert(
                        "Alert",
                        "Please enter price per unit for sell"
                      );
                    } else {
                      setModalVisible(!modalVisible);
                      setProductId("");
                    setQuantity("");
                    setPrice("");
                      AddToListed();
                    }
                  }}
                  style={{
                    width: "80%",
                    height: 30,
                    marginRight: 10,
                    width: 80,
                    borderRadius: 20,
                    color: "white",

                    justifyContent: "center",
                    backgroundColor: "#9f2241",

                    padding: 5,
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 14,
                      fontFamily: "HelveticaNeue",
                    }}
                  >
                    Ok
                  </Text>
                </TouchableOpacity>
              </View>
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

export default HomeTab;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    height: 200,
    backgroundColor: "red",
  },
  red: {
    color: "red",
    alignItems: "center",
    padding: 10,
  },
  button: {
    alignItems: "center",
    textDecorationColor: "pink",
    padding: 10,
  },
  formOuter: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    padding: 5,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    width: "90%",
    backgroundColor: "#fff",
  },
});
