import Taro, {Component, Config} from '@tarojs/taro'
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

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页',
  };

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
        />
        <Button onClick={() => {
          Taro.chooseImage({
            count: 1
          })
            .then(res => {
              console.log(res);
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
        />
      </View>
    )
  }
}
