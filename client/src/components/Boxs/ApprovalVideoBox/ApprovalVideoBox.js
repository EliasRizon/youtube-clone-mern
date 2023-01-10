import styles from './ApprovalVideoBox.module.scss'
import classNames from 'classnames/bind'
import Moment from 'react-moment'
import { approveVideo, denyVideo, fetchChannel } from '~/api/api'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const cn = classNames.bind(styles)

function ApprovalVideoBox({ video }) {
  const [button, setButton] = useState(0)
  const currentUser = JSON.parse(localStorage.getItem('profile'))
  const [channel, setChannel] = useState({})

  let videoDuration

  if (video.duration < 3600) {
    videoDuration = new Date(video.duration * 1000).toISOString().slice(14, 19)
  } else {
    videoDuration = new Date(video.duration * 1000).toISOString().slice(11, 19)
  }

  useEffect(() => {
    if (video?.userId) {
      const getChannel = async () => {
        const { data } = await fetchChannel(video?.userId)
        setChannel(data[0])
      }
      getChannel()
    }
  }, [video?.userId])

  const handleApprove = async (videoId) => {
    await approveVideo(videoId, currentUser.result)
  }

  const handleDeny = async (videoId) => {
    await denyVideo(videoId, currentUser.result)
  }

  return (
    <tr className={cn('video-row')}>
      <td className={cn('video-col')} style={{ padding: '0 0 0 12px' }}>
        <div style={{ display: 'flex' }}>
          <Link to={`/watch?v=${video._id}`} className={cn('video-link')}>
            <img
              className={cn('video-img')}
              src={video.imgUrl}
              alt="video img"
            />
            <div className={cn('video-duration')}>{videoDuration}</div>
          </Link>
          <div className={cn('video-col-end')}>
            <Link to={`/watch?v=${video._id}`} className={cn('title-link')}>
              <div className={cn('video-name')}>{video.title}</div>
            </Link>
            <div className={cn('video-desc')}>{video.desc}</div>
          </div>
        </div>
      </td>
      <td>
        <div style={{ display: 'flex' }}>
          {channel?.picture ? (
            <Link to={`/channel/${channel._id}`} className={cn('channel-link')}>
              <img
                className={cn('channel-picture')}
                src={channel.picture}
                alt="ChannelPicture"
              />
            </Link>
          ) : (
            <div className={cn('channel-picture')}></div>
          )}

          <div className={cn('channel-text')}>
            <Link to={`/channel/${channel._id}`} className={cn('channel-name')}>
              {channel.name}
            </Link>
            <div className={cn('channel-sub')}>
              {channel.subscribers} người đăng ký
            </div>
          </div>
        </div>
      </td>
      <td style={{ textAlign: 'right' }}>
        <Moment format="Do MMM, YYYY">{video.createdAt}</Moment>
      </td>
      <td style={{ textAlign: 'right' }}>
        {button === 0 && (
          <>
            <button
              className={cn('btn')}
              onClick={() => {
                setButton(1)
                handleApprove(video._id)
              }}
            >
              Chấp thuận
            </button>
            <button
              className={cn('btn')}
              style={{ marginLeft: '12px' }}
              onClick={() => {
                setButton(2)
                handleDeny(video._id)
              }}
            >
              Từ chối
            </button>
          </>
        )}
        {button === 1 && <div>Đã chấp thuận</div>}
        {button === 2 && <div>Đã từ chối</div>}
      </td>
    </tr>
  )
}
export default ApprovalVideoBox
