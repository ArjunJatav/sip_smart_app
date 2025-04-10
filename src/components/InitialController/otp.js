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
  Modal,
  SafeAreaView,
  Keyboard,
} from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import NetInfo from "@react-native-community/netinfo";
import * as constants from "../../constants/Const";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import backImage from "../../assets/images/other_icons/back.png";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import { CommonActions } from "@react-navigation/native";

var MobileVal = null;
var countryCode = null;

var isFromSignup = false;
var isFromChangeNumber = false;

var type = "";
var token = null;
var userId = null;
var name = null;
var fcmKey = null;
var otptype = "";

export default class OTP extends React.Component {
  constructor(props) {
    super(props);

    //  const { navigation }  = this.props;
    //comment by saneesh
    MobileVal = this.props.route.params.MobileVal;
    countryCode = this.props.route.params.countryCode;
    isFromSignup = this.props.route.params.isFromSignup;
    isFromChangeNumber = this.props.route.params.isFromChangeNumber;
    otptype = this.props.route.params.otptype;

    this.OTPText1 = React.createRef();
    this.OTPText2 = React.createRef();
    this.OTPText3 = React.createRef();
    this.OTPText4 = React.createRef();
    this.state = {
      otpResponse: undefined,
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      verificationCode: "",
      loading: false,
    };
  }

  onEnteringOTP1(text) {
    this.setState({
      otp1: text,
    });
    if (text.length > 0) {
      this.OTPText2.current.focus();
    }
  }
  onEnteringOTP2(text) {
    this.setState({
      otp2: text,
    });

    if (text.length > 0) {
      this.OTPText3.current.focus();
    }
  }
  onEnteringOTP3(text) {
    this.setState({
      otp3: text,
    });

    if (text.length > 0) {
      this.OTPText4.current.focus();
    }
  }
  onEnteringOTP4(text) {
    this.setState({
      otp4: text,
      verificationCode:
        this.state.otp1 + this.state.otp2 + this.state.otp3 + text,
    });
  }

  async getFcmToken() {
    fcmKey = await AsyncStorage.getItem("fcmToken");
  }

  componentDidMount() {
    this.getFcmToken();
  }

  storeData = async (value) => {
    try {
      
      await AsyncStorage.setItem("Token", token);

      this.props.navigation.navigate("AppNavigator", {
        screen: "HomeNavigator",
      });
    } catch (e) {
      // saving error
    }
  };

