(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@tarojs/taro'), require('react'), require('@tarojs/components')) :
    typeof define === 'function' && define.amd ? define(['@tarojs/taro', 'react', '@tarojs/components'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["taro-cropper"] = factory(global.Taro, global.React, global.components));
})(this, (function (Taro, React, components) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Taro__default = /*#__PURE__*/_interopDefaultLegacy(Taro);
    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function compareVersion(v1, v2) {
        v1 = v1.split('.');
        v2 = v2.split('.');
        var len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }
        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i]);
            var num2 = parseInt(v2[i]);
            if (num1 > num2) {
                return 1;
            }
            else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    }
    function isWeapp() {
        return process.env.TARO_ENV === 'weapp';
    }
    //////////////////////////////////////////////////////////////////////////////////
    //////// 微信小程序自1.9.90起废除若干个CanvasContext的函数，改为属性，以下为兼容代码
    //////////////////////////////////////////////////////////////////////////////////
    function _easyCanvasContextBase(systemInfo, lowCallback, highCallback, targetVersion) {
        if (targetVersion === void 0) { targetVersion = "1.9.90"; }
        if (isWeapp() && compareVersion(systemInfo.SDKVersion, targetVersion) >= 0) {
            highCallback();
        }
        else {
            lowCallback();
        }
    }
    /**
     *
     * 基础库 1.9.90 开始支持，低版本需做兼容处理。填充颜色。用法同 CanvasContext.setFillStyle()。
     * @param systemInfo
     * @param canvasContext
     * @param color
     */
    function easySetStrokeStyle(systemInfo, canvasContext, color) {
        _easyCanvasContextBase(systemInfo, function () {
            canvasContext.setStrokeStyle(color);
        }, function () {
            if (typeof color === "string") {
                canvasContext.strokeStyle = color;
            }
        });
    }
    function easySetLineWidth(systemInfo, canvasContext, lineWidth) {
        _easyCanvasContextBase(systemInfo, function () {
            canvasContext.setLineWidth(lineWidth);
        }, function () {
            canvasContext.lineWidth = lineWidth;
        });
    }
    function easySetFillStyle(systemInfo, canvasContext, color) {
        _easyCanvasContextBase(systemInfo, function () {
            canvasContext.setFillStyle(color);
        }, function () {
            if (typeof color === "string") {
                canvasContext.fillStyle = color;
            }
        });
    }

    var TaroCropperComponent = /** @class */ (function (_super) {
        __extends(TaroCropperComponent, _super);
        function TaroCropperComponent(props) {
            var _this = _super.call(this, props) || this;
            _this.imageLeft = 0;
            _this.imageTop = 0;
            _this.imageLeftOrigin = 0;
            _this.imageTopOrigin = 0;
            _this.width = 0;
            _this.height = 0;
            _this.cropperWidth = 0;
            _this.cropperHeight = 0;
            _this.realImageWidth = 0;
            _this.realImageHeight = 0;
            _this.scaleImageWidth = 0;
            _this.scaleImageHeight = 0;
            _this.touch0X = 0;
            _this.touch0Y = 0;
            _this.oldDistance = 0;
            _this.oldScale = 1;
            _this.newScale = 1;
            _this.lastScaleImageWidth = 0;
            _this.lastScaleImageHeight = 0;
            _this.update = _this.update.bind(_this);
            _this.handleOnTouchMove = _this.handleOnTouchMove.bind(_this);
            _this.handleOnTouchStart = _this.handleOnTouchStart.bind(_this);
            _this.handleOnTouchEnd = _this.handleOnTouchEnd.bind(_this);
            _this._drawCropperCorner = _this._drawCropperCorner.bind(_this);
            _this._drawCropperContent = _this._drawCropperContent.bind(_this);
            _this.systemInfo = Taro__default["default"].getSystemInfoSync();
            _this.state = {
                scale: 1,
            };
            return _this;
        }
        /**
         * 根据props更新长等信息
         */
        TaroCropperComponent.prototype.updateInfo = function (props) {
            var _this = this;
            var width = props.width, height = props.height, cropperWidth = props.cropperWidth, cropperHeight = props.cropperHeight, src = props.src, fullScreen = props.fullScreen;
            this.width = fullScreen ? this.systemInfo.windowWidth : this._getRealPx(width);
            this.height = fullScreen ? this.systemInfo.windowHeight : this._getRealPx(height);
            this.cropperWidth = this._getRealPx(cropperWidth);
            this.cropperHeight = this._getRealPx(cropperHeight);
            if (!src)
                return Promise.reject();
            return Taro__default["default"].getImageInfo({
                src: src
            })
                .then(function (res) {
                _this.imageInfo = res;
                var imageWidth = res.width;
                var imageHeight = res.height;
                if (imageWidth / imageHeight < _this.cropperWidth / _this.cropperHeight) { // 宽度充满
                    _this.scaleImageWidth = _this.realImageWidth = _this.cropperWidth;
                    _this.scaleImageHeight = _this.realImageHeight = _this.realImageWidth * imageHeight / imageWidth;
                    _this.imageLeftOrigin = _this.imageLeft = (_this.width - _this.cropperWidth) / 2;
                    _this.imageTopOrigin = _this.imageTop = (_this.height - _this.realImageHeight) / 2;
                }
                else {
                    _this.scaleImageHeight = _this.realImageHeight = _this.cropperHeight;
                    _this.scaleImageWidth = _this.realImageWidth = _this.realImageHeight * imageWidth / imageHeight;
                    _this.imageLeftOrigin = _this.imageLeft = (_this.width - _this.realImageWidth) / 2;
                    _this.imageTopOrigin = _this.imageTop = (_this.height - _this.cropperHeight) / 2;
                }
                // h5端返回的如果是blob对象，需要转成image对象才可以用Canvas绘制
                if (process.env.TARO_ENV === 'h5' && src.startsWith('blob:')) {
                    return new Promise(function (resolve, reject) {
                        _this.image = new Image();
                        _this.image.src = src;
                        _this.image.id = "taro_cropper_" + src;
                        _this.image.style.display = 'none';
                        document.body.append(_this.image);
                        _this.image.onload = resolve;
                        _this.image.onerror = reject;
                    });
                }
                else {
                    return Promise.resolve();
                }
            });
        };
        TaroCropperComponent.prototype.componentDidMount = function () {
            var _this = this;
            var _a = this.props, cropperCanvasId = _a.cropperCanvasId, cropperCutCanvasId = _a.cropperCutCanvasId;
            var initCanvas = function () {
                _this.cropperCanvasContext = Taro__default["default"].createCanvasContext(cropperCanvasId, _this);
                _this.cropperCutCanvasContext = Taro__default["default"].createCanvasContext(cropperCutCanvasId, _this);
                _this.updateInfo(_this.props)
                    .then(function () {
                    _this.update();
                })
                    .catch(function () {
                    _this.update();
                });
            };
            if (process.env.TARO_ENV == 'h5') {
                setTimeout(function () {
                    initCanvas();
                }, 500);
            }
            else {
                initCanvas();
            }
        };
        /**
         * 单位转换
         * @param value
         * @private
         */
        TaroCropperComponent.prototype._getRealPx = function (value) {
            return value / 750 * this.systemInfo.screenWidth;
        };
        /**
         * 绘制裁剪框的四个角
         * @private
         */
        TaroCropperComponent.prototype._drawCropperCorner = function () {
            var _a = this.props, themeColor = _a.themeColor, isSideLine = _a.isSideLine;
            if (!isSideLine)
                return;
            var lineWidth = 2;
            var lineLength = 10;
            var cropperStartX = (this.width - this.cropperWidth) / 2;
            var cropperStartY = (this.height - this.cropperHeight) / 2;
            this.cropperCanvasContext.beginPath();
            easySetStrokeStyle(this.systemInfo, this.cropperCanvasContext, themeColor);
            easySetLineWidth(this.systemInfo, this.cropperCanvasContext, lineWidth);
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
        };
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
        TaroCropperComponent.prototype._drawCropperContent = function (
        // props: TaroCropperComponentProps,
        src, deviationX, deviationY, imageWidth, imageHeight, drawWidth, drawHeight) {
            var _a = this.props, type = _a.type, maskColor = _a.maskColor;
            this._drawCropperCorner();
            var cropperStartX = (this.width - this.cropperWidth) / 2;
            var cropperStartY = (this.height - this.cropperHeight) / 2;
            var cropperImageX = (cropperStartX - deviationX) / drawWidth * imageWidth;
            var cropperImageY = (cropperStartY - deviationY) / drawHeight * imageHeight;
            var cropperImageWidth = this.cropperWidth / drawWidth * imageWidth;
            var cropperImageHeight = this.cropperHeight / drawHeight * imageHeight;
            // 绘制裁剪框内裁剪的图片
            if (process.env.TARO_ENV == 'swan') {
                // @ts-ignore
                this.cropperCanvasContext.drawImage(src, cropperStartX, cropperStartY, this.cropperWidth, this.cropperHeight, cropperImageX, cropperImageY, cropperImageWidth, cropperImageHeight);
                // @ts-ignore
                this.cropperCutCanvasContext.drawImage(src, 0, 0, this.cropperWidth, this.cropperHeight, cropperImageX, cropperImageY, cropperImageWidth, cropperImageHeight);
            }
            else {
                // @ts-ignore
                this.cropperCanvasContext.drawImage(src, cropperImageX, cropperImageY, cropperImageWidth, cropperImageHeight, cropperStartX, cropperStartY, this.cropperWidth, this.cropperHeight);
                // @ts-ignore
                this.cropperCutCanvasContext.drawImage(src, cropperImageX, cropperImageY, cropperImageWidth, cropperImageHeight, 0, 0, this.cropperWidth, this.cropperHeight);
            }
            if (type == 'circle') {
                // 绘制半透明层 圆形
                this.cropperCanvasContext.beginPath();
                var lineWidth = 300;
                this.cropperCanvasContext.lineWidth = lineWidth;
                this.cropperCanvasContext.strokeStyle = maskColor;
                this.cropperCanvasContext.arc(cropperStartX + this.cropperWidth / 2, cropperStartY + this.cropperHeight / 2, this.cropperWidth / 2 + lineWidth / 2, 0, 2 * Math.PI);
                this.cropperCanvasContext.stroke();
            }
        };
        TaroCropperComponent.prototype.update = function () {
            var _a = this.props, type = _a.type, maskColor = _a.maskColor;
            if (!this.imageInfo) { // 图片资源无效则不执行更新操作
                this._drawCropperCorner();
                this.cropperCanvasContext.draw();
                return;
            }
            var src = process.env.TARO_ENV === 'h5' ? this.image : this.imageInfo.path;
            if (process.env.TARO_ENV == 'swan') {
                // @ts-ignore
                this.cropperCanvasContext.drawImage(src, this.imageLeft, this.imageTop, this.scaleImageWidth, this.scaleImageHeight, 0, 0, this.imageInfo.width, this.imageInfo.height);
            }
            else {
                // @ts-ignore
                this.cropperCanvasContext.drawImage(src, 0, 0, this.imageInfo.width, this.imageInfo.height, this.imageLeft, this.imageTop, this.scaleImageWidth, this.scaleImageHeight);
            }
            if (type == 'rect') {
                // 绘制半透明层 矩形
                this.cropperCanvasContext.beginPath();
                easySetFillStyle(this.systemInfo, this.cropperCanvasContext, maskColor);
                this.cropperCanvasContext.fillRect(0, 0, this.width, this.height);
                this.cropperCanvasContext.fill();
            }
            // 绘制裁剪框内部的区域
            this._drawCropperContent(src, this.imageLeft, this.imageTop, this.imageInfo.width, this.imageInfo.height, this.scaleImageWidth, this.scaleImageHeight);
            this.cropperCanvasContext.draw(false);
            this.cropperCutCanvasContext.draw(false);
        };
        /**
         * 图片资源有更新则重新绘制
         * @param nextProps
         * @param nextContext
         */
        TaroCropperComponent.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
            var _this = this;
            if (JSON.stringify(nextProps) != JSON.stringify(this.props)) {
                this.updateInfo(nextProps)
                    .then(function () {
                    _this.update();
                });
            }
            return _super.prototype.componentWillReceiveProps && _super.prototype.componentWillReceiveProps.call(this, nextProps, nextContext);
        };
        /**
         * 图片移动边界检测
         * @param imageLeft
         * @param imageTop
         * @private
         */
        TaroCropperComponent.prototype._outsideBound = function (imageLeft, imageTop) {
            this.imageLeft =
                imageLeft > (this.width - this.cropperWidth) / 2
                    ?
                        (this.width - this.cropperWidth) / 2
                    :
                        ((imageLeft + this.scaleImageWidth) >= (this.width + this.cropperWidth) / 2
                            ?
                                imageLeft
                            :
                                (this.width + this.cropperWidth) / 2 - this.scaleImageWidth);
            this.imageTop =
                imageTop > (this.height - this.cropperHeight) / 2
                    ?
                        (this.height - this.cropperHeight) / 2
                    :
                        ((imageTop + this.scaleImageHeight) >= (this.height + this.cropperHeight) / 2
                            ?
                                imageTop
                            :
                                (this.height + this.cropperHeight) / 2 - this.scaleImageHeight);
        };
        TaroCropperComponent.prototype._oneTouchStart = function (touch) {
            this.touch0X = touch.x;
            this.touch0Y = touch.y;
        };
        TaroCropperComponent.prototype._twoTouchStart = function (touch0, touch1) {
            var xMove = touch1.x - touch0.x;
            var yMove = touch1.y - touch0.y;
            this.lastScaleImageWidth = this.scaleImageWidth;
            this.lastScaleImageHeight = this.scaleImageHeight;
            // 计算得到初始时两指的距离
            this.oldDistance = Math.sqrt(xMove * xMove + yMove * yMove);
        };
        TaroCropperComponent.prototype._oneTouchMove = function (touch) {
            var xMove = touch.x - this.touch0X;
            var yMove = touch.y - this.touch0Y;
            this._outsideBound(this.imageLeftOrigin + xMove, this.imageTopOrigin + yMove);
            this.update();
        };
        TaroCropperComponent.prototype._getNewScale = function (oldScale, oldDistance, touch0, touch1) {
            var xMove = touch1.x - touch0.x;
            var yMove = touch1.y - touch0.y;
            var newDistance = Math.sqrt(xMove * xMove + yMove * yMove);
            return oldScale + 0.02 * (newDistance - oldDistance);
        };
        TaroCropperComponent.prototype._twoTouchMove = function (touch0, touch1) {
            var maxScale = this.props.maxScale;
            var realMaxScale = maxScale >= 1 ? maxScale : 1;
            var oldScale = this.oldScale;
            var oldDistance = this.oldDistance;
            this.newScale = this._getNewScale(oldScale, oldDistance, touch0, touch1);
            // 限制缩放
            this.newScale <= 1 && (this.newScale = 1);
            this.newScale > realMaxScale && (this.newScale = realMaxScale);
            this.scaleImageWidth = this.realImageWidth * this.newScale;
            this.scaleImageHeight = this.realImageHeight * this.newScale;
            var imageLeft = this.imageLeftOrigin - (this.scaleImageWidth - this.lastScaleImageWidth) / 2;
            var imageTop = this.imageTopOrigin - (this.scaleImageHeight - this.lastScaleImageHeight) / 2;
            this._outsideBound(imageLeft, imageTop);
            this.update();
        };
        TaroCropperComponent.prototype.handleOnTouchEnd = function () {
            this.oldScale = this.newScale;
            this.imageLeftOrigin = this.imageLeft;
            this.imageTopOrigin = this.imageTop;
        };
        TaroCropperComponent.prototype.handleOnTouchStart = function (e) {
            var src = this.props.src;
            if (!src)
                return;
            // @ts-ignore
            var touch0 = e.touches[0];
            // @ts-ignore
            var touch1 = e.touches[1];
            // 计算第一个触摸点的位置，并参照改点进行缩放
            this._oneTouchStart(touch0);
            // 两指手势触发
            // @ts-ignore
            if (e.touches.length >= 2) {
                this._twoTouchStart(touch0, touch1);
            }
        };
        TaroCropperComponent.prototype.handleOnTouchMove = function (e) {
            var src = this.props.src;
            if (!src)
                return;
            // 单指手势触发
            // @ts-ignore
            if (e.touches.length === 1) {
                // @ts-ignore
                this._oneTouchMove(e.touches[0]);
                // @ts-ignore
            }
            else if (e.touches.length >= 2) { // 双指手势触发
                // @ts-ignore
                this._twoTouchMove(e.touches[0], e.touches[1]);
            }
        };
        /**
         * 将当前裁剪框区域的图片导出
         */
        TaroCropperComponent.prototype.cut = function () {
            var _this = this;
            var _a = this.props, cropperCutCanvasId = _a.cropperCutCanvasId, fileType = _a.fileType, quality = _a.quality;
            return new Promise(function (resolve, reject) {
                // const scope = process.env.TARO_ENV === 'h5' ? this : getCurrentInstance().page;
                Taro__default["default"].canvasToTempFilePath({
                    canvasId: cropperCutCanvasId,
                    x: 0,
                    y: 0,
                    width: _this.cropperWidth - 2,
                    height: _this.cropperHeight - 2,
                    destWidth: _this.cropperWidth * _this.systemInfo.pixelRatio,
                    destHeight: _this.cropperHeight * _this.systemInfo.pixelRatio,
                    fileType: fileType,
                    quality: quality,
                    success: function (res) {
                        switch (process.env.TARO_ENV) {
                            case 'alipay':
                                resolve({
                                    errMsg: res.errMsg,
                                    filePath: res.tempFilePath
                                });
                                break;
                            case 'weapp':
                            case 'qq':
                            case 'h5':
                            default:
                                resolve({
                                    errMsg: res.errMsg,
                                    filePath: res.tempFilePath
                                });
                                break;
                        }
                    },
                    fail: function (err) {
                        reject(err);
                    },
                    complete: function () {
                    }
                }, _this);
            });
        };
        TaroCropperComponent.prototype.render = function () {
            var _this = this;
            var _a = this.props, width = _a.width, height = _a.height, cropperCanvasId = _a.cropperCanvasId, fullScreen = _a.fullScreen, fullScreenCss = _a.fullScreenCss, themeColor = _a.themeColor, hideFinishText = _a.hideFinishText, cropperWidth = _a.cropperWidth, cropperHeight = _a.cropperHeight, cropperCutCanvasId = _a.cropperCutCanvasId, hideCancelText = _a.hideCancelText, onCancel = _a.onCancel, finishText = _a.finishText, cancelText = _a.cancelText;
            var _width = fullScreen ? this.systemInfo.windowWidth : this._getRealPx(width);
            var _height = fullScreen ? this.systemInfo.windowHeight : this._getRealPx(height);
            var _cropperWidth = this._getRealPx(cropperWidth);
            var _cropperHeight = this._getRealPx(cropperHeight);
            var isFullScreenCss = fullScreen && fullScreenCss;
            var cropperStyle = isFullScreenCss ? {} : {
                position: 'relative'
            };
            var canvasStyle = {
                background: 'rgba(0, 0, 0, 0.8)',
                position: 'relative',
                width: _width + "px",
                height: _height + "px"
            };
            var cutCanvasStyle = {
                position: 'absolute',
                left: (_width - _cropperWidth) / 2 + "px",
                top: (_height - _cropperHeight) / 2 + "px",
                width: _cropperWidth + "px",
                height: _cropperHeight + "px",
            };
            var finish = null;
            var cancel = null;
            // const isH5 = process.env.TARO_ENV === 'h5';
            if (!hideFinishText) {
                var finishStyle = {
                    position: 'absolute',
                    display: 'inline-block',
                    color: themeColor,
                    textAlign: "right",
                    fontSize: Taro__default["default"].pxTransform(32, 750),
                    bottom: Taro__default["default"].pxTransform(30, 750),
                    right: Taro__default["default"].pxTransform(30, 750),
                };
                var onFinishClick = function () {
                    _this.cut()
                        .then(function (res) {
                        _this.props.onCut && _this.props.onCut(res.filePath);
                    })
                        .catch(function (err) {
                        _this.props.onFail && _this.props.onFail(err);
                    });
                };
                // if (!isH5) {
                finish = React__default["default"].createElement(components.CoverView, { style: finishStyle, onClick: onFinishClick }, finishText);
                // } else {
                //   finish = <View
                //     style={finishStyle}
                //     onClick={onFinishClick}
                //   >
                //     完成
                //   </View>
                // }
            }
            if (!hideCancelText) {
                var cancelStyle = {
                    position: 'absolute',
                    display: 'inline-block',
                    color: themeColor,
                    textAlign: "left",
                    fontSize: Taro__default["default"].pxTransform(32, 750),
                    bottom: Taro__default["default"].pxTransform(30, 750),
                    left: Taro__default["default"].pxTransform(30, 750),
                };
                cancel = React__default["default"].createElement(components.CoverView, { style: cancelStyle, onClick: onCancel }, cancelText);
            }
            return (React__default["default"].createElement(components.View, { className: "taro-cropper " + (isFullScreenCss ? 'taro-cropper-fullscreen' : ''), style: cropperStyle },
                React__default["default"].createElement(components.Canvas, { canvasId: cropperCutCanvasId, style: cutCanvasStyle, className: "cut-canvas-item " + (isFullScreenCss ? 'cut-canvas-fullscreen' : '') }),
                React__default["default"].createElement(components.Canvas, { onTouchStart: this.handleOnTouchStart, onTouchMove: this.handleOnTouchMove, onTouchEnd: this.handleOnTouchEnd, canvasId: cropperCanvasId, style: canvasStyle, className: "canvas-item " + (isFullScreenCss ? 'canvas-fullscreen' : ''), disableScroll: true }),
                !hideFinishText &&
                    finish,
                !hideCancelText &&
                    cancel));
        };
        TaroCropperComponent.defaultProps = {
            type: 'rect',
            maskColor: 'rgba(0,0,0,.6)',
            isSideLine: false,
            width: 750,
            height: 1200,
            cropperWidth: 400,
            cropperHeight: 400,
            cropperCanvasId: 'cropperCanvasId',
            cropperCutCanvasId: 'cropperCutCanvasId',
            src: '',
            themeColor: '#00ff00',
            maxScale: 3,
            fullScreen: false,
            fullScreenCss: false,
            hideFinishText: false,
            hideCancelText: true,
            finishText: '完成',
            cancelText: '取消',
            fileType: 'jpg',
            quality: 1,
            onCancel: function () {
            },
            onCut: function () {
            },
            onFail: function () {
            },
        };
        return TaroCropperComponent;
    }(React.PureComponent));

    return TaroCropperComponent;

}));
//# sourceMappingURL=index.umd.js.map
