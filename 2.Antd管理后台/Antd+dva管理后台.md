# 管理后台
## 1.设置代理
在config/config.ts中设置,后面的数据请求时用到

```
proxy: {
    '/apis/': {
      target: '这里填入你要代理的url,后台提供',
      changeOrigin: true, // pathRewrite: { '^/server': '' },
    },
  },
```

## 2.路由设置

也在config/config.ts中设置

```
routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
]
```

## 3.在src/pages中编写相应的页面

## 4.dva状态管理
### 编写service文件
用来进行接口请求

```
import request from '../../../utils/request';

// 获取官网活动
//params用于设置请求头参数
const getactive = (activename) => {
    return request.get('/websiteActivity/get-website-activities',{
        params: {
            "name":activename
        },
    });
}

// 新增活动
//data用于设置请求体中的参数
const moreactive = (data) => {
    request.post('/websiteActivity/add-website-activity',{
        data:data
    })
}

export {
    getactive,
    moreactive,
}
```

### 编写model文件
这里类似于redux的作用  

1. namespace:相当于该model在整个文件中的唯一标识符
2. state:数据存储
3. effects:进行异步请求,在拿到数据后,把数据传给reducers进行管理
4. reducers:相当于redux中的功能,进行数据的管理,通过用户dispatch操作返回相应的数据

```
import {getactive,
        moreactive,} from './service';

export default {
    namespace:'officialactive',
    state:{
        list:[]
    },
    effects:{
        // 获取列表数据
        /**
        * @param payload 参数
        * @param call 执行异步函数调用接口
        * @param put 发出一个 Action，类似于 dispatch 将服务端返回的数据传递给上面的state
        **/ 
        *fetchactive({payload},{call,put}){
            const response = yield call(getactive,payload);
            // console.log(response.data.webActivities);
            yield put({
                //这行对应reducers处理函数名字
                type:'activeget',
                // 将最后的处理数据传递给reducers函数
                payload:response
            })
        },
        // 新增活动
        *formoreactive({payload},{call,put}){
            yield call(moreactive,payload);
            yield put({
                type:'fetchactive'
            })
        },
    },
    reducers:{
        activeget(state,action){
            return {
                ...state,
                list:[...action.payload.data.webActivities]
            }
        }
    }
}
```

## 5.在页面中引入数据
通过dva提供的**connect**来做state和dispatch的映射

```
import { connect } from 'dva';

const Grayscale = ({mygray,getgraylist,postgraylist}) => {
    useEffect(() => {
        getgraylist();
    }, []);

    //将state中的数据传入useEffect的第二个参数来实时渲染页面
    useEffect(() => {
        // console.log(mygray.list);
        if(mygray && mygray.list){
        console.log(mygray.list)
        setdata(mygray.list);
        }
    }, [mygray]);
}

export default connect(
  state => ({
    mygray:state.gray
  }),
  dispatch => ({
    getgraylist : () => dispatch({
      type:'gray/fetchgray'
    }),
    postgraylist: (data) => dispatch({
      type:'gray/postmygray',
      payload:data
    })
  })
)(Grayscale);
```

## antd 3 的表单提交
1. 引入表单
```
import { Form} from 'antd';
```
2. 使用Form.create()包裹组件
```
export default Form.create()(DynamicFieldSet)
```
3. 引入form参数

```
const DynamicFieldSet = ({form}) => {}
```
4. 利用**form.getFieldDecorator**包裹希望提交数据的组件，第一个参数是相应的数据名标签，第二个参数即相应的要提交的组件
```
{form.getFieldDecorator('username')(<Input />)}
```
5. form.validateFields用来触发触发表单验证
```
const handleSubmit = e => {
  e.preventDefault();
  form.validateFields((err, values) => {
    if (!err) {
      console.log('Received values of form: ', values);
    }
  });
};
```
6. 通过onSubmit把验证函数绑定到表单
```
<Form onSubmit={(e)=>handleSubmit(e)}></Form>
```

