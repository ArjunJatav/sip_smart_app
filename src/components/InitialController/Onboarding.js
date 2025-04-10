import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SliderBox } from "react-native-image-slider-box";
import { CommonActions } from "@react-navigation/native";
import { saveData, _retrieveData, IsFirstLaunch } from "../../helpers/helper";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default class Onboarding extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMatch: 1,
      buttonText: "Next",
      images: [
        require("../../assets/images/Onboarding/onboard1.png"),
        require("../../assets/images/Onboarding/onboard2.png"),
        require("../../assets/images/Onboarding/onboard3.png"),
      ],
    };
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <SafeAreaView>
          <SliderBox
            images={this.state.images}
            sliderBoxHeight={"100%"}
            onCurrentImagePressed={(index) =>
              console.log(`image ${index} pressed`)
            }
            dotColor={"#9F2241"}
            inactiveDotColor="#9F2241"
            resizeMode={"contain"}
            paginationBoxStyle={{
              position: "absolute",
              bottom: 50,
              padding: 0,
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
              paddingVertical: 10,
            }}
            dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 5,
              marginHorizontal: 0,
              padding: 0,
              margin: 0,
            }}
            imageLoadingColor="#2196F3"
          />

          <View
            style={{
              width: "100%",
              height: 30,
              bottom: 80,
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{
                width: "18%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.7}
              onPress={() => {
                saveData("false", IsFirstLaunch);

                const resetAction = CommonActions.reset({
                  routes: [{ name: "AuthStack" }],
                });
                this.props.navigation.dispatch(resetAction);
              }}
            >
              <Text style={{ fontSize: 18 }}>Skip</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
