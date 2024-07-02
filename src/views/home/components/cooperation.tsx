import { Button, Form, Input, Modal, Selector, Stepper, Switch, TextArea } from 'antd-mobile';
import { generateRoom, getUUID } from 'apis/tldraw';

import copy from 'copy-to-clipboard';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './content.module.scss';

interface ICooperation {
  onCloseMask: () => void;
}

const cooperation: FC<ICooperation> = ({ onCloseMask }) => {
  const [formInstance] = Form.useForm(); // 创建表单实例
  const navigate = useNavigate();

  useEffect(() => {
    return () => {};
  }, []);

  const onTitleChange = (value: string) => {
    console.log(value);
  };
  const onFinish = async () => {
    onCloseMask();
    let data = formInstance.getFieldsValue();
    data = {
      roomNum: data.roomNum
    };
    const res = (await getUUID(data)) as any;
    console.log('🚀 >> onFinish >> res:', res.data);
    joinRoom(res.uuid);
  };

  const joinRoom = (roomId: string) => {
    navigate(`/tldraw?roomId=${roomId}`);
  };

  return (
    <Form
      form={formInstance}
      layout="horizontal"
      onFinish={onFinish}
      initialValues={{
        roomNum: ''
      }}
      footer={
        <Button block type="submit" color="primary" size="large">
          提交
        </Button>
      }
    >
      <Form.Item name="roomNum" label="房间号" rules={[{ required: true, message: '房间号不能为空' }]}>
        <Input onChange={(value) => onTitleChange(value)} placeholder="请输入房间号" />
      </Form.Item>
    </Form>
  );
};

export default cooperation;
