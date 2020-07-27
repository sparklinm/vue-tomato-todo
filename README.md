# vue-tomato-todo

## Project setup

```bash
# install dependencies
yarn install

# serve with hot reload
yarn serve

# compiles and minifies for production
yarn build

# lints and fixes files
yarn lint
```

## Introduction

模仿手机应用 `番茄ToDo` 做的一个 demo，很多基本功能已经实现。

为什么选这个，主要还是关于 vue 的练手项目已经很多了，例如：仿饿了么，仿网易云音乐，仿知乎等等，自己想做一个不那么大众化的，就选了这个。

使用了 `pwa`，pc 端谷歌浏览器开启 `pwa` 功能后可添加到桌面，手机端的话谷歌浏览器也支持。

## Demo

[查看 demo 请看这里](https://todo.sparklinm.cn)，PC 端最好使用手机模式浏览。

## Screenshot

## Tech Stack

- Vue @ 2.6.10
- vue-router
- vuex
- vue-i18n
- vue-cli @ 3.x
- ES6
- vue-echarts
- tween.js
- stackblur-canvas.js
- lodash
- html2canvas.js
- less
- daysjs
- fortawesome
- postcss-pxtorem
- babel
- pwa

## Features

- [x] 主题切换
- [x] 国际化
- [x] 页面切换动画
- [x] 待办列表
- [x] 待办集列表
- [x] 进行待办
- [x] 每日打卡
- [x] 专注打卡数据统计
- [x] 专注时间轴
- [x] 未来计划
- [x] 番茄钟核心设置
- [x] 外观设置
- [x] 清除缓存数据
- [x] 登录、退出
- [x] 个人中心
- [x] 上传图片：包括用户封面，卡片背景，主界面背景
- [x] 上传待办音乐
- [x] 下载打卡卡片
- [ ] 计时器外观更改
- [ ] 完整的登录注册
- [ ] mock 数据
- [ ] 上传图片裁剪

## Summarize

在做之前是抱着一个学习和思考的态度，就想着什么都去自己实现，例如：构建了一部分需要的基础组件，包括模态框、输入框、提示、checkbox 按钮等，同时将其中的一些逻辑封装成了库，例如：轮播、滑动选择，拖拽排序等。这些基础组件和库的编写最为麻烦，因为总是难以考虑到各种情况和一些功能怎样才能优雅实现，总之就是经验太少的原因，导致就不断修修改改。

在不断修改和思考最佳方案的同时，自己对库和组件的认识越来越深，学到的东西也越来越多。

## LICENSE

[MIT](https://github.com/sparklinm/vue-tomato-todo/blob/master/LICENSE)
