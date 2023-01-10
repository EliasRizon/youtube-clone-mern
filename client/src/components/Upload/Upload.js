import styles from './Upload.module.scss'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useDispatch } from 'react-redux'
import { editVideo } from '~/actions/videoActions'
import PreviewImg from './PreviewImg'
import PreviewVideo from './PreviewVideo'
import { storage } from '~/firebase'
import TextArea from '../TextArea'
import { AddVideoIcon } from '../icons'
import { addVideo as apiAddVideo, editVideo as apiEditVideo } from '~/api/api'
import { RELOAD } from '~/constants/actionsTypes'
import { useNavigate } from 'react-router-dom'

const cn = classNames.bind(styles)

function Upload({ notify, setOpen, edit, title, videoEdit }) {
  const [img, setImg] = useState(undefined)
  const [video, setVideo] = useState(undefined)
  const [imgPerc, setImgPerc] = useState(0)
  const [videoPerc, setVideoPerc] = useState(0)
  const [inputs, setInputs] = useState({})
  const [videoId, setVideoId] = useState()

  const [upload, setUpload] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const uploadVideo = useCallback(
    (file) => {
      const fileName = new Date().getTime() + file.name
      const videoPath = `videos/${fileName}`
      if (!inputs.videoPath) {
        setInputs((prev) => {
          return {
            ...prev,
            videoPath: videoPath,
            status: 'trash',
          }
        })
        setUpload(true)
      }

      const storageRef = ref(storage, videoPath)
      const uploadTask = uploadBytesResumable(storageRef, file)
      setInputs((prev) => {
        return { ...prev, title: file.name }
      })

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setVideoPerc(Math.round(progress))
        },
        (error) => {},
        (complete) => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setInputs((prev) => {
              return {
                ...prev,
                videoUrl: downloadURL,
                videoPath: videoPath,
                status: 'draft',
              }
            })
            setUpload(true)
          })
        },
      )
    },
    [inputs.videoPath],
  )

  const uploadImage = useCallback(
    (file) => {
      const fileName = new Date().getTime() + file.name
      const imagePath = `images/${fileName}`
      if (!inputs?.imagePath) {
        setInputs((prev) => {
          return {
            ...prev,
            imgPath: imagePath,
            status: 'trash',
          }
        })
        setUpload(true)
      }
      const storageRef = ref(storage, imagePath)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImgPerc(Math.round(progress))
        },
        (error) => {},
        (complete) => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setInputs((prev) => {
              return {
                ...prev,
                imgUrl: downloadURL,
                imgPath: imagePath,
                status: 'draft',
              }
            })
            setUpload(true)
          })
        },
      )
    },
    [inputs?.imagePath],
  )

  useLayoutEffect(() => {
    if (edit) {
      setInputs({
        title: videoEdit?.title,
        desc: videoEdit?.desc,
        imgUrl: videoEdit?.imgUrl,
        videoUrl: videoEdit?.videoUrl,
      })
      setVideoId(videoEdit?._id)
      if (videoEdit?.imgUrl) {
        setImgPerc(101)
      }
      if (videoEdit?.videoUrl) {
        setVideoPerc(101)
      }
    }
  }, [
    edit,
    videoEdit?.desc,
    videoEdit?.imgUrl,
    videoEdit?.title,
    videoEdit?._id,
    videoEdit?.videoUrl,
  ])

  useEffect(() => {
    if (upload) {
      if (!videoId) {
        const sendData = async () => {
          const { data } = await apiAddVideo({ ...inputs })
          setVideoId(data._id)
        }
        sendData()
      } else {
        apiEditVideo(videoId, { ...inputs })
      }

      setUpload(false)
    }
  }, [inputs, upload, videoId, inputs.videoPath, inputs.imgPath])

  useEffect(() => {
    if (!inputs?.videoPath) {
      video && uploadVideo(video)
    }
  }, [inputs?.videoPath, uploadVideo, video])

  useEffect(() => {
    if (!inputs?.imagePath) {
      img && uploadImage(img)
    }
  }, [uploadImage, img, inputs?.imagePath])

  useEffect(() => {
    if (!inputs?.duration && inputs.videoUrl) {
      const myVideoPlayer = document.getElementById('video_player')
      myVideoPlayer?.addEventListener('loadedmetadata', function () {
        setInputs((prev) => {
          return {
            ...prev,
            duration: myVideoPlayer.duration,
          }
        })
      })
    }
  }, [inputs?.duration, inputs.videoUrl])

  const handleUpload = async (e) => {
    e.preventDefault()
    dispatch(editVideo(videoId, { ...inputs, status: 'pending' }))
    notify()
    setOpen(false)
  }

  return (
    <div className={cn('wrapper')}>
      <div className={cn('form')}>
        <div className={cn('start')}>
          <div className={cn('form-title')}>{title}</div>
          <div
            className={cn('close-icon')}
            onClick={() => {
              dispatch({ type: RELOAD })
              navigate('/studio/videos/pending')
              setOpen(false)
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
        {video || edit ? (
          <>
            <div className={cn('center')}>
              <h2 className={cn('detail-title')}>Chi tiết</h2>
              <div className={cn('input-field')}>
                <div className={cn('left-form')}>
                  <TextArea
                    title="Tiêu đề (bắt buộc)"
                    placeholder="Thêm tiêu đề để mô tả video của bạn"
                    value={inputs.title}
                    onChange={handleChange}
                    name="title"
                    rows="2"
                  />

                  <TextArea
                    className={cn('desc-box')}
                    title="Mô tả"
                    placeholder="Giới thiệu về video của bạn cho người xem"
                    value={inputs.desc}
                    onChange={handleChange}
                    name="desc"
                    rows="6"
                  />
                  <div className={cn('header-2')}>Hình thu nhỏ</div>
                  <div className={cn('header-2-detail')}>
                    Chọn hoặc tải một hình ảnh lên để thể hiện nội dung trong
                    video của bạn. Hình thu nhỏ hấp dẫn sẽ làm nổi bật video của
                    bạn và thu hút người xem.
                  </div>
                  <PreviewImg
                    imgPerc={imgPerc}
                    inputs={inputs}
                    setImg={setImg}
                  />
                </div>
                <div className={cn('right-form')}>
                  <PreviewVideo
                    videoPerc={videoPerc}
                    inputs={inputs}
                    setVideo={setVideo}
                  />
                </div>
              </div>
            </div>
            <div className={cn('end')}>
              {inputs?.imgUrl &&
              inputs?.videoUrl &&
              inputs?.duration &&
              inputs?.title ? (
                <button className={cn('save-btn')} onClick={handleUpload}>
                  Lưu
                </button>
              ) : (
                <div className={cn('save-btn', 'inactive-btn')}>Lưu</div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className={cn('center')}>
              <div className={cn('video-input-wrapper')}>
                <div className={cn('video-input-btn')}>
                  <label
                    className={cn('input-label')}
                    htmlFor={cn('video-input')}
                  >
                    <AddVideoIcon />
                    <span style={{ marginTop: '4px' }}>
                      Chọn tệp video để tải lên
                    </span>
                  </label>
                  <input
                    className={cn('video-input')}
                    type="file"
                    accept="video/*"
                    id={cn('video-input')}
                    onChange={(e) => setVideo(e.target.files[0])}
                  />
                </div>
                <div className={cn('remind')}>
                  Bạn cần đảm bảo không vi phạm bản quyền hoặc quyền riêng tư
                  của người khác.
                </div>
              </div>
            </div>
            <div className={cn('end')}></div>
          </>
        )}
      </div>
    </div>
  )
}

export default Upload
