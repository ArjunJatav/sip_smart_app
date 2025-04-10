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
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as constants from "../../constants/Const";

import axios from "axios";

import checkImage from "../../assets/images/other_icons/check.png";
import uncheckImage from "../../assets/images/other_icons/uncheck.png";
import CountryPicker from "react-native-country-picker-modal";
import renderIf from "../../helpers/renderIf";
import AsyncStorage from "@react-native-async-storage/async-storage";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

import { TextField } from "rn-material-ui-textfield";

var img = null;
var fcmKey = null;

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      emailAddress: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      cca2: "US",
      showCountryPicker: false,
      CountryCallingCode: "91",
    };
  }

  async getFcmToken() {
    fcmKey = await AsyncStorage.getItem("fcmToken");
  }

  componentDidMount() {
    this.getFcmToken();
  }

  termsConditionClicked() {
    this.props.navigation.navigate("TermsCondition", {
      PageName: constants.termsConditionTitle,
      PageURL: constants.termsConditions,
    });
  }

  PrivacyClicked() {
    this.props.navigation.navigate("TermsCondition", {
      PageName: constants.policiesTitle,
      PageURL: constants.policies,
    });
  }

  PasswordVisibilityClicked() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  ConfirmPasswordVisibilityClicked() {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  }

  makeCountryPickerVisible() {
    this.setState({ showCountryPicker: true });
  }

  renderTermConditions() {
    img = this.state.showImage ? checkImage : uncheckImage;
    return <Image style={styles.presentAddressIcon} source={img} />;
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

  signUpButtonClicked() {
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        if (this.state.fullName.trim().length == 0) {
          Alert.alert("Alert", constants.fullNameRequired);
          return;
        }
        if (this.state.emailAddress.trim().length == 0) {
          Alert.alert("Alert", constants.emailAddressRequired);
          return;
        }
        if (this.validate(this.state.emailAddress) == false) {
          Alert.alert("Alert", constants.validEmailRequired);
          return;
        }

        if (this.state.mobileNumber.trim().length == 0) {
          Alert.alert("Alert", constants.PhoneNumberRequired);
          return;
        }

        if (this.state.mobileNumber.trim().length < 10) {
          Alert.alert("Alert", constants.validateMobileRequired);
          return;
        }

        if (this.state.password.trim().length < 1) {
          Alert.alert("Alert", constants.passwordRequired);
          return;
        }

        if (this.state.password.trim().length < 6) {
          Alert.alert("Alert", constants.validPasswordRequired);
          return;
        }

        if (this.state.confirmPassword.trim().length < 1) {
          Alert.alert("Alert", constants.confirmPasswordRequired);
          return;
        }

        if (this.state.password != this.state.confirmPassword) {
          Alert.alert("Alert", constants.passwordNotMatch);
          return;
        }

        if (img == uncheckImage) {
          Alert.alert("Alert", constants.agreeTerms);
          return;
        }

        this.setState({ loading: true });

        axios({
          method: "post",
          url: constants.baseURL + constants.registerApi,
          header: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          data: {
            name: this.state.fullName,
            email: this.state.emailAddress,
            country_code: this.state.CountryCallingCode,
            mobile_number: this.state.mobileNumber,
            password: this.state.password,
            device_token: fcmKey,
            device_type: "android",
            version: "1.0",
            // fcm_key: fcmKey,
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
                isFromSignup: true,
                isFromChangeNumber: false,
                otptype: "register",
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
      <View style={{ flex: 1, flexDirection: "row" }}>
        <KeyboardAvoidingView
          enabled
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flex: 1 }}
        >
          <ScrollView style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 32,
                color: "#9F2241",
                marginTop:
                  Platform.OS == "ios" && deviceHeight > 811 ? 110 : 50,
                fontWeight: "bold",
                left: 30,
              }}
            >
              Sign Up {"\n"}to get Started
            </Text>

            <TextField
              containerStyle={{
                marginLeft: 30,
                marginRight: 30,
                alignSelf: "center",
                width: deviceWidth - 60,
              }}
              label="Name"
              style={{ width: "100%" }}
              onChangeText={(fullName) => this.setState({ fullName })}
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
                marginLeft: 30,
                marginRight: 30,
                alignSelf: "center",
                width: deviceWidth - 60,
              }}
              label="Email Address"
              style={{ width: "100%" }}
              onChangeText={(emailAddress) => this.setState({ emailAddress })}
              textColor={"#9F2241"}
              tintColor="black"
              baseColor="black"
              lineWidth={1}
              activeLineWidth={1}
              disabledLineWidth={1}
              keyboardType="email-address"
              labelTextStyle={{
                fontFamily: "HelveticaNeue",
                fontWeight: "300",
              }}
            />

            <View
              style={{
                flexDirection: "row",
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

            <TextField
              containerStyle={{
                marginLeft: 30,
                marginRight: 30,
                alignSelf: "center",
                width: deviceWidth - 60,
              }}
              label="Password"
              style={{ width: "100%" }}
              onChangeText={(password) => this.setState({ password })}
              textColor={"#9F2241"}
              tintColor="black"
              baseColor="black"
              lineWidth={1}
              secureTextEntry={true}
              activeLineWidth={1}
              disabledLineWidth={1}
              textContentType={"oneTimeCode"}
              labelTextStyle={{
                fontFamily: "HelveticaNeue",
                fontWeight: "300",
              }}
            />

            <TextField
              containerStyle={{
                marginLeft: 30,
                marginRight: 30,
                alignSelf: "center",
                width: deviceWidth - 60,
              }}
              label="Confirm Password"
              style={{ width: "100%" }}
              onChangeText={(confirmPassword) =>
                this.setState({ confirmPassword })
              }
              textColor={"#9F2241"}
              tintColor="black"
              baseColor="black"
              lineWidth={1}
              secureTextEntry={true}
              activeLineWidth={1}
              disabledLineWidth={1}
              textContentType={"oneTimeCode"}
              labelTextStyle={{
                fontFamily: "HelveticaNeue",
                fontWeight: "300",
              }}
            />

            <View
              style={{
                flexDirection: "row",
                height: 70,
                marginLeft: 30,
                marginTop: 10,
                marginRight: 30,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.termsAndConditionsCheckButton}
                onPress={() =>
                  this.setState({ showImage: !this.state.showImage })
                }
              >
                {this.renderTermConditions()}
              </TouchableOpacity>

              <TouchableOpacity
                style={{ margin: 5, marginRight: 30, justifyContent: "center" }}
                // onPress={() => this.termsConditionClicked()}
                disabled={true}
              >
                <Text style={styles.termsConditionLabelText}>
                  I agree to the
                  <Text
                    onPress={() => this.termsConditionClicked()}
                    style={{
                      fontSize: 16,
                      color: "#9F2241",
                      fontFamily: "HelveticaNeue",
                      fontWeight: "300",
                    }}
                  >
                    {" "}
                    {"Terms & Conditions"}{" "}
                  </Text>
                  and{" "}
                  <Text
                    onPress={() => this.PrivacyClicked()}
                    style={{
                      fontSize: 16,
                      color: "#9F2241",
                      fontFamily: "HelveticaNeue",
                      fontWeight: "300",
                    }}
                  >
                    {" "}
                    {"Privacy Policy"}{" "}
                  </Text>{" "}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={() => this.signUpButtonClicked()}
            >
              <Text style={styles.signupButton}>Sign Up</Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 30,
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 17,
                  fontFamily: "HelveticaNeue",
                  fontWeight: "300",
                  alignItems: "center",
                }}
              >
                Already a member?{" "}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.props.navigation.navigate("Login")}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: "#9F2241",
                    fontFamily: "HelveticaNeue",
                    fontWeight: "300",
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
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
  },
  backImage: {
    height: deviceHeight,
    width: "100%",
  },
  forgotButton: {
    alignItems: "flex-end",
    color: "#65A944",
    fontSize: 17,
    fontWeight: "500",
    marginRight: 30,
    height: 30,
    marginTop: 20,
  },
  forgot: {
    color: "#65A944",
    fontSize: 17,
    fontWeight: "500",
    alignItems: "center",
    textDecorationLine: "underline",
  },
  button: {
    width: deviceWidth - 60,
    height: 48,
    backgroundColor: "#9F2241",
    marginVertical: 25,
    alignItems: "center",
    left: 30,
    borderRadius: 12,
    justifyContent: "center",
  },
  signupButton: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "HelveticaNeue",
    fontWeight: "300",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  termsAndConditionsCheckButton: {
    height: 20,
    width: 20,
    marginTop: 7,
    marginRight: 10,
  },
  termsConditionLabelText: {
    color: "black",
    flexDirection: "row",
    justifyContent: "flex-start",
    fontSize: 16,
    margin: 5,
    top: 3,
    paddingRight: 19,
    fontFamily: "HelveticaNeue",
    fontWeight: "300",
  },
  presentAddressIcon: {
    height: 20,
    width: 20,
    justifyContent: "flex-start",
    padding: 7,
    bottom: 2,
    flexDirection: "row",
    resizeMode: "contain",
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
