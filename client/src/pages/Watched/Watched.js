import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { getWatched } from '~/api/api'
import SearchVideoBox from '~/components/Boxs/SearchVideoBox'
import Loading from '~/components/Loading'
import styles from './Watched.module.scss'

const cn = classNames.bind(styles)

function Watched() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    const getdata = async () => {
      const { data } = await getWatched()
      setVideos(data.watchedVideos)
      setLoading(false)
    }
    getdata()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className={cn('wrapper-title')}>
        <h2 className={cn('channel-name')}>Nhật ký xem</h2>
      </div>
      <div className={cn('wrapper-videos')}>
        {videos.length === 0 && !loading && (
          <div className={cn('no-video')}>Không có video nào!</div>
        )}
        {videos.map((video) => (
          <SearchVideoBox key={video._id} video={video} onlyId={true} />
        ))}
      </div>
    </>
  )
}

export default Watched
