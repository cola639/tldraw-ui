import { Button, List, Mask, Popover, SearchBar, Toast } from 'antd-mobile';
import SwipeAction, { SwipeActionRef } from 'antd-mobile/es/components/swipe-action';
import { ReactComponent as CreateIcon } from 'assets/icons/create.svg';
import { ReactComponent as SortIcon } from 'assets/icons/sort.svg';
import { ReactComponent as WindowIcon } from 'assets/icons/window.svg';
import avatar from 'assets/images/profile/avatar.png';
import { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Content from './components/content';

import { getTldraw } from 'apis/tldraw';
import { getUserInfoApi } from 'apis/user';
import { useSelector } from 'store';
import Cooperation from './components/cooperation';
import Item from './components/item';
import './index.scss';

interface Idashboard {}
// 定义 Action 接口，保持 onClick 为 () => void 类型
interface Action {
  key: string | number;
  text: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

const index: FC<Idashboard> = () => {
  const { nickName } = useSelector((state) => state.user.userInfo) as any;
  console.log('🚀 >> nickName:', nickName);
  const [layout, setLayout] = useState('list');
  const [roomVisible, setRoomVisible] = useState(false);
  const [coopVisible, setCoopVisible] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const getTldrawData = async () => {
      const res = (await getTldraw()) as any;
      console.log('🚀 >> getTldrawData >> res:', res.rows);
      setRows(res.rows);
    };

    getTldrawData();

    return () => {};
  }, []);

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
    { key: 'createtime', text: '创建时间', onClick: () => handleDelete() },
    { key: 'updatetime', text: '修改时间', onClick: () => handleDelete() },
    { key: 'title', text: '标题', onClick: () => handleDelete() },
    { key: 'ascending', text: '升序', onClick: () => handleDelete() },
    { key: 'descending', text: '倒序', onClick: () => handleDelete() }
  ];

  // 定义 fileactions 数组
  const fileactions = [
    { key: 'delete', text: '删除', onClick: () => handleDelete() },
    { key: 'update', text: '修改', onClick: () => handleUpdate() },
    { key: 'share', text: '分享', onClick: () => handleShare() }
  ];

  // 处理函数
  const handleDelete = () => {
    console.log('Delete action');
  };

  const handleUpdate = () => {
    console.log('Update action');
  };

  const handleShare = () => {
    console.log('Share action');
  };
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

  const handleWindow = () => {
    console.log('handleWindow');
    if (layout === 'list') {
      setLayout('content');
    } else {
      setLayout('list');
    }
  };

  const createRoom = async () => {};

  return (
    <div className="home_container">
      <div className="flex-space-between head">
        <SearchBar
          placeholder="输入标题搜索"
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
            trigger="click"
          >
            <SortIcon className="pointer icon-small" />
          </Popover.Menu>

          <WindowIcon className="pointer icon-mini ml20" onClick={handleWindow} />
        </div>
      </div>

      <div className="table">
        {layout === 'list' && (
          <>
            <div className="flex-space-between table_top">
              <span className="table_top_left">
                <FormattedMessage id="name" />
              </span>
              <span className="table_top_owner">
                <FormattedMessage id="owner" />
              </span>
              <span className="table_top_time">
                <FormattedMessage id="editTime" />
              </span>
            </div>
            <List>
              {rows.map((item, index) => (
                <SwipeAction key={index} leftActions={leftActions} rightActions={rightActions}>
                  <List.Item>
                    <Item nickName={nickName} {...item} />
                  </List.Item>
                </SwipeAction>
              ))}
            </List>
          </>
        )}

        {layout === 'content' && (
          <div className="flex-space-between list_content">
            {rows.map((item, index) => (
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
