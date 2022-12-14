import styles from './Upload.module.scss'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useLayoutEffect, useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useDispatch } from 'react-redux'
import { addVideo, editVideo } from '~/actions/videoActions'
import PreviewImg from './PreviewImg'
import PreviewVideo from './PreviewVideo'
import { storage } from '~/firebase'
import TextArea from '../TextArea'

const cn = classNames.bind(styles)

function Upload({ notify, setOpen, edit, title, videoEdit }) {
  const [img, setImg] = useState(undefined)
  const [video, setVideo] = useState(undefined)
  const [imgPerc, setImgPerc] = useState(0)
  const [videoPerc, setVideoPerc] = useState(0)
  const [inputs, setInputs] = useState({})

  const dispatch = useDispatch()

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const uploadVideo = (file) => {
    const fileName = new Date().getTime() + file.name
    const videoPath = `videos/${fileName}`
    const storageRef = ref(storage, videoPath)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setVideoPerc(Math.round(progress))
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return {
              ...prev,
              videoUrl: downloadURL,
              videoPath: videoPath,
            }
          })
        })
      },
    )
  }

  const uploadImage = (file) => {
    const fileName = new Date().getTime() + file.name
    const imagePath = `images/${fileName}`
    const storageRef = ref(storage, imagePath)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImgPerc(Math.round(progress))
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return {
              ...prev,
              imgUrl: downloadURL,
              imgPath: imagePath,
            }
          })
        })
      },
    )
  }

  useLayoutEffect(() => {
    if (edit) {
      setInputs({
        title: videoEdit?.title,
        desc: videoEdit?.desc,
        imgUrl: videoEdit?.imgUrl,
        videoUrl: videoEdit?.videoUrl,
      })
      setImgPerc(100)
      setVideoPerc(100)
    }
  }, [
    edit,
    videoEdit?.desc,
    videoEdit?.imgUrl,
    videoEdit?.title,
    videoEdit?.videoUrl,
  ])

  useEffect(() => {
    if (videoPerc === 100) {
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
  }, [videoPerc])

  useEffect(() => {
    video && uploadVideo(video)
  }, [video])

  useEffect(() => {
    img && uploadImage(img)
  }, [img])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (edit) {
      dispatch(editVideo(videoEdit._id, { ...inputs }))
    } else {
      dispatch(addVideo({ ...inputs }))
    }
    notify()
    setOpen(false)
  }

  return (
    <div className={cn('wrapper')}>
      <div className={cn('form')}>
        <div className={cn('start')}>
          <div className={cn('form-title')}>{title}</div>
          <div className={cn('close-icon')} onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
        <div className={cn('center')}>
          <h2 className={cn('detail-title')}>Chi ti???t</h2>
          <div className={cn('input-field')}>
            <div className={cn('left-form')}>
              <TextArea
                title="Ti??u ????? (b???t bu???c)"
                placeholder="Th??m ti??u ????? ????? m?? t??? video c???a b???n"
                value={inputs.title}
                onChange={handleChange}
                name="title"
                rows="2"
              />

              <TextArea
                className={cn('desc-box')}
                title="M?? t???"
                placeholder="Gi???i thi???u v??? video c???a b???n cho ng?????i xem"
                value={inputs.desc}
                onChange={handleChange}
                name="desc"
                rows="6"
              />
              <div className={cn('header-2')}>H??nh thu nh???</div>
              <div className={cn('header-2-detail')}>
                Ch???n ho???c t???i m???t h??nh ???nh l??n ????? th??? hi???n n???i dung trong video
                c???a b???n. H??nh thu nh??? h???p d???n s??? l??m n???i b???t video c???a b???n v??
                thu h??t ng?????i xem.
              </div>
              <PreviewImg imgPerc={imgPerc} inputs={inputs} setImg={setImg} />
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
              L??u
            </button>
          ) : (
            <div className={cn('save-btn', 'inactive-btn')}>L??u</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Upload
