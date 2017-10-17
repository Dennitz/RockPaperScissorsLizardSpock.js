import * as React from 'react';
import {
  Array3D,
  gpgpu_util,
  GPGPUContext,
  NDArrayMathGPU,
} from '../deeplearn';
import { SqueezeNet } from '../ai/squeezenet';
import { IMAGE_SIZE } from '../constants';
import { sleep } from '../utils';
import './styles/WebcamClassifier.css';

export interface Props {
  /** 
   * Function that is called with the name of the predicted class, 
   * everytime a prediction is made. 
   */
  onPredict: (predictedClass: string) => void;
}

export default class CamInput extends React.Component<Props, {}> {
  private webcamElement: HTMLVideoElement;
  private gl: WebGLRenderingContext;
  private gpgpu: GPGPUContext;
  private math: NDArrayMathGPU;
  private squeezeNet: SqueezeNet;

  constructor() {
    super();
    this.gl = gpgpu_util.createWebGLContext();
    this.gpgpu = new GPGPUContext(this.gl);
    this.math = new NDArrayMathGPU(this.gpgpu);
    this.squeezeNet = new SqueezeNet(this.math);
  }

  componentDidMount() {
    const navigatorAny = navigator as any;
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigatorAny.webkitGetUserMedia ||
      navigatorAny.mozGetUserMedia ||
      navigatorAny.msGetUserMedia;

    // get permission for webcam, if successful attach
    // webcam footage to video element and start predicting
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { video: { width: IMAGE_SIZE, height: IMAGE_SIZE } },
        stream => {
          this.webcamElement.src = window.URL.createObjectURL(stream);
          this.webcamElement.play().then(() => {
            this.squeezeNet.loadVariables().then(this.predict);
          });
        },
        err => {
          console.log(err);
        },
      );
    } else {
      console.log('no camera');
    }
  }

  private predict = async () => {
    const image = Array3D.fromPixels(this.webcamElement);

    this.math.scope((keep, track) => {
      const inferenceResult = this.squeezeNet.infer(image);
      // const topClassesToProbability = this.squeezeNet.getTopKClasses(
      //   inferenceResult.logits,
      //   6,
      // );
      // console.log(topClassesToProbability);
      const predictedClass = this.squeezeNet.getTopClass(
        inferenceResult.logits,
      );
      this.props.onPredict(predictedClass);
    });

    image.dispose();

    await sleep(50);
    this.predict();
  };

  render() {
    return (
      <video
        ref={(v: HTMLVideoElement) => (this.webcamElement = v)}
        className="WebcamClassifier"
        // width and height props have to be set to work with deeplearn.js
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
      />
    );
  }
}
