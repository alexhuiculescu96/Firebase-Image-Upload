/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, AppRegistry, View, Text,TouchableOpacity, Button } from "react-native";
import UploadPhotoComponent from "./UploadPhotoComponent";
import firebase from "firebase";
import { firebaseConfig } from "../FirebaseConfig";
import PhotoPicker from "./PhotoPicker";
import SpinnerOverlay from "./SpinnerOverlay";

// Init Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const globalRef = storage.ref("images").child("here")
class Demo extends Component {
    constructor() {
        super();
        this.state = {
            loadSpinner:false
        }
    }
  render() {
    let defaultUri = "";
    return (
      <View style={styles.container}>
        <Text>See below</Text>
        <PhotoPicker
          defaultUri = {defaultUri}
          choiceStarted = {()=>{this.choiceStarted();}}
          displayButton = {true}

        />
        <Button onPress={()=>{this.onButtonPress()}} title = {"Free kitties"}/>
        <SpinnerOverlay visible = {this.state.loadSpinner} indeterminate ={true}/>
      </View>
    );
  }
  choiceStarted() {
    console.log("**Choice has started");
  }
  onButtonPress() {
      this.setState({
          loadSpinner:true
      })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});

AppRegistry.registerComponent("FirebaseStorageDemo", () => Demo);
