import { ConvInfo } from './conv_util';
import { Array1D, Array2D, Array3D, Array4D, DataTypes, NDArray, Scalar } from './ndarray';
export declare type ScopeResult = NDArray[] | NDArray | void;
export interface LSTMCell {
    (data: Array2D, c: Array2D, h: Array2D): [Array2D, Array2D];
}
export interface SumTypes {
    float32: 'float32';
    int32: 'int32';
    bool: 'int32';
}
export declare enum SumTypesMap {
    float32 = "float32",
    int32 = "int32",
    bool = "int32",
}
export declare abstract class NDArrayMath {
    private safeMode;
    private ndarrayScopes;
    private activeScope;
    private ndarraysToKeep;
    private activeScopeNDArraysToKeep;
    private debugMode;
    constructor(safeMode: boolean);
    scope<T extends ScopeResult>(scopeFn: (keep: <T1 extends NDArray>(ndarray: T1) => T1, track: <T2 extends NDArray>(ndarray: T2) => T2) => T): T;
    enableDebugMode(): void;
    startScope(): void;
    endScope(result: ScopeResult): void;
    private isNDArrayDataInList(ndarray, ndarrayList);
    keep<T extends NDArray>(result: T): T;
    private checkForNaN(vals, name);
    track<G extends keyof DataTypes, T extends NDArray<G>>(result: T): T;
    dispose(): void;
    matMul(a: Array2D, b: Array2D, aOrientation?: MatrixOrientation, bOrientation?: MatrixOrientation): Array2D;
    private executeOp<G, T>(name, f);
    protected abstract matMulInternal(a: Array2D, b: Array2D, aOrientation: MatrixOrientation, bOrientation: MatrixOrientation): Array2D;
    vectorTimesMatrix(v: Array1D, matrix: Array2D): Array1D;
    matrixTimesVector(matrix: Array2D, v: Array1D): Array1D;
    dotProduct(v1: Array1D, v2: Array1D): Scalar;
    outerProduct(v1: Array1D, v2: Array1D): Array2D;
    clone<T extends NDArray>(ndarray: T): T;
    protected abstract cloneInternal<T extends NDArray>(ndarray: T): T;
    reshape<T1 extends NDArray, T2 extends NDArray>(ndarray: T1, newShape: number[]): T2;
    slice1D(input: Array1D, begin: number, size: number): Array1D;
    protected abstract slice1DInternal(input: Array1D, begin: number, size: number): Array1D;
    slice2D(input: Array2D, begin: [number, number], size: [number, number]): Array2D;
    protected abstract slice2DInternal(input: Array2D, begin: [number, number], size: [number, number]): Array2D;
    slice3D(input: Array3D, begin: [number, number, number], size: [number, number, number]): Array3D;
    protected abstract slice3DInternal(input: Array3D, begin: [number, number, number], size: [number, number, number]): Array3D;
    slice4D(input: Array4D, begin: [number, number, number, number], size: [number, number, number, number]): Array4D;
    protected abstract slice4DInternal(input: Array4D, begin: [number, number, number, number], size: [number, number, number, number]): Array4D;
    copy2D(source: Array2D, sourceBegin: [number, number], sourceSize: [number, number], dest: Array2D, destBegin: [number, number], destSize: [number, number]): void;
    protected abstract copy2DInternal(source: Array2D, sourceBegin: [number, number], sourceSize: [number, number], dest: Array2D, destBegin: [number, number], destSize: [number, number]): void;
    concat1D(a: Array1D, b: Array1D): Array1D;
    protected abstract concat1DInternal(a: Array1D, b: Array1D): Array1D;
    concat2D(a: Array2D, b: Array2D, axis: number): Array2D;
    protected abstract concat2DInternal(a: Array2D, b: Array2D, axis: number): Array2D;
    concat3D(ndarray1: Array3D, ndarray2: Array3D, axis: number): Array3D;
    protected abstract concat3DInternal(ndarray1: Array3D, ndarray2: Array3D, axis: number): Array3D;
    concat4D(ndarray1: Array4D, ndarray2: Array4D, axis: number): Array4D;
    protected abstract concat4DInternal(ndarray1: Array4D, ndarray2: Array4D, axis: number): Array4D;
    logSumExp(ndarray: NDArray): Scalar;
    protected abstract logSumExpInternal(ndarray: NDArray): Scalar;
    sum<T extends keyof DataTypes>(ndarray: NDArray<T>): Scalar<SumTypes[T]>;
    protected abstract sumInternal<T extends keyof DataTypes>(ndarray: NDArray<T>): Scalar<SumTypes[T]>;
    argMin(ndarray: NDArray): Scalar;
    protected abstract argMinInternal(ndarray: NDArray): Scalar;
    argMax(ndarray: NDArray): Scalar;
    protected abstract argMaxInternal(ndarray: NDArray): Scalar;
    argMaxEquals(x1: NDArray, x2: NDArray): Scalar;
    protected abstract argMaxEqualsInternal(x1: NDArray, x2: NDArray): Scalar;
    topK(ndarray: NDArray, k: number): {
        values: Array1D;
        indices: Array1D;
    };
    protected abstract topKInternal(ndarray: NDArray, k: number): {
        values: Array1D;
        indices: Array1D;
    };
    min(ndarray: NDArray): Scalar;
    protected abstract minInternal(ndarray: NDArray): Scalar;
    max(ndarray: NDArray): Scalar;
    protected abstract maxInternal(ndarray: NDArray): Scalar;
    softmax(x: Array1D): Array1D;
    switchDim<T extends NDArray>(a: T, newDim: number[]): T;
    protected abstract switchDimInternal<T extends NDArray>(a: T, newDim: number[]): T;
    scalarPlusArray<T extends NDArray>(c: Scalar, a: T): T;
    scalarMinusArray<T extends NDArray>(c: Scalar, a: T): T;
    arrayMinusScalar<T extends NDArray>(a: T, c: Scalar): T;
    neg<T extends NDArray>(a: T): T;
    protected abstract negInternal<T extends NDArray>(a: T): T;
    add(a: NDArray, b: NDArray): NDArray;
    protected abstract addInternal(a: NDArray, b: NDArray): NDArray;
    addStrict<T extends NDArray>(a: T, b: T): T;
    sub(a: NDArray, b: NDArray): NDArray;
    protected abstract subInternal(a: NDArray, b: NDArray): NDArray;
    subStrict<T extends NDArray>(a: T, b: T): T;
    multiply(a: NDArray, b: NDArray): NDArray;
    protected abstract multiplyInternal<T extends NDArray>(a: T, b: T): T;
    elementWiseMul<T extends NDArray>(a: T, b: T): T;
    multiplyStrict<T extends NDArray>(a: T, b: T): T;
    divide(a: NDArray, b: NDArray): NDArray;
    protected abstract divideInternal(a: NDArray, b: NDArray): NDArray;
    divideStrict<T extends NDArray>(a: T, b: T): T;
    scalarDividedByArray<T extends NDArray>(c: Scalar, a: T): T;
    arrayDividedByScalar<T extends NDArray>(a: T, c: Scalar): T;
    ceil<T extends NDArray>(ndarray: T): T;
    protected abstract ceilInternal<T extends NDArray>(ndarray: T): T;
    floor<T extends NDArray>(ndarray: T): T;
    protected abstract floorInternal<T extends NDArray>(ndarray: T): T;
    exp<T extends NDArray>(ndarray: T): T;
    protected abstract expInternal<T extends NDArray>(ndarray: T): T;
    log<T extends NDArray>(ndarray: T): T;
    protected abstract logInternal<T extends NDArray>(ndarray: T): T;
    sqrt<T extends NDArray>(ndarray: T): T;
    protected abstract sqrtInternal<T extends NDArray>(ndarray: T): T;
    abs<T extends NDArray>(ndarray: T): T;
    protected abstract absInternal<T extends NDArray>(ndarray: T): T;
    clip<T extends NDArray>(ndarray: T, min: number, max: number): T;
    protected abstract clipInternal<T extends NDArray>(ndarray: T, min: number, max: number): T;
    relu<T extends NDArray>(ndarray: T): T;
    protected abstract reluInternal<T extends NDArray>(ndarray: T): T;
    sigmoid<T extends NDArray>(ndarray: T): T;
    protected abstract sigmoidInternal<T extends NDArray>(ndarray: T): T;
    sin<T extends NDArray>(ndarray: T): T;
    protected abstract sinInternal<T extends NDArray>(ndarray: T): T;
    cos<T extends NDArray>(ndarray: T): T;
    protected abstract cosInternal<T extends NDArray>(ndarray: T): T;
    tan<T extends NDArray>(ndarray: T): T;
    protected abstract tanInternal<T extends NDArray>(ndarray: T): T;
    asin<T extends NDArray>(ndarray: T): T;
    protected abstract asinInternal<T extends NDArray>(ndarray: T): T;
    acos<T extends NDArray>(ndarray: T): T;
    protected abstract acosInternal<T extends NDArray>(ndarray: T): T;
    atan<T extends NDArray>(ndarray: T): T;
    protected abstract atanInternal<T extends NDArray>(ndarray: T): T;
    sinh<T extends NDArray>(ndarray: T): T;
    protected abstract sinhInternal<T extends NDArray>(ndarray: T): T;
    cosh<T extends NDArray>(ndarray: T): T;
    protected abstract coshInternal<T extends NDArray>(ndarray: T): T;
    tanh<T extends NDArray>(ndarray: T): T;
    protected abstract tanhInternal<T extends NDArray>(ndarray: T): T;
    step<T extends NDArray>(ndarray: T): T;
    protected abstract stepInternal<T extends NDArray>(ndarray: T): T;
    scaledArrayAdd<T extends NDArray>(c1: Scalar, a: T, c2: Scalar, b: T): T;
    protected abstract scaledArrayAddInternal<T extends NDArray>(c1: Scalar, a: T, c2: Scalar, b: T): T;
    scalarTimesArray<T extends NDArray>(c: Scalar, a: T): T;
    elementWiseMulBroadcast(a: Array2D, b: Array2D): Array2D;
    conv2d(x: Array3D, filter: Array4D, bias: Array1D | null, strides: [number, number] | number, pad: 'valid' | 'same' | number): Array3D;
    protected abstract conv2dInternal(x: Array3D, filter: Array4D, bias: Array1D | null, convInfo: ConvInfo): Array3D;
    conv2dBackProp(x: Array3D, dy: Array3D, filter: Array4D, strides: [number, number] | number, pad: 'valid' | 'same' | number): {
        dx: Array3D;
        dw: Array4D;
        db: Array1D;
    };
    conv2dDerInput(inShape: [number, number, number], dy: Array3D, filter: Array4D, strides: [number, number] | number, pad: 'valid' | 'same' | number): Array3D;
    protected abstract conv2dDerInputInternal(dy: Array3D, filter: Array4D, convInfo: ConvInfo): Array3D;
    conv2dDerBias(dy: Array3D): Array1D;
    protected abstract conv2dDerBiasInternal(dY: Array3D): Array1D;
    conv2dDerFilter(x: Array3D, dy: Array3D, filterSize: [number, number, number, number], strides: [number, number] | number, pad: 'valid' | 'same' | number): Array4D;
    protected abstract conv2dDerFilterInternal(x: Array3D, dy: Array3D, convInfo: ConvInfo): Array4D;
    conv2dTranspose(x: Array3D, filter: Array4D, outputShape: [number, number, number], strides: [number, number] | number, pad: 'valid' | 'same' | number): Array3D;
    maxPool(x: Array3D, filterSize: [number, number] | number, strides: [number, number] | number, pad: 'valid' | 'same' | number): Array3D;
    protected abstract maxPoolInternal(x: Array3D, convInfo: ConvInfo): Array3D;
    maxPoolBackprop(dy: Array3D, x: Array3D, filterSize: [number, number] | number, strides: [number, number] | number, pad: 'valid' | 'same' | number): Array3D;
    protected abstract maxPoolBackpropInternal(dy: Array3D, x: Array3D, convInfo: ConvInfo): Array3D;
    minPool(x: Array3D, filterSize: [number, number] | number, strides: [number, number] | number, pad: 'valid' | 'same' | number): Array3D;
    protected abstract minPoolInternal(x: Array3D, convInfo: ConvInfo): Array3D;
    avgPool(x: Array3D, filterSize: [number, number] | number, strides: [number, number] | number, pad: 'valid' | 'same' | number): Array3D;
    protected abstract avgPoolInternal(x: Array3D, convInfo: ConvInfo): Array3D;
    resizeBilinear3D(x: Array3D, newShape2D: [number, number], alignCorners?: boolean): Array3D;
    protected abstract resizeBilinear3DInternal(x: Array3D, newShape2D: [number, number], alignCorners: boolean): Array3D;
    batchNormalization3D(x: Array3D, mean: Array3D | Array1D, variance: Array3D | Array1D, varianceEpsilon?: number, scale?: Array3D | Array1D, offset?: Array3D | Array1D): Array3D;
    protected abstract batchNormalization3DInternal(x: Array3D, mean: Array3D | Array1D, variance: Array3D | Array1D, varianceEpsilon: number, scale?: Array3D | Array1D, offset?: Array3D | Array1D): Array3D;
    multiRNNCell(lstmCells: LSTMCell[], data: Array2D, c: Array2D[], h: Array2D[]): [Array2D[], Array2D[]];
    basicLSTMCell(forgetBias: Scalar, lstmKernel: Array2D, lstmBias: Array1D, data: Array2D, c: Array2D, h: Array2D): [Array2D, Array2D];
    multinomial(probabilities: Array1D, numSamples: number, seed?: number): Array1D;
    protected abstract multinomialInternal(probabilities: Array1D, numSamples: number, seed: number): Array1D;
    oneHot(indices: Array1D, depth: number, onValue?: number, offValue?: number): Array2D;
    protected abstract oneHotInternal(indices: Array1D, depth: number, onValue: number, offValue: number): Array2D;
}
export declare enum MatrixOrientation {
    REGULAR = 0,
    TRANSPOSED = 1,
}