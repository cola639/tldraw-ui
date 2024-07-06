import { DotLoading, List, Mask, Modal, Popover, SearchBar, Toast } from 'antd-mobile';
import SwipeAction from 'antd-mobile/es/components/swipe-action';
import { delTldrawByIdsApi, getTldrawApi } from 'apis/tldraw';
import { ReactComponent as CreateIcon } from 'assets/icons/create.svg';
import { ReactComponent as SortIcon } from 'assets/icons/sort.svg';
import { ReactComponent as WindowIcon } from 'assets/icons/window.svg';
import avatarPng from 'assets/images/profile/avatar.png';
import copy from 'copy-to-clipboard';
import { useDebounce } from 'hooks/useDebounce';
import { FC, useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'store';
import Content from './components/content';
import Cooperation from './components/cooperation';
import Item from './components/item';
import './index.scss';

interface IDashboard {}

const index: FC<IDashboard> = () => {
  const [coopVisible, setCoopVisible] = useState(false);
  const [layout, setLayout] = useState('content');
  const [isReq, setIsReq] = useState(false);
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
  const initialLoad = useRef(true);
  const navigate = useNavigate();
  const intl = useIntl();

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
    { key: 'delete', text: '删除' },
    { key: 'edit', text: '修改' },
    { key: 'share', text: '分享' }
  ];

  useEffect(() => {
    const getTldraw = async () => {
      setIsReq(true);
      const res = (await getTldrawApi()) as any;
      console.log('🚀 >> getTldrawApiData >> res:', res.rows);
      setRows(res.rows);
      setIsReq(false);
    };

    getTldraw();

    return () => {};
  }, []);

  /** 防抖函数 */
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
    } else {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
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
    setIsReq(true);
    console.log('search value ->', value);
    const params: { title?: string } = {};
    value && (params.title = value);
    const res = (await getTldrawApi(params)) as any;
    console.log('🚀 >> handleSearch >> res:', res.rows);
    setRows(res.rows);
    setIsReq(false);
  };

  const handleCase = (type: string, item: any) => {
    console.log('🚀 >> handleCase >> item:', item);
    switch (type) {
      case 'delete':
        handleDel(item);
        break;

      case 'edit':
        handleEdit(item.roomId);
        break;

      case 'share':
        handleShare(item.roomId);
        break;

      default:
        break;
    }
  };

  const handleDel = (item: any) => {
    Modal.show({
      title: '',
      content: `是否删除【${item.title}】`,
      closeOnAction: true,
      actions: [
        {
          key: 'confirm',
          text: '确认',
          danger: true,
          onClick: async () => {
            try {
              await delTldrawByIdsApi(item.id);
              toast.success('Delete Succeed!', { autoClose: 500 });
              const res = (await getTldrawApi()) as any;
              setRows(res.rows);
            } catch (error) {
              toast.error('Delete Failed!', { autoClose: 500 });
            }
          }
        },
        {
          key: 'cancel',
          text: '取消'
        }
      ]
    });
  };

  const handleEdit = (roomId: string) => {
    navigate(`/tldraw?roomId=${roomId}`);
  };

  const handleShare = (roomId: string) => {
    const content = `画板连结创建成功！, 进入链接：${location.href}tldraw?roomId=${roomId}`;
    try {
      copy(content);
      toast.success('🦄 Copy Success!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: 'colored'
      });
    } catch (error) {
      toast.error('Copy Failed!');
    }
  };

  /** 处理表单组合条件查询 */
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
          placeholder={intl.formatMessage({ id: 'home_placeholder', defaultMessage: 'dashboard' })}
          style={{
            '--background': '#ffffff',
            width: '260px',
            height: '40px'
          }}
        />
        <div className="avatar">
          <img src={avatar ? import.meta.env.VITE_BASE_API + avatar : avatarPng} />
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
        {isReq && (
          <div style={{ fontSize: 30, textAlign: 'center' }}>
            <DotLoading color="#60a9f4" />
          </div>
        )}

        {!isReq && layout === 'list' && (
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

        {!isReq && layout === 'content' && (
          <div className="flex-space-between list_content">
            {rows.map((item, index) => (
              <div key={index} className="flex-column list_item">
                <Popover.Menu
                  actions={fileActions.map((action) => ({
                    ...action
                  }))}
                  onAction={(node) => handleCase(node.key as string, item)}
                  placement="bottom-start"
                  trigger="click"
                >
                  <div className="pointer list_item_corner">...</div>
                </Popover.Menu>
                <img src={avatar ? import.meta.env.VITE_BASE_API + avatar : avatarPng} />
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
