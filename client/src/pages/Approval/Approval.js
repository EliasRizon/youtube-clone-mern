import styles from './Approval.module.scss'
import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { getUserVideosToApproval } from '~/api/api'
import ApprovalVideoBox from '~/components/Boxs/ApprovalVideoBox'
import Loading from '~/components/Loading'
import InfiniteScroll from 'react-infinite-scroll-component'

const cn = classNames.bind(styles)

function Approval() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [numberOfPages, setNumberOfPages] = useState(0)

  const getMoreVideos = async () => {
    if (page >= numberOfPages) {
      setHasMore(false)
    }
    const { data } = await getUserVideosToApproval(page)
    setVideos((prev) => prev.concat(data.data))
    setPage((prev) => ++prev)
    setNumberOfPages(data.numberOfPages)
  }

  useEffect(() => {
    const getdata = async () => {
      const { data } = await getUserVideosToApproval()
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
              <th
                style={{ textAlign: 'left', width: '16%', padding: '0 12px' }}
              >
                Kênh
              </th>
              <th
                style={{ textAlign: 'right', width: '16%', padding: '0 12px' }}
              >
                Ngày tải lên
              </th>
              <th style={{ textAlign: 'right', padding: '0 12px' }}>
                Tùy chọn
              </th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <ApprovalVideoBox key={video._id} video={video} />
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

export default Approval
