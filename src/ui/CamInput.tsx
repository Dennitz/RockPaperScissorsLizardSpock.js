import * as React from 'react';
import './styles/CamInput.css';
import { IMAGE_SIZE } from '../constants';

export interface Props {
  /**
   * Called when the component is ready to display video.
   */
  onReady?: (webcamElement?: HTMLVideoElement) => void;
  /**
   * Called if no camera is detected.
   */
  onNoCamera?: () => void;
  /**
   * Called if premissions for camera usage where received.
   */
  onPermissionReceived?: () => void;
  /**
   * Called if premissions for camera usage where denied.
   */
  onPermissionDenied?: () => void;
}

export default class CamInput extends React.Component<Props, {}> {
  private webcamElement: HTMLVideoElement;

  componentDidMount() {
    const noop = () => {};
    const {
      onReady = noop,
      onNoCamera = noop,
      onPermissionReceived = noop,
      onPermissionDenied = noop,
    } = this.props;

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
          onPermissionReceived();
          this.webcamElement.src = window.URL.createObjectURL(stream);
          this.webcamElement.play().then(() => onReady(this.webcamElement));
        },
        err => {
          onPermissionDenied();
        },
      );
    } else {
      onNoCamera();
    }
  }

  getWebcamElement = (): HTMLVideoElement => this.webcamElement;

  render() {
    return (
      <video
        ref={(v: HTMLVideoElement) => (this.webcamElement = v)}
        className="CamInput"
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
      />
    );
  }
}
