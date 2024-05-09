"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MODELS = exports.defaultModelsList = void 0;
exports.defaultModelsList = [
    { label: "General Photo (Real-ESRGAN)", value: "realesrgan-x4plus" },
    {
        label: "General Photo (Fast Real-ESRGAN)",
        value: "realesrgan-x4fast",
    },
    { label: "General Photo (Remacri)", value: "remacri" },
    { label: "General Photo (Ultramix Balanced)", value: "ultramix_balanced" },
    { label: "General Photo (Ultrasharp)", value: "ultrasharp" },
    { label: "Digital Art", value: "realesrgan-x4plus-anime" },
];
exports.DEFAULT_MODELS = exports.defaultModelsList.map((model) => model.value);
