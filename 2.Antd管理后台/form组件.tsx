import React,{useRef} from 'react';
import style from './moreactive.less';
import {
    Form,
    Button,
    Input,
    Upload,
    Select
  } from 'antd';

const { Option } = Select;

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

const Moreactive = ({canmore, setcanmore,postactive,form}) => {
    const handleSubmit = e => {
        e.preventDefault();
        form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            let tempdata = {};
            Object.keys(values).forEach((el) => {
                if(el == 'name' || el == 'version') {
                    tempdata[el] = values[el];
                } else {
                    let now = {
                        'fileList':values[el]
                    }
                    let needdata = handleUpload(now,el);
                    let {name, url} = needdata[0];
                    tempdata[name] = url;
                }
            });
            console.log(tempdata);
            postactive(tempdata);
            setcanmore(!canmore);
          }
        });
      };

    let videoformref = useRef<HTMLElement | null>(null);

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
            // console.log(name,url);
            fileInfo.url = url;
          }
        }
        fileInfo.name = name
        return [fileInfo]
      }

    return (
        <div className={style.moreactive}>
            <div className={style.back}>
                <span onClick={()=>{setcanmore(!canmore)}}
                    className={style.goback}>X</span>
            </div>
            <Form
                ref = {videoformref}
                className={`videoform ${style.myform} `}
                name="validate_other"
                {...formItemLayout}
                initialValues={{
                    ['input-number']: 3,
                    ['checkbox-group']: ['A', 'B'],
                    rate: 3.5,
                }}
                onSubmit={(e)=>handleSubmit(e)}
            >
                <Form.Item
                    name="name"
                    label="活动名称"
                >
                    {form.getFieldDecorator('name',{
                        rules: [
                            {
                                message: '请请输入活动名称',
                                required: true,
                            },
                        ],
                    })(
                    <Input placeholder="最多15个字符" name="name"/>
                )}
                   
                </Form.Item>
                <Form.Item label="主背景图">
                    {form.getFieldDecorator('bg_image', {
                        rules: [
                        {
                            message: '请选择主背景图',
                            required: true,
                        },
                        ],
                        valuePropName: 'fileList',
                        getValueFromEvent: e => handleUpload(e, 'bg_image'),
                    })(
                        <Upload
                        listType="picture"
                        action="https://activity1-upload.miniaixue.com/https-uploads"
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
                
                <Form.Item label="按钮背景图">
                    {form.getFieldDecorator('download_bnt_image', {
                        rules: [
                        {
                            message: '请选择按钮背景图',
                            required: true,
                        },
                        ],
                        valuePropName: 'fileList',
                        getValueFromEvent: e => handleUpload(e, 'download_bnt_image'),
                    })(
                        <Upload
                        listType="picture"
                        action="https://activity1-upload.miniaixue.com/https-uploads"
                        data={{
                            token: localStorage.getItem('token'),
                        }}
                        showUploadList={{
                            showDownloadIcon: false,
                        }}
                        >
                        <Button>
                            + 选择按钮背景图
                        </Button>
                        </Upload>,

                    )}
                </Form.Item>
                
                <Form.Item label="悬浮下载背景图">
                    {form.getFieldDecorator('suspend_download_image', {
                        rules: [
                        {
                            message: '请选择悬浮下载背景图',
                            required: true,
                        },
                        ],
                        valuePropName: 'fileList',
                        getValueFromEvent: e => handleUpload(e, 'suspend_download_image'),
                    })(
                        <Upload
                        listType="picture"
                        action="https://activity1-upload.miniaixue.com/https-uploads"
                        data={{
                            token: localStorage.getItem('token'),
                        }}
                        showUploadList={{
                            showDownloadIcon: false,
                        }}
                        >
                        <Button>
                            + 选择悬浮下载背景图
                        </Button>
                        </Upload>,

                    )}
                </Form.Item>
                
                <Form.Item label="视频中心浮层图">
                    {form.getFieldDecorator('video_suspend_image', {
                        rules: [
                        {
                            message: '请选择视频中心浮层图',
                            required: true,
                        },
                        ],
                        valuePropName: 'fileList',
                        getValueFromEvent: e => handleUpload(e, 'video_suspend_image'),
                    })(
                        <Upload
                        listType="picture"
                        action="https://activity1-upload.miniaixue.com/https-uploads"
                        data={{
                            token: localStorage.getItem('token'),
                        }}
                        showUploadList={{
                            showDownloadIcon: false,
                        }}
                        >
                        <Button>
                            + 选择视频中心浮层图
                        </Button>
                        </Upload>,

                    )}
                </Form.Item>

                <Form.Item label="上线官网版本：" hasFeedback>
                    {form.getFieldDecorator('version', {
                        rules: [{ required: true, message: '请挑选上线版本' }],
                    })(
                        <Select placeholder="请挑选上线版本">
                        <Option value="V1">V1</Option>
                        <Option value="V2">V2</Option>
                        <Option value="V3">V3</Option>
                        </Select>,
                    )}
                </Form.Item>
                <Form.Item label="移动端主背景图">
                    {form.getFieldDecorator('app_bg_image', {
                        rules: [
                        {
                            message: '请选择移动端主背景图',
                            required: true,
                        },
                        ],
                        valuePropName: 'fileList',
                        getValueFromEvent: e => handleUpload(e, 'app_bg_image'),
                    })(
                        <Upload
                        listType="picture"
                        action="https://activity1-upload.miniaixue.com/https-uploads"
                        data={{
                            token: localStorage.getItem('token'),
                        }}
                        showUploadList={{
                            showDownloadIcon: false,
                        }}
                        >
                        <Button>
                            + 选择移动端主背景图
                        </Button>
                        </Upload>,

                    )}
                </Form.Item>
                
                <Form.Item label="移动端悬浮条背景图">
                    {form.getFieldDecorator('app_suspend_image', {
                        rules: [
                        {
                            message: '请选择移动端悬浮条背景图',
                            required: true,
                        },
                        ],
                        valuePropName: 'fileList',
                        getValueFromEvent: e => handleUpload(e, 'app_suspend_image'),
                    })(
                        <Upload
                        listType="picture"
                        action="https://activity1-upload.miniaixue.com/https-uploads"
                        data={{
                            token: localStorage.getItem('token'),
                        }}
                        showUploadList={{
                            showDownloadIcon: false,
                        }}
                        >
                        <Button>
                            + 选择移动端悬浮条背景图
                        </Button>
                        </Upload>,

                    )}
                </Form.Item>

                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Button className={style.nosubmit} onClick={()=>{setcanmore(!canmore)}}>
                        取消
                    </Button>
                    <Button type="primary" htmlType="submit">
                    确认
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Form.create()(Moreactive);