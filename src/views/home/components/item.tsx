import { Ellipsis } from 'antd-mobile';
import { ReactComponent as ThinkingIcon } from 'assets/icons/thinking.svg';
import { FC, useEffect, useState } from 'react';
import { convertToTimestamp, formatTime, momentFormatTime } from 'utils/time';
import './item.scss';

interface IItem {
  id: number;
  roomId: string;
  title: string;
  nickName: string;
  updateTime: string;
}

const item: FC<IItem> = ({ id, roomId, title, updateTime, nickName }) => {
  // const formattedTime = formatTime(convertToTimestamp(updateTime), '{y}-{m}-{d}');
  const formattedTime = momentFormatTime(updateTime);

  const handleClick = (id, roomId) => {
    console.log('click', id, roomId);
  };

  return (
    <div className="flex-start itemContainer" onClick={() => handleClick(id, roomId)}>
      <div className="flex-start itemContainer_left">
        <ThinkingIcon className="icon-small" />
        <div className="ellipsis ml8 itemContainer_desc">{title}</div>
      </div>

      <span className="itemContainer_name">{nickName}</span>
      <span className="itemContainer_time">{formattedTime}</span>
    </div>
  );
};

export default item;
