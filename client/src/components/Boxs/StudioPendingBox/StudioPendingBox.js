import styles from './StudioPendingBox.module.scss'
import classNames from 'classnames/bind'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import DeleteButton from '~/components/Button/DeleteButton'
import EditButton from '~/components/Button/EditButton'

const cn = classNames.bind(styles)

function StudioPendingBox({ video }) {
  let videoDuration

  if (video.duration < 3600) {
    videoDuration = new Date(video.duration * 1000).toISOString().slice(14, 19)
  } else {
    videoDuration = new Date(video.duration * 1000).toISOString().slice(11, 19)
  }

  return (
    <tr className={cn('video-row')}>
      <td className={cn('video-col')} style={{ padding: '0 0 0 12px' }}>
        <div style={{ display: 'flex' }}>
          <Link className={cn('video-link')} to={`/watch?v=${video._id}`}>
            {video?.imgUrl ? (
              <div
                className={cn('thumbnail')}
                style={{ backgroundImage: `url(${video?.imgUrl})` }}
              ></div>
            ) : (
              <div className={cn('thumbnail', 'no-img')}></div>
            )}

            {video.duration !== 0 && (
              <div className={cn('video-duration')}>{videoDuration}</div>
            )}
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
        <div className={cn('option-col-box')}>
          <EditButton video={video} />
          <DeleteButton video={video} title="Bạn thực sự muốn xóa video?" />
        </div>
      </td>
      <td style={{ padding: '12px', textAlign: 'right' }}>
        <Moment format="Do MMM, YYYY">{video.createdAt}</Moment>
      </td>
      {video.status === 'pending' && (
        <td style={{ textAlign: 'right' }}>Đang chờ duyệt</td>
      )}
      {video.status === 'denied' && (
        <td style={{ textAlign: 'right', color: 'red' }}>Bị từ chối</td>
      )}
      {video.status === 'draft' && (
        <td style={{ textAlign: 'right', color: 'var(--primary-color)' }}>
          Bản nháp
        </td>
      )}
    </tr>
  )
}

export default StudioPendingBox
