#!/bin/sh expect
echo "=============================开始打包============================="
npm run build:prod && echo "=============================打包完成============================="
echo "=============================压缩文件============================="
tar -zvcf dist.tar.gz dist
echo "=============================开始上传============================="
# scp dist.tar.gz root@36.41.71.26:/opt/ctyun-ai-duty-pc
scp dist.tar.gz root@host31.880508.xyz:/opt/ctyun-ai-duty-pc