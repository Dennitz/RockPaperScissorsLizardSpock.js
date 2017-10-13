import * as React from 'react';
import {
  gpgpu_util,
  GPGPUContext,
  NDArrayMathCPU,
  NDArrayMathGPU,
} from 'deeplearn';
import { SqueezeNet } from '../ai/squeezenet';
import { IMAGE_SIZE } from '../constants';
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
  private mathCPU: NDArrayMathCPU;
  private squeezeNet: SqueezeNet;

  constructor() {
    super();
    this.gl = gpgpu_util.createWebGLContext();
    this.gpgpu = new GPGPUContext(this.gl);
    this.math = new NDArrayMathGPU(this.gpgpu);
    this.mathCPU = new NDArrayMathCPU();
    this.squeezeNet = new SqueezeNet(this.gpgpu, this.math);
  }

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

    this.squeezeNet.loadVariables().then(this.predict);
  }

  private predict = () => {
    const canvasTextureShape: [number, number] = [IMAGE_SIZE, IMAGE_SIZE];
    const canvasTexture = this.math
      .getTextureManager()
      .acquireTexture(canvasTextureShape);

    this.gpgpu.uploadPixelDataToTexture(canvasTexture, this.webcamElement);

    this.math.scope((keep, track) => {
      const preprocessedInput = track(
        this.squeezeNet.preprocessColorTextureToArray3D(
          canvasTexture,
          canvasTextureShape,
        ),
      );

      const inferenceResult = this.squeezeNet.infer(preprocessedInput);
      const predictedClass = this.squeezeNet.getTopClass(
        inferenceResult.logits,
      );
      this.props.onPredict(predictedClass);
    });

    this.math
      .getTextureManager()
      .releaseTexture(canvasTexture, canvasTextureShape);
  };

  render() {
    return (
      <video
        ref={(v: HTMLVideoElement) => (this.webcamElement = v)}
        className="WebcamClassifier"
      />
    );
  }
}
