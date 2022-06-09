import { CanvasContext, getImageInfo, getSystemInfoSync } from '@tarojs/taro';
import { PureComponent } from 'react';
import { BaseEventOrig } from '@tarojs/components';
interface TaroCropperComponentProps {
    type?: 'circle' | 'rect';
    maskColor?: string;
    isSideLine?: boolean;
    cropperCanvasId: string;
    cropperCutCanvasId: string;
    width: number;
    height: number;
    cropperWidth: number;
    cropperHeight: number;
    themeColor: string;
    maxScale: number;
    fullScreen: boolean;
    fullScreenCss: boolean;
    src: string;
    onCut: (src: string) => void;
    onCancel: () => void;
    onFail: (err: any) => void;
    hideFinishText: boolean;
    hideCancelText: boolean;
    finishText: string;
    cancelText: string;
    fileType: 'jpg' | 'png' | undefined;
    quality: number;
}
interface TaroCropperComponentState {
    scale: number;
}
declare type Inside<T> = T extends (...args: any[]) => Promise<infer U> ? U : T;
declare type getImageInfoType = {
    SuccessCallbackResult: Inside<typeof getImageInfo>;
};
declare type getSystemInfoSyncType = {
    Result: ReturnType<typeof getSystemInfoSync>;
};
declare class TaroCropperComponent extends PureComponent<TaroCropperComponentProps, TaroCropperComponentState> {
    static defaultProps: {
        type: string;
        maskColor: string;
        isSideLine: boolean;
        width: number;
        height: number;
        cropperWidth: number;
        cropperHeight: number;
        cropperCanvasId: string;
        cropperCutCanvasId: string;
        src: string;
        themeColor: string;
        maxScale: number;
        fullScreen: boolean;
        fullScreenCss: boolean;
        hideFinishText: boolean;
        hideCancelText: boolean;
        finishText: string;
        cancelText: string;
        fileType: string;
        quality: number;
        onCancel: () => void;
        onCut: () => void;
        onFail: () => void;
    };
    systemInfo: getSystemInfoSyncType['Result'];
    constructor(props: any);
    cropperCanvasContext: CanvasContext;
    cropperCutCanvasContext: CanvasContext;
    imageLeft: number;
    imageTop: number;
    imageLeftOrigin: number;
    imageTopOrigin: number;
    width: number;
    height: number;
    cropperWidth: number;
    cropperHeight: number;
    imageInfo: getImageInfoType['SuccessCallbackResult'];
    realImageWidth: number;
    realImageHeight: number;
    scaleImageWidth: number;
    scaleImageHeight: number;
    image: HTMLImageElement;
    /**
     * 根据props更新长等信息
     */
    updateInfo(props: TaroCropperComponentProps): Promise<unknown>;
    componentDidMount(): void;
    /**
     * 单位转换
     * @param value
     * @private
     */
    _getRealPx(value: number): number;
    /**
     * 绘制裁剪框的四个角
     * @private
     */
    _drawCropperCorner(): void;
    /**
     * 绘制裁剪框区域的图片
     * @param props
     * @param src               待绘制的图片路径
     * @param deviationX        图片绘制x向偏移
     * @param deviationY        图片绘制y向偏移
     * @param imageWidth        图片的原始宽度
     * @param imageHeight       图片的原始高度
     * @param drawWidth         图片的绘制宽度
     * @param drawHeight        图片的绘制高度
     * @param reverse
     * @private
     */
    _drawCropperContent(src: string | HTMLImageElement, deviationX: number, deviationY: number, imageWidth: number, imageHeight: number, drawWidth: number, drawHeight: number): void;
    update(): void;
    /**
     * 图片资源有更新则重新绘制
     * @param nextProps
     * @param nextContext
     */
    componentWillReceiveProps(nextProps: Readonly<TaroCropperComponentProps>, nextContext: any): void;
    /**
     * 图片移动边界检测
     * @param imageLeft
     * @param imageTop
     * @private
     */
    _outsideBound(imageLeft: number, imageTop: number): void;
    touch0X: number;
    touch0Y: number;
    oldDistance: number;
    oldScale: number;
    newScale: number;
    lastScaleImageWidth: number;
    lastScaleImageHeight: number;
    _oneTouchStart(touch: any): void;
    _twoTouchStart(touch0: any, touch1: any): void;
    _oneTouchMove(touch: any): void;
    _getNewScale(oldScale: number, oldDistance: number, touch0: any, touch1: any): number;
    _twoTouchMove(touch0: any, touch1: any): void;
    handleOnTouchEnd(): void;
    handleOnTouchStart(e: BaseEventOrig<any>): void;
    handleOnTouchMove(e: BaseEventOrig<any>): void;
    /**
     * 将当前裁剪框区域的图片导出
     */
    cut(): Promise<{
        errMsg: string;
        filePath: string;
    }>;
    render(): any;
}
export default TaroCropperComponent;
