//@flow
//@ts-check
import React, { Component } from "react";
import { StyleSheet, View, Image, Text, Dimensions, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ModalSelector from "react-native-modal-selector";

type ButtonProps = {
  onPress: () => void,
  onSelect: () => void,
  title: string,
  buttonStyle: any,
  titleTextStyle: any,
  titleTextSize: number,
  disabled: boolean,
  data: { key: string, value: number }[]
};

export default class UploadPhotoButton extends Component<ButtonProps> {
  constructor(props: ButtonProps) {
    super(props);
    this.state = {
      //Used for storing the user's selection
      optionSelected: 0
    };
  }

  render() {
    const data = this.props.data;
    let title = this.props.title;

    return (
      <TouchableOpacity
        style={{ marginHorizontal: 20, marginBottom: 20 }}
        disabled={this.props.disabled}
      >
        <LinearGradient
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 0.1 }}
          colors={["#990000", "#FF0000"]}
          style={style.linearGradient}
        >
          <View>
            <ModalSelector
              //Do not display alerts and modals at the same time
              data={data}
              initValue={title}
              onChange={(option) => {
                console.log("UploadPhotoButton: onChange, with option ", JSON.stringify(option));
                if (typeof this.props.onSelect !== "undefined" && this.props.onSelect !== null) {
                  console.log("calling onSellect");
                  this.props.onSelect(option.key);
                }
              }}
              selectTextStyle={[style.buttonText, { fontSize: this.props.titleTextSize }]}
              selectStyle={style.button}
              cancelText={"CANCEL"}
              //When running on iOS, add the following 
              //onDismiss={this.props.onDismiss}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const style = {
  button: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "#00FFFFFF"
  },
  gradient: {
    height: 50,
    borderRadius: 2
  },
  buttonText: {
    width: "90%",
    fontSize: "14",
    textAlign: "center",
    backgroundColor: "transparent",
    textAlignVertical: "center",
    color: "#FFFFFF",
    letterSpacing: 2
  }
};
