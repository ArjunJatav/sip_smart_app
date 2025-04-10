import React, { Component, useState, useEffect, useRef } from "react";
import {
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Modal,
    Alert,
    StatusBar,
    ActivityIndicator,
    KeyboardAvoidingView,
    requireNativeComponent,
    FlatList,
} from "react-native";
import { Rating, AirbnbRating } from "react-native-ratings";
import * as constants from "../../constants/Const";
import backImage from "../../assets/images/other_icons/back.png";
import down from "../../assets/images/other_icons/drop-arrow-1x.png";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
//import ModalDropdown from "react-native-modal-dropdown";
import { TextField } from "rn-material-ui-textfield";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalDropdown from "react-native-modal-dropdown";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import { SafeAreaView } from "react-native-safe-area-context";
import iconAddAction from "../../assets/images/other_icons/pluswhite.png";
import close from "../../assets/images/other_icons/close.png";
import ImagePicker from "react-native-image-picker";
import SelectBox from "react-native-multi-selectbox";
import { xorBy } from "lodash";
import { TabActions, CommonActions } from '@react-navigation/native';
const jumpToAction2 = TabActions.jumpTo('Home');
var imageArry1 = [];

var type = '';
var newiamge = [];
var cat = ''
var catname = ''

const EditWine = ({ route, navigation }) => {
    var token = "";
    const [imagearry, setImageArray] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [newiamge,setnewiamge]=useState( route.params.images)
    
    const [selectedTeam, setSelectedTeam] = useState({"id": route.params.country, "item": route.params.country});
    type = route.params.type;
  //  newiamge = route.params.images;
    cat = route.params.category;
    catname = route.params.catname;


    const [value, setVlue] = useState("select");
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(route.params.name);
    const [images, setImages] = useState("");
    const [category, setCategory] = useState("Category");
    const [categoryList, setCategoryList] = useState([]);
    const [alcohol_percentage, setAlcohol_percentage] = useState(route.params.alcohal_prec);
    const [quantity, setQuantity] = useState(route.params.quantity.toString());
    const [price, setPrice] = useState(route.params.price.toString());
    const [country_code, setCountry_code] = useState(route.params.country);
    const [countrylist, setCountryList] = useState([]);
    const [city, setCity] = useState(route.params.city);
    const [MFG, setMFG] = useState(route.params.MFG);
    const [ingredients, setIngredients] = useState(route.params.ingredients);
    const [relevant_link, setRelevant_link] = useState(route.params.relevant_links);
    const [description, setDescription] = useState(route.params.history);
    const [rating, setRating] = useState(route.params.star_rating);



    function onChange() {
        return (val) => {
            console.log(val)
            setSelectedTeam(val)};
    }

    const Category = async (rowData) => {
        token = await AsyncStorage.getItem(AUTH_TOKEN);
        console.log("Getcategory");
        setIsLoading(true);
        axios({
            method: "GET",
            url: constants.baseURL + constants.categoryDetail,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then((response) => {
                console.log(response.data)
                setCategoryList(response.data.data);
                setIsLoading(false);
                setTimeout(() => {
       setSelectedTeams(route.params.category.map((x) => ({
            id: x._id,
            item: x.name,
        })))

  }, 500);
     
            })
            .catch((error) => {
                console.log(error);

                Alert.alert(
                    "Alert",
                    constants.serverError,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setIsLoading(false);
                            },
                        },
                    ],
                    { cancelable: false }
                );

                return;
            });
    };
    const removeimge = async (item) => {
        token = await AsyncStorage.getItem(AUTH_TOKEN);
        console.log("Getcategory");
        setIsLoading(true);
        axios({
            method: "post",
            url: constants.baseURL + constants.removeimage,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
            data:{
                productId:route.params.id,
                imageLink:item

            }
        })
            .then((response) => {
                console.log("response:-getttt ", response.data);
                if(response.data.status==200){
                    setnewiamge(newiamge.filter(item1 => item1 !== item));

                }

                
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);

                Alert.alert(
                    "Alert",
                    constants.serverError,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setIsLoading(false);
                            },
                        },
                    ],
                    { cancelable: false }
                );

                return;
            });
    };
    const countryList = async () => {
        token = await AsyncStorage.getItem(AUTH_TOKEN);

        axios({
            method: "GET",
            url: constants.baseURL + constants.countryDetail,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then((response) => {



                setCountryList(response.data.data);

                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);

                Alert.alert(
                    "Alert",
                    constants.serverError,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setIsLoading(false);
                            },
                        },
                    ],
                    { cancelable: false }
                );

                return;
            });
    };

    const SaveDetails = async () => {

        var option = [];
        var image1111 = [];
console.log("jhjh1")
        
         
    if(type=='200')
    {

     
      option.push(cat);
    }
    else{
        console.log("jhjh2")

      for (var i = 0; i < selectedTeams.length; i++) {
        option.push(selectedTeams[i].id);
      }
    }

   
        

    console.log("jhjh3")






        token = await AsyncStorage.getItem(AUTH_TOKEN);


        NetInfo.fetch().then((state) => {
            if (state.isInternetReachable == false) {
                Alert.alert("No Internet", "No Internet Connection.");
                return;
            } else {
                console.log("jhjh4")

                if ( newiamge.length === 0) {
                    console.log("jhjh5")
                    Alert.alert("Alert", "Please add image");
                    
                }



                else if (name == "") {
                    Alert.alert("Alert", "Please enter wine name");
                } else if (option.length == 0) {
                    Alert.alert("Alert", "Please select category");
                } else if (alcohol_percentage == "") {
                    Alert.alert("Alert", "Please enter alcohol percentage");
                } else if (quantity == ""||quantity==="0") {
                    Alert.alert("Alert", "Please enter quantity");
                } else if (price == ""||price==="0") {
                    Alert.alert("Alert", "Please enter price");
                } else if (Object.keys(selectedTeam).length == 0) {
                    Alert.alert("Alert", "Please select country");
                } else if (city === "") {
                    Alert.alert("Alert", "Please enter city");
                } else if (MFG === "") {
                    Alert.alert("Alert", "Please enter MFG");
                }
                    else if(parseInt(MFG)>2021){
                        Alert.alert("Alert", "Please enter valid MFG");
              
                      }
                 else if (ingredients === "") {
                    Alert.alert("Alert", "Please enter ingredients");
                } else if (relevant_link === "") {
                    Alert.alert("Alert", "Please enter relevant_link");
                }

                else if (description === "") {
                    Alert.alert("Alert", "Please enter description");
                }

                else {
                    setIsLoading(true);
                    console.log("jhjh6")


                    const data = new FormData();



                    data.append('name', name);

                
                  

                        



                        

                   




                    for (let i = 0; i < option.length; i++) {

                        if (option.length > 1) {

                            data.append('category', option[i])
                        }
                        else {
                            data.append('category[]', option[i])
                        }






                    }

                    data.append('alcohol_percentage', alcohol_percentage);
                    data.append('quantity', quantity);
                    data.append('price', price);
                    data.append('country_code', selectedTeam.id);
                    data.append('city', city);
                    data.append('MFG', MFG);
                    data.append('ingredients', ingredients);
                    data.append('relevant_link', relevant_link);

                    data.append('history', description);
                    data.append('star_rating', rating);
                    data.append('productId',route.params.id)
                    data.append('type',route.params.flowtype)



                    console.log(data)





                    axios({
                        method: "post",
                        url: constants.baseURL + constants.EditWine,
                        headers: {
                            //'Content-Type': 'application/json',
                            Accept: "application/json",


                            Authorization: "Bearer " + token,
                        },
                        data: {
                           'name': name,
                           'alcohol_percentage':alcohol_percentage,
                           'quantity': quantity,
                           'price': price,
                          'country_code':selectedTeam.id,
                           'city':city,
                           'MFG': MFG,
                           'ingredients': ingredients,
                           'relevant_link':relevant_link,
       
                           'history':description,
                           'star_rating': rating,
                           'productId':route.params.id,
                           'type':route.params.flowtype,
                           'category':option
       
                        },
                    })
                        .then((response) => {
                            setIsLoading(false);
                            console.log('response.data', response.data)

                            if (response.data.status == 200) {
                                Alert.alert("Alert", response.data.message);
                                navigation.dispatch(jumpToAction2)


                                navigation.goBack();
                            }
                            if (response.data.status == 400) {
                                Alert.alert("Alert", response.data.message);
                            }
                        })
                        .catch(function (error) {
                            console.log(error)

                            setIsLoading(false);
                        });
                }

                //})
            }
        });
    };
    const addimage = async (image) => {

        token = await AsyncStorage.getItem(AUTH_TOKEN);
        console.log("Getcategory");
        setIsLoading(true);
                    const data = new FormData();

        data.append('image', {
            uri: image,
            type: 'image/jpeg', // or photo.type


            name: "wineImage.jpg",


        })
        data.append('productId',route.params.id)

        axios({
            method: "post",
            url: constants.baseURL + constants.addImage,
            headers: {
                "Content-Type": 'multipart/form-data',
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
            data:data
        })
            .then((response) => {
                console.log("response:-getttt ", response.data);
                if(response.data.status==200){
                    setnewiamge((oldArray) => [...oldArray,response.data.data[0]])
                   // setnewiamge(newiamge.filter(item1 => item1 !== item));
                   Alert.alert(
                    "Alert",
                    response.data.message,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setIsLoading(false);
                            },
                        },
                    ],
                    { cancelable: false }
                );
                }

                
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);

                Alert.alert(
                    "Alert",
                    constants.serverError,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                setIsLoading(false);
                            },
                        },
                    ],
                    { cancelable: false }
                );

                return;
            });
    };
    useEffect(() => {



       // setAlcohol_percentage(route.params.alcohal_prec)

        countryList();
        Category();
console.log(route.params.category)
//setCategorylist(oldArray => [...oldArray, item._id]);



    }, []);

    const ratingCompleted = (rating) => {

        setRating(rating)
    }


    const imageGalleryLaunch = () => {
        var options = {
            title: "Select Image",

            storageOptions: {
                skipBackup: true,
                path: "images",
            },
        };
        console.log("active camera");

        ImagePicker.showImagePicker(options, (res) => {
            console.log("Response = ", res.fileSize);

            if (res.didCancel) {
                console.log("User cancelled image picker");
            } else if (res.error) {
                console.log("ImagePicker Error: ", res.error);
            } else if (res.customButton) {
                console.log("User tapped custom button: ", res.customButton);
                alert(res.customButton);
            } else {
                let source = res;
                var base64Img = res.type + ";base64," + res.data;
                addimage( res.uri)
                //setImageArray((oldArray) => [...oldArray, res.uri]);


            }
        });
    };

    const ListHeader = () => {

        return (
            <TouchableOpacity
                onPress={() => {
                    if (newiamge.length < 5) {
                        imageGalleryLaunch();
                    } else {
                        Alert.alert("Alert", response.data.message);
                    }
                }}
            >
                <View
                    style={{
                        marginTop: 10,
                        marginLeft: 10,
                        height: 100,
                        width: 100,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#9F2241",
                    }}
                >
                    <Image
                        source={iconAddAction}
                        resizeMode="center"
                        style={{
                            height: 30,
                            width: 30,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    />

                    <Text
                        style={{
                            color: "white",
                            fontSize: 13,
                            fontWeight: "300",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            display: "flex",
                            lineHeight: 21,
                            fontFamily: "HelveticaNeue",
                            alignSelf: "center",
                        }}
                    >
                        Add Image
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };
    const ItemView = ({ item, index }) => {

        return (
            <View
                style={{
                    marginTop: 10,
                    marginLeft: 10,
                    height: 100,
                    width: 100,
                    borderRadius: 8,

                    backgroundColor: "#9F2241",
                }}
            >
                <Image
                    source= {{ uri: item }}
                    resizeMode="cover"
                    style={{ height: "100%", width: "100%", borderRadius: 8 }}
                ></Image>

                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                        '',
                     
                          'Are you sure you want to remove this image? ',
                        [
                          {
                            text: 'No',
                            onPress: () => console.log('Cancel Pressed'),
                      
                          },
                          {
                            text: 'Yes', onPress: () => {


                              removeimge(item)
                            }
                          },
                        ]
                      );
                      

                    }}
                    style={{
                        height: 25,
                        width: 25,
                        marginTop: -110,
                        marginLeft: 80,
                        backgroundColor: "#9F2241",
                        borderRadius: 12,
                    }}
                >
                    <Image
                        source={close}
                        style={{ height: "100%", width: "100%" }}
                    ></Image>
                </TouchableOpacity>

            </View>
        );
    };
    function onMultiChange() {

        return (item) => {
            console.log(item)
            setSelectedTeams(xorBy(selectedTeams, [item], "id"));
            console.log(selectedTeams)


        };
    }

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
                                Edit Details
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
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        flex: 1,
                        marginLeft: 16,
                        marginRight: 16,
                        marginBottom: 20,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <KeyboardAvoidingView
                        keyboardVerticalOffset={20}
                        enabled behavior={Platform.OS === 'ios' ? 'padding' : "padding"}
                    >



                        <ScrollView


                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        >
                            {/* Image Picker & Image Scroll ------ Start */}
                            <View
                                style={{
                                    marginTop: 10,
                                    marginLeft: 10,
                                    marginRight: 10,
                                    height: 120,
                                    borderRadius: 8,
                                    backgroundColor: "#F5EFEB",
                                    flexDirection: "row",
                                }}
                            >






                                <FlatList
                                    style={{
                                        backgroundColor: "#F5EFEB",
                                        width: "100%",
                                        height: "100%",
                                    }}

                                    data={newiamge}

                                    keyExtractor={(item, index) => index.toString()}
                                    horizontal={true}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    // //Header to show above listview
                                    ListHeaderComponent={


                                            ListHeader}
                                    //Footer to show below listview
                                   
                                    renderItem={ItemView}

                                />


                            </View>
                            {/* Image Picker & Image Scroll ------ End */}

                            <TextField
                                containerStyle={{
                                    alignSelf: "center",
                                    width: "90%",
                                }}
                                label="Name of the wine"
                                style={{ width: "100%" }}
                                textColor={"#9F2241"}
                                tintColor="black"
                                baseColor="black"
                                lineWidth={1}
                                activeLineWidth={1}
                                disabledLineWidth={1}
                                value={name}
                                editable={type === 'admin' ? false : true}
                                onChangeText={(name) => {
                                    setName(name);
                                }}
                                labelTextStyle={{
                                    fontFamily: "HelveticaNeue",
                                    fontWeight: "300",
                                }}
                            />
                            {type === 'admin' ? (  <View style={{flexDirection:"column"}}> 
                            <Text style={{fontFamily: "HelveticaNeue",
                                    fontWeight: "300",fontSize:12,marginLeft:15}}>{"Select Category"}</Text>
                                     <View style={{
      paddingVertical: 5,
      paddingHorizontal: 0,
      marginTop: 0,
      marginLeft: 15,
      marginRight: 10,
      flexWrap: 'wrap',
      flexDirection: "row",
    }
}>
              {selectedTeams.map((itm, key) => {
                return (
                  <Text
                    key={key}
                    style={{
                      fontSize: 15,
                      color: '#ffffff',
                      marginRight: 15,
                      fontWeight: '600',
                      borderColor: '#000',
                      //textAlignVertical: 'center',
                      height: 35,
                      lineHeight:35,
                      backgroundColor:"#9F2241",
                      borderRadius: 16,
                      //textAlign: 'center',
                      paddingLeft: 15,
                      
                      paddingRight: 15,
                      borderWidth: 0.5,
                    }}>
                    {itm.item}
                  </Text>
                );
              })}
            </View>
            </View>
) : (<View style={{ width: "100%", marginLeft: "5%", marginTop: 20 }}>
                                <View style={{ width: "100%", alignItems: "center" }}>
                                <SelectBox
                      label="Select Category"
                      options={categoryList.map((x) => ({
                        id: x._id,
                        item: x.name,
                      }))}
                      style={{ margin: 10, maxHeight: 200 }}
                      containerStyle={{ width: "90%" }}
                      toggleIconColor="white"
                      searchIconColor="#9F2241"
                      arrowIconColor="#9F2241"
                      //  contentContainerStyle={{ flexGrow: 1 ,flex:1}}
                      multiOptionContainerStyle = {{backgroundColor:"#9F2241"}}
                      optionContainerStyle={{ width: "90%", backgroundColor:"#9F2241" }}
                      labelStyle={{
                        color: "black",
                        fontFamily: "HelveticaNeue",
                      }}
                      inputFilterContainerStyle={{ width: "90%" }}
                      selectedItemStyle
                      selectedValues={selectedTeams}
                      showsHorizontalScrollIndicator={false}
                      onMultiSelect={onMultiChange()}
                      onTapClose={onMultiChange()}
                      isMulti
                    />
                                </View>

                            </View>

                            )}

                            {type === '200' ? (<View></View>) : (<View
                                style={{
                                    height: 1,
                                    width: "90%",
                                    backgroundColor: "grey",
                                    marginLeft: 18,
                                }}
                            ></View>)}
                            <TextField
                                containerStyle={{
                                    alignSelf: "center",
                                    width: "90%",
                                }}
                                label="Alcohol Percentage"
                                style={{ width: "100%" }}
                                textColor={"#9F2241"}
                                tintColor="black"
                                baseColor="black"
                                lineWidth={1}
                                keyboardType="phone-pad"
                                activeLineWidth={1}
                                disabledLineWidth={1}
                                value={alcohol_percentage}
                                editable={type === 'admin' ? false : true}
                                onChangeText={(alcohol_percentage) => {
                                    setAlcohol_percentage(alcohol_percentage);
                                }}
                                labelTextStyle={{
                                    fontFamily: "HelveticaNeue",
                                    fontWeight: "300",
                                }}
                            />

                            <TextField
                                containerStyle={{
                                    alignSelf: "center",
                                    width: "90%",
                                }}
                                label="Quantity Available"
                                style={{ width: "100%" }}
                                textColor={"#9F2241"}
                                tintColor="black"
                                baseColor="black"
                                lineWidth={1}
                                keyboardType="phone-pad"
                                activeLineWidth={1}
                                disabledLineWidth={1}
                                value={quantity} returnKeyLabel="Done"
                                returnKeyType="done"

                                onChangeText={(quantity) => {
                                    setQuantity(quantity);
                                }}
                                labelTextStyle={{
                                    fontFamily: "HelveticaNeue",
                                    fontWeight: "300",
                                }}
                            />

                            <TextField
                                containerStyle={{
                                    alignSelf: "center",
                                    width: "90%",
                                }}
                                label="Price Per Unit"
                                style={{ width: "100%" }}
                                textColor={"#9F2241"}
                                tintColor="black"
                                baseColor="black"
                                lineWidth={1}
                                activeLineWidth={1}
                                disabledLineWidth={1}
                                value={price}
                                returnKeyLabel="Done"
                                returnKeyType="done"
                                keyboardType="phone-pad"
                                onChangeText={(oldPassword) => {
                                    setPrice(oldPassword);
                                }}
                                labelTextStyle={{
                                    fontFamily: "HelveticaNeue",
                                    fontWeight: "300",
                                }}
                            />

