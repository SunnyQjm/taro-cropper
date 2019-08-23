import {ComponentClass} from "react";

export interface TaroCropperComponentProps {
  cropperCanvasId?: string,          // 画布id
  cropperCutCanvasId?: string,        // 用于裁剪的canvas id
  width?: number,                    // 组件宽度
  height?: number,                   // 组件高度   (要求背景高度大于宽度)
  cropperWidth?: number,             // 裁剪框宽度
  cropperHeight?: number,            // 裁剪框高度
  themeColor?: string,               // 主题色（裁剪框的四个角的绘制颜色）
  maxScale?: number,                 // 最大放大倍数，maxScale >= 1
  fullScreen?: boolean,              // 组件充满全屏，此时width和height设置无效
  src: string,                      // 要裁剪的图片路径,
  hideFinishText?: boolean,          // 隐藏完成按钮（可以自己实现，然后调用本实例的cut方法进行裁剪）
  onCut?: (src: string) => void,     // 点击底部的完成按钮，执行裁剪，成功则触发该回调
  onFail?: (err) => void,            // 裁剪失败触发该回调
}

declare const TaroCropper: ComponentClass<TaroCropperComponentProps>;

export default TaroCropper;
