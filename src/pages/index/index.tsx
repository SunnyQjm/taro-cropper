import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button} from '@tarojs/components'
import './index.scss'
import TaroCropper from '../../components/taro-cropper';

interface IndexProps {

}

interface IndexState {
  src: string,
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
    this.state = {
      src: ''
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    const {
      src
    } = this.state;
    return (
      <View className='index'>
        <TaroCropper height={1000} src={src} cropperWidth={400} cropperHeight={400}/>
        <Button onClick={() => {
          Taro.chooseImage()
            .then(res => {
              this.setState({
                src: res.tempFilePaths[0]
              });
            })
        }}>选择图片</Button>
      </View>
    )
  }
}
