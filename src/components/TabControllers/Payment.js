import React, {Component, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
//import Back from '../Image/back.svg';
import backImage from "../../assets/images/other_icons/back.png";

import {WebView} from 'react-native-webview';
var PageUrl = '';
var PageTitle = '';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
export default class Payment extends Component {
  constructor(props) {
    super(props);
    PageUrl = this.props.route.params.url;
    PageTitle = this.props.route.params.header;

    this.state = {
      loaded: false,
      isLoading: true,
      showback:true
    };
  }
  

  backButtonClicked() {
    this.props.navigation.pop();
  }

  webViewMessageHandler = event => {
    if (event.nativeEvent.data === 'pageLoaded') {
      this.setState({
        loaded: true,
      });
    }
  };
   handleBackButton =()=>  {
    

    if(global.playerVisible){
    EventRegister.emit('showbar', 'back');
    }
    else{
     
      this.props.navigation.pop();


    }
    return true;
  };
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'light-content'}></StatusBar>

        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
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
           {this.state.showback && <TouchableOpacity
              style={{
                width: 50,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.7}
              onPress={() => this.props.navigation.goBack()}
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
            </TouchableOpacity>}
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
              Payment
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

          <View
            style={{
              height: deviceWidth - 50,
              width: '100%',
              flex: 1,
              backgroundColor: '#000000',
            }}>
            <WebView
              source={{uri: PageUrl}}
              style={[styles.webstyle, styles.webpageLoaded]}
              onLoad={() => this.setState({isLoading: false})}
              onMessage={event =>{const{data}=event.nativeEvent;
            console.log(data)
            
            if(data==="Payment Done"){
              this.props.navigation.pop()
              this.props.navigation.pop()
              this.props.navigation.pop()

              this.props.navigation.navigate("MyOrder")



            }
            else if(data==="Payment Failed"){
              this.props.navigation.pop()

            }
            else if(data==='Payment Click'){
              this.setState({showback: false})
            }
            }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              originWhiteList={['*']}
              scalesPageToFit={false}
            />
          </View>

          {/* {this.state.isLoading && (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(52, 52, 52, 0.5)',
                height: '100%',
                width: '100%',
                alignContent: 'center',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator
                color="#9f2241"
                size="large"></ActivityIndicator>
            </View>
          )} */}
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backImage: {
    height: '100%',
    width: '100%',
  },
  webstyle: {
    backgroundColor: '#FFFFFF',
  },
  webpageLoaded: {
    flex: 1,
    height: '100%',
  },
  webpageNotLoaded: {
    flex: 0,
    height: 0,
    opacity: 0,
  },
});
