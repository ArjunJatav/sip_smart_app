import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { EventRegister } from "react-native-event-listeners";
import { SafeAreaView } from 'react-native-safe-area-context';
import backImage from "../../assets/images/other_icons/back.png";

import {

    Image,
    Dimensions,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    StyleSheet,
    Alert,
    Modal,
    KeyboardAvoidingView,
    ActivityIndicator,
  } from "react-native";
const GooglePlacesInput = ({ route, navigation }) => {


    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                Address
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

                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log(data);
                            console.log(details)

                            let pp = details.address_components.filter((ele, ind) => ind === details.address_components.findIndex(elem => elem.short_name === ele.short_name))
                            let selectedValues = pp.map((ingredient) =>
                                ingredient.types[0] == 'administrative_area_level_1' ? ingredient.long_name : ingredient.short_name)


                            let selectedValuesInString = selectedValues.join(',');

                            let city = '', state = '', country = '', postal_code = '', neighbourhood = '', sublocalityone = '', sublocalitytwo = '';
                            for (let i = 0; i < details.address_components.length; i++) {
                                for (let j = 0; j < details.address_components[i].types.length; j++) {
                                    switch (details.address_components[i].types[j]) {
                                        case 'neighborhood':
                                            neighbourhood = details.address_components[i].long_name;
                                            break;
                                        case 'sublocality_level_2':
                                            sublocalitytwo = details.address_components[i].long_name;
                                            break;
                                        case 'sublocality_level_1':
                                            sublocalityone = details.address_components[i].long_name;
                                            break;
                                        case "locality":
                                            city = details.address_components[i].long_name;
                                            break;
                                        case "administrative_area_level_1":
                                            state = details.address_components[i].long_name;
                                            break;
                                        case "country":
                                            country = details.address_components[i].long_name;
                                        case 'postal_code':
                                            postal_code = details.address_components[i].long_name;
                                            break;
                                    }
                                }
                            }

                            EventRegister.emit("add address", {
                                address: data.structured_formatting.main_text,
                                address1: neighbourhood + " " + sublocalitytwo + " " + sublocalityone,
                                city: city,
                                country: country,
                                postcode: postal_code,
                            });
                            navigation.pop();


                        }}
                        fetchDetails={true}
                        query={{
                            key: 'AIzaSyAn5Nhum6ckEWuWOdkSaK21FaKwzpK1KVk',
                            language: 'en',
                        }}
                    // currentLocation={true}
                    />
    </SafeAreaView>
                );
};

                export default GooglePlacesInput;