  async resendOTPClicked() {
    var token = await AsyncStorage.getItem(AUTH_TOKEN);

    this.setState({ loading: true });
    axios({
      method: "post",
      url: constants.baseURL + constants.resendOTPApi,
      header: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        country_code: countryCode,
        mobile_number: MobileVal,
        device_id: fcmKey,
        device_type: "android",
        version: "1.0",
        otp_type:
          otptype === "forget"
            ? "forgot_password"
            : otptype === "changenumber"
            ? "change_mobile"
            : "verify_user",
        authToken: otptype == "changenumber" ? token : "",
      },
    })
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.status != 201) {
          this.setState({ loading: false });
          this.ShowAlertWithDelay(response.data.message);
          return;
        } else {
          this.setState({ loading: false });
          this.ShowAlertWithDelay(response.data.message);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        this.ShowAlertWithDelay(constants.serverError);
        return;
      });
  }

  verifyOTPClicked() {
    if (isFromChangeNumber == false) {
      console.log("response.dat>>>>");
      this.OTPSubmitClicked();
    } else {
      this.OTPSubmitonChangeMobileClicked();
      console.log("response.dat2>>>>");
    }
  }

  async OTPSubmitClicked() {
    var token = await AsyncStorage.getItem(AUTH_TOKEN);
    if (this.state.verificationCode.length == 4) {
      if (isFromSignup == true) {
        type = "verify_user";
      } else {
        type = "forgot_password";
      }

      this.setState({ loading: true });
      axios({
        method: "post",
        url:
          otptype == "changenumber"
            ? constants.baseURL + constants.userchangeMobileOTPVerify
            : constants.baseURL + constants.verifyOTPApi,

        header: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data:
          otptype == "changenumber"
            ? {
                country_code: countryCode,
                mobile_number: MobileVal,
                otp: this.state.verificationCode,
                otp_type: "change_mobile",
                authToken: token,
              }
            : {
                country_code: countryCode,
                mobile_number: MobileVal,
                otp: this.state.verificationCode,
                otp_type: type,
                device_id: "4512ASYPB",
                device_type: "android",
                version: "1.0",
              },
      })
        .then((response) => {
          this.setState({ loading: false });
          if (response.data.status == 200) {
            if (otptype == "changenumber") {
              Alert.alert("Alert", response.data.message);
              navigation.goBack();
            } else {
              if (isFromSignup == true) {
                this.setState({ loading: false });

                token = response.data.data.token;
                saveData(token, AUTH_TOKEN);
                saveData(response.data.data.userId, "userId");

                this.props.navigation.navigate(
                  "Address",

                  {
                    type: "register",
                  }
                );
              } else {
                this.setState({ loading: false });
                this.props.navigation.navigate("ResetPassword", {
                  mobileVal: MobileVal,
                  countryCode: countryCode,
                });
              }
            }
          } else {
            this.setState({ loading: false });
            this.ShowAlertWithDelay(response.data.message);
            return;
          }
        })
        .catch((error) => {
          this.ShowAlertWithDelay(constants.serverError);
          return;
        });
    } else {
      Alert.alert("Alert", constants.otpRequired);
    }
  }

  async OTPSubmitonChangeMobileClicked() {
    let userToken = await AsyncStorage.getItem(AUTH_TOKEN);

    if (this.state.verificationCode.length == 4) {
      this.setState({ loading: true });
      axios({
        method: "post",
        url: constants.baseURL + constants.ChangeNumberVerify,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + userToken,
        },
        data: {
          otp: this.state.verificationCode,
          otp_type: "change_mobile",
          device_id: "4512ASYPB",
          device_type: "android",
          version: "1.0",
        },
      })
        .then((response) => {
          this.setState({ loading: false });
          if (response.data.status == 200) {
            this.onSuccessChangeMobileVerify();
          } else {
            this.setState({ loading: false });
            this.ShowAlertWithDelay(response.data.message);
            return;
          }
        })
        .catch((error) => {
          this.ShowAlertWithDelay(constants.serverError);
          return;
        });
    } else {
      Alert.alert("Alert", constants.otpRequired);
    }
  }

  async onSuccessChangeMobileVerify() {
    let userToken = await AsyncStorage.getItem(AUTH_TOKEN);

    axios({
      method: "post",
      url: constants.baseURL + constants.resetMobileNumberApi,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + userToken,
      },
      data: {
        country_code: countryCode,
        new_mobile: MobileVal,
        device_id: "4512ASYPB",
        device_type: "android",
        version: "1.0",
      },
    })
      .then((response) => {
        if (response.data.status == 200) {
          Alert.alert("Alert", response.data.message);
          const resetAction = CommonActions.reset({
            routes: [{ name: "HomeNavigator" }],
          });
          this.props.navigation.dispatch(resetAction);
        } else {
          this.setState({ loading: false });
          this.ShowAlertWithDelay(response.data.message);
          return;
        }
      })
      .catch((error) => {
        this.ShowAlertWithDelay(constants.serverError);
        return;
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
            this.setState({
              otp1: "",
              otp2: "",
              otp3: "",
              otp4: "",
              verificationCode: "",
              loading: false,
            });
            this.OTPText1.current.focus();
          },
        },
      ],
      { cancelable: false }
    );
  };

  backButtonClicked() {
    this.props.navigation.pop();
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "row", backgroundColor: "white" }}>
        <SafeAreaView>
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
                Verification
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
              marginLeft: 32,
              marginTop: 30,
              fontFamily: "HelveticaNeue",
              fontWeight: "300",
              marginRight: 30,
            }}
          >
            4 digit OTP code has been sent to your Mobile No., Please enter it
            here.
          </Text>

          <View style={styles.blockLayout}>
            <TextInput
              style={styles.verifyBlock}
              ref={this.OTPText1}
              secureTextEntry={true}
              onChangeText={(otp1) => this.onEnteringOTP1(otp1)}
              maxLength={1}
              value={this.state.otp1}
              inputRef={(input) => {
                this.state.OTPText1 = input;
              }}
              autoFocus={this.state.autofocusText1}
              selectionColor="gray"
              keyboardType="number-pad"
            />

            <TextInput
              style={styles.verifyBlock}
              ref={this.OTPText2}
              secureTextEntry={true}
              maxLength={1}
              value={this.state.otp2}
              onChangeText={(otp2) => this.onEnteringOTP2(otp2)}
              inputRef={(input) => {
                this.state.OTPText2 = input;
              }}
              autoFocus={this.state.autofocusText2}
              selectionColor="gray"
              keyboardType="number-pad"
            ></TextInput>

            <TextInput
              style={styles.verifyBlock}
              ref={this.OTPText3}
              secureTextEntry={true}
              selectionColor="gray"
              maxLength={1}
              value={this.state.otp3}
              inputRef={(input) => {
                this.state.OTPText3 = input;
              }}
              autoFocus={this.state.autofocusText3}
              onChangeText={(otp3) => this.onEnteringOTP3(otp3)}
              keyboardType="number-pad"
            ></TextInput>

            <TextInput
              style={styles.verifyBlock}
              ref={this.OTPText4}
              secureTextEntry={true}
              selectionColor="gray"
              value={this.state.otp4}
              inputRef={(input) => {
                this.state.OTPText4 = input;
              }}
              maxLength={1}
              autoFocus={this.state.autofocusText4}
              onChangeText={(otp4) => this.onEnteringOTP4(otp4)}
              keyboardType="number-pad"
            ></TextInput>
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => this.verifyOTPClicked()}
          >
            <Text style={styles.signupButton}>Submit</Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => this.resendOTPClicked()}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: "black",
                  fontFamily: "HelveticaNeue",
                  fontWeight: "300",
                }}
              >
                Haven't received code ?
                <Text
                  style={{
                    fontSize: 16,
                    color: "firebrick",
                    fontFamily: "HelveticaNeue",
                    fontWeight: "300",
                  }}
                >
                  {" "}
                  {"Resend"}{" "}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {this.state.loading && (
          <View
            style={{
              position: "absolute",

              height: "100%",
              width: "100%",

              flex: 1,
              marginTop: "60%",
            }}
          >
            <ActivityIndicator color="#9F2241" size="large"></ActivityIndicator>
          </View>
        )}
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
  forgotButton: {
    alignItems: "flex-end",
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "500",
    marginRight: 30,
    height: 30,
    marginTop: 20,
  },
  forgot: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "500",
    alignItems: "center",
    textDecorationLine: "underline",
  },
  button: {
    width: deviceWidth - 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    left: 30,
    /* Main Color */
    backgroundColor: "#9F2241",
    borderRadius: 10,
    marginTop: 140,
  },
  signupButton: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "HelveticaNeue",
    fontWeight: "300",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  verifyBlock: {
    marginHorizontal: 5,
    textAlign: "center",
    color: "firebrick",
    fontSize: 28,
    width: 70,
    height: 60,
    borderRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: "firebrick",
  },
  blockLayout: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    paddingHorizontal: 20,
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