#### 详细代码如下
```
import React from "react";
import styles from "./index.less";
import {
  Button,
  Input,
  Upload,
  Form
} from 'antd';
import '@ant-design/compatible/assets/index.css';

const DynamicFieldSet = ({form}) => {
  form.validateFields((err, fieldsValue) => {
    if (err) return;
    console.log(fieldsValue)
});

    return (
      <Form>
        <Form.Item name="field" noStyle>
        {form.getFieldDecorator('username')(<Input />)}
        </Form.Item>
        <Form.Item name="jojo" noStyle>
        {form.getFieldDecorator('jojo')(<Input />)}
        </Form.Item>
        <Button htmlType="submit">Submit</Button>
      </Form>
    );
};

export default Form.create()(DynamicFieldSet)

```

## antd 4 的表单提交
antd4的表单提交引入了hook钩子函数,通过Form.useForm()引入form

```
const [form] = Form.useForm();
```
然后在Form中引入该form,之后如果哪个表单组件需要获取其数据，通过带有name表单的Form.Item将其包裹起来

```
<Form.Item name="field" noStyle><Input /></Form.Item>
```

#### 详细代码如下
```
import React from "react";
import styles from "./index.less";
import {
  Button,
  Input,
  Form
} from 'antd';

const DynamicFieldSet = () => {
  const [form] = Form.useForm();
  const onFinish = values => {
    console.log('Success:', values);
  };

    return (
      <Form onFinish={onFinish} form={form}>
        <Form.Item name="field" noStyle><Input /></Form.Item>
        <Form.Item name="jojo" noStyle><Input /></Form.Item>
        <Button htmlType="submit">Submit</Button>
      </Form>
    );
};

export default DynamicFieldSet

```

## 图片上传
1. 引入Upload

```
import { Upload } from 'antd';
```

2. 同样利用Form.Item和form.getFieldDecorator来将组件包裹起来,在Upload中通过指定标签action来指定提交的接口  

```
<Form.Item label="主背景图">
                    {form.getFieldDecorator('bg_image', {
                        rules: [
                        {
                            message: '请选择主背景图',
                            required: true,
                        },
                        ],
                        valuePropName: 'fileList',
                        initialValue: lookimg.bg_image && [
                        {
                            uid: -1,
                            name: '主背景图',
                            status: 'done',
                            url: lookimg.bg_image,
                            thumbUrl:lookimg.bg_image
                        },
                        ],
                        getValueFromEvent: e => handleUpload(e, 'bg_image'),
                    })(
                        <Upload
                        listType="picture"
                        action="图片提交的接口"
                        data={{
                            token: localStorage.getItem('token'),
                        }}
                        showUploadList={{
                            showDownloadIcon: false,
                        }}
                        >
                        <Button>
                            + 选择主背景图
                        </Button>
                        </Upload>,

                    )}
                </Form.Item>
```

3. 通过上诉的接口返回数据获取我们需要的内容，通过是图片转换后的url路径  

```
const handleUpload = ({ fileList }, name) => {
        if (fileList.length === 0) {
          return []
        }
        const fileInfo = fileList[fileList.length - 1]
        if (fileInfo.response) {
          if (fileInfo.response.ret !== 0) {
            fileInfo.status = 'error';
            fileInfo.response = '上传失败, 请重新登录再试~';
          } else {
            const [url] = fileInfo.response.urls;
            console.log(name,url);
            fileInfo.url = url;
          }
        }
```

## table中的分页请求
```
<Table
                columns={col}
                dataSource={packages}
                pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: () => `总共有${pagination.total}条数据`,
                total: pagination.total,
                pageSize: pagination.pageSize,
                current: pagination.current,
                onChange: (current) => {
                    getList({
                        pageSize: 10,
                        current: current
                    });
                }
                }}
                rowKey={record => record.id}
            />
```