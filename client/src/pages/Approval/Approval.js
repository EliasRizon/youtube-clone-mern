import styles from './Approval.module.scss'
import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { getUserVideosToApproval } from '~/api/api'
import ApprovalVideoBox from '~/components/Boxs/ApprovalVideoBox'
import Loading from '~/components/Loading'

const cn = classNames.bind(styles)

function Approval() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    const getdata = async () => {
      const { data } = await getUserVideosToApproval()
      setVideos(data.videos)
      setLoading(false)
    }
    getdata()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className={cn('wrapper')}>
      <table className={cn('table')}>
        <thead>
          <tr>
            <th
              style={{ textAlign: 'left', width: '45%', paddingLeft: '24px' }}
            >
              Video
            </th>
            <th style={{ textAlign: 'left', width: '16%', padding: '0 12px' }}>
              Kênh
            </th>
            <th style={{ textAlign: 'right', width: '16%', padding: '0 12px' }}>
              Ngày tải lên
            </th>
            <th style={{ textAlign: 'right', padding: '0 12px' }}>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <ApprovalVideoBox key={video._id} video={video} />
          ))}
        </tbody>
      </table>
      {videos.length === 0 && (
        <div className={cn('no-video')}>Không có video nào!</div>
      )}
    </div>
  )
}

export default Approval
