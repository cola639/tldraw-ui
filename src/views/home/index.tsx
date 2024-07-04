import { List, Mask, Popover, SearchBar, Toast } from 'antd-mobile';
import SwipeAction from 'antd-mobile/es/components/swipe-action';
import { getTldrawApi } from 'apis/tldraw';
import { ReactComponent as CreateIcon } from 'assets/icons/create.svg';
import { ReactComponent as SortIcon } from 'assets/icons/sort.svg';
import { ReactComponent as WindowIcon } from 'assets/icons/window.svg';
import avatarPng from 'assets/images/profile/avatar.png';
import { useDebounce } from 'hooks/useDebounce';
import { FC, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'store';
import Content from './components/content';
import Cooperation from './components/cooperation';
import Item from './components/item';
import './index.scss';

interface IDashboard {}

const index: FC<IDashboard> = () => {
  const [coopVisible, setCoopVisible] = useState(false);
  const [layout, setLayout] = useState('content');
  const [roomVisible, setRoomVisible] = useState(false);
  const [rows, setRows] = useState([]);
  const [searchForm, setSearchForm] = useState({
    orderByColumn: '',
    isAsc: 'asc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { nickName, avatar } = useSelector((state) => state.user.userInfo) as any;
  const debouncedSearchTerm = useDebounce(searchTerm, 1 * 1000);
  const searchFormRef = useRef(searchForm);

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
  const sortActions = [
    { key: 'createTime', text: '创建时间', onClick: () => handleSort('createTime') },
    { key: 'updateTime', text: '修改时间', onClick: () => handleSort('updateTime') },
    { key: 'title', text: '标题', onClick: () => handleSort('title') },
    { key: 'ascending', text: '升序', onClick: () => handleSort('asc') },
    { key: 'descending', text: '倒序', onClick: () => handleSort('desc') }
  ];
  const createActions = [
    { key: 'create', text: '创建房间', onClick: () => handleCreate() },
    { key: 'join', text: '参与协作', onClick: () => handleCooperate() }
  ];
  const fileActions = [
    { key: 'delete', text: '删除', onClick: () => handleCooperate() },
    { key: 'update', text: '修改', onClick: () => handleCooperate() },
    { key: 'share', text: '分享', onClick: () => handleShare() }
  ];

  useEffect(() => {
    const getTldraw = async () => {
      const res = (await getTldrawApi()) as any;
      console.log('🚀 >> getTldrawApiData >> res:', res.rows);
      setRows(res.rows);
    };

    getTldraw();

    return () => {};
  }, []);

  /** 防抖函数 */
  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    searchFormRef.current = searchForm;
  }, [searchForm]);

  const handleShare = () => {
    console.log('Share action');
  };

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

  const handleSearch = async (value: string) => {
    console.log('search value ->', value);
    const params = {
      title: value
    };
    const res = (await getTldrawApi(params)) as any;
    console.log('🚀 >> handleSearch >> res:', res.rows);
    setRows(res.rows);
  };

  /** 处理表单 组合条件查询字段 */
  const processForm = (type: string) => {
    const directions = ['asc', 'desc'];
    if (directions.includes(type)) {
      setSearchForm((prevState) => {
        const newForm = {
          ...prevState,
          isAsc: type
        };
        searchFormRef.current = newForm;
        return newForm;
      });
    } else {
      setSearchForm((prevState) => {
        const newForm = {
          ...prevState,
          orderByColumn: type
        };
        searchFormRef.current = newForm;
        return newForm;
      });
    }

    console.log('🚀 >> handleSort searchFormRef ->', searchFormRef.current);
  };

  const handleSort = async (type: string) => {
    processForm(type);
    const params = { ...searchFormRef.current } as any;
    debouncedSearchTerm && (params.title = debouncedSearchTerm);
    const res = (await getTldrawApi(params)) as any;
    setRows(res.rows);
  };

  return (
    <div className="home_container">
      <div className="flex-space-between head">
        <SearchBar
          onChange={(value) => setSearchTerm(value)}
          // onBlur={(value) => debounce(handleSearch(value), 1000)}
          // onSearch={(value) => handleSearch(value)}
          placeholder="输入标题搜索"
          style={{
            '--background': '#ffffff',
            width: '260px',
            height: '40px'
          }}
        />
        <div className="avatar">
          <img src={import.meta.env.VITE_BASE_API + avatar || avatarPng} />
        </div>
      </div>

      <div className="flex-space-between banner">
        <div className="flex-center file">
          <FormattedMessage id="files" />
        </div>
        <div className="flex-center mr20 tools">
          <Popover.Menu
            actions={sortActions.map((action) => ({
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
                  actions={fileActions.map((action) => ({
                    ...action
                  }))}
                  placement="bottom-start"
                  trigger="click"
                >
                  <div className="pointer list_item_corner">...</div>
                </Popover.Menu>
                <img src={import.meta.env.VITE_BASE_API + avatar || avatarPng} />
                <span className="mt5 list_item_title">{item.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Popover.Menu
        actions={createActions.map((action) => ({
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
