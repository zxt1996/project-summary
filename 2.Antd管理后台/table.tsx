import React, {useEffect, useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
    Form, Row, Col, Button, Input, Table,
    Badge,
    Popconfirm,
} from 'antd';
import moment from 'moment';
import ChangeChannel from './components/changeChannel';
import styles from './style.less';
import { connect } from 'dva';

const ChannelManagement: React.FC = ({
    packages,
    pagination,
    getList,
    createChannel,
    deleteChannel,
    updateChannel
}) => {
    const [isOpne, setIsOpne] = useState(false);
    const [change, setChange] = useState(false);
    const [nowChange, setNowChange] = useState({});
    useEffect(() => {
        getList({
            pageSize: 10,
            current: 1
        });
    }, [isOpne, change]);
    const col = [
        {
            title: '渠道id',
            dataIndex: 'source_num',
            key: 'source_num',
          },
        {
            title: '渠道名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '平台',
            dataIndex: 'platform',
            key: 'platform',
        },
          
          {
            title: '平台最高版本',
            dataIndex: 'highest_version',
            key: 'highest_version',
          },
          {
            title: '商店版本号',
            dataIndex: 'version',
            key: 'version',
            // render: (_, record) => (record.levelIds ? record.levelIds.length : 0),
          },
          {
            title: '商店地址',
            dataIndex: 'source_url',
            key: 'source_url',
            // render: (_, record) => (record.levelIds ? record.levelIds.length : 0),
          },
          {
            title: '操作',
            dataIndex: 'setting',
            key: 'setting',
            render: (_, record) => (
                <>
                <span 
                    className={styles.editBtn} 
                    onClick={()=>{
                        setNowChange(record);
                        setIsOpne(true);
                        }}>
                    编辑
                </span>
                |
                <Popconfirm
                  title="请确认是否删除该活动?"
                  onConfirm={() => {
                      deleteChannel({_id: record._id});
                      setChange(!change);
                    }}
                  okText="是"
                  cancelText="否"
                >
                  <span className={styles.deleteBtn}>删除</span>
                </Popconfirm>
              </>
            ),
          },
    ];
return (
        <PageHeaderWrapper>
            <div className={styles.setVersion}>
                <Row style={{ marginTop: 14 }}>
                    <Button 
                        type="primary" 
                        icon="plus" 
                        className={styles.myButton} 
                        onClick={()=>{
                            setNowChange({
                                "source_num": '',
                                "name": '',
                                "platform": '',
                                "source_url": '',
                                "_id": ''
                            })
                            setIsOpne(true);
                        }}>
                        新建
                    </Button>
                </Row>
            </div>
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
        <ChangeChannel
            isOpne = {isOpne}
            setIsOpne = {setIsOpne}
            createChannel = {createChannel}
            nowChange = {nowChange}
            updateChannel = {updateChannel}
        />
        </PageHeaderWrapper>
    )
}

