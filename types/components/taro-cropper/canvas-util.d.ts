import Taro, { CanvasContext } from '@tarojs/taro';
/**
 *
 * 基础库 1.9.90 开始支持，低版本需做兼容处理。填充颜色。用法同 CanvasContext.setFillStyle()。
 * @param systemInfo
 * @param canvasContext
 * @param color
 */
declare function easySetStrokeStyle(systemInfo: Taro.getSystemInfoSync.Result, canvasContext: CanvasContext, color: string | CanvasGradient): void;
declare function easySetLineWidth(systemInfo: Taro.getSystemInfoSync.Result, canvasContext: CanvasContext, lineWidth: number): void;
declare function easySetFillStyle(systemInfo: Taro.getSystemInfoSync.Result, canvasContext: CanvasContext, color: string | CanvasGradient): void;
export { easySetStrokeStyle, easySetLineWidth, easySetFillStyle };
