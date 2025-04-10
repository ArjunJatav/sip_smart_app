import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import NetInfo from "@react-native-community/netinfo";
import * as constants from "../../constants/Const";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import renderIf from "../../helpers/renderIf";
import CountryPicker from "react-native-country-picker-modal";
import { CommonActions } from "@react-navigation/native";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import hide from "../../assets/images/other_icons/hidden.png";
import view from "../../assets/images/other_icons/view.png";
// import CountryPicker, {
//   getAllCountries
// } from 'react-native-country-picker-modal'
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import { TextField } from "rn-material-ui-textfield";

var token = null;
var userId = null;
var name = null;
var fcmKey = null;

export default class login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      email: "",
      loading: false,
      showPassword: true,
      cca2: "US",
      showCountryPicker: false,
      CountryCallingCode: "91",
    };
  }

  PasswordVisibilityClicked() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  forgotPasswordClicked() {
    this.props.navigation.navigate("ForgotPassword");
  }

  async getFcmToken() {
    fcmKey = await AsyncStorage.getItem("fcmToken");
  }

  componentDidMount() {
    this.getFcmToken();
  }

  loginButtonClicked() {
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        console.log("Country Code:- ", this.state.CountryCallingCode);
        console.log("Mobile Number:- ", this.state.userName);
        console.log("Password:-", this.state.password);

        if (this.state.userName.trim().length == 0) {
          Alert.alert("Alert", constants.PhoneNumberRequired);
          return;
        }

        if (this.state.userName.trim().length < 10) {
          Alert.alert("Alert", constants.validateMobileRequired);
          return;
        }

        if (this.state.password.trim().length == 0) {
          Alert.alert("Alert", constants.passwordRequired);
          return;
        }

        if (this.state.password.trim().length < 5) {
          Alert.alert("Alert", constants.validPasswordRequired);
          return;
        }
        this.setState({ loading: true });

        axios({
          method: "post",
          url: constants.baseURL + constants.loginApi,
          header: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          data: {
            country_code: this.state.CountryCallingCode,
            mobile_number: this.state.userName,
            password: this.state.password,

            device_id: "skfhsdkfhsdkfjhsdkf395734987534975357345",
            device_type: "android",
            version: "1.0",
            device_token: fcmKey,
          },
        })
          .then((response) => {
            console.log("Login Response:-", response.data);

            if (response.data.status != 201 && response.data.status != 200) {
              this.setState({ loading: false, userName: "", password: "" });
              this.ShowAlertWithDelay(response.data.message);
              return;
            } else if (response.data.status == 201) {
              this.setState({
                loading: false,
                email: response.data.data,
              });
              console.log("response.data.data.token>>>>",response.data);
              
              this.props.navigation.navigate("OTP", {
                MobileVal: this.state.userName,
                countryCode: this.state.CountryCallingCode,
                isFromSignup: true,
                isFromChangeNumber: false,
                otptype: "login",
              });
              
            } else {
              var data = response.data.data;
              token = response.data.data.token;
              this.setState({ loading: false, userName: "", password: "" });
              saveData(response.data.data.token, AUTH_TOKEN);
              saveData(response.data.data.userId, "userId");

              const resetAction = CommonActions.reset({
                routes: [{ name: "HomeNavigator" }],
              });
              this.props.navigation.dispatch(resetAction);
            }
          })
          .catch((error) => {
            console.log(error);
            this.ShowAlertWithDelay(constants.serverError);
            return;
          });
      }
    });
  }

  makeCountryPickerVisible() {
    this.setState({ showCountryPicker: true });
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
        <KeyboardAvoidingView
          enabled
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flex: 1 }}
        >
          <ScrollView style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  color: "#9F2241",
                  left: 30,
                  marginTop: 94,
                  fontWeight: "bold",
                  width: 201,
                  height: 86,
                }}
              >
                Sign In {"\n"}to Continue
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 30,
                  justifyContent: "center",
                  height: 57,
                  marginLeft: 30,
                  marginRight: 30,
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
                  onChangeText={(userName) => this.setState({ userName })}
                  value={this.state.userName}
                  labelTextStyle={{
                    fontFamily: "HelveticaNeue",
                    fontWeight: "300",
                  }}
                  returnKeyLabel="Done"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>

              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 30,
                  marginRight: 30,
                  marginTop: 10,
                }}
              >
                <TextField
                  containerStyle={{
                    width: "95%",
                    alignSelf: "center",
                  }}
                  label="Password"
                  style={{ width: "100%" }}
                  onChangeText={(password) => this.setState({ password })}
                  value={this.state.password}
                  textColor={"#9F2241"}
                  tintColor="black"
                  baseColor="black"
                  lineWidth={1}
                  secureTextEntry={this.state.showPassword}
                  activeLineWidth={1}
                  disabledLineWidth={1}
                  labelTextStyle={{
                    fontFamily: "HelveticaNeue",
                    fontWeight: "300",
                  }}
                />
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    this.PasswordVisibilityClicked();
                  }}
                >
                  {this.state.showPassword ? (
                    <Image
                      source={hide}
                      style={{
                        height: 20,
                        width: 20,
                        marginRight: 10,
                        resizeMode: "contain",
                        alignSelf: "center",
                      }}
                    />
                  ) : (
                    <Image
                      source={view}
                      style={{
                        height: 20,
                        width: 20,
                        marginRight: 10,
                        resizeMode: "contain",
                        alignSelf: "center",
                      }}
                    />
                  )}
                </TouchableOpacity>
              </View>

              <View style={{ height: 80, width: deviceWidth }}>
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.7}
                  onPress={() => this.loginButtonClicked()}
                >
                  <Text style={styles.signupButton}>Sign In</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.forgotButton}
                activeOpacity={0.7}
                onPress={() => this.forgotPasswordClicked()}
              >
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  flex: 1,
                  alignItems: "center",
                  marginTop: 80,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 18,
                    fontWeight: "300",
                    alignItems: "center",
                    fontFamily: "HelveticaNeue",
                  }}
                >
                  Not a member ?
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => this.props.navigation.navigate("Register")}
                >
                  <Text
                    style={{
                      fontFamily: "HelveticaNeue",
                      fontSize: 18,
                      color: "firebrick",
                    }}
                  >
                    {" "}
                    Sign Up{" "}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {this.state.loading && (
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
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  backImage: {
    height: deviceHeight,
    width: "100%",
  },
  forgotButton: {
    // alignItems: "flex-end",
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "500",
    marginTop: 30,
    marginRight: 60,
    marginLeft: 60,
    height: 30,
    justifyContent: "center",
  },
  forgot: {
    color: "#9F2241",
    fontSize: 18,
    fontWeight: "300",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    display: "flex",
    lineHeight: 21,
    fontFamily: "HelveticaNeue",
    alignSelf: "center",
  },
  button: {
    height: 48,
    backgroundColor: "#9F2241",
    marginVertical: 30,
    alignItems: "center",
    borderRadius: 12,
    marginLeft: 30,
    marginRight: 30,
  },
  signupButton: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "300",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    fontFamily: "HelveticaNeue",
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
