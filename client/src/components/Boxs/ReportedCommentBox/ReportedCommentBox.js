import styles from './ReportedCommentBox.module.scss'
import classNames from 'classnames/bind'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import { fetchChannel, getComment, getVideo } from '~/api/api'

const cn = classNames.bind(styles)

function ReportedCommentBox({ item }) {
  const [video, setVideo] = useState([])
  const [commentUser, setCommentUser] = useState([])
  const [comment, setComment] = useState([])
  const [reportUser, setReportUser] = useState([])

  let videoDuration
  if (video?.duration) {
    if (video.duration < 3600) {
      videoDuration = new Date(video.duration * 1000)
        .toISOString()
        .slice(14, 19)
    } else {
      videoDuration = new Date(video.duration * 1000)
        .toISOString()
        .slice(11, 19)
    }
  }

  useEffect(() => {
    const getdata = async () => {
      const video = await getVideo(item.videoId)
      setVideo(video.data)
      const commentUser = await fetchChannel(item.userId)
      setCommentUser(commentUser.data)
      const comment = await getComment(item.commentId)
      setComment(comment.data)
      const reportUser = await fetchChannel(item.reportUserId)
      setReportUser(reportUser.data)
    }
    getdata()
  }, [item.commentId, item.reportUserId, item.userId, item.videoId])

  return (
    <tr className={cn('row')}>
      <td className={cn('video-col')} style={{ padding: '0 0 0 12px' }}>
        <div style={{ display: 'flex' }}>
          <Link className={cn('video-link')} to={`/watch?v=${video._id}`}>
            <img
              className={cn('video-img')}
              src={video.imgUrl}
              alt="video img"
            />
            <div className={cn('video-duration')}>{videoDuration}</div>
          </Link>
          <div className={cn('video-col-end')}>
            <Link className={cn('title-link')} to={`/watch?v=${video._id}`}>
              <div className={cn('video-name')}>{video.title}</div>
            </Link>
            <div className={cn('video-desc')}>{video.desc}</div>
          </div>
        </div>
      </td>
      <td>
        <div style={{ display: 'flex' }}>
          {commentUser?.picture ? (
            <Link
              to={`/channel/${commentUser._id}`}
              className={cn('channel-link')}
            >
              <img
                className={cn('channel-picture')}
                src={commentUser.picture}
                alt="ChannelPicture"
              />
            </Link>
          ) : (
            <div className={cn('channel-picture')}></div>
          )}

          <div className={cn('channel-text')}>
            <Link
              to={`/channel/${commentUser._id}`}
              className={cn('channel-name')}
            >
              {commentUser.name}
            </Link>
            <div className={cn('channel-sub')}>
              {commentUser.subscribers} người đăng ký
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className={cn('text-col')}> {comment.desc}</div>
      </td>
      <td>
        <div style={{ display: 'flex' }}>
          {reportUser?.picture ? (
            <Link
              to={`/channel/${reportUser._id}`}
              className={cn('channel-link')}
            >
              <img
                className={cn('channel-picture')}
                src={reportUser.picture}
                alt="ChannelPicture"
              />
            </Link>
          ) : (
            <div className={cn('channel-picture')}></div>
          )}

          <div className={cn('channel-text')}>
            <Link
              to={`/channel/${reportUser._id}`}
              className={cn('channel-name')}
            >
              {reportUser.name}
            </Link>
            <div className={cn('channel-sub')}>
              {reportUser.subscribers} người đăng ký
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className={cn('text-col')}> {item.reportContent}</div>
      </td>
    </tr>
  )
}

export default ReportedCommentBox
