"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBatchArguments = exports.getDoubleUpscaleSecondPassArguments = exports.getDoubleUpscaleArguments = exports.getSingleImageArguments = void 0;
const check_model_scale_1 = __importDefault(require("../../common/check-model-scale"));
const get_device_specs_1 = require("./get-device-specs");
const slash = (0, get_device_specs_1.getPlatform)() === "win" ? "\\" : "/";
const getSingleImageArguments = ({ inputDir, fileNameWithExt, outFile, modelsPath, model, scale, gpuId, saveImageAs, customWidth, tileSize, compression, }) => {
    const modelScale = (0, check_model_scale_1.default)(model);
    let includeScale = modelScale !== scale && !customWidth;
    return [
        // INPUT IMAGE
        "-i",
        inputDir + slash + fileNameWithExt,
        // OUTPUT IMAGE
        "-o",
        outFile,
        // OUTPUT SCALE
        includeScale ? "-s" : "",
        includeScale ? scale : "",
        // MODELS PATH
        "-m",
        modelsPath,
        // MODEL NAME
        "-n",
        model,
        // GPU ID
        gpuId ? "-g" : "",
        gpuId ? gpuId : "",
        // FORMAT
        "-f",
        saveImageAs,
        // CUSTOM WIDTH
        customWidth ? `-w` : "",
        customWidth ? customWidth : "",
        // COMPRESSION
        "-c",
        compression,
        // TILE SIZE
        tileSize ? `-t` : "",
        tileSize ? tileSize.toString() : "",
    ];
};
exports.getSingleImageArguments = getSingleImageArguments;
const getDoubleUpscaleArguments = ({ inputDir, fullfileName, outFile, modelsPath, model, gpuId, saveImageAs, tileSize, }) => {
    return [
        // INPUT IMAGE
        "-i",
        inputDir + slash + fullfileName,
        // OUTPUT IMAGE
        "-o",
        outFile,
        // MODELS PATH
        "-m",
        modelsPath,
        // MODEL NAME
        "-n",
        model,
        // GPU ID
        gpuId ? `-g` : "",
        gpuId ? gpuId : "",
        // FORMAT
        "-f",
        saveImageAs,
        // TILE SIZE
        tileSize ? `-t` : "",
        tileSize ? tileSize.toString() : "",
    ];
};
exports.getDoubleUpscaleArguments = getDoubleUpscaleArguments;
const getDoubleUpscaleSecondPassArguments = ({ outFile, modelsPath, model, gpuId, saveImageAs, scale, customWidth, compression, tileSize, }) => {
    const modelScale = (parseInt((0, check_model_scale_1.default)(model)) ** 2).toString();
    let includeScale = modelScale !== scale && !customWidth;
    return [
        // INPUT IMAGE
        "-i",
        outFile,
        // OUTPUT IMAGE
        "-o",
        outFile,
        // OUTPUT SCALE
        includeScale ? "-s" : "",
        includeScale ? scale : "",
        // MODELS PATH
        "-m",
        modelsPath,
        // MODEL NAME
        "-n",
        model,
        // GPU ID
        gpuId ? `-g` : "",
        gpuId ? gpuId : "",
        // FORMAT
        "-f",
        saveImageAs,
        // CUSTOM WIDTH
        customWidth ? `-w` : "",
        customWidth ? customWidth : "",
        // COMPRESSION
        "-c",
        compression,
        // TILE SIZE
        tileSize ? `-t` : "",
        tileSize ? tileSize.toString() : "",
    ];
};
exports.getDoubleUpscaleSecondPassArguments = getDoubleUpscaleSecondPassArguments;
const getBatchArguments = ({ inputDir, outputDir, modelsPath, model, gpuId, saveImageAs, scale, customWidth, compression, tileSize, }) => {
    const modelScale = (0, check_model_scale_1.default)(model);
    let includeScale = modelScale !== scale && !customWidth;
    return [
        // INPUT IMAGE
        "-i",
        inputDir,
        // OUTPUT IMAGE
        "-o",
        outputDir,
        // OUTPUT SCALE
        includeScale ? "-s" : "",
        includeScale ? scale : "",
        // MODELS PATH
        "-m",
        modelsPath,
        // MODEL NAME
        "-n",
        model,
        // GPU ID
        gpuId ? `-g` : "",
        gpuId ? gpuId : "",
        // FORMAT
        "-f",
        saveImageAs,
        // CUSTOM WIDTH
        customWidth ? `-w` : "",
        customWidth ? customWidth : "",
        // COMPRESSION
        "-c",
        compression,
        // TILE SIZE
        tileSize ? `-t` : "",
        tileSize ? tileSize.toString() : "",
    ];
};
exports.getBatchArguments = getBatchArguments;
