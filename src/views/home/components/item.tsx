import { FC, useState, useEffect } from 'react'
import { ReactComponent as ThinkingIcon } from 'assets/icons/thinking.svg'
import { Ellipsis } from 'antd-mobile'
import './item.scss'

interface Iitem {}

const item: FC<Iitem> = () => {
  const [name, setName] = useState('item')

  useEffect(() => {
    return () => {}
  }, [])

  const handleClick = () => {
    setName('item2')
  }

  return (
    <div className="flex-start itemContainer" onClick={handleClick}>
      <div className="flex-center itemContainer_left">
        <ThinkingIcon className="icon-small" />
        <div className="ellipsis ml8 itemContainer_desc">
          Docker基本操作Docker基本操作Docker基本操作Docker基本操作
        </div>
      </div>

      <span className="itemContainer_name">C和</span>
      <span className="itemContainer_time">1个月前</span>
    </div>
  )
}

export default item
