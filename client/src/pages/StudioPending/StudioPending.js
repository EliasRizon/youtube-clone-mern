import styles from './StudioPending.module.scss'
import classNames from 'classnames/bind'
import StudioPendingBox from '~/components/Boxs/StudioPendingBox'
import { useEffect, useState } from 'react'
import { getUserVideosPending } from '~/api/api'
import { useSelector } from 'react-redux'
import Loading from '~/components/Loading'
import InfiniteScroll from 'react-infinite-scroll-component'

const cn = classNames.bind(styles)

function StudioPending() {
  const { reload } = useSelector((store) => store.videoReducer)
  const currentUser = JSON.parse(localStorage.getItem('profile'))
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [numberOfPages, setNumberOfPages] = useState(0)

  const getMoreVideos = async () => {
    if (page >= numberOfPages) {
      setHasMore(false)
    }
    const { data } = await getUserVideosPending(currentUser?.result._id, page)
    setVideos((prev) => prev.concat(data.data))
    setPage((prev) => ++prev)
    setNumberOfPages(data.numberOfPages)
  }

  useEffect(() => {
    const getdata = async () => {
      const { data } = await getUserVideosPending(currentUser?.result._id)
      if (data.total < 20) {
        setHasMore(false)
      }
      setVideos(data.data)
      setNumberOfPages(data.numberOfPages)
      setPage(2)
      setLoading(false)
    }
    getdata()
  }, [currentUser?.result._id, reload])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className={cn('wrapper')}>
      <InfiniteScroll
        dataLength={videos.length}
        loader={<Loading mgt="0px" size="3em" />}
        scrollThreshold="1px"
        next={getMoreVideos}
        hasMore={hasMore}
      >
        <table className={cn('table')}>
          <thead>
            <tr>
              <th
                style={{ textAlign: 'left', width: '45%', paddingLeft: '24px' }}
              >
                Video
              </th>
              <th style={{ textAlign: 'left', padding: '0 12px' }}>Tùy chọn</th>
              <th
                style={{ textAlign: 'right', width: '16%', padding: '0 12px' }}
              >
                Ngày tải lên
              </th>
              <th
                style={{ textAlign: 'right', width: '20%', padding: '0 12px' }}
              >
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <StudioPendingBox key={video._id} video={video} />
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
      {videos.length === 0 && (
        <div className={cn('no-video')}>Không có video nào!</div>
      )}
    </div>
  )
}

export default StudioPending
