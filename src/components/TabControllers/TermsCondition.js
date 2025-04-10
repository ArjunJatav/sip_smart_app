import React, { Component } from "react";
import {
  StyleSheet, View, BackHandler, ImageBackground, Image, TouchableOpacity, Text, Dimensions
} from 'react-native';

import { WebView } from "react-native-webview"
import backImage from '../../assets/images/other_icons/back.png';
import { SafeAreaView } from 'react-native-safe-area-context';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

var PageUrl = ""
var PageTitle = ""

export default class TermsCondition extends Component {

  constructor(props) {
    super(props);
    PageUrl = this.props.route.params.PageURL;
    PageTitle = this.props.route.params.PageName;

    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    this.props.navigation.dangerouslyGetParent().setOptions({
        tabBarVisible: false
    });

}


  backButtonClicked() {
    this.props.navigation.pop();
  }

  webViewMessageHandler = (event) => {
    if (event.nativeEvent.data === 'pageLoaded') {
      this.setState({
        loaded: true
      })
    }
  }


  render() {
    return (
      <View style={styles.container}>
          <SafeAreaView
            style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}
          >

            <View style={{ height: 48, width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor:"#fff" }}>
              <View style={{ height: 48, width: 50 }}>
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 48,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  activeOpacity={.7}
                  onPress={() => this.backButtonClicked()}
                >
                  <Image source={backImage} style={{ height: 20, width: 20, resizeMode: "contain", alignSelf: "center" }} />

                </TouchableOpacity>

              </View>
              <Text style={{ fontSize: 16, color: "#000", alignSelf: "center", fontWeight: "bold", width: deviceWidth - 100, alignSelf: "center", textAlign: "center" }}>{PageTitle}</Text>
              <View style={{ height: 48, width: 50, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              </View>
              <View style={{ position: "absolute", bottom: 1.5, height: 0.5, backgroundColor: "#fff", width: "100%", opacity: 0.5 }} />

            </View>

            <View style={{ height: deviceWidth - 50, width: "100%", flex: 1 }}>
              <WebView source={{ uri: PageUrl }}  style={[styles.webstyle, this.state.loaded == true  ? styles.webpageLoaded : styles.webpageNotLoaded]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                originWhiteList={['*']}
                injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', ' initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); window.ReactNativeWebView.postMessage('pageLoaded');
                true; javascript:document.body.style.setProperty(\"color\", \"black\"); `}
                onMessage={this.webViewMessageHandler}
                scalesPageToFit={false}
                
              />

            </View>

          </SafeAreaView>

      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  backImage: {
    height: "100%",
    width: "100%",
  },
  webstyle :{
    backgroundColor: "black"
  },
  webpageLoaded:{
    flex: 1, height: "100%", opacity: 1

  },
  webpageNotLoaded:{
    flex: 0, height: 0, opacity: 0

  }


});


