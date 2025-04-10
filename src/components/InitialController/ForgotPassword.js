import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Modal,
  Keyboard,
} from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import NetInfo from "@react-native-community/netinfo";
import * as constants from "../../constants/Const";
import axios from "axios";
import backImage from "../../assets/images/other_icons/back.png";
import { TextField } from "rn-material-ui-textfield";
import CountryPicker from "react-native-country-picker-modal";

export default class ChooseAdreesstPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: "",
      loading: false,
      cca2: "US",
      showCountryPicker: false,
      CountryCallingCode: "91",
    };
  }

  validate = (emailVal) => {
    let text = emailVal;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };

  backButtonClicked() {
    this.props.navigation.pop();
  }

  makeCountryPickerVisible() {
    this.setState({ showCountryPicker: true });
  }

  NextButtonClicked() {
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);

        return;
      } else {
        if (this.state.mobileNumber.trim().length == 0) {
          Alert.alert("Alert", constants.PhoneNumberRequired);
          return;
        }

        if (this.state.mobileNumber.trim().length < 10) {
          Alert.alert("Alert", constants.validateMobileRequired);
          return;
        }

        this.setState({ loading: true });

        axios({
          method: "post",
          url: constants.baseURL + constants.forgotPasswordApi,
          header: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          data: {
            country_code: this.state.CountryCallingCode,
            mobile_number: this.state.mobileNumber,

            device_id: "4512ASYPB",
            device_type: "android",
            version: "1.0",
          },
        })
          .then((response) => {
            if (response.data.status != 200) {
              this.setState({ loading: false });
              this.ShowAlertWithDelay(response.data.message);
              return;
            } else {
              this.setState({ loading: false });
              this.props.navigation.navigate("OTP", {
                MobileVal: this.state.mobileNumber,
                countryCode: this.state.CountryCallingCode,
                isFromSignup: false,
                isFromChangeNumber: false,
                otptype: "forget",
              });
            }
          })
          .catch((error) => {
            this.ShowAlertWithDelay(constants.serverError);
            return;
          });
      }
    });
  }

  ShowAlertWithDelay = (messagestr) => {
    Alert.alert(
      "Alert",
      messagestr,
      [
        {
          text: "OK",
          onPress: () => {
            this.setState({ loading: false });
          },
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "row", backgroundColor: "white" }}>
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
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
              <View style={{ height: 48, width: 50 }}>
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 48,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  activeOpacity={0.7}
                  onPress={() => this.backButtonClicked()}
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
              <Text
                style={{
                  fontSize: 18,
                  color: "#000",
                  alignSelf: "center",
                  fontWeight: "bold",
                  width: deviceWidth - 100,
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                Forgot Password
              </Text>
              <View
                style={{
                  height: 48,
                  width: 50,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></View>
            </View>
          </View>

          <Text
            style={{
              fontSize: 17,
              color: "black",
              marginLeft: 30,
              height: 22,
              fontFamily: "HelveticaNeue",
              fontWeight: "300",
              marginTop: 40,
              marginRight: 30,
              textAlign: "left",
            }}
          >
            Enter your registered Mobile No.
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              height: 57,
              marginLeft: 30,
              marginRight: 30,
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              style={{
                width: "18%",
                borderBottomWidth: 1.0,
                borderBottomColor: "black",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.7}
              onPress={() => this.makeCountryPickerVisible()}
            >
              <Text
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: 18,
                  fontSize: 17,
                  color: "#9F2241",
                  alignSelf: "flex-end",
                  fontFamily: "HelveticaNeue",
                  fontWeight: "300",
                }}
              >
                +{this.state.CountryCallingCode}
              </Text>
            </TouchableOpacity>

            <TextField
              containerStyle={{
                width: "78%",
                marginLeft: "4%",
                alignSelf: "center",
              }}
              label="Mobile Number"
              keyboardType="phone-pad"
              style={{ width: "100%" }}
              textColor={"#9F2241"}
              tintColor="black"
              baseColor="black"
              lineWidth={1}
              activeLineWidth={1}
              onChangeText={(mobileNumber) => this.setState({ mobileNumber })}
              value={this.state.mobileNumber}
              labelTextStyle={{
                fontFamily: "HelveticaNeue",
                fontWeight: "300",
              }}
              returnKeyLabel="Done"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => this.NextButtonClicked()}
          >
            <Text style={styles.signupButton}>Next</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {this.state.loading && (
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

        <CountryPicker
          onSelect={(value) => {
            this.setState({
              CountryCallingCode: value.callingCode.toString(),
              cca2: value.callingCode,
              showCountryPicker: false,
            });
          }}
          cca2={this.state.cca2}
          placeholder=""
          placeholderTextColor="9F2241"
          withCountryNameButton={true}
          withCallingCode={true}
          withAlphaFilter={true}
          visible={this.state.showCountryPicker}
          onClose={(value) => {
            this.setState({ showCountryPicker: false });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  backImage: {
    height: "100%",
    width: "100%",
  },
  button: {
    width: deviceWidth - 60,
    height: 56,
    backgroundColor: "#9F2241",
    justifyContent: "center",
    height: 48,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 80,
    alignItems: "center",
  },
  signupButton: {
    width: "100%",
    fontStyle: "normal",
    fontWeight: "300",
    fontSize: 17,
    lineHeight: 22,
    color: "#FFFFFF",
    textAlign: "center",
  },
  loading_cont: {
    width: 80,
    height: 80,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
