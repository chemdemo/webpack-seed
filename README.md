# webpack-seed

基于webpack搭建纯静态页面型前端工程解决方案模板。


### 安装软件

- Node.js：v4.0+

- compass（非必须）：v1.0+


### 拷贝项目模板

``` bash
$ git clone https://github.com/chemdemo/webpack-seed.git
```


### 安装依赖模块

``` bash
$ npm install -g gulp webpack
$ npm install -g node-dev # 推荐这个工具，代码改动会自动重启node进程
$ cd webpack-seed && npm install
```

### 本地开发环境

- 启动本地开发服务器

    ``` bash
    $ npm run start-dev
    ```

- 启动compass监听

    ``` bash
    $ compass watch
    ```
    compass在这里主要用于生成雪碧，雪碧图生成有多种方案，不一定要用compass。如果项目没用到雪碧图，完全可以不用compass，因为`sass-loader`可以直接加载sass文件

### 业务开发

##### 目录结构

``` js
.
├── config.rb                 # compass配置
├── gulpfile.js               # gulp任务配置
├── mock/                     # 假数据文件
├── package.json              # 项目配置
├── README.md                 # 项目说明
├── server                    # 本地server
│   ├── app.js                # 本地server入口
│   ├── home.html             # 列出项目所有入口文件
│   └── routes.js             # 本地路由配置
├── src                       # 源码目录
│   ├── a.html                # 入口文件a
│   ├── b.html                # 入口文件b
│   ├── c.html                # 入口文件c
│   ├── css/                  # css资源
│   ├── img/                  # 图片资源
│   ├── js                    # js&jsx资源
│   │   ├── a.js              # a页面入口
│   │   ├── b.js              # b页面入口
│   │   ├── c.js              # c页面入口
│   │   ├── components/       # 组件
│   │   ├── helpers/          # 业务相关的辅助工具
│   │   ├── lib/              # 没有存放在npm的第三方库或者下载存放到本地的基础库，如jQuery、Zepto、React等
│   │   └── utils/            # 业务无关的辅助工具
│   ├── scss/                 # scss资源
│   ├── pathmap.json          # 手动配置某些模块的路径，可以加快webpack的编译速度
│   └── tmpl/                 # 模板目录，如果是React的项目这个可以删掉
├── make-webpack.config.js    # webpack配置
├── webpack.config.js         # 正式环境webpack配置入口
└── webpack-dev.config.js     # 开发环境webpack配置入口
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
$ npm run start-release
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
  publicPath: debug ? '' : 'http://cdn.site.com/'
}
...
```

### 修改日志

#### 2016.07.12

- 配置增加`DefinePlugin`插件，即生产模式build时使用`production`模式，减小打包后文件的体积


#### 2016.05.23

- 修复版本升级带来的一些bug
- 增加React demo（其实本来就是支持的T_T）


#### 2016.03.28

- 升级`extract-text-webpack-plugin`到v1.0+
- webpack配置修改，开发模式下css也是用link引用，便于调试
- webpack配置pathMap项，添加React等常用lib的默认路径
- webpack配置增加liveload支持 by @liupy525

### License

MIT.
