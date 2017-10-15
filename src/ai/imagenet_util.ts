// Taken from https://github.com/PAIR-code/deeplearnjs/blob/master/demos/models/imagenet_util.ts
import { GPGPUContext, webgl_util } from 'deeplearn';

/**
 * Unpacks an RGB packed image texture into a 2D physical, 3D logical texture
 * with the conventional ndarray format and performs the standard imagenet image
 * preprocessing.
 */
export function getUnpackAndPreprocessInputShader(
  gpgpu: GPGPUContext,
  inputShapeRC: [number, number],
): WebGLProgram {
  const fragmentShaderSource = `
    precision highp float;
    uniform sampler2D source;
    varying vec2 resultUV;

    const vec2 inputShapeCR = vec2(${inputShapeRC[1]}.0, ${inputShapeRC[0]}.0);

    const vec2 halfCR = vec2(0.5, 0.5);

    void main() {
      vec2 outputCR = floor(gl_FragCoord.xy);

      vec2 sourceCR = vec2(floor(outputCR[0] / 3.0), outputCR[1]);
      vec2 sourceUV = (sourceCR + halfCR) / inputShapeCR;

      vec4 sourceValue = texture2D(source, sourceUV) * 255.0;

      float channelValue = 0.0;
      int channel = int(mod(outputCR[0], 3.0));

      if (channel == 0) {
        channelValue = sourceValue.r - 103.939;
      } else if (channel == 1) {
        channelValue = sourceValue.g - 116.779;
      } else if (channel == 2) {
        channelValue = sourceValue.b - 123.68;
      }

      gl_FragColor = vec4(channelValue, 0, 0, 0);
    }`;
  return gpgpu.createProgram(fragmentShaderSource);
}

export function preprocessInput(
  gpgpu: GPGPUContext,
  preprocessInputShader: WebGLProgram,
  sourceTex: WebGLTexture,
  resultTex: WebGLTexture,
  shapeRowCol: [number, number],
) {
  gpgpu.setOutputMatrixTexture(resultTex, shapeRowCol[0], shapeRowCol[1]);
  gpgpu.setProgram(preprocessInputShader);
  const samplerLocation = webgl_util.getProgramUniformLocationOrThrow(
    gpgpu.gl,
    preprocessInputShader,
    'source',
  );
  gpgpu.setInputMatrixTexture(sourceTex, samplerLocation, 0);
  gpgpu.executeProgram();
}

/**
 * Transposes the depth and the column dimensions of a 3D ndarray represented as
 * a 2D texture into a square collage with each channel rendered as a normalized
 * grayscale image. The normalization bounds are given as two sample2Ds,
 * minValues and maxValues, which give min and max values per channel. These can
 * be computed from a max and min pooling layer.
 */
export function getRenderGrayscaleChannelsCollageShader(
  gpgpu: GPGPUContext,
): WebGLProgram {
  const fragmentShaderSource = `
    precision highp float;
    uniform sampler2D source;
    uniform sampler2D minValues;
    uniform sampler2D maxValues;
    varying vec2 resultUV;

    uniform float imageSize;
    uniform float channels;
    uniform float imagesPerRow;
    uniform vec2 inputShapeCR;

    const vec2 halfCR = vec2(0.5, 0.5);

    void main() {
      vec2 outputCR = floor(gl_FragCoord.xy);

      float imageRow = floor(outputCR[1] / imageSize);
      float imageCol = mod(outputCR[0], imageSize);

      float currentChannel = floor(outputCR[0] / imageSize) +
          imageRow * imagesPerRow;

      // When the number of channels is not square, we render white to fill in
      // the output texture.
      if (currentChannel > channels) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        return;
      }

      float sourceC = channels * imageCol + currentChannel;
      float sourceR = mod(outputCR[1], imageSize);

      vec2 sourceUV = (vec2(sourceC, sourceR) + halfCR) / inputShapeCR;

      // Flip the vertical axis of the texture for display since we represent
      // image textures as vertically flipped.
      float sourceValue = texture2D(
          source, vec2(sourceUV.s, 1.0 - sourceUV.t)).r;

      // Normalize the value by sampling the minValues and maxValues texture
      // which contain min and max per channel.
      vec2 minMaxValuesShapeCR = vec2(channels, 1);
      vec2 minMaxValuesCR = vec2(currentChannel, 0);
      vec2 minMaxValuesUV = (minMaxValuesCR + halfCR) / minMaxValuesShapeCR;

      float minValue = texture2D(minValues, minMaxValuesUV).r;
      float maxValue = texture2D(maxValues, minMaxValuesUV).r;

      float normalizedValue = (sourceValue - minValue) / (maxValue - minValue);

      gl_FragColor = vec4(
          normalizedValue, normalizedValue, normalizedValue, 1);
    }
  `;
  return gpgpu.createProgram(fragmentShaderSource);
}

export function renderGrayscaleChannelsCollage(
  gpgpu: GPGPUContext,
  unpackChannelsShader: WebGLProgram,
  sourceTex: WebGLTexture,
  minValuesTex: WebGLTexture,
  maxValuesTex: WebGLTexture,
  inputShapeRC: [number, number],
  imageSize: number,
  channels: number,
  textureSize: number,
  numRows: number,
) {
  webgl_util.bindCanvasToFramebuffer(gpgpu.gl);
  gpgpu.setProgram(unpackChannelsShader);

  const sourceSamplerLocation = webgl_util.getProgramUniformLocationOrThrow(
    gpgpu.gl,
    unpackChannelsShader,
    'source',
  );
  const minValuesSamplerLocation = webgl_util.getProgramUniformLocationOrThrow(
    gpgpu.gl,
    unpackChannelsShader,
    'minValues',
  );
  const maxValuesSamplerLocation = webgl_util.getProgramUniformLocationOrThrow(
    gpgpu.gl,
    unpackChannelsShader,
    'maxValues',
  );

  gpgpu.setInputMatrixTexture(sourceTex, sourceSamplerLocation, 0);
  gpgpu.setInputMatrixTexture(minValuesTex, minValuesSamplerLocation, 1);
  gpgpu.setInputMatrixTexture(maxValuesTex, maxValuesSamplerLocation, 2);

  const imageSizeLoc = gpgpu.getUniformLocation(
    unpackChannelsShader,
    'imageSize',
  );
  gpgpu.gl.uniform1f(imageSizeLoc, imageSize);

  const channelsLoc = gpgpu.getUniformLocation(
    unpackChannelsShader,
    'channels',
  );
  gpgpu.gl.uniform1f(channelsLoc, channels);

  const imagesPerRowLoc = gpgpu.getUniformLocation(
    unpackChannelsShader,
    'imagesPerRow',
  );
  gpgpu.gl.uniform1f(imagesPerRowLoc, Math.floor(textureSize / imageSize));

  const inputShapeCRLoc = gpgpu.getUniformLocation(
    unpackChannelsShader,
    'inputShapeCR',
  );
  gpgpu.gl.uniform2f(inputShapeCRLoc, inputShapeRC[1], inputShapeRC[0]);

  gpgpu.executeProgram();
}
