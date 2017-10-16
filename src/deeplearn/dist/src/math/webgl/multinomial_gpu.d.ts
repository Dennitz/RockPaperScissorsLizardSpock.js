import { GPGPUContext } from './gpgpu_context';
import { GPGPUProgram } from './gpgpu_math';
export declare class MultinomialProgram implements GPGPUProgram {
    variableNames: string[];
    params: Array<{}>;
    outputShape: number[];
    userCode: string;
    seedLoc: WebGLUniformLocation;
    constructor(numOutcomes: number, numSamples: number);
    getCustomSetupFunc(seed: number): (gpgpu: GPGPUContext, webGLProgram: WebGLProgram) => void;
}
