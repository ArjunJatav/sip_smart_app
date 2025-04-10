import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Share,
  FlatList,
  TextInput,
  KeyboardAvoidingView

} from "react-native";

import backArrow from "../../assets/images/Profile_icons/profileIcon.png";

import { SliderBox } from "react-native-image-slider-box";
import { Rating } from "react-native-ratings";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import * as constants from "../../constants/Const";
import { useIsFocused, CommonActions,TabActions } from "@react-navigation/native";
import renderIf from "../InitialController/renderIf";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import moment from "moment";

import backImage from "../../assets/images/other_icons/back.png";
import ShareIcon from "../../assets/images/other_icons/ShareIcon.png";

import edit from "../../assets/images/other_icons/edit.png";
import iconNotLike from "../../assets/images/other_icons/iconnotLike.png";

import iconGlaass from "../../assets/images/Bottle/iconGlass.png";
import iconBottle from "../../assets/images/Bottle/iconBottle.png";
import { EventRegister } from 'react-native-event-listeners'
import { TextField } from "rn-material-ui-textfield";
import Vieworder from "./ViewOrder";
var token = null;
//export default class WineDetailScreen extends React.Component {
const WineDetailScreen = ({ route, navigation }) => {
  var productId = null;

  productId = route.params.productId;
  var favourite = false;
  var button = route.params.button;
  var api = route.params.api;


  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [image, setImage] = useState([]);
  const [category, setCategory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [sellername,setSellername]=useState("")
  const [price, setPrice] = useState("");
  const [unit,setUnit]=useState("1")
  const model=(id,type)=>{
    setModalVisible(type)
    

  }

  const AddToListed = async () => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);
    console.log("detailis saved")

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);
        console.log("responsebbbbbbbbb", token);

        axios({
          method: "post",
          url: constants.baseURL + constants.ProductSellToMarket,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          //  Authorization:"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2MGY1OGFkODQzNzVlOTMyZjMzOGUxYTYiLCJ1c2VyTmFtZSI6ImVlZWVlIiwianRpIjoiNDQyMmVhY2UtODMxMy00YmM5LTlhMDUtZjRjOGI4ZDI0MWU3IiwiaWF0IjoxNjI4MDUzMTk3LCJleHAiOjE2MjgxMzk1OTd9.e3LGeYaNZ_Fc9W-44b_tFmG2AxVzBJYMiaZAnBLTfSM"

            Authorization:"Bearer " + token
          },
          data: {

            quantity:quantity,
          
            price:price,

            productId: productId,
         
          },
        })
          .then((response) => {
            setIsLoading(false);
          
            console.log("gggggggggggggggggggggggggggggggg", response.data)



            setIsLoading(false);

            if (response.data.status == 200) {
            
setQuantity('')
setPrice('')
              Alert.alert("Alert", response.data.message);



                   navigation.goBack()
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


  const favoriteWine = async (type,api,bul) => {

 
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
              api==constants.removeFavouriteItem?{
                productId:type
              }:
              {
    
    
                productId: type,
    
              },
    
            })
              .then((response) => {
                setIsLoading(false);
                // setProductId(response.data.data)
                console.log("responsedatajjjjjjjjjjsaneesh", response.data);
       
    
    
    
                setIsLoading(false);
    
                if (response.data.status == 200 ) {
                
                

                  if(bul===false)
                  {
                    navigation.pop();
                  }
                  else{
                    Alert.alert("Alert ",response.data.message);
                    AddToSeller()
                  }
                  //AddToSeller();
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




  const AddToSeller = async () => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);
   

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);
        console.log("responsebbbbbbbbb", token);

        axios({
          method: "post",
          url: constants.baseURL + api,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          //  Authorization:"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2MGY1OGFkODQzNzVlOTMyZjMzOGUxYTYiLCJ1c2VyTmFtZSI6ImVlZWVlIiwianRpIjoiNDQyMmVhY2UtODMxMy00YmM5LTlhMDUtZjRjOGI4ZDI0MWU3IiwiaWF0IjoxNjI4MDUzMTk3LCJleHAiOjE2MjgxMzk1OTd9.e3LGeYaNZ_Fc9W-44b_tFmG2AxVzBJYMiaZAnBLTfSM"

            Authorization:"Bearer " + token
          },
          data: {

       
            productId: productId,
         
          },
        })
          .then((response) => {
            setIsLoading(false);
            console.log("gggggggggggggggggggggggggggggggg", response.data.data.user)
            //  setProductId(response.data.data)
            setImage(response.data.data.images)
            setCategory(response.data.data.category)
            setData(response.data.data)
            setSellername(response.data.data.user.name)
          



            setIsLoading(false);

            if (response.data.status == 200) {
            //  Alert.alert("Alert", response.data.message);

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

    AddToSeller();
    //getToken();

  }, [isFocused]);

  const BuyNow = async (id,type) => {
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
            //  Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2MGY1OGFkODQzNzVlOTMyZjMzOGUxYTYiLCJ1c2VyTmFtZSI6ImVlZWVlIiwianRpIjoiNDQyMmVhY2UtODMxMy00YmM5LTlhMDUtZjRjOGI4ZDI0MWU3IiwiaWF0IjoxNjI4MDUzMTk3LCJleHAiOjE2MjgxMzk1OTd9.e3LGeYaNZ_Fc9W-44b_tFmG2AxVzBJYMiaZAnBLTfSM"

            Authorization: "Bearer " + token
          },
          data: {
            productId: id,
            quantity:parseInt(unit)
          },

        })
          .then((response) => {
            setIsLoading(false);
            // setProductId(response.data.data)
            console.log("responsedatajjjjjjjjjjsaneesjjjjjjjjjjjjjjjjjjjjjjjjh", response.data);




            setIsLoading(false);

            if (response.data.status == 200) {

             

              if(type===true)
              {
                Alert.alert("Alert ", response.data.message);
                EventRegister.emit('wine detail updated', 'detail');

                navigation.pop();
              }
              else{
                Alert.alert("Alert ", 'Item moved to cart successfully!');
                navigation.pop();

                //favoriteWine(id,constants.removeFavouriteItem,type)
              }

            

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
            //  Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2MGY1OGFkODQzNzVlOTMyZjMzOGUxYTYiLCJ1c2VyTmFtZSI6ImVlZWVlIiwianRpIjoiNDQyMmVhY2UtODMxMy00YmM5LTlhMDUtZjRjOGI4ZDI0MWU3IiwiaWF0IjoxNjI4MDUzMTk3LCJleHAiOjE2MjgxMzk1OTd9.e3LGeYaNZ_Fc9W-44b_tFmG2AxVzBJYMiaZAnBLTfSM"

            Authorization: "Bearer " + token
          },
          data: {
            productId: id
          },

        })
          .then((response) => {
            setIsLoading(false);
            // setProductId(response.data.data)
            console.log("responsedatajjjjjjjjjjsaneesjjjjjjjjjjjjjjjjjjjjjjjjh", response.data);




            setIsLoading(false);

            if (response.data.status == 200) {

              Alert.alert("Alert ", response.data.message);
              navigation.pop();

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
            style={{ width: "60%", height: "100%", justifyContent: "center" }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#000",
                alignSelf: "center",
                fontWeight: "bold",
                alignSelf: "center",
                textAlign: "center",
                fontFamily: "HelveticaNeue",
              }}
            >
            {data.name}{" - "}{data.MFG}

            </Text>
          
          </View>
          
          
               <View
            style={{
              height: "100%",
              width: "10%",
              flexDirection: "row",
              justifyContent: "center",
              
              alignItems: "center",
            }}

        
          >
{button==='Sell' || button==='Delete' ?<TouchableOpacity
              style={{
                width: 25,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.7}
              onPress={() => {


                navigation.navigate("EditWine",{
                  type:route.params.button==="Delete"?"admin":data.addType,
                 // type:"admin",
                  id:data._id,
                MFG: moment(data.MFG).format("YYYY")
                
               ,
               flowtype:route.params.button==="Sell"?"inventory":"listed",
                alcohal_prec:data.alcohol_percentage,
                category:data.category._id,
                catname:data.category.name,
                category:data.category,
                history:data.history,
                images:data.images,
                ingredients:data.ingredients,
                name:data.name,
                relevant_links:data.relevant_link,
                star_rating:data.star_rating,
                quantity:route.params.button==="Sell"?data.quantity:data.sale_quantity,
                price:route.params.button==="Sell"?data.price:data.sale_price,
                city:data.city,
                country:data.country_code
                })

              }}
            >
              <Image
                source={edit}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
            </TouchableOpacity>:<View></View>}

          </View>
          <View
            style={{
              height: "100%",
              width: "10%",
              flexDirection: "row",
              justifyContent: "center",
              
              alignItems: "center",
            }}
          >
            
            <TouchableOpacity
              style={{
                width: 40,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.7}
              onPress={() => {


                Share.share({
                  message: "Hi There!\n"+'I found this wine "'+ data.name.trim()+'" which might be of your interest.\n'+"Check this out.\n"+"LINK of app\n",

                  url:"Hi There!\n"+'I found this wine "'+ data.name + '"which might be of your interest.\n'+"Check this out.+\n"+"LINK of app+\n"
                  
                
                })
                  //after successful share return result
                  .then(result => {
                   
                  })
                  //If any thing goes wrong it comes here
                  .catch(errorMsg => console.log(errorMsg));

              }}
            >
              <Image
                source={ShareIcon}
                style={{
                  height: 20,
                  width: 30,
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
          alignItems: "center",
        }}
      >
                <KeyboardAvoidingView
                  keyboardVerticalOffset={20}
                  behavior={Platform.OS === "ios" ? "padding" : "padding"}
                >


        <ScrollView
          style={{
            width: "90%",
            marginBottom: 30,
            backgroundColor: "#fff",
            borderRadius: 10,
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              width: "100%",
              // height: 280,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                marginTop: 15,
                width: 280,
                height: 250,
                backgroundColor: "#F5EFEB",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SliderBox
                images={image}
                style={{width:280,height:200, alignSelf: "center",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                justifyContent: "center",
              }}
                sliderBoxHeight={"100%"}
                onCurrentImagePressed={(index) =>
                  console.log(`image ${index} pressed`)
                }
                dotColor={"#9F2241"}
                inactiveDotColor="#DCC7B7"
                resizeMode={"cover"}
                paginationBoxStyle={{
                  position: "absolute",
                  bottom: 10,
                  padding: 5,
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                }}
                dotStyle={{
                  width: 15,
                  height: 8,
                  borderRadius: 5,
                  marginHorizontal: 0,
                  padding: 0,
                  margin: 0,
                }}
                imageLoadingColor="#9F2241"
              />
            </View>

            <Text
              style={{
                marginTop: 20,
                fontFamily: "HelveticaNeue",
                fontSize: 24,
                color: "#000",

                fontWeight: "bold",
                alignSelf:'flex-start',
                marginLeft:10,
                width:'70%'
              }}
            >
              {/* Vega Sicilia Oremus Furmint Dry Mandolas - 2018 */}
              {data.name}{" - "}{data.MFG}
            </Text>
            {button==='Add To Cart'||button==='Move To Cart' ? <Text
                  style={{
                    fontFamily: "HelveticaNeue",
                    fontSize: 12,
                    alignSelf:'flex-start',
                    color: "#000",
                    fontWeight: "300",
                    marginLeft:10,
                  }}
                >
                {"Sold by"} {sellername}
                </Text>:<View></View>}
            <View
              style={{
                width: "98%",
                marginTop: 15,
                height: 50,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: "80%",
                  height: "100%",
                  backgroundColor: "#fff",
                  alignSelf: "flex-start",
                  flexDirection:'row',
                 
                }}
              >
                  <View pointerEvents="none">
                <Rating
                  type="custom"
                  ratingColor="#9f2241"
                  ratingBackgroundColor="#c8c7c8"
                  ratingCount={5}
                  imageSize={15}
                  startingValue={data.star_rating}
                  // onFinishRating={this.ratingCompleted}
                  style={{ padding: 10 }}
                />
</View>
{/* <View style={{height:30,backgroundColor:'#DCC7B7',borderTopStartRadius:100,borderBottomStartRadius:100,width:100}}>


</View> */}


              </View>

              {button==='Add To Cart'||button==='Move To Cart'?(
                    <View style={{
                  height: 40,
                  width: 40,
                  backgroundColor: data.favourite==false? "#DCC7B7":"#9f2241",
                  borderRadius: 6,
                  justifyContent: "center",
                  alignItems: "center",
                 
                //  marginRight: 12,
                  }}>
                   <TouchableOpacity onPress={() => 
                        
                        {
                          favoriteWine(
                            data._id,data.favourite==true?constants.removeFavouriteItem:constants.addFavouriteProduct,true)
  
                    //       Alert.alert(
                    //         '',
  
                    //         data.favourite==false?'Are you sure you want to add this item in favourite list':
                    
                    //         'Are you sure you want to remove this item from favourite list ? ',
                    //         [
                    //           {
                    //             text: 'No',
                    //             onPress: () => console.log('Cancel Pressed'),
                    
                    //           },
                    //           {
                    //             text: 'Yes', onPress: () => {
                    //          favoriteWine(
                    //                     data._id,data.favourite==true?constants.removeFavouriteItem:constants.addFavouriteProduct,true)
                    // //  console.warn(item)
                    
                    
                    
                    //             }
                    //           },
                    //         ]
                    //         );
                        }
                          
                      }>
                          <Image style={{
                            height: 17, width: 19, resizeMode: "contain",
  
                            alignSelf: "center"
  
                          }}
                            source={require("../../assets/images/other_icons/heart.png")} />
                        </TouchableOpacity>


                  </View>
          ):(<View></View>)}
  </View> 
  <View
                        style={{
                          width: "98%",
                          height: 50,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
 <Image
                          source={iconGlaass}
                          style={{
                            height: 30,
                            width: 30,
                            marginLeft: 10,
                            marginRight: 10,
                            resizeMode: "contain",
                            alignSelf: "center",
                          }}
                        />


<FlatList
          
          data={category}
          showsHorizontalScrollIndicator={false}
       
          keyExtractor={(item, index) => index}
          horizontal
          

          
         
          renderItem={({ item, index }) => {
           

            return (
           
           <View style={{backgroundColor:'#9F2241',marginRight:10,borderRadius:16}}>

<Text style={{  fontFamily: "HelveticaNeue",color:'white',padding:8,fontSize:10}}>{
                        // item.name

item.name
                          
                       
                          
                          
                         
                       }</Text>

                       
           </View>
              
           
            )}}
        />





                    </View>
           

           





            <View
              style={{
                width: "98%",
                height: 50,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={iconBottle}
                style={{
                  height: 30,
                  width: 30,
                  marginLeft: 10,
                  marginRight: 10,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />

              <Text style={{ color: "black",  fontFamily: "HelveticaNeue", }}>No. of Units </Text>

              {button==='Sell'?(   <Text style={{ color: "#9f2241",  fontFamily: "HelveticaNeue", }}>{data.quantity}</Text>):(   <Text style={{ color: "#9f2241",  fontFamily: "HelveticaNeue", }}>{data.sale_quantity}</Text>)}
           
            </View>

            <View
              style={{
                width: "98%",
                height: 50,
                flexDirection: "row",
                alignItems: "center",
              }}
            >



{button==='Sell'?(   <Text
                style={{ marginLeft: 10, fontSize: 24, fontWeight: "700",color: "black",  fontFamily: "HelveticaNeue" }}
              >
              {"$"+data.price}
              </Text>):(   <Text
                style={{ marginLeft: 10, fontSize: 24, fontWeight: "700",color: "black",  fontFamily: "HelveticaNeue" }}
              >
              {"$"+data.sale_price}
              </Text>)}
           
              
              <Text
                style={{ color: "#9f2241", fontSize: 18, fontWeight: "300", fontFamily: "HelveticaNeue" }}
              >
               {" "} Per Unit
              </Text>
            </View>

            <View
              style={{
                width: "93%",
                height: 60,
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 8,
                backgroundColor: "#F5EFEB",
              }}
            >
              <View
                style={{
                  width: "33%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRightWidth: 0.5,
                  borderRightColor:"#d6d5d4"
                }}
              >
                <Text style={{ fontWeight: "300", fontSize: 13 ,  color: "#9f2241",  fontFamily: "HelveticaNeue"}}>
                  Country
                </Text>
                <Text
                  style={{
                    marginTop:3,
                    color: "black",
                    fontWeight: "300",
                    fontSize: 13,
                    fontFamily: "HelveticaNeue"
                  }}
                >
                {data.country_code}
                </Text>
              </View>

              <View
                style={{
                  width: "34%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRightWidth: 0.5,
                  borderRightColor: "#d6d5d4",
                }}
              >
                <Text style={{ fontWeight: "300", fontSize: 14,  color: "#9f2241", fontFamily: "HelveticaNeue" }}>City</Text>
                <Text
                  style={{
                    color: "black",
                    fontWeight: "300",
                    fontSize: 13,
                    marginTop:3,
                    fontFamily: "HelveticaNeue"
                  }}
                >
                {data.city}
                </Text>
              </View>

              <View
                style={{
                  width: "33%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontWeight: "300", fontSize: 14,  color: "#9f2241" , fontFamily: "HelveticaNeue" }}>
                  Alcohol
                </Text>
                <Text
                  style={{
                    marginTop:3,
                    color: "black",
                    fontWeight: "300",
                    fontSize: 14,
                    fontFamily: "HelveticaNeue"
                  }}
                >
              {data.alcohol_percentage+"%"}
                </Text>
              </View>
            </View>

            <View
              style={{
                borderRadius: 8,
                backgroundColor: "#F5EFEB",
                width: "93%",
                padding: 10,
                marginTop: 10,
              }}
            >
              <Text
                style={{ color: "#9f2241", fontWeight: "300", fontSize: 14 , fontFamily: "HelveticaNeue"}}
              >
                Ingredients
              </Text>
              <Text
                style={{
                  paddingTop: 10,
                  fontWeight: "300",
                  fontSize: 14,
                  fontFamily: "HelveticaNeue"
                }}
              >
              {data.ingredients}
              </Text>
            </View>

            <View
              style={{
                borderRadius: 8,
                backgroundColor: "#F5EFEB",
                width: "93%",
                padding: 10,
                marginTop: 10,
              }}
            >
              <Text
                style={{ color: "#9f2241", fontWeight: "300", fontSize: 14 , fontFamily: "HelveticaNeue"}}
              >
                Relevant links
              </Text>
              <Text
                style={{
                  paddingTop: 10,
                  fontWeight: "300",
                  fontSize: 14,
                  fontFamily: "HelveticaNeue"
                }}
              >
              {data.relevant_link}
              </Text>
            </View>

            <View
              style={{
                borderRadius: 8,
                backgroundColor: "#F5EFEB",
                width: "93%",
                padding: 10,
                marginTop: 10,
              }}
            >
              <Text
                style={{ color: "#9f2241", fontWeight: "300", fontSize: 14, fontFamily: "HelveticaNeue" }}
              >
                History & Details
              </Text>
              <Text
                style={{
                  paddingTop: 10,
                  fontWeight: "300",
                  fontSize: 14,
                  fontFamily: "HelveticaNeue"
                }}
              >
             {data.history}
              </Text>
            </View>

           <View
           style={{flexDirection:"row",alignContent:"space-between"}}
           
           >

{button==='Add To Cart' ||button==='Move To Cart'  ?
renderIf(
  data.sale_quantity > 0,
<View
                        style={{
                          borderColor: '#9f2241',
                          borderWidth: 1,
                          height: 50,
                          alignItems: "center",

                          marginTop: 10,

                          marginLeft: 10,
                          width:80,
                         

                          borderRadius: 10,
                          justifyContent: "center",

                        }}
                      >
                        <TextInput style={{
                          

                          alignItems: "center", textAlign: 'center',width:80
                        }}
                          value={unit}
                          

                          onChangeText={(text) => setUnit(text)} placeholder={""}
                          keyboardType={"number-pad"}
                          returnKeyType="done" />

                      </View>):<View></View>}
         { button==="Move To Cart" && data.sale_quantity <= 0? <View
                          style={{
                            height: 40,
                            justifyContent: "center",
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
                        </View>:
            <TouchableOpacity  style={{
                borderRadius: 8,
                backgroundColor: "#fff",
                flex:1,
                marginLeft: 10,
                marginRight: 10,

                height: 90,
                marginTop: 20,
                bottom:10,
                justifyContent: "center",
                alignItems: "center",
              }} onPress={() => 
                  {



                    if(button==='Add To Cart')
                    {
                      if(unit===""){
                        Alert.alert("Alert", "Please enter quantity");

                      }
                      else if(unit==="0"){
                        Alert.alert("Alert", "Please enter quantity");

                      }
                      else{
                        BuyNow(productId,true)

                      }
                    }
                    else if(button==='Sell')
                    {
                      model(productId,true)
                    }
                  else if(button==='Delete')
                    {
                      Alert.alert(
                        '',
  
                      
                
                        'Are you sure you want to delete this item from market ? ',
                        [
                          {
                            text: 'No',
                            onPress: () => console.log('Cancel Pressed'),
                
                          },
                          {
                            text: 'Yes', onPress: () => {
                              deleteitem(productId)
                
                            }
                          },
                        ]
                        );
                    }

                    else if(button==='Move To Cart')
                    {
                      if(unit===""){
                        Alert.alert("Alert", "Please enter quantity");

                      }else{
                        BuyNow(productId,false)

                      }

                      // Alert.alert(
                      //   '',
  
                      
                
                      //   'Are you sure you want to move this item in cart ? ',
                      //   [
                      //     {
                      //       text: 'No',
                      //       onPress: () => console.log('Cancel Pressed'),
                
                      //     },
                      //     {
                      //       text: 'Yes', onPress: () => {
                      //         BuyNow(productId,false)
                
                      //       }
                      //     },
                      //   ]
                      //   );
                    }
              
                  }
                  
                  
                  
                 }>
                   
            <View
              style={{
               
                width: "100%",
                height: '100%',
               
              }}
            >
              <View
                style={{
                  width: "98%",
                  height: 50,
                  borderRadius: 8,
                  backgroundColor: "#9f2241",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
               
                  <Text style={{ color: "#fff", fontWeight: "300", fontSize: 18, fontFamily: "HelveticaNeue" }}>
                   {button}
                  </Text>
               

              </View>
            </View>
            </TouchableOpacity>}
            </View>
            <Modal animationType="slide"
                    transparent visible={modalVisible}
                    
                >
                    <View style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                    }}>
                        <View style={{
                            alignItems: "center",
                            justifyContent: "center",
                            position: "absolute",
                            top: "30%",
                            left: "50%",
                            elevation: 5,
                            transform: [{ translateX: -(deviceWidth * 0.4) },
                            { translateY: -90 }],
                            height: 200,
                            width: deviceWidth * 0.8,
                            backgroundColor: "#fff",
                           
                        }}>

                            <View style={{ alignItems: "center", width: '100%', }}>
                           
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
                returnKeyLabel='Done' 
                returnKeyType='done' 
              
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
                returnKeyLabel='Done' 
                returnKeyType='done' 
              
                labelTextStyle={{
                  fontFamily: "HelveticaNeue",
                  fontWeight: "300",
                }}
              />
              
              
              
              
              
              
              </View>

                         
                         
                         
                         
                         
                         
                         
                         
                         
                         
                         
                         
                           {/* <View
                                    style={{
                                        height: 1,
                                        width: "100%",

                                        marginBottom: 10,


                                        backgroundColor: 'gray',
                                    }}
                                /> */}


                            <View style={{
                                flexDirection: 'row',
                                marginTop:10,


                               
                                width: "100%",
                                justifyContent: 'flex-end',



                            }}>


                                <View style={{ marginRight: 16, alignItems: "flex-start", width: '30%' }}>
                                <TouchableOpacity 

onPress={() => {

  setModalVisible(!modalVisible)

  setQuantity('')
  setPrice('')
  
}}
                                    style={{  width: '100%',height:30,
                                    marginRight:10,
                                    width:80, borderRadius: 20,
                                   color:"white",
                                 
                         
                                 justifyContent:"center",
                                    backgroundColor:"#9f2241",
                                  
                                  
                                    padding: 5,
                                    elevation: 2 }}
                                    
                                    
                                    >
                                    <Text style={{  textAlign:"center",color: 'white', fontSize: 14, fontFamily: 'HelveticaNeue' }}>Cancel</Text>
                                </TouchableOpacity>

                                </View>
                                <View style={{ marginLeft: 16,  alignItems: 'flex-end', width: '50%' }}>
                                    <TouchableOpacity 
                                     onPress={() => { if(quantity==='')
                                     {
                                       Alert.alert("Alert", 'Please enter quantity for sell');
                                     }
                                     else if(price==='')
                                     {
                                       Alert.alert("Alert", 'Please enter price per unit for sell');
                                     }
                                     else{
                                       setModalVisible(!modalVisible)
                                       AddToListed()
                                     }
                                    
                                    }}
                                    style={{  width: '80%',height:30,
                                    marginRight:10,
                                    width:80, borderRadius: 20,
                                   color:"white",
                                 
                         
                                 justifyContent:"center",
                                    backgroundColor:"#9f2241",
                                  
                                  
                                    padding: 5,
                                    elevation: 2 }}
                                  >
                                        <Text style={{   textAlign:"center",color: 'white', fontSize: 14, fontFamily: 'HelveticaNeue' }}>Ok</Text>

                                    </TouchableOpacity>



                                </View>

                            </View>

                        </View>
                    </View>
                </Modal>

 
        

        
        
        
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>



      {isLoading && (
          <View
            style={{
              position: "absolute",
              backgroundColor: "rgba(52, 52, 52, 0.5)",
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
  );
}
//}
export default WineDetailScreen;