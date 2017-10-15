/**
 * Taken from https://github.com/PAIR-code/deeplearnjs/blob/master/demos/models/squeezenet.ts
 * with adjusted deeplearn variable names and added function to
 * return the name of the class with the highest probability.
 */
import {
  Array1D,
  Array3D,
  Array4D,
  CheckpointLoader,
  GPGPUContext,
  NDArray,
  NDArrayMathCPU,
  NDArrayMathGPU,
} from 'deeplearn';
import * as imagenet_util from './imagenet_util';
import { CATEGORIES, IMAGE_SIZE } from '../constants';

export class SqueezeNet {
  private variables: { [varName: string]: NDArray };

  private preprocessInputShader: WebGLShader;

  constructor(private gpgpu: GPGPUContext, private math: NDArrayMathGPU) {
    this.preprocessInputShader = imagenet_util.getUnpackAndPreprocessInputShader(
      gpgpu,
      [IMAGE_SIZE, IMAGE_SIZE],
    );
  }

  /**
   * Loads necessary variables for SqueezeNet. Resolves the promise when the
   * variables have all been loaded.
   */
  loadVariables(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const checkpointLoader = new CheckpointLoader('deeplearn-checkpoint');
      checkpointLoader.getAllVariables().then(variables => {
        this.variables = variables;
        resolve();
      });
    });
  }

  /**
   * Preprocess an RGB color texture before inferring through squeezenet.
   * @param rgbTexture The RGB color texture to process into an Array3D.
   * @param imageDimensions The 2D dimensions of the image.
   */
  preprocessColorTextureToArray3D(
    rgbTexture: WebGLTexture,
    imageDimensions: [number, number],
  ): Array3D {
    const preprocessResultShapeRC: [number, number] = [
      imageDimensions[0],
      imageDimensions[0] * 3,
    ];

    const preprocessResultTexture = this.math
      .getTextureManager()
      .acquireTexture(preprocessResultShapeRC);

    imagenet_util.preprocessInput(
      this.gpgpu,
      this.preprocessInputShader,
      rgbTexture,
      preprocessResultTexture,
      preprocessResultShapeRC,
    );
    return Array3D.make([imageDimensions[0], imageDimensions[0], 3], {
      texture: preprocessResultTexture,
      textureShapeRC: preprocessResultShapeRC,
    });
  }

  /**
   * Get the name of the class with the highest score. The returned name is 
   * one of 'rock', 'paper', 'scissors', 'lizard', 'spock', 'other'
   * @param logits Pre-softmax logits array
   */
  getTopClass(logits: Array1D): string {
    const predictions = this.math.softmax(logits);
    const top = new NDArrayMathCPU().topK(predictions, 1);
    const topIdx = top.indices.getValues()[0];
    return CATEGORIES[topIdx];
  }

  /**
   * Infer through SqueezeNet, assumes variables have been loaded. This does
   * standard ImageNet pre-processing before inferring through the model. This
   * method returns named activations as well as pre-softmax logits. The user
   * needs to clean up namedActivations after inferring.
   *
   * @param preprocessedInput preprocessed input Array.
   * @return Named activations and the pre-softmax logits.
   */
  infer(
    preprocessedInput: Array3D,
  ): {
    namedActivations: { [activationName: string]: Array3D };
    logits: Array1D;
  } {
    const namedActivations: { [key: string]: Array3D } = {};

    const avgpool10 = this.math.scope(keep => {
      const conv1 = this.math.conv2d(
        preprocessedInput,
        this.variables['conv1/kernel'] as Array4D,
        this.variables['conv1/bias'] as Array1D,
        2,
        0,
      );
      const conv1relu = keep(this.math.relu(conv1));
      namedActivations.conv_1 = conv1relu;

      const pool1 = keep(this.math.maxPool(conv1relu, 3, 2, 0));
      namedActivations.maxpool_1 = pool1;

      const fire2 = keep(this.fireModule(pool1, 2));
      namedActivations.fire2 = fire2;

      const fire3 = keep(this.fireModule(fire2, 3));
      namedActivations.fire3 = fire3;

      // Because we don't have uneven padding yet, manually pad the ndarray on
      // the right.
      const fire3Reshape2d = fire3.as2D(
        fire3.shape[0],
        fire3.shape[1] * fire3.shape[2],
      );
      const fire3Sliced2d = this.math.slice2D(
        fire3Reshape2d,
        [0, 0],
        [fire3.shape[0] - 1, (fire3.shape[1] - 1) * fire3.shape[2]],
      );
      const fire3Sliced = fire3Sliced2d.as3D(
        fire3.shape[0] - 1,
        fire3.shape[1] - 1,
        fire3.shape[2],
      );
      const pool2 = keep(this.math.maxPool(fire3Sliced, 3, 2, 0));
      namedActivations.maxpool_2 = pool2;

      const fire4 = keep(this.fireModule(pool2, 4));
      namedActivations.fire4 = fire4;

      const fire5 = keep(this.fireModule(fire4, 5));
      namedActivations.fire5 = fire5;

      const pool3 = keep(this.math.maxPool(fire5, 3, 2, 0));
      namedActivations.maxpool_3 = pool3;

      const fire6 = keep(this.fireModule(pool3, 6));
      namedActivations.fire6 = fire6;

      const fire7 = keep(this.fireModule(fire6, 7));
      namedActivations.fire7 = fire7;

      const fire8 = keep(this.fireModule(fire7, 8));
      namedActivations.fire8 = fire8;

      const fire9 = keep(this.fireModule(fire8, 9));
      namedActivations.fire9 = fire9;

      const conv10 = keep(
        this.math.conv2d(
          fire9,
          this.variables['conv10/kernel'] as Array4D,
          this.variables['conv10/bias'] as Array1D,
          1,
          0,
        ),
      );
      namedActivations.conv10 = conv10;

      return this.math.avgPool(conv10, conv10.shape[0], 1, 0).as1D();
    });

    return { namedActivations, logits: avgpool10 };
  }

  private fireModule(input: Array3D, fireId: number) {
    const y1 = this.math.conv2d(
      input,
      this.variables['fire' + fireId + '/squeeze1x1/kernel'] as Array4D,
      this.variables['fire' + fireId + '/squeeze1x1/bias'] as Array1D,
      1,
      0,
    );
    const y2 = this.math.relu(y1);
    const left1 = this.math.conv2d(
      y2,
      this.variables['fire' + fireId + '/expand1x1/kernel'] as Array4D,
      this.variables['fire' + fireId + '/expand1x1/bias'] as Array1D,
      1,
      0,
    );
    const left2 = this.math.relu(left1);

    const right1 = this.math.conv2d(
      y2,
      this.variables['fire' + fireId + '/expand3x3/kernel'] as Array4D,
      this.variables['fire' + fireId + '/expand3x3/bias'] as Array1D,
      1,
      1,
    );
    const right2 = this.math.relu(right1);

    return this.math.concat3D(left2, right2, 2);
  }
}
