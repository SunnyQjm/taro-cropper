import Taro, {CanvasContext, getImageInfo, getSystemInfoSync} from '@tarojs/taro';
import {Canvas, View} from '@tarojs/components';

import './index.scss';
import {ITouch, ITouchEvent} from "@tarojs/components/types/common";


interface TaroCropperComponentProps {
  cropperCanvasId: string,  // 裁剪框画布id
  width: number,            // 组件宽度
  height: number,           // 组件高度   (要求背景高度大于宽度)
  cropperWidth: number,     // 裁剪框宽度
  cropperHeight: number,    // 裁剪框高度
  src: string,
}

interface TaroCropperComponentState {
  scale: number,
}

class TaroCropperComponent extends Taro.PureComponent<TaroCropperComponentProps, TaroCropperComponentState> {

  static defaultProps = {
    width: 750,
    height: 1200,
    cropperWidth: 300,
    cropperHeight: 300,
    cropperCanvasId: 'TaroCropperCanvasId',
    src: '',
  };

  systemInfo: getSystemInfoSync.Return;
  cropperCanvasContext: CanvasContext;

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.handleOnTouchMove = this.handleOnTouchMove.bind(this);
    this.handleOnTouchStart = this.handleOnTouchStart.bind(this);
    this.handleOnTouchEnd = this.handleOnTouchEnd.bind(this);
    this._drawCropperCorner = this._drawCropperCorner.bind(this);
    this._drawCropperContent = this._drawCropperContent.bind(this);
    this.systemInfo = Taro.getSystemInfoSync();
    this.state = {
      scale: 1,
    }
  }

  imageLeft: number = 0;
  imageTop: number = 0;
  imageLeftOrigin: number = 0;
  imageTopOrigin: number = 0;
  width: number = 0;
  height: number = 0;
  cropperWidth: number = 0;
  cropperHeight: number = 0;
  imageInfo: getImageInfo.Promised;
  realImageWidth: number = 0;
  realImageHeight: number = 0;
  scaleImageWidth: number = 0;
  scaleImageHeight: number = 0;

  /**
   * 根据props更新长等信息
   */
  updateInfo(props: TaroCropperComponentProps) {
    const {
      width,
      height,
      cropperWidth,
      cropperHeight,
      src
    } = props;
    this.width = this._getRealPx(width);
    this.height = this._getRealPx(height);
    this.cropperWidth = this._getRealPx(cropperWidth);
    this.cropperHeight = this._getRealPx(cropperHeight);
    if (!src)
      return Promise.reject();
    return Taro.getImageInfo({
      src: src
    })
      .then((res: getImageInfo.Promised) => {
        this.imageInfo = res;
        const imageWidth = res.width;
        const imageHeight = res.height;

        if (imageWidth / imageHeight < this.cropperWidth / this.cropperHeight) {      // 宽度充满
          this.scaleImageWidth = this.realImageWidth = this.cropperWidth;
          this.scaleImageHeight = this.realImageHeight = this.realImageWidth * imageHeight / imageWidth;
          this.imageLeftOrigin = this.imageLeft = (this.width - this.cropperWidth) / 2;
          this.imageTopOrigin = this.imageTop = (this.height - this.realImageHeight) / 2;
        } else {
          this.scaleImageHeight = this.realImageHeight = this.cropperHeight;
          this.scaleImageWidth = this.realImageWidth = this.realImageHeight * imageWidth / imageHeight;
          this.imageLeftOrigin = this.imageLeft = (this.width - this.realImageWidth) / 2;
          this.imageTopOrigin = this.imageTop = (this.height - this.cropperHeight) / 2;
        }

        return Promise.resolve()
      })
  }


  componentDidMount(): void {
    const {
      cropperCanvasId,
    } = this.props;
    this.cropperCanvasContext = Taro.createCanvasContext(cropperCanvasId, this);
    this.updateInfo(this.props)
      .then(() => {
        this.update();
      })
      .catch(() => {
        this.update();
      });
  }

  /**
   * 单位转换
   * @param value
   * @private
   */
  _getRealPx(value: number) {
    return value / 750 * this.systemInfo.screenWidth;
  }

  /**
   * 绘制裁剪框的四个角
   * @private
   */
  _drawCropperCorner() {
    const cropperStartX = (this.width - this.cropperWidth) / 2;
    const cropperStartY = (this.height - this.cropperHeight) / 2;

    const lineWidth = 2;
    const lineLength = 10;
    this.cropperCanvasContext.beginPath();
    this.cropperCanvasContext.setStrokeStyle('#0f0');
    this.cropperCanvasContext.setLineWidth(lineWidth);
    // 左上角
    this.cropperCanvasContext.moveTo(cropperStartX, cropperStartY);
    this.cropperCanvasContext.lineTo(cropperStartX + lineLength, cropperStartY);
    this.cropperCanvasContext.moveTo(cropperStartX, cropperStartY - lineWidth / 2);
    this.cropperCanvasContext.lineTo(cropperStartX, cropperStartY + lineLength);
    // 右上角
    this.cropperCanvasContext.moveTo(cropperStartX + this.cropperWidth, cropperStartY);
    this.cropperCanvasContext.lineTo(cropperStartX + this.cropperWidth - lineLength, cropperStartY);
    this.cropperCanvasContext.moveTo(cropperStartX + this.cropperWidth, cropperStartY - lineWidth / 2);
    this.cropperCanvasContext.lineTo(cropperStartX + this.cropperWidth, cropperStartY + lineLength);
    // 左下角
    this.cropperCanvasContext.moveTo(cropperStartX, cropperStartY + this.cropperHeight);
    this.cropperCanvasContext.lineTo(cropperStartX + lineLength, cropperStartY + this.cropperHeight);
    this.cropperCanvasContext.moveTo(cropperStartX, cropperStartY + this.cropperHeight + lineWidth / 2);
    this.cropperCanvasContext.lineTo(cropperStartX, cropperStartY + this.cropperHeight - lineLength);
    // 右下角
    this.cropperCanvasContext.moveTo(cropperStartX + this.cropperWidth, cropperStartY + this.cropperHeight);
    this.cropperCanvasContext.lineTo(cropperStartX + this.cropperWidth - lineLength, cropperStartY + this.cropperHeight);
    this.cropperCanvasContext.moveTo(cropperStartX + this.cropperWidth, cropperStartY + this.cropperHeight + lineWidth / 2);
    this.cropperCanvasContext.lineTo(cropperStartX + this.cropperWidth, cropperStartY + this.cropperHeight - lineLength);
    this.cropperCanvasContext.closePath();
    this.cropperCanvasContext.stroke();
  }

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
  _drawCropperContent(
    // props: TaroCropperComponentProps,
    src: string,
    deviationX: number,
    deviationY: number,
    imageWidth: number,
    imageHeight: number,
    drawWidth: number,
    drawHeight: number) {
    const cropperStartX = (this.width - this.cropperWidth) / 2;
    const cropperStartY = (this.height - this.cropperHeight) / 2;

    const cropperImageX = (cropperStartX - deviationX) / drawWidth * imageWidth;
    const cropperImageY = (cropperStartY - deviationY) / drawHeight * imageHeight;
    const cropperImageWidth = this.cropperWidth / drawWidth * imageWidth;
    const cropperImageHeight = this.cropperHeight / drawHeight * imageHeight;
    // 绘制裁剪框内裁剪的图片
    this.cropperCanvasContext.drawImage(src, cropperImageX, cropperImageY, cropperImageWidth, cropperImageHeight,
      cropperStartX, cropperStartY, this.cropperWidth, this.cropperHeight);
    this._drawCropperCorner();
  }

  update() {
    if (!this.imageInfo) {            // 图片资源无效则不执行更新操作
      this._drawCropperCorner();
      this.cropperCanvasContext.draw();
      return;
    }

    this.cropperCanvasContext.drawImage(this.imageInfo.path, 0, 0, this.imageInfo.width, this.imageInfo.height,
      this.imageLeft, this.imageTop, this.scaleImageWidth, this.scaleImageHeight);
    // 绘制半透明层
    this.cropperCanvasContext.beginPath();
    this.cropperCanvasContext.setFillStyle('rgba(0, 0, 0, 0.3)');
    this.cropperCanvasContext.fillRect(0, 0, this.width, this.height);
    this.cropperCanvasContext.fill();

    // 绘制裁剪框内部的区域
    this._drawCropperContent(this.imageInfo.path, this.imageLeft, this.imageTop,
      this.imageInfo.width, this.imageInfo.height, this.scaleImageWidth, this.scaleImageHeight);
    this.cropperCanvasContext.draw(false);
  }

  /**
   * 图片资源有更新则重新绘制
   * @param nextProps
   * @param nextContext
   */
  componentWillReceiveProps(nextProps: Readonly<TaroCropperComponentProps>, nextContext: any): void {
    if (JSON.stringify(nextProps) != JSON.stringify(this.props)) {
      this.updateInfo(nextProps)
        .then(() => {
          this.update();
        });
    }
    return super.componentWillReceiveProps && super.componentWillReceiveProps(nextProps, nextContext);
  }

  /**
   * 图片移动边界检测
   * @param imageLeft
   * @param imageRight
   * @private
   */
  _outsideBound(imageLeft: number, imageTop: number) {
    this.imageLeft =
      imageLeft > (this.width - this.cropperWidth) / 2
        ?
        (this.width - this.cropperWidth) / 2
        :
        (
          (imageLeft + this.scaleImageWidth) >= (this.width + this.cropperWidth) / 2
            ?
            imageLeft
            :
            (this.width + this.cropperWidth) / 2 - this.scaleImageWidth
        );
    this.imageTop =
      imageTop > (this.height - this.cropperHeight) / 2
        ?
        (this.height - this.cropperHeight) / 2
        :
        (
          (imageTop + this.scaleImageHeight) >= (this.height + this.cropperHeight) / 2
            ?
            imageTop
            :
            (this.height + this.cropperHeight) / 2 - this.scaleImageHeight
        )
  }

  touch0X = 0;
  touch0Y = 0;
  oldDistance = 0;
  oldScale = 1;
  newScale = 1;
  lastScaleImageWidth = 0;
  lastScaleImageHeight = 0;

  _oneTouchStart(touch: ITouch) {
    this.touch0X = touch.x;
    this.touch0Y = touch.y;
  }

  _twoTouchStart(touch0: ITouch, touch1: ITouch) {
    const xMove = touch1.x - touch0.x;
    const yMove = touch1.y - touch0.y;
    this.lastScaleImageWidth = this.scaleImageWidth;
    this.lastScaleImageHeight = this.scaleImageHeight;

    // 计算得到初始时两指的距离
    this.oldDistance = Math.sqrt(xMove * xMove + yMove * yMove);
  }

  _oneTouchMove(touch: ITouch) {
    const xMove = touch.x - this.touch0X;
    const yMove = touch.y - this.touch0Y;
    this._outsideBound(this.imageLeftOrigin + xMove, this.imageTopOrigin + yMove);
    this.update();
  }

  _getNewScale(oldScale: number, oldDistance: number, touch0: ITouch, touch1: ITouch) {
    const xMove = touch1.x - touch0.x;
    const yMove = touch1.y - touch0.y;
    const newDistance = Math.sqrt(xMove * xMove + yMove * yMove);
    return oldScale + 0.02 * (newDistance - oldDistance);
  }

  _twoTouchMove(touch0: ITouch, touch1: ITouch) {
    const oldScale = this.oldScale;
    const oldDistance = this.oldDistance;
    this.newScale = this._getNewScale(oldScale, oldDistance, touch0, touch1);

    // 限制缩放
    this.newScale <= 1 && (this.newScale = 1);
    this.newScale > 3 && (this.newScale = 3);

    this.scaleImageWidth = this.realImageWidth * this.newScale;
    this.scaleImageHeight = this.realImageHeight * this.newScale;
    const imageLeft = this.imageLeftOrigin - (this.scaleImageWidth - this.lastScaleImageWidth) / 2;
    const imageTop = this.imageTopOrigin - (this.scaleImageHeight - this.lastScaleImageHeight) / 2;

    this._outsideBound(imageLeft, imageTop);

    this.update();
  }


  handleOnTouchEnd() {
    this.oldScale = this.newScale;
    this.imageLeftOrigin = this.imageLeft;
    this.imageTopOrigin = this.imageTop
  }


  handleOnTouchStart(e: ITouchEvent) {
    const {
      src
    } = this.props;
    if (!src)
      return;
    const touch0 = e.touches[0];
    const touch1 = e.touches[1];

    // 计算第一个触摸点的位置，并参照改点进行缩放
    this._oneTouchStart(touch0);

    // 两指手势触发
    if (e.touches.length >= 2) {
      this._twoTouchStart(touch0, touch1);
    }
  }

  handleOnTouchMove(e: ITouchEvent) {
    const {
      src
    } = this.props;
    if (!src)
      return;

    // 单指手势触发
    if (e.touches.length === 1) {
      this._oneTouchMove(e.touches[0]);
    } else if (e.touches.length >= 2) {// 双指手势触发
      this._twoTouchMove(e.touches[0], e.touches[1]);
    }
  }


  /**
   * 将当前裁剪框区域的图片导出
   */
  cut(): Promise<{
    errMsg: string,
    tempFilePath: string,
  }> {
    const {
      cropperCanvasId
    } = this.props;
    return new Promise((resolve, reject) => {
      const cropperStartX = (this.width - this.cropperWidth) / 2;
      const cropperStartY = (this.height - this.cropperHeight) / 2;
      Taro.canvasToTempFilePath({
        canvasId: cropperCanvasId,
        x: cropperStartX,
        y: cropperStartY,
        width: this.cropperWidth,
        height: this.cropperHeight,
        destWidth: 2 * this.cropperWidth,
        destHeight: 2 * this.cropperHeight,
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err);
        },
        complete: () => {
        }
      }, this.$scope);
    });
  }


  render(): any {
    const {
      width,
      height,
      cropperCanvasId,
    } = this.props;
    return (
      <View className='taro-cropper-component'>
        <Canvas
          onTouchStart={this.handleOnTouchStart}
          onTouchMove={this.handleOnTouchMove}
          onTouchEnd={this.handleOnTouchEnd}
          canvasId={cropperCanvasId}
          style={{
            width: `${width / 750 * this.systemInfo.screenWidth}px`,
            height: `${height / 750 * this.systemInfo.screenWidth}px`,
            background: 'rgba(0, 0, 0, 0.8)',
          }}
          disableScroll
        />
      </View>
    );
  }
}

export default TaroCropperComponent;
