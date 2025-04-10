import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Button, ImageBackground, TextInput, ScrollViewBase

} from "react-native";
import * as constants from "../../constants/Const";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";


import backImage from "../../assets/images/other_icons/back.png";
import { Colors } from "react-native/Libraries/NewAppScreen";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import { TextField } from "rn-material-ui-textfield";
import { EventRegister } from 'react-native-event-listeners'

const FilterScreen = ({ route, navigation }) => {
  var token = null;
  const { City,
    Vintage,
    Sortbyid,
    Priceid,
    PriceFrom,
    PriceTo,
    Categorylist } = route.params;

  const [city, setCity] = useState(City)
  const [vintage, setVintage] = useState(Vintage)
  const [isLoading, setIsLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { id: '1', name: 'Sort By', },
    { id: '2', name: 'Categories', },
    { id: '3', name: 'City', },
    { id: '4', name: 'Price Range', },
    { id: '5', name: 'Vintage', },
    //{ id: '6', name: 'GrapeVariety', },
  ])
  var sortby = [
    { id: '1', name: 'Price Low to High', },
    { id: '2', name: 'Price High to Low', },
  ]

  var PriceList = [
    { id: '1', From: '0', To: '500' },
    { id: '2', From: '500', To: '1000' },
    { id: '3', From: '1000', To: '1500' },
    { id: '4', From: '1500', To: '2000' },
    { id: '5', From: '2000', To: '5000' },



  ]

  const [selectedItem, setSelectedItem] = useState('1')
  const [sortbyid, setSortbyid] = useState(Sortbyid)
  const [priceid, setPriceid] = useState(Priceid)
  const [pricefrom, setPriceFrom] = useState(PriceFrom)
  const [priceTo, setPriceTo] = useState(PriceTo)
  const [categoryData, SetCategoryData] = useState([])
  const [categorylist, setCategorylist] = useState(Categorylist)

  const Categories = async () => {

    token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        setIsLoading(true);
        axios({
          method: "GET",
          url: constants.baseURL + constants.categorydetail,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          }

        })
          .then((response) => {
            setIsLoading(false);
           




            if (response.data.status == 200) {
              SetCategoryData(response.data.data)
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
  const Applyfilter = () => {






    var sort = '';
    var pricerange

    if (sortbyid == 1) {
      sort = "Price Low to High"
    }
    else {
      sort = "Price High to Low"
    }

    
    EventRegister.emit('filter updated', {
      sorting: sortbyid,
      categorylist: categorylist,
      city: city,
      pricefrom: pricefrom,
      priceTo: priceTo,
      vintage: vintage,
      priceid: priceid
    });

    navigation.pop();


  }

  
  useEffect(() => {

    Categories();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          height: 50,
          width: "100%",

          flexDirection: "row",
        }}
      >

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            marginLeft: 10,
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


        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#000",

              fontWeight: "bold",
              justifyContent: "center",
              fontFamily: "HelveticaNeue",

            }}
          >
            Filter & Sort
          </Text>
        </View>
        <View
          style={{
            height: "100%",

            justifyContent: "center",
            marginRight: 10,
            alignItems: "flex-end",
          }}
        >



          <TouchableOpacity

            onPress={() => {

              setPriceTo('')
              setPriceFrom("")
              setPriceid("")
              setSortbyid(0)
              setCity('')
              setVintage('')
              setCategorylist([])
            }}
            style={{

              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.7}
          // CartScreen

          >
            <Text
              style={{
                fontSize: 14,
                color: "#9f2241",
                alignSelf: "center",

                alignSelf: "center",
                textAlign: "center",
              }}
            >
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* -----------------------------------Top Navigation Bar End------------------------------------------------ */}

      <View
        style={{
          height: deviceHeight - 135,
          //backgroundColor: "#F5EFEB",
          // justifyContent: "center",
          // alignItems:"center"
        }}
      >


        <View style={styles.content}>
          <View style={styles.menuColumn}>
            {menuItems.map(
              (item, index) => {
                return (
                  <TouchableOpacity key={item.id} onPress={() => setSelectedItem(item.id)} style={[styles.menuItem, item.id === selectedItem ? styles.selectedMenuItem : null]}>
                    <Text style={item.id === selectedItem ? styles.menuItemTextselected : styles.menuItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )
              }
            )
            }

          </View>
          <View style={styles.settingsColumn}>

            {/* Option 1: AGE */}
            {
              selectedItem === '1' &&
              <View >
                {sortby.map(
                  (item, index) => {
                    return (
                      <TouchableOpacity key={item.id} onPress={() => setSortbyid(item.id)} style={{ paddingVertical: 15 }} >
                        <Text style={item.id === sortbyid ? styles.ItemTextselected : styles.ItemText}>{item.name}</Text>
                      </TouchableOpacity>
                    )
                  }
                )
                }

              </View>}
            {
              selectedItem === '2' &&
              <ScrollView style={{ height: 600 }}>
                <View style={{}}>
                  {categoryData.map(
                    (item, index) => {
                      return (
                        <TouchableOpacity key={item._id} onPress={() => {

                          if (categorylist.includes(item._id)) {
                            setCategorylist(categorylist.filter(item1 => item1 !== item._id));

                          } else {
                            setCategorylist(oldArray => [...oldArray, item._id]);
                          }

                        }} style={{ paddingVertical: 15 }} >
                          <Text style={categorylist.includes(item._id) ? styles.ItemTextselected : styles.ItemText}>{item.name}</Text>
                        </TouchableOpacity>
                      )
                    }
                  )
                  }

                </View>
              </ScrollView>
            }
            {
              selectedItem === '3' &&
              <View style={{ paddingVertical: 0 }} >


                <TextField
                  containerStyle={{
                    alignSelf: "center",
                    width: "90%",
                  }}
                  label="Enter City"
                  style={{ width: "100%" }}
                  textColor={"#9F2241"}
                  tintColor="black"
                  baseColor="black"
                  lineWidth={1}
                  activeLineWidth={1}
                  disabledLineWidth={1}
                  value={city}
                  onChangeText={(name) => {
                    setCity(name);
                  }}
                  labelTextStyle={{
                    fontFamily: "HelveticaNeue",
                    fontWeight: "300",
                  }}
                />

              </View>}
            {
              selectedItem === '4' &&
              <View >
                {PriceList.map(
                  (item, index) => {
                    return (
                      <TouchableOpacity key={item.id} onPress={() => {
                        setPriceid(item.id)
                        setPriceFrom(item.From)
                        setPriceTo(item.To)
                      }} style={{ paddingVertical: 15 }} >
                        <Text style={item.id === priceid ? styles.ItemTextselected : styles.ItemText}>{"$" + item.From + " - " + "$" + item.To}</Text>
                      </TouchableOpacity>
                    )
                  }
                )
                }

              </View>}
            {selectedItem === '5' &&
              <View style={{ paddingVertical: 0 }} >


                <TextField
                  containerStyle={{
                    alignSelf: "center",
                    width: "90%",
                  }}
                  label="Enter Vintage"
                  style={{ width: "100%" }}
                  textColor={"#9F2241"}
                  tintColor="black"
                  baseColor="black"
                  lineWidth={1}
                  activeLineWidth={1}
                  disabledLineWidth={1}
                  value={vintage}
                  onChangeText={(name) => {
                    setVintage(name);
                  }}
                  labelTextStyle={{
                    fontFamily: "HelveticaNeue",
                    fontWeight: "300",
                  }}
                />

              </View>
            }
          </View>

        </View>


      </View>
      <TouchableOpacity onPress={() => Applyfilter()}>
        <View style={{ height: 85, alignItems: "center", paddingVertical: 10, justifyContent: "center", bottom: 40 }}>

          <View
            style={{
              width: "95%",
              height: 50,
              borderRadius: 8,
              backgroundColor: "#9f2241",
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <Text style={{ color: "#fff", fontWeight: "300", fontSize: 18 }}>
              Apply
            </Text>

          </View>
        </View>
      </TouchableOpacity>

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

export default FilterScreen;

const styles = StyleSheet.create({

  content: {
    flexDirection: 'row',
    flex: 0.70,

  },

  // menu Column - left
  menuColumn: {
    flex: .4,
    flexDirection: 'column',
    borderRightColor: '#F8F8FF',
    borderRightWidth: 1,
    borderTopEndRadius: 15,
    borderBottomEndRadius: 15,
    marginTop: 10,
    marginRight: 10,
    bottom: 10,
    height: deviceHeight - 170,
    backgroundColor: '#F5EFEB'
  },
  menuItem: {
    // flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 10

    // alignItems: 'flex-start',
    // borderWidth:1,
  },
  selectedMenuItem: {
    backgroundColor: '#9f2241',
    // borderLeftColor: Colors.darkPurple,
  },

  menuItemText: {
    marginLeft: 10,
    alignSelf: 'flex-start',

    color: "black",
    fontSize: 18,

  },
  ItemText: {
    marginLeft: 10,
    alignSelf: 'flex-start',

    color: "black",
    fontSize: 17,

  },
  menuItemTextselected: {
    marginLeft: 10,
    alignSelf: 'flex-start',

    color: "white",
    fontSize: 18,

  },
  ItemTextselected: {
    marginLeft: 10,
    alignSelf: 'flex-start',
    fontWeight:"bold",
    backgroundColor:"white",

    color: '#9f2241',
    fontSize: 17,

  },
  // settings column -right
  settingsColumn: {
    flex: .6,
    height: deviceHeight - 150
  },
});