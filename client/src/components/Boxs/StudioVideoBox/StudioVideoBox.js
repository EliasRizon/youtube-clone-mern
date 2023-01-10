import styles from './StudioVideoBox.module.scss'
import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { getComments } from '~/api/api'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import DeleteButton from '~/components/Button/DeleteButton'
import EditButton from '~/components/Button/EditButton'

const cn = classNames.bind(styles)

function StudioVideoBox({ video }) {
  const [comments, setComments] = useState([])

  let likePercent = (
    (video.likes.length / (video.likes.length + video.dislikes.length)) *
    100
  ).toFixed(0)

  if (isNaN(likePercent)) {
    likePercent = 0
  }

  let videoDuration

  if (video.duration < 3600) {
    videoDuration = new Date(video.duration * 1000).toISOString().slice(14, 19)
  } else {
    videoDuration = new Date(video.duration * 1000).toISOString().slice(11, 19)
  }

  useEffect(() => {
    const Comments = async () => {
      const { data } = await getComments(video._id)
      setComments(data)
    }
    Comments()
  }, [video._id])

  return (
    <tr className={cn('video-row')}>
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
            <div className={cn('option-btn')}>
              <EditButton video={video} />
              <DeleteButton video={video} title="Bạn thực sự muốn xóa video?" />
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: '12px' }}>
        <Moment format="Do MMM, YYYY">{video.createdAt}</Moment>
      </td>
      <td style={{ textAlign: 'right' }}>{video?.views}</td>
      <td style={{ textAlign: 'right' }}>{comments.total}</td>
      <td style={{ textAlign: 'right' }}>
        <div>{likePercent ? likePercent : 0}%</div>
        <div style={{ color: 'var(--text-color-darker)' }}>
          {video.likes.length} lượt thích
        </div>
      </td>
    </tr>
  )
}

export default StudioVideoBox
