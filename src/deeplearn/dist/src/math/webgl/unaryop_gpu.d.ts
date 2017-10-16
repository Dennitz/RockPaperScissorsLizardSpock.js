import { GPGPUProgram } from './gpgpu_math';
export declare class UnaryOpProgram implements GPGPUProgram {
    variableNames: string[];
    params: Array<{}>;
    userCode: string;
    outputShape: number[];
    constructor(aShape: number[], opSnippet: string);
}
export declare const CHECK_NAN_SNIPPET = "\n  if (isNaN(x)) {\n    return x;\n  }\n";
export declare const ABS = "\n  return abs(x);\n";
export declare const RELU = "\n  return (x < 0.0) ? 0.0 : x;\n";
export declare const STEP = "\n  return (x == x) ? (x > 0.0 ? 1.0 : 0.0) : x;\n";
export declare const NEG = "\n  return -x;\n";
export declare const CEIL = "\n  return ceil(x);\n";
export declare const FLOOR = "\n  return floor(x);\n";
export declare const EXP = "\n  return exp(x);\n";
export declare const LOG = "\n  return log(x);\n";
export declare const SQRT: string;
export declare const SIGMOID = "\n  return 1.0 / (1.0 + exp(-1.0 * x));\n";
export declare const SIN: string;
export declare const COS: string;
export declare const TAN = "\n  return tan(x);\n";
export declare const ASIN: string;
export declare const ACOS: string;
export declare const ATAN: string;
export declare const SINH = "\n  float e2x = exp(x);\n  return (e2x - 1.0 / e2x) / 2.0;\n";
export declare const COSH = "\n  float e2x = exp(-x);\n  return (e2x + 1.0 / e2x) / 2.0;\n";
export declare const TANH = "\n  float e2x = exp(-2.0 * abs(x));\n  return sign(x) * (1.0 - e2x) / (1.0 + e2x);\n";
