import classNames from 'classnames/bind'
import styles from './WatchVideoBoxs.module.scss'
import WatchVideoBox from './WatchVideoBox'
import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchVideos } from '~/api/api'
import Loading from '~/components/Loading'

const cn = classNames.bind(styles)

function WatchVideoBoxs() {
  const [currentVideos, setCurrentVideos] = useState([])
  const [videos, setVideos] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [startIndex, setStartIndex] = useState(20)

  const getMoreVideos = useCallback(() => {
    setCurrentVideos((prev) =>
      prev.concat(videos.slice(0 + startIndex, 20 + startIndex)),
    )
    setStartIndex((prev) => prev + 20)
    if (videos.length >= currentVideos.length) {
      setHasMore(false)
    }
    setLoading(false)
  }, [currentVideos.length, startIndex, videos])

  const intObserver = useRef()

  const scrollThreshold = useCallback(
    (video) => {
      if (loading) return

      if (intObserver.current) intObserver.current.disconnect()

      intObserver.current = new IntersectionObserver((comments) => {
        if (comments[0].isIntersecting && hasMore) {
          setLoading(true)
          getMoreVideos()
        }
      })

      if (video) intObserver.current.observe(video)
    },
    [getMoreVideos, hasMore, loading],
  )

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    const getdata = async () => {
      const { data } = await fetchVideos()
      if (data.data.length < 20) {
        setHasMore(false)
      }
      setVideos(data.data)
      setCurrentVideos((prev) => prev.concat(data.data.slice(0, 20)))
      setPageLoading(false)
    }
    getdata()
  }, [])

  if (pageLoading) {
    return <Loading />
  }

  return (
    <>
      <div className={cn('wrapper')}>
        {currentVideos?.map((video) => (
          <WatchVideoBox key={video._id} video={video} />
        ))}
      </div>
      {loading && <Loading mgt="0px" size="3em" />}
      <div className={cn('scrollThreshold')} ref={scrollThreshold}></div>
    </>
  )
}

export default WatchVideoBoxs
