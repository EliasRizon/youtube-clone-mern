import styles from './Comment.module.scss'
import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { fetchChannel, reportComment } from '~/api/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { DeleteIcon, FeedbackIcon } from '~/components/icons'
import { useDispatch } from 'react-redux'
import { deleteComment } from '~/actions/commentActions'
import ConfirmOverlay from '~/components/ConfirmOverlay'

const cn = classNames.bind(styles)

function Comment({
  comment,
  currentUser,
  setUpdate,
  notify,
  notify2,
  videoId,
}) {
  const [channel, setChannel] = useState({})
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const dispatch = useDispatch()
  const [reportMessage, setReportMessage] = useState('')

  useEffect(() => {
    const getChannel = async () => {
      const { data } = await fetchChannel(comment.userId)
      setChannel(data)
    }
    getChannel()
  }, [comment.userId])

  const handleDelete = () => {
    dispatch(deleteComment(comment._id, setUpdate, notify))
  }

  const handleReport = () => {
    reportComment(comment._id, { videoId, reportMessage, userId: channel._id })
    notify2()
  }

  return (
    <>
      <div className={cn('wrappper')}>
        {channel?.picture && channel?.name ? (
          <>
            <div className={cn('left')}>
              <img
                className={cn('user-img')}
                src={channel.picture}
                alt="UserImg"
              />
              <div className={cn('detail-wrap')}>
                <div className={cn('user-name')}>{channel.name}</div>
                <div className={cn('comment')}>{comment.desc}</div>
              </div>
            </div>
            <div>
              <button
                className={cn('menu-btn', 'deletable')}
                onClick={() => {
                  setOpen(true)
                }}
              >
                <FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon>
              </button>

              {open && (
                <>
                  <div className={cn('menu-wrapper')}>
                    {(currentUser.result.role === 'admin' ||
                      currentUser.result._id === comment.userId) && (
                      <button
                        className={cn('menu-item')}
                        onClick={() => {
                          setOpen(false)
                          setOpen2(true)
                        }}
                      >
                        <DeleteIcon />
                        <span className={cn('menu-text')}>Xóa</span>
                      </button>
                    )}

                    {currentUser.result._id !== comment.userId && (
                      <button
                        className={cn('menu-item')}
                        onClick={() => {
                          setOpen(false)
                          setOpen3(true)
                        }}
                      >
                        <FeedbackIcon />
                        <span className={cn('menu-text')}>Báo vi phạm</span>
                      </button>
                    )}
                  </div>
                  <div
                    className={cn('overlay')}
                    onClick={() => {
                      setOpen(false)
                    }}
                  ></div>
                </>
              )}
              {open2 && (
                <ConfirmOverlay
                  setOpen={setOpen2}
                  title="Bạn có chắc muốn xóa bình luận?"
                  confirmText="Xóa"
                  onConfirm={handleDelete}
                />
              )}
              {open3 && (
                <ConfirmOverlay
                  setOpen={setOpen3}
                  title="Bạn có chắc muốn báo vi phạm bình luận?"
                  confirmText="Báo vi phạm"
                  onConfirm={handleReport}
                  setMessage={setReportMessage}
                />
              )}
            </div>
          </>
        ) : (
          <>
            <div className={cn('user-img')}></div>
            <div className={cn('detail-wrap')}>
              <div className={cn('user-name', 'user-name-loading')}></div>
              <div className={cn('comment', 'comment-loading')}></div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Comment
