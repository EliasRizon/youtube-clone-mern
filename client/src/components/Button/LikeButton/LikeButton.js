import { LikeIcon } from '../../icons'
import classNames from 'classnames/bind'
import styles from './LikeButton.module.scss'
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from '~/components/Tooltip/Tooltip.tsx'
import TooltipTag from '~/components/Tooltip/TooltipTag'
import { useDispatch } from 'react-redux'
import { dislike, like, undislike, unlike } from '~/actions/videoActions'

const cn = classNames.bind(styles)

function LikeButton({ video, currentUser, handleLogin }) {
  const dispatch = useDispatch()

  const handleLike = async () => {
    dispatch(like(video._id, currentUser.result._id))
  }
  const handleUnlike = async () => {
    dispatch(unlike(video._id, currentUser.result._id))
  }
  const handleDislike = async () => {
    dispatch(dislike(video._id, currentUser.result._id))
  }
  const handleUndislike = async () => {
    dispatch(undislike(video._id, currentUser.result._id))
  }

  return (
    <>
      {currentUser ? (
        <>
          {video.likes?.includes(currentUser.result._id) ? (
            <Tooltip placement="bottom">
              <TooltipTrigger asChild>
                <button className={cn('like-btn')} onClick={handleUnlike}>
                  <LikeIcon pathFill={'#f05123'} />
                  {video.likes.length > 0 && (
                    <span
                      className={cn('like-btn-text')}
                      style={{ color: 'var(--primary-color)' }}
                    >
                      {video.likes.length}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <TooltipTag>Bỏ thích</TooltipTag>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip placement="bottom">
              <TooltipTrigger asChild>
                <button className={cn('like-btn')} onClick={handleLike}>
                  <LikeIcon pathFill={'white'} />
                  {video.likes.length > 0 && (
                    <span className={cn('like-btn-text')}>
                      {video.likes.length}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <TooltipTag>Tôi thích video này</TooltipTag>
              </TooltipContent>
            </Tooltip>
          )}

          {video.dislikes?.includes(currentUser.result._id) ? (
            <Tooltip placement="bottom">
              <TooltipTrigger asChild>
                <button className={cn('dislike-btn')} onClick={handleUndislike}>
                  <LikeIcon pathFill={'#f05123'} />
                  {video.dislikes.length > 0 && (
                    <span
                      className={cn('like-btn-text')}
                      style={{ color: 'var(--primary-color)' }}
                    >
                      {video.dislikes.length}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <TooltipTag>Tôi đã suy nghĩ lại</TooltipTag>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip placement="bottom">
              <TooltipTrigger asChild>
                <button className={cn('dislike-btn')} onClick={handleDislike}>
                  <LikeIcon pathFill={'white'} />
                  {video.dislikes.length > 0 && (
                    <span className={cn('like-btn-text')}>
                      {video.dislikes.length}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <TooltipTag>Tôi không thích video này</TooltipTag>
              </TooltipContent>
            </Tooltip>
          )}
        </>
      ) : (
        <>
          <Tooltip placement="bottom">
            <TooltipTrigger asChild>
              <button className={cn('like-btn')} onClick={handleLogin}>
                <LikeIcon pathFill={'white'} />
                {video.likes.length > 0 && (
                  <span className={cn('like-btn-text')}>
                    {video.likes.length}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <TooltipTag>Tôi thích video này</TooltipTag>
            </TooltipContent>
          </Tooltip>

          <Tooltip placement="bottom">
            <TooltipTrigger asChild>
              <button className={cn('dislike-btn')} onClick={handleLogin}>
                <LikeIcon pathFill={'white'} />
                {video.dislikes.length > 0 && (
                  <span className={cn('like-btn-text')}>
                    {video.dislikes.length}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <TooltipTag>Tôi không thích video này</TooltipTag>
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </>
  )
}

export default LikeButton
