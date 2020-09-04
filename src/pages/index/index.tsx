import Taro from '@tarojs/taro'
import React, {Component} from 'react'
import {View, Button, Image} from '@tarojs/components'
import './index.scss'
import TaroCropper from '../../components/taro-cropper';

interface IndexProps {

}

interface IndexState {
  src: string,
  cutImagePath: string,
}

export default class Index extends Component<IndexProps, IndexState> {
  constructor(props) {
    super(props);
    this.catTaroCropper = this.catTaroCropper.bind(this);
    this.state = {
      src: '',
      cutImagePath: '',
    }
  }

  taroCropper: TaroCropper;

  catTaroCropper(node: TaroCropper) {
    this.taroCropper = node;
  }

  render() {
    const {
      src,
      cutImagePath
    } = this.state;
    return (
      <View className='index'>
        <TaroCropper
          height={1000} src={src}
          cropperWidth={400}
          cropperHeight={400}
          ref={this.catTaroCropper}
          // themeColor={'#f00'}
          // hideFinishText
          fullScreen
          onCut={res => {
            this.setState({
              cutImagePath: res
            })
          }}
          hideCancelText={false}
          onCancel={() => {
            Taro.showToast({
              icon: 'none',
              title: '点击取消'
            })
          }}
        />
        <Button onClick={() => {
          Taro.chooseImage({
            count: 1
          })
            .then(res => {
              // console.log(res);
              this.setState({
                src: res.tempFilePaths[0]
              });
            })
        }}>选择图片</Button>
        <Button onClick={() => {
          this.taroCropper && this.taroCropper.cut()
            .then(res => {
              this.setState({
                cutImagePath: res.filePath
              });
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            })
        }}>
          裁剪
        </Button>
        <Image
          src={cutImagePath}
          mode='widthFix'
          style={{
            width: Taro.pxTransform(400),
            height: Taro.pxTransform(400)
          }}
        />
      </View>
    )
  }
}
