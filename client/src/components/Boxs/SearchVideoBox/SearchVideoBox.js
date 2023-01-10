import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { fetchChannel } from '~/api/api'
import styles from './SearchVideoBox.module.scss'

const cn = classNames.bind(styles)

function SearchVideoBox({ video }) {
  const [channel, setChannel] = useState({})

  let videoDuration

  if (video.duration < 3600) {
    videoDuration = new Date(video.duration * 1000).toISOString().slice(14, 19)
  } else {
    videoDuration = new Date(video.duration * 1000).toISOString().slice(11, 19)
  }

  useEffect(() => {
    const getChannel = async () => {
      const { data } = await fetchChannel(video.userId)
      setChannel(data[0])
    }
    getChannel()
  }, [video.userId])

  return (
    <div className={cn('wrapper')}>
      <Link to={`/watch?v=${video._id}`} className={cn('img-link')}>
        <>
          <div
            className={cn('thumbnail')}
            style={{ backgroundImage: `url(${video?.imgUrl})` }}
          ></div>
          <div className={cn('video-duration')}>{videoDuration}</div>
        </>
      </Link>
      <div className={cn('video-details')}>
        <Link to={`/watch?v=${video._id}`} className={cn('title-link')}>
          <div className={cn('video-name')}>{video.title}</div>
          <div className={cn('views-and-time')}>
            <span>{video.views} lượt xem</span>
            <span className={cn('timer')}>
              <Moment fromNow>{video.createdAt}</Moment>
            </span>
          </div>
        </Link>
        <Link to={`/channel/${channel._id}`} className={cn('author')}>
          {channel?.picture ? (
            <>
              <img
                className={cn('author-img')}
                src={channel.picture}
                alt="author"
              />
              <div className={cn('author-name')}>{channel.name}</div>
            </>
          ) : (
            <>
              <div className={cn('author-img')}></div>
              <div className={cn('author-name-load')}></div>
            </>
          )}
        </Link>
        <div className={cn('video-desc')}>{video.desc}</div>
      </div>
    </div>
  )
}

export default SearchVideoBox
