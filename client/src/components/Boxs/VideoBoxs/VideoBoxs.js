import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchVideos } from '~/api/api'
import Loading from '~/components/Loading'
import VideoBox from './VideoBox/VideoBox'
import styles from './VideoBoxs.module.scss'

const cn = classNames.bind(styles)

function VideoBoxs() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const { reload } = useSelector((store) => store.videoReducer)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    const getdata = async () => {
      const { data } = await fetchVideos()
      setVideos(data.data)
      setLoading(false)
    }
    getdata()
  }, [reload])

  if (loading) {
    return <Loading />
  }

  return (
    <div className={cn('grid__row', 'videoboxs-row')}>
      {videos?.map((video) => (
        <VideoBox key={video._id} video={video} />
      ))}
    </div>
  )
}

export default VideoBoxs
