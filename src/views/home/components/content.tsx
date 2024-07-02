import { Button, Form, Input, Modal, Selector, Stepper, Switch, TextArea } from 'antd-mobile';
import { generateRoom } from 'apis/tldraw';

import copy from 'copy-to-clipboard';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './content.scss';

interface Icontent {
  onCloseMask: () => void;
}

const content: FC<Icontent> = ({ onCloseMask }) => {
  const [name, setName] = useState('content');
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
      title: data.title,
      status: data.status ? '1' : '0'
    };

    const res = (await generateRoom(data)) as any;
    console.log('🚀 >> onFinish >> res:', res);
    onGenerateRoom(res.data.title, res.tempRoomNum, res.data.roomId);
  };
  const onGenerateRoom = (title: string, tempRoomNum: string, roomId: string) => {
    Modal.alert({
      title: '房间创建成功！',
      content: (
        <>
          <div>房间名：{title}</div>
          <div className="flex-space-between">
            房间号: {tempRoomNum}
            <Button className="ml8" color="primary" onClick={() => handleCopy(tempRoomNum)}>
              复制房间号
            </Button>
          </div>
        </>
      ),
      confirmText: '加入房间',
      onConfirm: () => joinRoom(roomId)
    });
  };
  const handleCopy = (roomNum) => {
    const content = `画板房间号创建成功！, 房间号为:${roomNum}, 房间号有效性15分钟，请及时加入`;
    try {
      copy(content);
      toast.success('🦄 Copy Success!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
    } catch (error) {
      toast.error('Copy Failed!');
    }
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
        title: '',
        status: ''
      }}
      footer={
        <Button block type="submit" color="primary" size="large">
          提交
        </Button>
      }
    >
      <Form.Item name="title" label="房间名" rules={[{ required: true, message: '房间名不能为空' }]}>
        <Input onChange={(value) => onTitleChange(value)} placeholder="请输入房间名" />
      </Form.Item>

      <Form.Item name="status" label="是否公开" childElementPosition="right">
        <Switch />
      </Form.Item>
    </Form>
  );
};

export default content;
