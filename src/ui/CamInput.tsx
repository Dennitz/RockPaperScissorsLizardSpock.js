import * as React from 'react';
import './styles/CamInput.css';
import { IMAGE_SIZE } from '../constants';

export default class CamInput extends React.Component {
  private webcamElement: HTMLVideoElement;

  componentDidMount() {
    const navigatorAny = navigator as any;
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigatorAny.webkitGetUserMedia ||
      navigatorAny.mozGetUserMedia ||
      navigatorAny.msGetUserMedia;

    // get permission for webcam, if successful attach
    // webcam footage to video element
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { video: { width: IMAGE_SIZE, height: IMAGE_SIZE } },
        stream => {
          this.webcamElement.src = window.URL.createObjectURL(stream);
          this.webcamElement.play();
        },
        err => {
          console.log(err);
        },
      );
    } else {
      console.log('no camera');
    }
  }

  getWebcamElement = (): HTMLVideoElement => this.webcamElement;

  render() {
    return (
      <video
        ref={(v: HTMLVideoElement) => (this.webcamElement = v)}
        className="CamInput"
      />
    );
  }
}
