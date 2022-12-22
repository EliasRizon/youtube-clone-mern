import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { signin, sub, unsub } from '~/actions/authActions'
import { fetchChannel, getUserVideos } from '~/api/api'
import SubcribeButton from '~/components/Button/SubcribeButton'
import VideoBox from '~/components/Boxs/VideoBoxs/VideoBox'
import styles from './Channel.module.scss'
import BlockButton from '~/components/Button/BlockButton'
import Loading from '~/components/Loading'
import Button from '~/components/Button'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

const cn = classNames.bind(styles)

function Channel() {
  const { reload } = useSelector((store) => store.videoReducer)
  const { id } = useParams()
  const [channel, setChannel] = useState({})
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('profile')),
  )
  const dispatch = useDispatch()
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    const getChannel = async () => {
      const { data } = await fetchChannel(id)
      setChannel(data)
    }
    getChannel()
    const getdata = async () => {
      const { data } = await getUserVideos(id)
      setVideos(data.videos)
    }
    getdata()
    setIsLoading(false)
  }, [id, reload])

  const handleLogin = useGoogleLogin({
    onSuccess: async (respose) => {
      try {
        const res = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${respose.access_token}`,
            },
          },
        )
        dispatch(
          signin({
            name: res.data.name,
            email: res.data.email,
            picture: res.data.picture,
          }),
        )
      } catch (err) {
        console.log(err)
      }
    },
  })

  const handleSub = async () => {
    if (currentUser?.result.subscribedUsers.includes(channel._id)) {
      let archive = structuredClone(currentUser)
      archive.result.subscribedUsers.splice(
        archive.result.subscribedUsers.findIndex(
          (item) => item === channel._id,
        ),
      )
      setCurrentUser(archive)
      setChannel({ ...channel, subscribers: channel.subscribers - 1 })
      dispatch(unsub(channel._id, setCurrentUser))
    } else {
      setCurrentUser({
        ...currentUser,
        result: { ...currentUser.result, subscribedUsers: channel._id },
      })
      setChannel({ ...channel, subscribers: channel.subscribers + 1 })
      dispatch(sub(channel._id, setCurrentUser))
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className={cn('wrapper-title')}>
        <div className={cn('title-left')}>
          <img
            className={cn('title-img')}
            src={channel.picture}
            alt="title img"
          />
          <div className={cn('channel-detail')}>
            <h2 className={cn('channel-name')}>{channel.name}</h2>
            <div className={cn('channel-sub')}>
              {channel.subscribers} người đăng ký
            </div>
          </div>
        </div>
        <div className={cn('title-right')}>
          <BlockButton channel={channel} currentUser={currentUser} />

          {currentUser?.result && (
            <SubcribeButton
              currentUser={currentUser}
              channel={channel}
              handleSub={handleSub}
            />
          )}
          {!currentUser?.result && (
            <Button children="Đăng ký" small normal onClick={handleLogin} />
          )}
        </div>
      </div>
      <div className={cn('separate')}></div>
      <div className={cn('wrapper-videos')}>
        <div className={cn('grid__row', 'videoboxs-row')}>
          {videos?.map((video) => (
            <VideoBox key={video._id} video={video} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Channel
