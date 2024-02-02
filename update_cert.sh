#!/bin/bash

# 检查参数数量
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <domain> <nginx_conf_path> <zip_path>"
    exit 1
fi

# 提取参数
domain="$1"
nginx_conf_path="$2"
zip_path="$3"

echo "新证书位置 $zip_path"

# 检查证书文件是否存在
if [ ! -f "$zip_path" ]; then
    echo "证书文件不存在"
    exit 1
fi

# 创建临时目录
temp_dir=$(mktemp -d)

# 解压证书文件
unzip -d "$temp_dir" "$zip_path"

# 输入解压后的文件列表
ls -l "$temp_dir"

# pem 文件
pem_file=$(ls "$temp_dir" | grep ".pem")
# key 文件
key_file=$(ls "$temp_dir" | grep ".key")

# 检查解压后的文件是否存在，*.pem 为证书文件，*.key 为 key 文件
if [ -z "$pem_file" ] || [ -z "$key_file" ]; then
    echo "证书文件不完整"
    exit 1
fi

# 执行 grep 命令，将结果存储到变量中
ssl_certificates=$(grep -rl "server_name.*$domain" "$nginx_conf_path"/*/** | xargs grep -Po 'ssl_certificate\s+\K[^;]+')
ssl_certificates_key=$(grep -rl "server_name.*$domain" "$nginx_conf_path"/*/** | xargs grep -Po 'ssl_certificate_key\s+\K[^;]+')

# 打印变量内容
echo "证书位置: $ssl_certificates"
echo "key位置: $ssl_certificates_key"

# 复制证书文件到指定位置，覆盖原有文件
cp "$temp_dir/$pem_file" "$ssl_certificates"
cp "$temp_dir/$key_file" "$ssl_certificates_key"

# temp_dir 为临时目录，删除
rm -rf "$temp_dir"

# echo 结束
echo "更新证书成功"