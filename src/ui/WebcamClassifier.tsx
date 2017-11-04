import * as React from 'react';
import {
  Array3D,
  gpgpu_util,
  GPGPUContext,
  NDArrayMathGPU,
} from '../deeplearn';
import { SqueezeNet } from '../ai/squeezenet';
import { sleep } from '../utils';
import CamInput from './CamInput';

export interface Props {
  /**
   * Function that is called with the name of the predicted class,
   * everytime a prediction is made.
   */
  onPredict: (predictedClass: string) => void;
}

export default class WebcamClassifier extends React.Component<Props, {}> {
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

  private handleWebcamReady = (webcamElement: HTMLVideoElement) => {
    this.webcamElement = webcamElement;
    this.squeezeNet.loadVariables().then(this.predict);
  };

  private predict = async () => {
    const image = Array3D.fromPixels(this.webcamElement);

    this.math.scope((keep, track) => {
      const inferenceResult = this.squeezeNet.infer(image);
      const predictedClass = this.squeezeNet.getTopClass(
        inferenceResult.logits,
      );
      this.props.onPredict(predictedClass);
    });

    image.dispose();

    await sleep(500);
    this.predict();
  };

  render() {
    return <CamInput onReady={this.handleWebcamReady} />;
  }
}
