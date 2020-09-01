FROM nginx:stable

# 注意修改对应nginx配置文件名称
ARG confName=ningxia-video-admin.conf

# 修改时区、编码
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo '$TZ' > /etc/timezone
ENV LANG C.UTF-8

WORKDIR /usr/share/nginx/html
ADD ./${confName} /etc/nginx/conf.d
ADD ./dist /usr/share/nginx/html
