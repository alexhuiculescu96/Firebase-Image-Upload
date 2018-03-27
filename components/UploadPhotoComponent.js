import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator
} from "react-native";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

type UploadPhotoComponentPropTypes = {
  onErrorView: ?Component,
  onUploadStarted: () => {},
  onUploadProgress: (e: { uploaded: number, total: number, percentage: number }) => {},
  onUploadFinished: () => {},
  onUploadError: () => {},
  cancel: ?boolean,
  forceCancel: ?() => {},
  storageReference: firebase.storage.Reference,
  buttonView: ?Component,
  butonStyle: ?any,
  buttonContent: {
    noImageContent: string,
    imageUploadingContent: string,
    imageShownContent: string
  }
};

export default class UploadPhotoComponent extends Component {
  props: UploadPhotoComponentPropTypes;
  constructor(props) {
    super(props);
    this.state = {};
  }

  _pickImage() {
    this.setState({ uploadURL: "" });

    ImagePicker.launchImageLibrary({}, response => {
      this.uploadImage(response.uri)
        .then(url => {
          console.log("Image has been uploaded, showing url");

          this.setState({ uploadURL: url });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  render() {
    return (
      <View>
        {(() => {
          switch (this.state.uploadURL) {
            case null:
              return null;
            case "":
              return <ActivityIndicator />;
            default:
              return (
                <View>
                  <Image source={{ uri: this.state.uploadURL }} style={styles.image} />
                  <Text>{this.state.uploadURL}</Text>
                </View>
              );
          }
        })()}
        <TouchableOpacity onPress={() => this._pickImage()}>
          <Text style={styles.upload}>Upload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  uploadImage = (uri, mime = "application/octet-stream") => {
    return new Promise((resolve, reject) => {
      //Where is located the image to be updated
      const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
      //The BLOP that will contain the uploaded image
      let uploadBlob = null;
      //Storage reference, given as prop to the cmponent
      let imageRef = this.props.storageReference;
      if (typeof imageRef === "undefined" || imageRef === null) {
        //No reference has been provided
        console.log("There is no storage reference");
        reject("No reference");
        return;
      }
      if (this.props.onUploadStarted) {
        this.props.onUploadStarted();
      }
      fs
        .readFile(uploadUri, "base64")
        .then(data => {
          //Building BLOB from URI
          console.log("uploadImage: date has been read. Creating Blob ");
          return Blob.build(data, { type: `${mime};BASE64` });
        })
        .then(blob => {
          console.log("uploadImage: blob has been created,upload blob to firebase ");
          uploadBlob = blob;
          //Uploading BLOB
          const uploadTask = imageRef.put(blob, { contentType: mime });
          //Create progress helper
          let progressHelper = new UploadProgressHelper();
          //Listen for progress events
          uploadTask.on("state_changed", (snapshot: firebase.storage.UploadTaskSnapshot) => {
            //Get correct progress values using the helper class
            let progressEvent = progressHelper.onEventUpdate(
              snapshot.bytesTransferred,
              snapshot.totalBytes
            );
            console.log(
              `There are ${progressEvent.uploaded}, representing ${progressEvent.percentage} `
            );
            console.log(`Debug values: ${snapshot.bytesTransferred}`);
            //Check for callback
            if (this.props.onUploadProgress) {
              this.props.onUploadProgress({
                uploaded: progressEvent.uploaded,
                total: snapshot.totalBytes,
                percentage: progressEvent.percentage
              });
            }
          });
          return uploadTask;
        })
        .then(() => {
          //Upload is finished, resolve the Promise
          console.log("uploadImage: blob has been uploaded, getDowloadUrl ");
          uploadBlob.close();
          if (this.props.onUploadFinished) {
            this.props.onUploadFinished(url);
          }
          resolve(uri);
        })
        .catch(error => {
          //Upload has thrown error, return ErrorModelView
          console.log("uploadImage: error ", JSON.stringify(error));
          if (this.props.onUploadError) {
            this.props.onUploadError(error);
          }
          reject(error);
        });
    });
  };
}

//It's used to parse firebase UploadTaskSnapshot values
//The value contained in snapshot.bytesTransferred is not calculated well
//Intead making number addition, the library makes string concatenation
//We need to separate them
class UploadProgressHelper {
  _index: number;
  _stage: number;
  _inStage: boolean;

  constructor() {
    this._values = [];
  }

  onEventUpdate(current, total) {
    let uploadedBytes;
    if (current < 256000) {
      //First values works ok
      uploadedBytes = current;
    } else if (!this._inStage) {
      //Needed to catch first doubled value
      this._inStage = true;
      this._stage = current;
      uploadedBytes = current;
    } else {
      let currentString = "" + current;
      let stageString = "" + this._stage;
      if (currentString.startsWith(stageString)) {
        //The common case, where the <current> param is formed
        //by merging the 'stage' value with 'stageProgress' value
        let stageProgress = Number.parseFloat(currentString.substring(stageString.length));
        if (!stageProgress) stageProgress = 0;
        uploadedBytes = this._stage + stageProgress;
      } else {
        //A new stage
        this._stage = current;
        uploadedBytes = current;
      }
    }

    return {
      uploaded: uploadedBytes,
      percentage: 100 * uploadedBytes / total
    };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  image: {
    height: 200,
    resizeMode: "contain"
  },
  upload: {
    textAlign: "center",
    color: "#333333",
    padding: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "gray"
  }
});
