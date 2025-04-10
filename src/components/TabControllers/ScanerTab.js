import React, { useRef,useState,useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import close from "../../assets/images/other_icons/close.png";
const CAM_VIEW_HEIGHT = Dimensions.get('screen').width * 1.5;
const CAM_VIEW_WIDTH = Dimensions.get('screen').width;

const leftMargin = 50;
const topMargin = 50;
const frameWidth = 200;
const frameHeight = 250;
import IconBadge from "react-native-icon-badge";

const scanAreaX = leftMargin / CAM_VIEW_HEIGHT;
const scanAreaY = topMargin / CAM_VIEW_WIDTH;
const scanAreaWidth = frameWidth / CAM_VIEW_HEIGHT;
const scanAreaHeight = frameHeight / CAM_VIEW_WIDTH;
import { useIsFocused, CommonActions,TabActions } from "@react-navigation/native";
const jumpToAction2 = TabActions.jumpTo('Home');
import ProfileIcon from "../../assets/images/other_icons/iconProfile.png";
import CartIcon from "../../assets/images/other_icons/iconCart.png";
import iconAddAction from "../../assets/images/other_icons/iconAddAction.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveData, _retrieveData, AUTH_TOKEN } from "../../helpers/helper";
import axios from "axios";
import * as constants from "../../constants/Const";
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";

const ScanerTab = ({navigation }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

    const cameraRef = useRef(null);
  const takePicture = async () => {
    setIsLoading(true)
    if (cameraRef.current) {

      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri);

      SubmitClicked(
        data.uri
      )


    }
  };


  const isFocused = useIsFocused();

  const SubmitClicked = async(image) => {

    let Imageurlstr = image.replace("file://", "")


  var  token = await AsyncStorage.getItem(AUTH_TOKEN);

    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
        
        setIsLoading(true)

        const data = new FormData();

        data.append('image', {
          uri: image,
          type: 'image/jpeg', // or photo.type
          name: 'scanImage.jpg',
        });
        console.log("now1",data)
      
        axios({
          method: "post",
          url: constants.baseURL + constants.productscan,
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: "application/json",
            Authorization: "Bearer " + token
          },
          data: data,
        })
          .then((response) => {
            setIsLoading(false)
            console.log(response.data)
          
            if (response.data.status === 200) {
            
              console.log('hjjh',response.data.data)
              navigation.navigate("AddWineScreen",{
                type:'200',
                MFG: moment( response.data.data.MFG).format("YYYY")
                
               ,
                alcohal_prec:response.data.data.alcohal_prec,
                category:response.data.data.category._id,
                catname:response.data.data.category.name,
                history:response.data.data.history,
                images:response.data.data.images,
                ingredients:response.data.data.ingredients,
                name:response.data.data.name,
                relevant_links:response.data.data.relevant_links,
                star_rating:response.data.data.star_rating,
                adminid:response.data.data._id
                })
        
            //   //Alert.alert("Alert", response.data.message);
            //  //navigation.goBack()
         
            } 
          else  if (response.data.status === 201) {
           
            navigation.navigate("AddWineScreen",{
              type:'201',
              MFG:"",
              alcohal_prec:"",
              category:"",
              catname:"",
              history:"",
              images:[],
              ingredients:"",
              name:"",
              relevant_links:"",
              star_rating:0,
              adminid:""

              })
             
        
             // Alert.alert("Alert", response.data.message);
           //   navigation.goBack()
         
            } 
            
            else {
              setIsLoading(false)
              console.log(response.data);
             Alert.alert("Alert", response.data.message);
           //   this.setState({ loading: false });

         
            }
          })
          .catch((error) => {
            console.log("Server exception",error);
          
            setIsLoading(false)
            Alert.alert("Alert", constants.serverError);
           // this.ShowAlertWithDelay(constants.serverError);
            return;
          });
      }
    });

  }
  useEffect(() => {
    console.log("useeffect>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
   
    cartcount1()

  }, [isFocused]);

  const cartcount1 = async () => {
    token = await AsyncStorage.getItem(AUTH_TOKEN);
    NetInfo.fetch().then((state) => {
      if (state.isInternetReachable == false) {
        Alert.alert("No Internet", constants.noInternet);
        return;
      } else {
       axios({
          method: "get",
          url: constants.baseURL + constants.cartcount,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: "Bearer " + token
          },
          
        })
          .then((response) => {
            setIsLoading(false);
            console.log(response.data)
            console.log("lkijlkj")

 setTimeout(() => {
  setCartCount(response.data.data.count.data)

     }, 500);







            if (response.data.status == 200) {
             
            }
            if (response.data.status == 400) {
            }
          })
          .catch(function (error) {
            setIsLoading(false);
          });
      }

    });

  }
  return (
    <SafeAreaView style={styles.safeWrapper}>
       
      <View style={styles.container}>
      <View
        style={{
          height: 50,
          width: "100%",
          backgroundColor:"#FFFFFF",
          borderBottomLeftRadius:25,
          borderBottomRightRadius:25,
          borderColor: "#DCC7B7",
          borderWidth: 1,

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
          <View style={{ height: 48, width: "15%" }}></View>

          <View
            style={{ width: "55%", height: "100%", justifyContent: "center" }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#000",
                marginLeft: "15%",
                alignSelf: "center",
                fontWeight: "bold",
                alignSelf: "center",
                textAlign: "center",
                fontFamily: "HelveticaNeue",
              }}
            >
              Scan Wine Label
            </Text>
          </View>
          <View
            style={{
              height: "100%",
              width: "20%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ height: "100%", width: "50%" }}>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                activeOpacity={0.7}
                onPress={() => navigation.navigate("UserProfile")}
              >
                <Image
                  source={ProfileIcon}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: "contain",
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ height: "100%", width: "50%" }}>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                activeOpacity={0.7}
                // CartScreen
                onPress={() => navigation.navigate("CartScreen")}
              >
                <IconBadge
                  MainElement={
                    <Image
                      source={CartIcon}
                      style={{
                        height: 20,
                        width: 20,
                        resizeMode: "contain",
                        alignSelf: "center",
                      }}
                    />
                  }
                  BadgeElement={<Text style={{ color: "#FFFFFF" }}>{cartCount}</Text>}
                  IconBadgeStyle={{
                    position: "absolute",
                    top: -10,
                    right: -12,
                    minWidth: 20,
                    height: 20,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FF0000",
                  }}
                  Hidden={cartCount == 0}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
        <RNCamera
          ref={cameraRef}
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          captureAudio={false}
          
          rectOfInterest={{
                        x: scanAreaX,
                        y: scanAreaY,
                        width: scanAreaWidth,
                        height: scanAreaHeight,
                    }}
                    cameraViewDimensions={{
                        width: CAM_VIEW_WIDTH,
                        height: CAM_VIEW_HEIGHT,
                    }}
        >
 <View
                        style={{
                        position: 'absolute',
                        top: CAM_VIEW_WIDTH/2,
                        
                        width: frameWidth,
                        height: frameHeight,
                        borderWidth: 2,
                        borderColor: 'red',
                        opacity: 0.5,
                        }}
                    />

        </RNCamera>
        {/* <View style={styles.top}>
        <TouchableOpacity onPress={() => {
                            navigation.dispatch(jumpToAction2)
                        }}>

          <Image
            source={close}
            style={{ height: 30, width: 30 }}
          ></Image>
          </TouchableOpacity>
        </View> */}
        <View style={styles.snapWrapper}>
          <TouchableOpacity onPress={takePicture} style={styles.capture}>
            <Text style={styles.snapText}>Scan</Text>
          </TouchableOpacity>
        </View>
     
      </View>


      <Modal
        visible={isLoading}
        animationType={"none"}
        transparent={true}
        onRequestClose={() => {}}
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
            <Text
              style={{
                fontSize: 16,
                color: "white",
                alignSelf: "center",
                fontWeight: "bold",
                alignSelf: "center",
                textAlign: "center",
                marginBottom:5,
                fontFamily: "HelveticaNeue",
              }}
            >
            {"Please wait ...."}

            </Text>
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: "white",
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

const styles = StyleSheet.create({
  safeWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    position: 'relative',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  snapWrapper: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    bottom: 50,
    left: 16,
    right: 16,
  },
  top: {
    flex: 0,
    flexDirection: 'row',
    justifyContent:'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    top: 30,
    left: 16,
    right: 16,
  },
  snapText: {
    fontSize: 14,
    color: '#9F2241',
    fontFamily: "HelveticaNeue",
  },
});



export default ScanerTab;