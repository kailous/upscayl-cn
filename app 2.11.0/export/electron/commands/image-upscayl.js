"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const get_resource_paths_1 = require("../utils/get-resource-paths");
const commands_1 = __importDefault(require("../../common/commands"));
const config_variables_1 = require("../utils/config-variables");
const get_arguments_1 = require("../utils/get-arguments");
const logit_1 = __importDefault(require("../utils/logit"));
const slash_1 = __importDefault(require("../utils/slash"));
const spawn_upscayl_1 = require("../utils/spawn-upscayl");
const path_1 = require("path");
const main_window_1 = require("../main-window");
const show_notification_1 = __importDefault(require("../utils/show-notification"));
const models_list_1 = require("../../common/models-list");
const get_file_name_1 = __importDefault(require("../../common/get-file-name"));
const decode_path_1 = __importDefault(require("../../common/decode-path"));
const get_directory_from_path_1 = __importDefault(require("../../common/get-directory-from-path"));
const imageUpscayl = (event, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const mainWindow = (0, main_window_1.getMainWindow)();
    if (!mainWindow) {
        (0, logit_1.default)("No main window found");
        return;
    }
    // GET VARIABLES
    const tileSize = payload.tileSize;
    const compression = payload.compression;
    const scale = payload.scale;
    const useCustomWidth = payload.useCustomWidth;
    const customWidth = useCustomWidth ? payload.customWidth : "";
    const model = payload.model;
    const gpuId = payload.gpuId;
    const saveImageAs = payload.saveImageAs;
    const overwrite = payload.overwrite;
    const imagePath = (0, decode_path_1.default)(payload.imagePath);
    let inputDir = (0, get_directory_from_path_1.default)(imagePath);
    let outputDir = (0, decode_path_1.default)(payload.outputPath);
    const fileNameWithExt = (0, get_file_name_1.default)(imagePath);
    const fileName = (0, path_1.parse)(fileNameWithExt).name;
    const outFile = outputDir +
        slash_1.default +
        fileName +
        "_upscayl_" +
        (useCustomWidth ? `${customWidth}px_` : `${scale}x_`) +
        model +
        "." +
        saveImageAs;
    const isDefaultModel = models_list_1.DEFAULT_MODELS.includes(model);
    // UPSCALE
    if (fs_1.default.existsSync(outFile) && !overwrite) {
        // If already upscayled, just output that file
        (0, logit_1.default)("✅ Already upscayled at: ", outFile);
        mainWindow.webContents.send(commands_1.default.UPSCAYL_DONE, outFile);
    }
    else {
        (0, logit_1.default)("✅ Upscayl Variables: ", JSON.stringify({
            model,
            gpuId,
            saveImageAs,
            inputDir,
            fileNameWithExt,
            outputDir,
            outFile,
            fileName,
            scale,
            compression,
            customWidth,
            useCustomWidth,
            tileSize,
        }));
        const upscayl = (0, spawn_upscayl_1.spawnUpscayl)((0, get_arguments_1.getSingleImageArguments)({
            inputDir: decodeURIComponent(inputDir),
            fileNameWithExt: decodeURIComponent(fileNameWithExt),
            outFile,
            modelsPath: isDefaultModel
                ? get_resource_paths_1.modelsPath
                : config_variables_1.savedCustomModelsPath !== null && config_variables_1.savedCustomModelsPath !== void 0 ? config_variables_1.savedCustomModelsPath : get_resource_paths_1.modelsPath,
            model,
            scale,
            gpuId,
            saveImageAs,
            customWidth,
            compression,
            tileSize,
        }), logit_1.default);
        (0, config_variables_1.setChildProcesses)(upscayl);
        (0, config_variables_1.setStopped)(false);
        let failed = false;
        const onData = (data) => {
            (0, logit_1.default)(data.toString());
            mainWindow.setProgressBar(parseFloat(data.slice(0, data.length)) / 100);
            data = data.toString();
            mainWindow.webContents.send(commands_1.default.UPSCAYL_PROGRESS, data.toString());
            if (data.includes("Error")) {
                upscayl.kill();
                failed = true;
            }
            else if (data.includes("Resizing")) {
                mainWindow.webContents.send(commands_1.default.SCALING_AND_CONVERTING);
            }
        };
        const onError = (data) => {
            if (!mainWindow)
                return;
            mainWindow.setProgressBar(-1);
            mainWindow.webContents.send(commands_1.default.UPSCAYL_ERROR, data.toString());
            failed = true;
            upscayl.kill();
            return;
        };
        const onClose = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!failed && !config_variables_1.stopped) {
                (0, logit_1.default)("💯 Done upscaling");
                // Free up memory
                upscayl.kill();
                mainWindow.setProgressBar(-1);
                mainWindow.webContents.send(commands_1.default.UPSCAYL_DONE, outFile);
                (0, show_notification_1.default)("Upscayl", "Image upscayled successfully!");
            }
        });
        upscayl.process.stderr.on("data", onData);
        upscayl.process.on("error", onError);
        upscayl.process.on("close", onClose);
    }
});
exports.default = imageUpscayl;
