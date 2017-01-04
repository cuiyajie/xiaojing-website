# xiaojing-website

> 小睛考勤的后台管理系统

## 目录结构

 - build: webpack打包脚本
 - config: 运行环境的相关配置
 - dist: 打包输出目录
 - src: 源代码目录
 	- api: 请求后端数据的接口
 	- assets: 静态资源， 如：图片、样式等
 	- utils: 通用帮助函数等，如：filters
 	- vuex: 保存跨页面或全局数据
 	- components: 子模板目录
 	- routes.js: 定义页面路径
 	- main.js: 入口，一切的开始
- test: 测试相关的代码
- index.html: html入口
- package.json: 工程定义，依赖库等等

 	 

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
