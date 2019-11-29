[![](https://img.shields.io/npm/v/taro-cropper.svg?style=flat-square)](https://www.npmjs.com/package/taro-cropper)
[![](https://img.shields.io/npm/l/taro-cropper.svg?style=flat-square)](https://www.npmjs.com/package/taro-cropper)
[![](https://img.shields.io/npm/dt/taro-cropper.svg?style=flat-square)](https://www.npmjs.com/package/taro-cropper)

> # taro-cropper
>
> 项目地址: [https://github.com/SunnyQjm/taro-cropper](https://github.com/SunnyQjm/taro-cropper)

TaroCropper 是Taro小程序框架下使用的图片裁剪，基于canvasAPI进行实现，支持滑动和缩放，目前测试在微信小程序端, QQ小程序端, 支付宝小程序端, 字节跳动小程序端, 百度小程序端和H5端可以正常使用。

> ### 使用方式

- **首先用npm安装**

  ```bash
  npm install --save taro-cropper
  ```

- **引入组件库**

  ```typescript
  import {
    TaroCropper
  } from 'taro-cropper';
  ```

- 在项目配置文件 `config/index.js` 中添加如下配置

  ```javascript
  h5: {
      esnextModules: ['taro-cropper']
  }
  ```

  该配置的作用是，在H5端使用本库的时候，对应的单位会进行转换（`px` => `rem`）

- **在代码中使用**

  ```typescript
  <TaroCropper
    fullScreen
    onCut={res => {
         this.setState({
         cutImagePath: res
        })
    }}
  />
  ```

  具体的使用实例参考[taro-cropper-demo](<https://github.com/SunnyQjm/taro-cropper/blob/master/src/pages/index/index.tsx>)

> ### 参数说明

|       参数名       |            参数类型            |                           参数说明                           | 默认值                |
| :----------------: | :----------------------------: | :----------------------------------------------------------: | --------------------- |
|  cropperCanvasId   |             string             |                     用于绘制的Canvas的id                     | cropperCanvasId       |
| cropperCutCanvasId |             string             |                     用于裁剪的Canvas的id                     | cropperCutCanvasId    |
|       width        |             number             |                 整个控件的宽度（单位为rpx）                  | 750（即充满屏幕宽度） |
|       height       |             number             |                 整个控件的高度（单位为rpx）                  | 1200                  |
|    cropperWidth    |             number             |                  裁剪框的宽度（单位为rpx）                   | 400                   |
|   cropperHeight    |             number             |                  裁剪框的高度（单位为rpx）                   | 400                   |
|     themeColor     |             string             |       主题色（裁剪框四角的颜色以及底部完成按钮的颜色）       | #0f0（绿色）          |
|      maxScale      |             number             |                 最大放大倍数（maxScale > 1）                 | 3                     |
|     fullScreen     |            boolean             |                       控件是否充满全屏                       | false                 |
|        src         |             string             |                      待裁剪的图片的路径                      | ‘’                    |
|   hideFinishText   |            boolean             |                    是否隐藏底部的完成按钮                    | false                 |
|       onCut        | (cutImagePath: string) => void | 点击底部完成按钮时会执行裁剪操作，可以通过此回调接收裁剪结果 | () => {}              |
|       onFail       |         (err) => void          |                        裁剪失败的回调                        | () => {}              |
|   hideCancelText   |            boolean             |                       是否隐藏取消按钮                       | true                  |
|      onCancel      |           () => void           |                      点击取消按钮的回调                      | () => {}              |
|     finishText     |             string             |                         完成按钮文字                         | 完成                  |
|     cancelText     |             string             |                         取消按钮文字                         | 取消                  |


> ### 效果展示

<img src="https://raw.githubusercontent.com/SunnyQjm/taro-cropper/master/document/demo1.png" width="375"/>
