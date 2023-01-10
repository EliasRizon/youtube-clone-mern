import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getWatched } from '~/api/api'
import SearchVideoBox from '~/components/Boxs/SearchVideoBox'
import Loading from '~/components/Loading'
import styles from './Watched.module.scss'

const cn = classNames.bind(styles)

function Watched() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [numberOfPages, setNumberOfPages] = useState(0)

  const getMoreVideos = async () => {
    if (page >= numberOfPages) {
      setHasMore(false)
    }
    const { data } = await getWatched(page)
    setVideos((prev) => prev.concat(data.data))
    setPage((prev) => ++prev)
    setNumberOfPages(data.numberOfPages)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    const getdata = async () => {
      const { data } = await getWatched(1)
      if (data.total < 20) {
        setHasMore(false)
      }
      setVideos(data.data)
      setNumberOfPages(data.numberOfPages)
      setPage(2)
      setLoading(false)
    }
    getdata()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className={cn('wrapper')}>
      <div className={cn('wrapper-title')}>
        <h2 className={cn('channel-name')}>Nhật ký xem</h2>
      </div>
      <InfiniteScroll
        dataLength={videos.length}
        loader={<Loading mgt="0px" size="3em" />}
        scrollThreshold="54px"
        next={getMoreVideos}
        hasMore={hasMore}
      >
        <div className={cn('wrapper-videos')}>
          {videos.length === 0 && !loading && (
            <div className={cn('no-video')}>Không có video nào!</div>
          )}
          {videos.map((video) => (
            <SearchVideoBox key={video._id} video={video} onlyId={true} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default Watched
