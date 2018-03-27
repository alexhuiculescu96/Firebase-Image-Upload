import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Modal } from "react-native";

import Spinner from "react-native-loading-spinner-overlay";
import { Circle } from "react-native-progress";

type SpinnerOverlayPropTypes = {
  progress: number,
  spinnerStyle: any,
  indeterminate: boolean,
  visible: boolean
};
export default class SpinnerOverlay extends Component<SpinnerOverlayPropTypes> {
  render() {
    return (
      <Spinner visible={this.props.visible}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", margin: 100 }}>
          <Circle size={this.props.progress} indeterminate={this.props.indeterminate} />
        </View>
      </Spinner>
    );
  }
}
