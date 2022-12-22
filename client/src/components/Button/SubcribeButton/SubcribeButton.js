import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from './SubcribeButton.module.scss'
import { useState } from 'react'
import ConfirmOverlay from '~/components/ConfirmOverlay'

const cn = classNames.bind(styles)

function SubcribeButton({ currentUser, channel, handleSub, handleLogin }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {currentUser ? (
        <>
          {currentUser?.result._id === channel._id ? (
            <Link to="/studio/videos/upload" className={cn('sub-btn')}>
              Quản lý kênh
            </Link>
          ) : (
            <>
              {currentUser?.result.subscribedUsers.includes(channel._id) ? (
                <button className={cn('sub-btn')} onClick={() => setOpen(true)}>
                  Đã đăng ký
                </button>
              ) : (
                <button className={cn('sub-btn')} onClick={handleSub}>
                  Đăng ký
                </button>
              )}
            </>
          )}
        </>
      ) : (
        <button className={cn('sub-btn')} onClick={handleLogin}>
          Đăng ký
        </button>
      )}
      {open && (
        <ConfirmOverlay
          setOpen={setOpen}
          title={`Hủy đăng ký ${channel.name}`}
          confirmText="Hủy đăng ký"
          onConfirm={handleSub}
        />
      )}
    </>
  )
}

export default SubcribeButton
