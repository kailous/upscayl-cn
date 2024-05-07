document.addEventListener("DOMContentLoaded", function() {
    // 定义替换规则
    const replacementRules = {
        "Select Image": "选择图片",
        "Select Model": "选择模型",
        "Digital Art": "数字艺术",
        "General Photo ": "通用照片 ",
        "GENERAL PHOTO": "通用照片",
        "Double Upscayl": "双倍放大",
        "Image Scale": "图像缩放比例 ",
        "Set Output Folder": "设置输出文件夹",
        "Batch Upscayl": "批量放大",
        "Settings": "设置",
        "X": "倍",
        "Step 1": "第1步",
        "Step 2": "第2步",
        "Step 3": "第3步",
        "Step 4": "第4步",
        "Defaults to Image's path": "默认为图片路径",
        "Select an Image to Upscayl": "选择要 Upscayl 的图像",
        "Select or drag and drop a PNG, JPG, JPEG or WEBP image.": "选择或拖放 PNG、JPG、JPEG 或 WEBP 图像。",
        "Reset Image": "重置图片",
        "Lens View": "镜头视图",
        "Slider View": "滑块视图",
        "Zoom Amount ": "缩放比例",
        "Lens Size ": "镜头大小",
        "Having issues?": "遇到问题了吗？",
        "🙏 GET HELP": "🙏 获取帮助",
        "If you like what we do :)": "如果你喜欢我们的工作 :)",
        "💎 DONATE": "💎 捐赠",
        "LOGS": "日志",
        "COPY LOGS 📋": "复制日志 📋",
        "⚙️ Getting saveImageAs from localStorage:  ": "⚙️ 从本地存储获取 saveImageAs: ",
        "⚙️ Getting model from localStorage:  ": "⚙️ 从本地存储获取模型：",
        "⚙️ Setting gpuId to empty string": "⚙️ 将 gpuId 设置为空字符串",
        "🔀 Setting model to": "🔀 设置模型为",
        "⚙️ Setting gpuId to empty string": "⚙️ 将 gpuId 设置为空字符串",        
        "UPSCAYL THEME": "UPSCAYL 主题",
        "SAVE IMAGE AS": "另存图片为",
        "IMAGE SCALE ": "图像缩放比例",
        "Anything above 4X (except 16X Double Upscayl) only resizes the image and does not use AI upscaling.": "4倍以上的任何缩放（除了16倍双倍放大）只会调整图片大小，不会使用AI放大。",        
        "Anything above 4倍 (except 16倍 双倍放大) only resizes the image and does not use AI upscaling.": "4倍以上的任何缩放（除了16倍双倍放大）只会调整图片大小，不会使用AI放大。",
        "CUSTOM OUTPUT WIDTH": "自定义输出宽度",
        "REQUIRES RESTARTUse a custom width for the output images. The height will be adjusted automatically. Enabling this will override the scale setting.": "需要重启。使用自定义宽度输出图片。高度将自动调整。启用此选项将覆盖比例设置。",
        "Image Compression ": "图像压缩",
        "SAVE OUTPUT FOLDER": "保存输出文件夹",
        "If enabled, the output folder will be remembered between sessions.": "如果启用，输出文件夹将在会话之间被记住。",
        "TURN OFF NOTIFICATIONS": "关闭通知",
        "If enabled, Upscayl will not send any system notifications on success or failure.": "如果启用，Upscayl 将不会在成功或失败时发送任何系统通知。",
        "OVERWRITE PREVIOUS UPSCALE": "覆盖先前的放大",
        "If enabled, Upscayl will process the image again instead of loading it directly.": "如果启用，Upscayl 将重新处理图像，而不是直接加载它。",
        "GPU ID": "GPU ID",
        "Please read the Upscayl Documentation for more information.": "请阅读 Upscayl 文档以获取更多信息。",
        "CUSTOM TILE SIZE": "自定义瓦片大小",
        "Use a custom tile size for segmenting the image. This can help process images faster by reducing the number of tiles generated.": "使用自定义瓦片大小来对图像进行分段。这可以通过减少生成的瓦片数量来加快图像处理速度。",
        "ADD CUSTOM MODELS": "添加自定义模型",
        "You can add your own models easily. For more details: Custom Models Repository": "您可以轻松添加自己的模型。有关更多详细信息，请参阅：自定义模型存储库。",
        "Select Folder": "选择文件夹",
        "RESET UPSCAYL": "重置 Upscayl",
    };

    // 替换文本的通用函数
    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
            let modifiedText = node.nodeValue.trim();
            Object.entries(replacementRules).forEach(([key, value]) => {
                const regex = new RegExp(escapeRegExp(key), 'g');
                modifiedText = modifiedText.replace(regex, value);
            });
            if (node.nodeValue.trim() !== modifiedText) {
                node.nodeValue = modifiedText; // 只在有更改时更新节点值
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 特定元素选择器匹配，如按钮和段落
            if (node.matches('button[data-tooltip-content], p, h1, h2, h3, span')) {
                let text = node.textContent.trim();
                Object.entries(replacementRules).forEach(([key, value]) => {
                    const regex = new RegExp(escapeRegExp(key), 'g');
                    text = text.replace(regex, value);
                });
                node.textContent = text; // 更新元素文本
            }
            // 递归遍历所有子节点
            Array.from(node.childNodes).forEach(replaceText);
        }
    }

    // 设置 MutationObserver 监视DOM变更
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                replaceText(node);
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 辅助函数：转义特殊字符
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& 表示整个被匹配的字符串
    }
});
