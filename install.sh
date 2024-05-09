#!/bin/bash

# 应用的完整路径
APP_PATH="/Applications/Upscayl.app"
# 下载超时时间（秒）
DOWNLOAD_TIMEOUT=40

function check_app_existence {
    local app_path=$1

    if [ ! -d "$app_path" ]; then
        echo "应用未找到: Upscayl.app"
        exit 1
    fi
}

# 函数：根据应用版本和系统架构构建下载地址
# 参数：
#   $1: 应用路径
#   $2: 下载文件保存路径
# 返回值：
#   无
function build_download_url {
    local app_path=$1
    local file_name=""
    local arch=$(uname -m)

    # 读取应用版本
    local version=$(defaults read "$app_path/Contents/Info" CFBundleShortVersionString)
    echo "Upscayl.app 的版本是: $version"

    # 根据系统架构确定下载文件的名称
    if [[ "$arch" == "arm64" ]]; then
        file_name="MacOS.ARM.zip"
    elif [[ "$arch" == "x86_64" ]]; then
      # file_name="MacOS.x86_64.zip"
        file_name="MacOS.ARM.zip"
        echo "兼容性未验证"
    else
        echo "不支持的架构: $arch"
        exit 1
    fi

    # 构建下载URL
    DOWNLOAD_URL="https://github.com/kailous/upscayl-cn/releases/download/v${version}/${file_name}"
    echo "下载URL: $DOWNLOAD_URL"

    # 如果有第二个参数，则将下载文件的路径保存在该参数中
    if [ ! -z "$2" ]; then
        eval "$2=$file_name"
    fi
}

# 函数：检查代理可用性并设置代理
# 参数：
#   $1: 代理服务器地址
#   $2: 代理服务器端口
function check_and_set_proxy {
    local proxy_server=$1
    local proxy_port=$2

    # 检查代理是否可用
    if nc -z $proxy_server $proxy_port; then
        echo "代理可用，将使用代理下载。"
        export https_proxy=http://$proxy_server:$proxy_port http_proxy=http://$proxy_server:$proxy_port all_proxy=socks5://$proxy_server:$proxy_port
    else
        echo "代理不可用"
    fi
}

# 函数：下载文件，并在超时时尝试使用代理
# 参数：
#   $1: 文件下载地址
#   $2: 文件保存路径
#   $3: 下载超时时间（秒）
function download_with_timeout {
    local download_url=$1
    local file_name=$2
    local download_timeout=$3

    # 打印下载信息
    echo -e "\n\n正在下载汉化补丁\n对应版本：${VERSION}\n文件大小：36.2 mb\n文件格式：zip 压缩文件\n文件地址：$download_url\n..."

    # 下载文件，设置超时时间
    if curl -L -m $download_timeout $download_url -o $file_name; then
        echo "下载完成: $file_name"
    else
        echo "下载超时，尝试使用代理..."
        check_and_set_proxy "127.0.0.1" "7890"
        curl -L $download_url -o $file_name
        echo "下载完成: $file_name"
    fi
}
# 函数：备份原始 app.asar 文件
# 参数：
#   $1: 应用路径
# 返回值：
#   无
function backup_original_app_asar {
    local app_path=$1
    local asar_path="$app_path/Contents/Resources/app.asar"
    local backup_asar_path="$app_path/Contents/Resources/app.asar.backup"

    # 检查原始 app.asar 文件是否存在
    if [ -f "$asar_path" ]; then
        # 如果备份文件已存在，先删除
        if [ -f "$backup_asar_path" ]; then
            echo "删除现有备份文件: $backup_asar_path"
            rm "$backup_asar_path"
        fi

        # 备份原始 app.asar 文件
        echo "备份原始 app.asar 文件: $asar_path -> $backup_asar_path"
        mv "$asar_path" "$backup_asar_path"
    else
        echo "原始 app.asar 文件未找到: $asar_path"
    fi
}
# 函数：解压压缩包到指定目录
# 参数：
#   $1: 目标目录
# 返回值：
#   无
function extract_zip_to_directory {
    local target_dir=$1

    # 检查压缩包文件是否存在
    if [ ! -f "$FILE_NAME" ]; then
        echo "压缩包文件未找到: $FILE_NAME"
        exit 1
    fi

    # 解压压缩包到指定目录
    echo "正在解压压缩包: $FILE_NAME -> $target_dir"
    unzip -o "$FILE_NAME" -d "$target_dir"
    echo "解压完成"
} 
# 调用函数检查应用是否存在
check_app_existence "$APP_PATH"
# 调用函数构建下载地址
build_download_url "$APP_PATH" "FILE_NAME"
# 调用函数进行文件下载
download_with_timeout "$DOWNLOAD_URL" "$FILE_NAME" $DOWNLOAD_TIMEOUT
# 调用函数备份原始 app.asar 文件
backup_original_app_asar "$APP_PATH"
# 调用函数解压压缩包到目标目录
extract_zip_to_directory "$APP_PATH/Contents/Resources"
