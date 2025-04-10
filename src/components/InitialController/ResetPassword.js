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
  ActivityIndicator,
  Modal,
  Alert,
  SafeAreaView,
} from "react-native";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import NetInfo from "@react-native-community/netinfo";
import * as constants from "../../constants/Const";
import axios from "axios";
var mobileVal = null;
var countryCode = null;
import hide from "../../assets/images/other_icons/hidden.png";
import view from "../../assets/images/other_icons/view.png";
import backImage from "../../assets/images/other_icons/back.png";
import { TextField } from "rn-material-ui-textfield";

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    mobileVal = this.props.route.params.mobileVal
    countryCode = this.props.route.params.countryCode

    this.state = {
      password: "",
      confirmPassword: "",
      loading: false,
      showResetPasswordView: false,
      showPassword: true,
      showConfirmPassword: true,
    };
  }

  backButtonClicked() {
    this.props.navigation.pop();
  }

  PasswordVisibilityClicked() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  ConfirmPasswordVisibilityClicked() {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  }

  ConfirmClicked() {
    this.props.navigation.navigate("Login");
  }

  NextButtonClicked() {
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
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

        this.setState({ loading: true });

        console.log("Country Code: ", countryCode)
        console.log("Mobile Number: ", mobileVal)
        console.log("Password: ", this.state.password)

        axios({
          method: "post",
          url: constants.baseURL + constants.resetPasswordApi,
          header: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          data: {
            country_code: countryCode,
            mobile_number: mobileVal,
            new_password: this.state.password,
            device_id: "4512ASYPB",
            device_type: "android",
            version: "1.0",
          },
        })
          .then((response) => {
            if (response.data.status != 200) {
              this.setState({ loading: false });
              console.log(response.data);
              this.ShowAlertWithDelay(response.data.message);
              return;
            } else {
              console.log(response.data);
              this.setState({ loading: false, showResetPasswordView: true });
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
                Reset Password
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
          <View
                style={{
                  marginTop: 30,

                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent:"center",
                 
                }}
              >
          <TextField
            containerStyle={{
              width: "75%",
              alignSelf: "center",
            }}
            label="Enter New Password"
            style={{ width: "100%" }}
            onChangeText={(password) => this.setState({ password })}
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
                style={{alignSelf:"center"}}
                onPress={()=>{this.PasswordVisibilityClicked()}}
                >
                {this.state.showPassword ? <Image
                  source={hide}
                  style={{
                    height: 20,
                    width: 20,
                    marginRight:10,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                />:<Image
                source={view}
                style={{
                  height: 20,
                  width: 20,
                  marginRight:10,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
}
</TouchableOpacity>
          </View>
          <View
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent:"center",
                 
                }}
              >
          <TextField
            containerStyle={{
              width: "75%",
              alignSelf: "center",
            }}
            label="Confirm Password"
            style={{ width: "100%" }}
            onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
            textColor={"#9F2241"}
            tintColor="black"
            baseColor="black"
            lineWidth={1}
            secureTextEntry={this.state.showConfirmPassword}
            activeLineWidth={1}
            disabledLineWidth={1}
            labelTextStyle={{
              fontFamily: "HelveticaNeue",
              fontWeight: "300",
            }}
          />
            <TouchableOpacity
                style={{alignSelf:"center"}}
                onPress={()=>{this.ConfirmPasswordVisibilityClicked()}}
                >
                {this.state.showConfirmPassword ? <Image
                  source={hide}
                  style={{
                    height: 20,
                    width: 20,
                    marginRight:10,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                />:<Image
                source={view}
                style={{
                  height: 20,
                  width: 20,
                  marginRight:10,
                  resizeMode: "contain",
                  alignSelf: "center",
                }}
              />
}
</TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => this.NextButtonClicked()}
          >
            <Text style={styles.signupButton}>Reset</Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 16,
                alignSelf: "center",
                fontFamily: "HelveticaNeue",
                fontWeight: "300",
              }}
            >
              Back to the{" "}
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
                {" "}
                Login{" "}
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
              alignContent: "center",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color="#9F2241" size="large"></ActivityIndicator>
          </View>
        )}

        <Modal
          visible={this.state.showResetPasswordView}
          animationType={"none"}
          transparent={false}
          onRequestClose={() => {}}
        >
          <View
            style={[
              {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `#9F2241`,
              },
            ]}
          >
            <View
              style={{
                width: 320,
                height: 300,
                borderRadius: 18,
                justifyContent: "center",
              }}
            >
              {/* 
                <Image
                  source={thumbImage}
                  style={{ height: 90, width: 90, alignSelf: "center", top: 25 }}
                /> */}

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 22,
                  color: "white",
                  marginTop: 44,
                  marginLeft: 10,
                  marginRight: 10,
                  alignSelf: "center",
                }}
              >
                Password Changed!
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "white",
                  marginTop: 4,
                  marginLeft: 10,
                  marginRight: 10,
                  alignSelf: "center",
                }}
              >
                Your password has been updated.
              </Text>

              <TouchableOpacity
                style={{
                  width: 120,
                  height: 44,
                  backgroundColor: "#ffffff",
                  marginVertical: 15,
                  alignSelf: "center",
                  borderRadius: 16,
                  justifyContent: "center",
                }}
                activeOpacity={0.7}
                onPress={() => this.ConfirmClicked()}
              >
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 20,
                    fontWeight: "500",
                    fontWeight: "bold",
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 10,
                    alignSelf: "center",
                  }}
                >
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    backgroundColor: "#9F2241",
    borderRadius: 12,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 120,
  },
  signupButton: {
    color: "white",
    fontSize: 17,
    fontFamily: "HelveticaNeue",
    fontWeight: "300",
    alignItems: "center",
    justifyContent: "center",
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
