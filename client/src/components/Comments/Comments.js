import styles from './Comments.module.scss'
import classNames from 'classnames/bind'
import unName from '~/assets/images/unnamed.jpg'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addComment } from '~/actions/commentActions'
import { getComments } from '~/api/api'
import Comment from './Comment'
import { toast } from 'react-toastify'

const cn = classNames.bind(styles)

function Comments({ videoId, currentUser, handleLogin }) {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const [update, setUpdate] = useState(false)

  const handleComment = async () => {
    dispatch(addComment(comment, videoId, setUpdate))
    setComment('')
    setOpen(false)
  }

  useEffect(() => {
    const Comments = async () => {
      const { data } = await getComments(videoId)
      setComments(data)
    }
    Comments()
  }, [videoId, update])

  const notify = () =>
    toast.success('Xóa bình luận thành công.', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  const notify2 = () =>
    toast.success('Báo vi phạm bình luận thành công.', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  return (
    <>
      <div className={cn('comment-header')}>
        <span className={cn('numof-comment')}>{comments.length} bình luận</span>
      </div>
      <div className={cn('comment-box')}>
        <div className={cn('user-comment-wrap')}>
          {currentUser ? (
            <img
              referrerPolicy="no-referrer"
              className={cn('user-img')}
              src={currentUser?.result.picture}
              alt="UserImg"
            />
          ) : (
            <img className={cn('user-img')} src={unName} alt="UserImg" />
          )}

          <div className={cn('comment-imput-wrapper')}>
            {currentUser ? (
              <textarea
                className={cn('comment-imput')}
                placeholder="Viết bình luận..."
                rows="1"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onClick={() => {
                  setOpen(true)
                }}
              ></textarea>
            ) : (
              <textarea
                className={cn('comment-imput')}
                placeholder="Viết bình luận..."
                rows="1"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onClick={handleLogin}
              ></textarea>
            )}

            {open && (
              <div className={cn('comment-btn')}>
                <button
                  className={cn('btn', 'close-btn')}
                  onClick={() => {
                    setComment('')
                    setOpen(false)
                  }}
                >
                  Hủy
                </button>
                {comment.length > 0 ? (
                  <button
                    className={cn('btn', 'btn-active')}
                    onClick={() => {
                      handleComment()
                    }}
                  >
                    Bình luận
                  </button>
                ) : (
                  <div className={cn('btn', 'btn-inactive')}>Bình luận</div>
                )}
              </div>
            )}
          </div>
        </div>
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            currentUser={currentUser}
            setUpdate={setUpdate}
            notify={notify}
            notify2={notify2}
            videoId={videoId}
          />
        ))}
      </div>
    </>
  )
}

export default Comments
