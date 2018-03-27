import ModalSelector from "react-native-modal-selector";
import React, { Component } from "react";
import { StyleSheet, View, Image, Text, Dimensions, TouchableOpacity } from "react-native";
import style from "react-native-modal-selector/style";
import UploadPhotoButton from "./UploadPhotoButton";

type PhotoPickerPropTypes = {
  imageUri: ?string,
  displayButton: boolean
};

export default class PhotoPicker extends Component {
  props: PhotoPickerPropTypes;
  constructor(props) {
    super(props);
    state = {
      displayType: null
    };
  }
  render() {
    const modalData = [
      { key: 0, section: true, label: "Please Select" },
      { key: 1, label: "Take Photo" },
      { key: 2, label: "Choose Photo" }
    ];
    let imageUri = this.props.imageUri;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image source={imageUri} />
        {this.props.displayButton ? (
          <UploadPhotoButton
            onPress={()=>{this.onPress();}}
            onSelect={selection => {
              this.onSelect(selection);
            }}
            title={"upload"}
            data={modalData}
          />
        ) : null}
      </View>
    );
  }
  onPress() {
    console.log("Button has been pressed");
  }
  onSelect(selection) {
    console.log("Selection has been made:", selection);
  }
}
const displayType = {
  noImage: "noImage",
  loading: "loadnig",
  imageShown: "imageShown"
};
