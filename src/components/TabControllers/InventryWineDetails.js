import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert, StyleSheet,
  Pressable

} from "react-native";

import backArrow from "../../assets/images/Profile_icons/profileIcon.png";
import { TextField } from "rn-material-ui-textfield";
import { SliderBox } from "react-native-image-slider-box";
import { Rating } from "react-native-ratings";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import * as constants from "../../constants/Const";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import backImage from "../../assets/images/other_icons/back.png";
import ShareIcon from "../../assets/images/other_icons/ShareIcon.png";

import iconLike from "../../assets/images/other_icons/iconLike.png";
import iconNotLike from "../../assets/images/other_icons/iconnotLike.png";

import iconGlaass from "../../assets/images/Bottle/iconGlass.png";
import iconBottle from "../../assets/images/Bottle/iconBottle.png";
import { Modal } from "react-native";


var token = null;
const InventryWineDetails = ({ route, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  var productId = null;

  productId = route.params.productId;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const AddToListed = async () => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);
    console.log("detailis saved")

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

            Authorization: "Bearer " + token
          },
          data: {

            quantity: quantity,

            price: price,

            productId: productId,

          },
        })
          .then((response) => {
            setIsLoading(false);
            setData(response.data.data)



            setIsLoading(false);

            if (response.data.status == 200) {
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








  const WineDetails = async () => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);

        axios({
          method: "post",
          url: constants.baseURL + constants.userProductDetails,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token
          },
          data: {


            productId: productId,

          },
        })
          .then((response) => {
            setIsLoading(false);





            if (response.data.status == 200) {
              setImage(response.data.data.images)
              setData(response.data.data)


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

  useEffect(() => {

    WineDetails();

  }, []);

  const [image, setImage] = useState([
  ])

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
              Oremus Mandolas...

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
              onPress={() => console.log("Share Clicked")}
            >
              <Image
                source={ShareIcon}
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
          alignItems: "center",
        }}
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
                sliderBoxHeight={"100%"}
                onCurrentImagePressed={(index) =>
                  console.log(`image ${index} pressed`)
                }
                dotColor={"#9F2241"}
                inactiveDotColor="#DCC7B7"
                resizeMode={"center"}
                paginationBoxStyle={{
                  position: "absolute",
                  bottom: 10,
                  padding: 0,
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
                imageLoadingColor="#2196F3"
              />
            </View>

            <Text
              style={{
                marginTop: 20,
                fontFamily: "HelveticaNeue",
                fontSize: 24,
                color: "#000",

                fontWeight: "bold",
              }}
            >
              {/* Vega Sicilia Oremus Furmint Dry Mandolas - 2018 */}
              {data.name}
            </Text>

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
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <Rating
                  type="custom"
                  ratingColor="#9f2241"
                  ratingBackgroundColor="#c8c7c8"
                  ratingCount={5}
                  imageSize={15}
                  // onFinishRating={this.ratingCompleted}
                  style={{ padding: 10 }}
                />
              </View>



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

              <Text>White Wine</Text>
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

              <Text>No. of Units </Text>
              <Text style={{ color: "#9f2241" }}>{data.quantity}</Text>
            </View>

            <View
              style={{
                width: "98%",
                height: 50,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{ marginLeft: 10, fontSize: 24, fontWeight: "700" }}
              >
                {data.price}
              </Text>
              <Text
                style={{ color: "#9f2241", fontSize: 18, fontWeight: "300" }}
              >
                Per Unit{" "}
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
                  borderRightWidth: 0.7,
                  borderRightColor: "#E5E5E5",
                }}
              >
                <Text style={{ fontWeight: "300", fontSize: 14 }}>
                  Country
                </Text>
                <Text
                  style={{
                    color: "#9f2241",
                    fontWeight: "300",
                    fontSize: 14,
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
                  borderRightWidth: 0.7,
                  borderRightColor: "#E5E5E5",
                }}
              >
                <Text style={{ fontWeight: "300", fontSize: 14 }}>City</Text>
                <Text
                  style={{
                    color: "#9f2241",
                    fontWeight: "300",
                    fontSize: 14,
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
                <Text style={{ fontWeight: "300", fontSize: 14 }}>
                  Alcohol
                </Text>
                <Text
                  style={{
                    color: "#9f2241",
                    fontWeight: "300",
                    fontSize: 14,
                  }}
                >
                  {data.alcohol_percentage}%
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
                style={{ color: "#9f2241", fontWeight: "300", fontSize: 14 }}
              >
                Ingredients
              </Text>
              <Text
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  fontWeight: "300",
                  fontSize: 14,
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
                style={{ color: "#9f2241", fontWeight: "300", fontSize: 14 }}
              >
                Relevant links
              </Text>
              <Text
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  fontWeight: "300",
                  fontSize: 14,
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
                style={{ color: "#9f2241", fontWeight: "300", fontSize: 14 }}
              >
                History & Details
              </Text>
              <Text
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  fontWeight: "300",
                  fontSize: 14,
                }}
              >
                {data.history}
              </Text>
            </View>

            <View
              style={{
                borderRadius: 8,
                backgroundColor: "#fff",
                width: "93%",
                height: 90,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
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
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text style={{ color: "#fff", fontWeight: "300", fontSize: 18 }}>
                    AddToSeller
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.centeredView}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                      <View
                        style={{
                          width: "100%",
                          height: 170,
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >



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
                          disabledLineWidth={1}
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
                          activeLineWidth={1}
                          disabledLineWidth={1}
                          labelTextStyle={{
                            fontFamily: "HelveticaNeue",
                            fontWeight: "300",
                          }}
                        />
                        <TouchableOpacity

                          onPress={() => AddToListed()
                          }
                        >
                          <Text style={{

                            fontWeight: "300",
                            fontSize: 14,
                            height: 30,
                            width: 80, borderRadius: 20,
                            color: "white",
                            textAlign: "center",

                            justifyContent: "center",
                            backgroundColor: "#9f2241",


                            padding: 5,
                            elevation: 2
                          }} >Add</Text>

                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                      >
                        <Text style={styles.textStyle}>Close Modal</Text>

                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>



              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
//}
export default InventryWineDetails;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#9f2241",
  },
  buttonClose: {
    backgroundColor: "#9f2241",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 5,
    textAlign: "center"
  }
});