{type === 'admin' ? (<TextField
                                containerStyle={{
                                    alignSelf: "center",
                                    width: "90%",

                                }}
                                
                                label="Select Country"
                                style={{ width: "100%" }}
                                textColor={"#9F2241"}
                                tintColor="black"
                                baseColor="black"
                                lineWidth={0}
                              
                                value={route.params.country}
                                editable={type === 'admin' ? false : true}
                                labelTextStyle={{
                                    fontFamily: "HelveticaNeue",
                                    fontWeight: "300",
                                }}
                            />) :

                            <View style={{ width: "100%", marginLeft: "5%", marginTop: 20 }}>
                                <View style={{ width: "100%", alignItems: "center" }}>
                                <SelectBox
                      label="Select Country"
                      options={countrylist.map((x) => ({
                        id: x.name,
                        item: x.name,
                      }))}
                      containerStyle={{ width: "90%" }}
                      toggleIconColor="#9F2241"
                      searchIconColor="#9F2241"
                      arrowIconColor="#9F2241"
                      optionContainerStyle={{ width: "90%",backgroundColor:"#9F2241"  }}
                      labelStyle={{
                        color: "black",
                        fontFamily: "HelveticaNeue",
                      }}
                      inputFilterContainerStyle={{ width: "90%" }}
                      //selectedItemStyle
                      // selectedValues={selectedTeams}
                      showsHorizontalScrollIndicator={false}
                      value={selectedTeam}
                      onChange={onChange()}
                      hideInputFilter={false}
                    />
                                </View>
                            </View>
}
                            <View
                                style={{
                                    height: 1,
                                    width: "90%",
                                    backgroundColor: "grey",
                                    marginLeft: 16,
                                }}
                            ></View>

                            <TextField
                                containerStyle={{
                                    alignSelf: "center",
                                    width: "90%",
                                }}
                                label="City"
                                style={{ width: "100%" }}
                                textColor={"#9F2241"}
                                tintColor="black"
                                baseColor="black"
                                lineWidth={1}
                                activeLineWidth={1}
                                editable={type === 'admin' ? false : true}
                                disabledLineWidth={1}
                                value={city}
                                returnKeyLabel="Done"
                                returnKeyType="done"
                                onChangeText={(oldPassword) => {
                                    setCity(oldPassword);
                                }}
                                labelTextStyle={{
                                    fontFamily: "HelveticaNeue",
                                    fontWeight: "300",
                                }}
                            />

                            <TextField
                                containerStyle={{
                                    alignSelf: "center",
                                    width: "90%",
                                }}
                                label="MFG. Year"
                                style={{ width: "100%" }}
                                textColor={"#9F2241"}
                                tintColor="black"
                                baseColor="black"
                                lineWidth={1}
                                activeLineWidth={1}
                                disabledLineWidth={1}
                                value={MFG}
                                returnKeyLabel="Done"
                                returnKeyType="done"
                                keyboardType="phone-pad"
                                editable={type === 'admin' ? false : true}
                                onChangeText={(oldPassword) => {
                                    setMFG(oldPassword);
                                }}
                                labelTextStyle={{
                                    fontFamily: "HelveticaNeue",
                                    fontWeight: "300",
                                }}
                            />

                            <TextField
                                containerStyle={{
                                    alignSelf: "center",
                                    width: "90%",
                                }}
                                label="Ingredients"
                                editable={type === 'admin' ? false : true}
                                style={{ width: "100%" }}
                                textColor={"#9F2241"}
                                tintColor="black"
                                baseColor="black"
                                lineWidth={1}
                                activeLineWidth={1}
                                disabledLineWidth={1}
                                value={ingredients}
                                returnKeyLabel="Done"
                                returnKeyType="done"
                                onChangeText={(oldPassword) => {
                                    setIngredients(oldPassword);
                                }}
                                labelTextStyle={{
                                    fontFamily: "HelveticaNeue",
                                    fontWeight: "300",
                                }}
                            />

                            <TextField
                                containerStyle={{
                                    alignSelf: "center",
                                    width: "90%",
                                }}
                                editable={type === 'admin' ? false : true}
                                label="Relevant Link"
                                style={{ width: "100%" }}
                                textColor={"#9F2241"}
                                tintColor="black"
                                baseColor="black"
                                lineWidth={1}
                                activeLineWidth={1}
                                disabledLineWidth={1}
                                
                                value={relevant_link}
                                returnKeyLabel="Done"
                                returnKeyType="done"
                                onChangeText={(oldPassword) => {
                                    setRelevant_link(oldPassword);
                                }}
                                labelTextStyle={{
                                    fontFamily: "HelveticaNeue",
                                    fontWeight: "300",
                                }}
                            />

                            <TextField
                                containerStyle={{
                                    alignSelf: "center",
                                    width: "90%",
                                }}
                                editable={type === 'admin' ? false : true}
                                label="Description"
                                style={{ width: "100%" }}
                                textColor={"#9F2241"}
                                tintColor="black"
                                baseColor="black"
                                lineWidth={1}
                                activeLineWidth={1}
                                disabledLineWidth={1}
                                value={description}
                                multiline = {true}
                  numberOfLines = {5}
                                returnKeyLabel="Done"
                                returnKeyType="done"
                                onChangeText={(oldPassword) => {
                                    setDescription(oldPassword);
                                }}
                                labelTextStyle={{
                                    fontFamily: "HelveticaNeue",
                                    fontWeight: "300",
                                }}
                            />


                            <Text
                                style={{
                                    fontSize: 16,


                                    color: "black", fontFamily: "HelveticaNeue",
                                    marginLeft: 16, marginTop: 16
                                }}
                            >
                                Select Rating
                            </Text>





                            {type === 'admin' ? (<View pointerEvents="none">
                                <AirbnbRating

                                    onFinishRating={ratingCompleted}
                                    reviews={[""]}

                                    //count={5}
                                    size={20}
                                    defaultRating={rating}

                                    ratingCount={5}
                                    imageSize={15}

                                    startingValue={rating}
                                    starContainerStyle={{ alignSelf: 'flex-start', marginLeft: 16 }}
                                    style={{ backgroundColor: 'red', alignSelf: 'flex-start' }}
                                />

                            </View>) : (<AirbnbRating

                                onFinishRating={ratingCompleted}
                                reviews={[""]}

                                //count={5}
                                size={20}
                                defaultRating={rating}

                                ratingCount={5}
                                imageSize={15}

                                startingValue={rating}
                                starContainerStyle={{ alignSelf: 'flex-start', marginLeft: 16 }}
                                style={{ backgroundColor: 'red', alignSelf: 'flex-start' }}
                            />)}



                            <View
                                style={{
                                    borderRadius: 8,
                                    backgroundColor: "#fff",
                                    width: "100%",
                                    height: 90,
                                    marginTop: 20,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        width: "95%",
                                        height: 50,
                                        borderRadius: 8,
                                        backgroundColor: "#9f2241",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}

                                    onPress={() => SaveDetails()}>
                                    <View
                                        style={{
                                            width: "100%",
                                            height: 50,
                                            borderRadius: 8,
                                            backgroundColor: "#9f2241",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >

                                        <Text
                                            style={{ color: "#fff", fontWeight: "300", fontSize: 18 }}
                                        >
                                            Save
                                        </Text>

                                    </View>
                                </TouchableOpacity>
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
        </View>
    );
};

export default EditWine;
