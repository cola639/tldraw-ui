import { Button, List, Mask, Popover, SearchBar, Toast } from 'antd-mobile';
import SwipeAction, { SwipeActionRef } from 'antd-mobile/es/components/swipe-action';
import { ReactComponent as CreateIcon } from 'assets/icons/create.svg';
import { ReactComponent as SortIcon } from 'assets/icons/sort.svg';
import { ReactComponent as WindowIcon } from 'assets/icons/window.svg';
import avatar from 'assets/images/profile/avatar.png';
import { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Content from './components/content';

import Cooperation from './components/cooperation';
import Item from './components/item';
import './index.scss';

interface Idashboard {} // 定义 Action 接口，保持 onClick 为 () => void 类型
interface Action {
  key: string | number;
  text: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

const index: FC<Idashboard> = () => {
  const [name, setName] = useState('index');
  const [layout, setLayout] = useState('content');
  const [roomVisible, setRoomVisible] = useState(false);
  const [coopVisible, setCoopVisible] = useState(false);
  const items = ['A', 'B', 'C', 'd', 'e', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'];
  const leftActions = [
    {
      key: 'pin',
      text: '置顶',
      color: 'primary'
    }
  ];
  const rightActions = [
    {
      key: 'delete',
      text: '删除',
      color: 'danger'
    }
  ];
  const actions = [
    { key: 'createtime', text: '创建时间' },
    { key: 'updatetime', text: '修改时间' },
    { key: 'title', text: '标题' },
    { key: 'ascending', text: '升序' },
    { key: 'descending', text: '倒序' }
  ];

  // 定义 fileactions 数组
  const fileactions = [
    { key: 'delete', text: '删除', onClick: () => handleDelete() },
    { key: 'update', text: '修改', onClick: () => handleUpdate() },
    { key: 'share', text: '分享', onClick: () => handleShare() }
  ];

  // 处理函数
  function handleDelete() {
    console.log('Delete action');
  }

  function handleUpdate() {
    console.log('Update action');
  }

  function handleShare() {
    console.log('Share action');
  }
  const createactions = [
    { key: 'create', text: '创建房间', onClick: () => handleCreate() },
    { key: 'join', text: '参与协作', onClick: () => handleCooperate() }
  ];

  const handleCreate = () => {
    setRoomVisible(true);
  };

  const handleCooperate = () => {
    setCoopVisible(true);
  };

  useEffect(() => {
    return () => {};
  }, []);

  const handleWindow = () => {
    console.log('handleWindow');
    if (layout === 'list') {
      setLayout('content');
    } else {
      setLayout('list');
    }
  };

  const createRoom = async () => {};

  // TODO: 验证用户是否存在房间内
  const joinRoom = async () => {};

  return (
    <div className="home_container">
      <div className="flex-space-between head">
        <SearchBar
          placeholder="请输入内容"
          style={{
            '--background': '#ffffff',
            width: '260px',
            height: '40px'
          }}
        />
        <div className="avatar">
          <img src={avatar} />
        </div>
      </div>

      <div className="flex-space-between banner">
        <div className="flex-center file">
          <FormattedMessage id="files" />
        </div>
        <div className="flex-center mr20 tools">
          <Popover.Menu
            actions={actions.map((action) => ({
              ...action
            }))}
            onAction={(node) => Toast.show(`选择了 ${node.text}`)}
            trigger="click"
          >
            <SortIcon className="icon-small" />
          </Popover.Menu>

          <WindowIcon className="icon-mini ml20" onClick={handleWindow} />
        </div>
      </div>

      <div className="table">
        {layout === 'list' && (
          <div className="flex-space-between table_top">
            <span className="table_top_left">
              <FormattedMessage id="name" />
            </span>
            <div className="flex-space-between table_top_right">
              <span className="table_top_owner">
                <FormattedMessage id="owner" />
              </span>
              <span className="table_top_time">
                <FormattedMessage id="editTime" />
              </span>
            </div>
          </div>
        )}
        {layout === 'list' && (
          <List>
            {items.map((item, index) => (
              <SwipeAction key={index} leftActions={leftActions} rightActions={rightActions}>
                <List.Item>
                  <Item />
                </List.Item>
              </SwipeAction>
            ))}
          </List>
        )}

        {layout === 'content' && (
          <div className="flex-space-between list_content">
            {items.map((item, index) => (
              <div key={index} className="flex-column list_item">
                <Popover.Menu
                  actions={fileactions.map((action) => ({
                    ...action
                  }))}
                  placement="bottom-start"
                  trigger="click"
                >
                  <div className="pointer list_item_corner">...</div>
                </Popover.Menu>
                <img src={avatar} />
                <span className="mt5">Nginx指令</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Popover.Menu
        actions={createactions.map((action) => ({
          ...action
        }))}
        trigger="click"
      >
        <CreateIcon className="icon-middle create" />
      </Popover.Menu>

      <Mask visible={roomVisible} onMaskClick={() => setRoomVisible(false)}>
        <div className="box-shadow overlay_content">
          <Content onCloseMask={() => setRoomVisible(false)} />
        </div>
      </Mask>

      <Mask visible={coopVisible} onMaskClick={() => setCoopVisible(false)}>
        <div className="box-shadow overlay_content">
          <Cooperation onCloseMask={() => setCoopVisible(false)} />
        </div>
      </Mask>
    </div>
  );
};

export default index;
