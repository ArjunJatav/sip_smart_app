import React, { Component, useState, useEffect } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  ActivityIndicator,
  Button, ImageBackground, TextInput,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Keyboard,
  Platform
} from "react-native";
import { Image } from 'react-native-elements';
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileIcon from "../../assets/images/other_icons/iconProfile.png";
import CartIcon from "../../assets/images/other_icons/iconCart.png";
import { Rating, AirbnbRating } from 'react-native-ratings';
import ModalDropdown from "react-native-modal-dropdown";
import { FlatList } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import * as constants from "../../constants/Const";
import IconBadge from "react-native-icon-badge";
import { TextField } from "rn-material-ui-textfield";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import { EventRegister } from 'react-native-event-listeners'
import { useIsFocused, CommonActions } from "@react-navigation/native";
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

var pageNumber = 1
var extra = [];

const MarketTab = ({ route, navigation }) => {
  var token = null;

  const [isLoading, setIsLoading] = useState(false);
  //const [search, setSearch] = useState(" ");

  const [search, setSearch] = useState('');
  const [Data, setData] = useState([])
  const [sortbyid, setSortbyid] = useState(0)
  const [priceid, setPriceid] = useState('')
  const [pricefrom, setPriceFrom] = useState('')
  const [priceTo, setPriceTo] = useState('')
  const [categorylist, setCategorylist] = useState([])
  const [city, setCity] = useState("")
  const [vintage, setVintage] = useState('')
  const [refreshing, setRefreshing] = React.useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [keyboardheigh,setKeyboardHeight]=useState(0)

  const [isDataFetch, setDatafetch] = useState(false)

  
  const handleChange = (index, status) => {
    // 1. Make a shallow copy of the items
    let items = [...extra];
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...items[index] };
    // 3. Replace the property you're intested in
    item.favourite = status;
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;
    extra = items
    // 5. Set the state to our new copy
    setData(items);
  }
  const changeunit = (index, value) => {
    // 1. Make a shallow copy of the items
    let items = [...extra];
    // 2. Make a shallow copy of the item you want to mutate
    let item = { ...items[index] };
    // 3. Replace the property you're intested in
    item.unit = value;
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    items[index] = item;
    extra = items
    // 5. Set the state to our new copy
    setData(items);
  }
  const favoriteWine = async (type, api, index, status) => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);


    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);


        axios({
          method: "post",
          url: constants.baseURL + api,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            //  Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2MGY1OGFkODQzNzVlOTMyZjMzOGUxYTYiLCJ1c2VyTmFtZSI6ImVlZWVlIiwianRpIjoiNDQyMmVhY2UtODMxMy00YmM5LTlhMDUtZjRjOGI4ZDI0MWU3IiwiaWF0IjoxNjI4MDUzMTk3LCJleHAiOjE2MjgxMzk1OTd9.e3LGeYaNZ_Fc9W-44b_tFmG2AxVzBJYMiaZAnBLTfSM"

            Authorization: "Bearer " + token
          },
          data:
            api == constants.removeFavouriteItem ? {
              productId: type
            } :
              {


                productId: type,

              },

        })
          .then((response) => {
            setIsLoading(false);
            // setProductId(response.data.data)





            if (response.data.status == 200) {
              // pageNumber=1;
              // extra=[];

              Alert.alert("Alert ", response.data.message);
              handleChange(index, !status)

              // GetMarketList(search,sortbyid,categorylist,city,pricefrom,priceTo,vintage);
            }
            if (response.data.status == 400) {
              Alert.alert("Alert", response.data.message);
            }
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


  const GetMarketList = async (name, priceSort, categories, city, priceFrom, priceTo, vintage) => {
    console.log("pagenumber", pageNumber)

    token = await AsyncStorage.getItem(AUTH_TOKEN);


    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {

        console.log("name", name, "priceFrom", priceFrom, "priceTo", priceTo, "city", city, "vintage", vintage, "priceSort", priceSort)


        setIsLoading(true);
        axios({
          method: "post",
          url: constants.baseURL + constants.marketWineList,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token
          },
          data:
            JSON.stringify(

              {
                "name": name,
                "priceSort": priceSort === '0' ? '' : priceSort === '1' ? "asc" : priceSort === '' ? '' : "desc",
                "categories": categories,
                "city": city,
                "priceFrom": priceFrom,
                "priceTo": priceTo,
                "vintage": vintage,
                "grapeVariety": "",
                page: pageNumber

              }

            )

        })
          .then(function (response) {

            setIsLoading(false);
            console.log(response.data.data)
            if (pageNumber === 1) {
              extra = []
            }
            cartcount()
            if (response.data.status == 200) {
              setDatafetch(true)
              const recnames = response.data.data.wineList.map(obj => {
                extra.push(obj)
                return obj
              })

              setData(response.data.data.wineList)
            }


          })

          .catch(function (error) {
            setIsLoading(false);

          });

      };
    }

    );
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

  const BuyNow = async (id,unit,index) => {
    console.log(unit)
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

            Authorization: "Bearer " + token
          },
          data: {
            productId: id,
            quantity: parseInt(unit)
          },

        })
          .then((response) => {
            setIsLoading(false);






            if (response.data.status == 200) {
              Alert.alert("Alert ", response.data.message);
              changeunit(index,"1")
              cartcount()
              //pageNumber=1;
              //extra=[];
              //GetMarketList(search,sortbyid,categorylist,city,pricefrom,priceTo,vintage);


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
  const submitText = () => {


    extra = [];
    pageNumber = 1;




    GetMarketList(search, sortbyid, categorylist, city, pricefrom, priceTo, vintage);





  }


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    extra = [];
    pageNumber = 1;
    GetMarketList(search, sortbyid, categorylist, city, pricefrom, priceTo, vintage);
    wait(300).then(() => setRefreshing(false));
  }, []);
  const isFocused = useIsFocused();

  const onKeyboardWillShow = e => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const onKeyboardWillHide = () => {
    setKeyboardHeight(0);
  };

  
  useEffect(() => {
    setDatafetch(false)
    setData([])

    extra = [];
    pageNumber = 1;

    GetMarketList(search, sortbyid, categorylist, city, pricefrom, priceTo, vintage);





    const list = EventRegister.addEventListener('filter updated', (data) => {


      extra = [];
      pageNumber = 1;

      setSortbyid(data.sorting);
      setPriceFrom(data.pricefrom)
      setPriceTo(data.priceTo)
      setCategorylist(data.categorylist)
      setCity(data.city)
      setVintage(data.vintage)
      setPriceid(data.priceid)




      //GetMarketList(search,data.sorting,data.categorylist,data.city,data.pricefrom,data.priceTo,data.vintage);
    })

    const list2 = EventRegister.addEventListener('wine detail updated', (data) => {

      extra = [];
      pageNumber = 1;




      GetMarketList(search, sortbyid, categorylist, city, pricefrom, priceTo, vintage);
    })

    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', onKeyboardWillShow);
      Keyboard.addListener('keyboardWillHide', onKeyboardWillHide);
    }

   
    return () => {


      EventRegister.removeEventListener(list);
      EventRegister.removeEventListener(list2);
      if (Platform.OS === 'ios') {
        Keyboard.removeListener('keyboardWillShow', onKeyboardWillShow);
        Keyboard.removeListener('keyboardWillHide', onKeyboardWillHide);
      }
    }


    //getToken();

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
            backgroundColor: "#FFFFFF",
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            marginBottom: 5,
            width: "100%",
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
                Market
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
              <View
                style={{ height: "100%", width: "50%", }}
              >
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 48,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate("UserProfile")}>
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

              <View
                style={{ height: "100%", width: "50%", }}
              >
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
            marginLeft: '5%', marginTop: 8,
            marginBottom: 8,
            marginRight: 16,
            width: '100%',
            flexDirection: "row",
          }}
        >


          <View
            style={{
              height: 49,
              width: '70%',
              marginTop: 10,
              alignItems: "center",
              //   justifyContent: "center",
              backgroundColor: "#DCC7B7",
              borderRadius: 10,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity>
              <Image style={{
                height: 17, width: 19, resizeMode: "contain", marginLeft: 17,

                alignSelf: "center"

              }}
                source={require("../../assets/images/other_icons/search.png")} />
            </TouchableOpacity>

            <TextInput
              placeholder='Search Wine'
              placeholderTextColor={'black'}


              style={{ height: 40, padding: 0, color: 'gray', fontSize: 14, width: '75%' }}
              onChangeText={(search) => {

                if (search.length == 0) {
                  setSearch('')
                  extra = [];
                  pageNumber = 1;
                  setData([])

                  //  Searchwine('')

                }
                else {

                  setSearch(search)

                }

              }


              }
              returnKeyType='search'
              onSubmitEditing={submitText}
              value={search}
            />

            <TouchableOpacity

              style={{
                height: 22,
                width: 22,
                padding: 2,
                alignItems: 'center',
                backgroundColor: "#9F2241",
                borderRadius: 12,
              }}
              onPress={() => {
                setSearch('')
                extra = [];
                pageNumber = 1;

                GetMarketList("", sortbyid, categorylist, city, pricefrom, priceTo, vintage);
              }}
            >
              <Image style={{
                height: 19, width: 19, resizeMode: "contain",

                alignSelf: "center"

              }}
                source={require("../../assets/images/other_icons/close.png")} />
            </TouchableOpacity>

          </View>
          <View style={{
            height: 49, width: '15%',
            backgroundColor: city === "" && vintage === "" && sortbyid === 0 && priceid === "" && pricefrom === "" && priceTo === "" && categorylist.length <= 0 ? "#DCC7B7" : "#e0b390", borderRadius: 10, marginLeft: 16,
            justifyContent: "center", alignItems: "center", marginTop: 10,
            marginRight: '10%'
          }}>
            <TouchableOpacity onPress={() => navigation.navigate("Filter", {
              City: city,
              Vintage: vintage,
              Sortbyid: sortbyid,
              Priceid: priceid,
              PriceFrom: pricefrom,
              PriceTo: priceTo,
              Categorylist: categorylist
            })}>
              <Image style={{
                height: 17, width: 19, resizeMode: "contain",

                alignSelf: "center"

              }}
                source={require("../../assets/images/other_icons/filter.png")} />
            </TouchableOpacity>


          </View>
        </View>


        <FlatList
        style={{marginBottom:keyboardheigh}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={extra}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={
            () => {
              return (
                <View style={{ alignSelf: 'center', justifyContent: 'center', marginTop: '50%' }} >
                  <Text style={{ color: '#9F2241', fontSize: 20, fontFamily: "HelveticaNeue" }}>{isDataFetch ? "No Record Found." : ""}</Text>
                </View>
              )
            }
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={'#9F2241'} colors={['#9F2241', '#9F2241', '#9F2241']}
              onRefresh={onRefresh}
            />
          }


          onEndReachedThreshold={0}

          onEndReached={() => {


            if (pageNumber == 1) {
              //  setLoader2(false)
            }
            else {
              // setLoader2(true)
            }



            pageNumber = pageNumber + 1

            GetMarketList(search, sortbyid, categorylist, city, pricefrom, priceTo, vintage);
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
                  flexDirection: "row",
                }}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("WineDetailScreen", {
                  productId: item._id,
                  button: 'Add To Cart',
                  api: constants.WineDetails
                })}
              >
                <View style={styles.formOuter}>
                  {/* 2.1 */}

                  <View
                    style={{
                      margin: 16,
                      height: 170,
                      width: '90%',
                      flexDirection: "row",
                      shadowColor: "black",
                      borderRadius: 10,
                      backgroundColor: "#F5EFEB",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ marginTop: 17, marginLeft: '5%', width: '30%' }}>
                      <Image
                        resizeMode='cover'
                        style={{
                          height: '96%',
                          width: '100%',

                        }}

                        // source={item.img}
                        PlaceholderContent={<ActivityIndicator animating={true} size={"small"} color="#000000" />}
                        source={{ uri: item.images[0] }}
                      />
                    </View>



                    <View
                      style={{
                        height: 104,
                        width: '55%',
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
                            fontSize: 12, textAlign: 'center'
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
                          style={{ paddingVertical: 10, marginLeft: 12, marginRight: 12, }}
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

                  <Text
                    style={{
                      fontFamily: "HelveticaNeue",
                      fontSize: 12,
                      color: "#000",
                      fontWeight: "300",
                      marginHorizontal: 16,
                    }}
                  >
                    {"Sold by"} {item.user.name}
                  </Text>
                  <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // alignItems:"center",
                    marginHorizontal: 16
                  }}>


                    <View
                      style={{
                        height: 40,
                        width: 150,
                        marginTop: 12,
                        marginHorizontal: 16,
                        marginBottom: 10,
                        flexDirection: "row",
                        justifyContent: "center",


                      }}
                    >
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
                        <TextInput style={{
                         

                          alignItems: "center", textAlign: 'center',
                        }}
                          value={item.unit.toString()}
                          

                          onChangeText={(text) => changeunit(index,text)} placeholder={""}
                          keyboardType={"number-pad"}
                          returnKeyType="done" />

                      </View>
                      <TouchableOpacity onPress={() => {

                        if(item.unit===""){
                          Alert.alert("Alert", "Please enter quantity");

                        }
                        else if(item.unit==="0"){
                          Alert.alert("Alert", "Please enter quantity");

                        }
                        
                        else{
                          BuyNow(item._id,item.unit,index)

                        }
                        // Alert.alert(
                        //   '',

                        //     'Are you sure you want to add this wine in cart ? ',
                        //   [
                        //     {
                        //       text: 'No',
                        //       onPress: () => console.log('Cancel Pressed'),

                        //     },
                        //     {
                        //       text: 'Yes', onPress: () => {
                        //         BuyNow(item._id)
                        //       }
                        //     },
                        //   ]
                        // );




                      }}>
                        <Text style={{
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
                        }}>Buy Now</Text>
                      </TouchableOpacity>
                    

                    </View>

                    <TouchableOpacity onPress={() => {
                      handleChange(index)

                      favoriteWine(
                        item._id, item.favourite == true ? constants.removeFavouriteItem : constants.addFavouriteProduct, index, item.favourite)




                      // Alert.alert(
                      //   '',

                      //   item.favourite == false ? 'Are you sure you want to add this wine in favourite list' :

                      //     'Are you sure you want to remove this wine from favourite list ? ',
                      //   [
                      //     {
                      //       text: 'No',
                      //       onPress: () => console.log('Cancel Pressed'),

                      //     },
                      //     {
                      //       text: 'Yes', onPress: () => {
                      //         favoriteWine(
                      //           item._id, item.favourite == true ? constants.removeFavouriteItem : constants.addFavouriteProduct)



                      //       }
                      //     },
                      //   ]
                      // );
                    }

                    }>
                      <View style={{
                        height: 40,
                        width: 40,
                        marginTop: 12,
                        backgroundColor: item.favourite == false ? "#DCC7B7" : "#9f2241",
                        borderRadius: 6,
                        justifyContent: "center",
                        alignItems: "center",

                        //  marginRight: 12,
                      }}>

                        <Image style={{
                          height: 17, width: 19, resizeMode: "contain",

                          alignSelf: "center"

                        }}
                          source={require("../../assets/images/other_icons/heart.png")} />



                      </View>
                    </TouchableOpacity>

                  </View>



                </View>

              </TouchableOpacity>

            )
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

export default MarketTab;
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
    width: '90%',
  },
});