# webpack-bootstrap

基于webpack+gulp搭建纯静态页面型前端工程解决方案模板。


### 安装软件

- Node.js：v4.0+

- compass（非必须）：v1.0+

### 拷贝项目模板

``` bash
$ clone https://github.com/chemdemo/webpack-bootstrap.git
```


### 安装依赖模块

``` bash
$ npm install -g gulp webpack
$ npm install -g node-dev # 推荐这个工具，代码改动会自动重启node进程
$ cd webpack-bootstrap && npm install
```

### 本地开发环境

- 启动compass监听

    ``` bash
    $ compass watch
    ```
    compass在这里主要用于生成雪碧，雪碧图生成有多种方案，不一定要用compass。如果项目没用到雪碧图，完全可以不用compass，因为`sass-loader`可以直接加载sass文件

- 启动本地开发服务器

    ``` bash
    $ npm run start
    ```
    浏览器打开`http://localhost:3005/a.html`即可访问。

### 业务开发

##### 目录结构

``` js
- root/
  - src/                   # 开发目录
    + css/                 # css资源
    + img/                 # 图片资源
    + js/                  # js&jsx资源
    + scss/                # scss资源
    + tmpl/                # 前端模板
    a.html                 # 入口文件a
    b.html                 # 入口文件b
  + assets/                # 编译输出目录
  + mock/                  # 假数据文件
  app.js                   # 本地server入口
  routes.js                # 本地路由配置
  webpack.config.js        # webpack配置文件
  webpack-dev.config.js    # 开发环境webpack配置文件
  gulpfile.js              # gulp任务配置
  config.rb                # compass配置
  package.json             # 项目配置
  README.md                # 项目说明
```

##### 单/多页面支持

约定`/src/*.html`为应用的入口文件，在`/src/js/`一级目录下有一个同名的js文件作为该入口文件的逻辑入口（即entry）。

在编译时会扫描入口html文件并且根据webpack配置项解决entry的路径依赖，同时还会对html文件进行压缩、字符替换等处理。

这样可以做到同时支持SPA和多页面型的项目。

### 编译

``` bash
$ npm run build
```

### 模拟生产环境

``` bash
$ npm run release
```

### 部署&发布

纯静态页面型的应用，最简单的做法是直接把`assets`文件夹部署到指定机器即可（先配置好机器ip、密码、上传路径等信息）：

``` js
$ npm run deploy # or run `gulp deploy`
```

如果需要将生成的js、css、图片等发布到cdn，修改下`publicPath`项为目标cdn地址即可：

``` js
...
output: {
  ...
  publicPath: debug ? '/__build/' : 'http://cdn.site.com/'
}
...
```

### License

MIT.
