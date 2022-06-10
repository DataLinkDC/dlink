# docker build
## 构建docker镜像
基于Dinky每次发布的[release](http://www.dlink.top/download/download)构建：
1. 将`Dockerfile`、`docker-entrypoint.sh`文件拷贝至release包解压目录
2. 执行下述构建与推送命令，根据需要推送至公共或私有仓库
```bash
docker build --tag ylyue/dinky:0.6.4-flink1.15 .
docker push ylyue/dinky:0.6.4-flink1.15
docker login --username=xxxxxxxx registry.cn-beijing.aliyuncs.com
docker tag ylyue/dinky:0.6.4-flink1.15 registry.cn-beijing.aliyuncs.com/yue-open/dinky:0.6.4-flink1.15
docker push registry.cn-beijing.aliyuncs.com/yue-open/dinky:0.6.4-flink1.15
```

[👉已构建的dockerhub仓库](https://hub.docker.com/r/ylyue/dinky)
