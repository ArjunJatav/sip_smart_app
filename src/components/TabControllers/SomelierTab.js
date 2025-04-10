import React, { Component, useState, useEffect } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Button,
  ImageBackground,
  Alert,
  StatusBar,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Keyboard,
  Platform,
} from "react-native";
import { Image } from "react-native-elements";
import { useIsFocused, CommonActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileIcon from "../../assets/images/other_icons/iconProfile.png";
import CartIcon from "../../assets/images/other_icons/iconCart.png";
import { Rating, AirbnbRating } from "react-native-ratings";
import ModalDropdown from "react-native-modal-dropdown";
import { FlatList } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import * as constants from "../../constants/Const";
import IconBadge from "react-native-icon-badge";
import renderIf from "../InitialController/renderIf";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
var pageNumber = 1;
var extra = [];

const Somelier = ({ route, navigation }) => {
  var token = null;
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isDataFetch, setDatafetch] = useState(false);
  const [keyboardheigh, setKeyboardHeight] = useState(0);

  const onRefresh = React.useCallback(() => {
    extra = [];
    pageNumber = 1;
    setRefreshing(true);

    setData([]);
    GetSomeliar();
    wait(300).then(() => setRefreshing(false));
  }, []);

  const changeunit = (index, value) => {
    // 1. Make a shallow copy of the items
    let items = [...Data];
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...items[index] };
    // 3. Replace the property you're intested in
    item.unit = value;
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;
    // Data = items
    // 5. Set the state to our new copy
    setData(items);
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

            Authorization: "Bearer " + token,
          },
        })
          .then((response) => {
            setIsLoading(false);
            console.log(response.data);
            setCartCount(response.data.data.count.data);

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
  };
  const BuyNow = async (id, unit, index) => {
    console.log(unit);
    token = await AsyncStorage.getItem(AUTH_TOKEN);
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);
        axios({
          method: "post",
          url: constants.baseURL + constants.AddtoCart,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token,
          },
          data: {
            productId: id,
            quantity: parseInt(unit),
          },
        })
          .then((response) => {
            setIsLoading(false);

            if (response.data.status == 200) {
              Alert.alert("Alert ", "Item moved to cart successfully!");
              changeunit(index, "1");

              cartcount();
              //removeItem(id,false)
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

  const removeItem = async (id, type) => {
    // console.log("removed")

    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);

        axios({
          method: "post",
          url: constants.baseURL + constants.removeFavouriteItem,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            //  Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2MGY1OGFkODQzNzVlOTMyZjMzOGUxYTYiLCJ1c2VyTmFtZSI6ImVlZWVlIiwianRpIjoiNDQyMmVhY2UtODMxMy00YmM5LTlhMDUtZjRjOGI4ZDI0MWU3IiwiaWF0IjoxNjI4MDUzMTk3LCJleHAiOjE2MjgxMzk1OTd9.e3LGeYaNZ_Fc9W-44b_tFmG2AxVzBJYMiaZAnBLTfSM"

            Authorization: "Bearer " + token,
          },
          data: {
            productId: id,
          },
        })
          .then((response) => {
            setIsLoading(false);

            if (response.data.status == 200) {
              pageNumber = 1;
              extra = [];

              if (type === true) {
                Alert.alert("Alert", response.data.message);
              }

              GetSomeliar();
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

  const GetSomeliar = async () => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);

        axios({
          method: "GET",
          url:
            constants.baseURL +
            constants.getFavoriteList +
            "?" +
            "page=" +
            pageNumber,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token,
          },
        })
          .then((response) => {
            setIsLoading(false);

            if (response.data.status == 200) {
              setDatafetch(true);
              setData(response.data.data.favList);
              console.log(response.data.data.favList);
              //setCartCount(response.data.data.cartCount)
              const recnames = response.data.data.favList.map((obj) => {
                extra.push(obj);
                return obj;
              });
            }
            if (response.data.status == 400) {
              Alert.alert("Alert", response.data.message);
            }
            cartcount();
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
            setIsLoading(false);
          });
      }
    });
  };

  const onKeyboardWillShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const onKeyboardWillHide = () => {
    setKeyboardHeight(0);
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    setDatafetch(false);
    setData([]);
    pageNumber = 1;
    extra = [];
    GetSomeliar();
    if (Platform.OS === "ios") {
      Keyboard.addListener("keyboardWillShow", onKeyboardWillShow);
      Keyboard.addListener("keyboardWillHide", onKeyboardWillHide);
    }
    return () => {
      if (Platform.OS === "ios") {
        Keyboard.removeListener("keyboardWillShow", onKeyboardWillShow);
        Keyboard.removeListener("keyboardWillHide", onKeyboardWillHide);
      }
    };
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
            backgroundColor: "#FFFFFF",
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            marginBottom: 5,
            borderColor: "#DCC7B7",
            borderWidth: 1,

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
                Sommelier
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
                    BadgeElement={
                      <Text style={{ color: "#FFFFFF" }}>{cartCount}</Text>
                    }
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
          style={{ marginBottom: keyboardheigh }}
          data={Data}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
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
                  {isDataFetch ? "You do not have any favourite wine yet." : ""}
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
                    productId: item.product._id,
                    button: "Move To Cart",
                    api: constants.WineDetails,
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
                      style={{ marginTop: 17, marginLeft: "5%", width: "30%" }}
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
                        source={{ uri: item.product.images[0] }}
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
                            fontSize: 12,
                            marginLeft: 5,
                          }}
                        >
                          {item.product.sale_quantity}
                        </Text>
                      </View>

                      <View pointerEvents="none">
                        <Rating
                          type="custom"
                          ratingColor="#9f2241"
                          ratingBackgroundColor="#c8c7c8"
                          ratingCount={5}
                          imageSize={15}
                          startingValue={item.product.star_rating}
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
                          ${item.product.sale_price}{" "}
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
                    {item.product.name.trim()}
                    {" - "}
                    {item.product.MFG}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "HelveticaNeue",
                      fontSize: 12,
                      color: "#000",
                      fontWeight: "300",
                      marginHorizontal: 16,
                    }}
                  >
                    {"Sold by"} {item.product.user.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginHorizontal: 16,
                    }}
                  >
                    <View
                      style={{
                        height: 40,
                        width: 150,
                        marginTop: 12,
                        marginBottom: 10,
                        marginHorizontal: 16,
                        flexDirection: "row",

                        justifyContent: "center",
                      }}
                    >
                      {renderIf(
                        item.product.sale_quantity == 0,
                        <View
                          style={{
                            height: 40,
                            width: 140,
                            justifyContent: "center",
                            left: -20,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "HelveticaNeue",
                              fontSize: 16,
                              color: "#9f2241",
                              fontWeight: "800",
                              
                            }}
                          >
                           Out of Stock
                          </Text>
                        </View>
                      )}

                      {renderIf(
                        item.product.sale_quantity > 0,
                        <View
                          style={{
                            borderColor: "#9f2241",
                            borderWidth: 1,
                            height: 40,
                            width: 60,
                            marginRight: 10,

                            borderRadius: 10,
                            justifyContent: "center",
                          }}
                        >
                          <TextInput
                            style={{
                              alignItems: "center",
                              textAlign: "center",
                            }}
                            value={item.unit.toString()}
                            onChangeText={(text) => changeunit(index, text)}
                            placeholder={""}
                            keyboardType={"number-pad"}
                            returnKeyType="done"
                          />
                        </View>
                      )}

                      {renderIf(
                        item.product.sale_quantity > 0,
                        <TouchableOpacity
                          onPress={() => {
                            console.log(item.unit);
                            if (item.unit === "") {
                              Alert.alert("Alert", "Please enter quantity");
                            } else if (item.unit === "0") {
                              Alert.alert("Alert", "Please enter quantity");
                            } else {
                              BuyNow(item.product._id, item.unit, index);
                            }
                          }}
                        >
                          <Text
                            style={{
                              height: 40,
                              width: 115,
                              borderRadius: 8,
                              backgroundColor: "#9f2241",
                              textAlign: "center",
                              //  justifyContent:"center",
                              fontSize: 16,
                              overflow: "hidden",
                              color: "#ffffff",
                              alignSelf: "center",

                              fontFamily: "HelveticaNeue",
                              paddingTop: 8,
                              marginBottom: 8,
                            }}
                          >
                            {" "}
                            Move to Cart
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        marginTop: 12,
                        backgroundColor: "#9f2241",
                        borderRadius: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          removeItem(item.product._id, true);
                          // Alert.alert(
                          //   '',

                          //     'Are you sure you want to remove this item from favourite list ? ',
                          //   [
                          //     {
                          //       text: 'No',
                          //       onPress: () => console.log('Cancel Pressed'),

                          //     },
                          //     {
                          //       text: 'Yes', onPress: () => {
                          //         removeItem(item.product._id,true)

                          //       }
                          //     },
                          //   ]
                          // );
                        }}
                      >
                        <Image
                          style={{
                            height: 17,
                            width: 19,
                            resizeMode: "contain",

                            alignSelf: "center",
                          }}
                          source={require("../../assets/images/other_icons/heart.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
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

export default Somelier;
const styles = StyleSheet.create({
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
    backgroundColor: "#fff",
    width: "90%",
  },
});
