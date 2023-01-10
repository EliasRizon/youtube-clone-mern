import { TrashIcon } from '../../icons'
import classNames from 'classnames/bind'
import styles from './DeleteButton.module.scss'
import { useState } from 'react'
import { deleteObject, ref } from 'firebase/storage'
import { storage } from '~/firebase'
import { toast } from 'react-toastify'
import { deleteVideo } from '~/actions/videoActions'
import { useDispatch } from 'react-redux'
import ConfirmOverlay from '~/components/ConfirmOverlay'
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from '~/components/Tooltip/Tooltip.tsx'
import TooltipTag from '~/components/Tooltip/TooltipTag'

const cn = classNames.bind(styles)

function DeleteButton({ video, className, handle }) {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const handleDelete = () => {
    try {
      if (video?.videoPath) {
        const videoRef = ref(storage, video.videoPath)
        deleteObject(videoRef)
      }
      if (video?.imgPath) {
        const imageRef = ref(storage, video.imgPath)
        deleteObject(imageRef)
      }
      dispatch(deleteVideo(video._id))
      notify()
    } catch (error) {
      console.log(error)
    }
  }

  if (!handle) {
    handle = handleDelete
  }

  const classes = cn('option-icon', {
    [className]: className,
  })

  const notify = () =>
    toast.success('Xóa video thành công.', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  return (
    <>
      <Tooltip placement="bottom">
        <TooltipTrigger asChild>
          <button
            onClick={() => {
              setOpen(true)
            }}
            className={classes}
          >
            <TrashIcon />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <TooltipTag>Xóa</TooltipTag>
        </TooltipContent>
      </Tooltip>

      {open && (
        <ConfirmOverlay
          setOpen={setOpen}
          title="Bạn có chắc muốn xóa video?"
          confirmText="Xóa"
          onConfirm={handle}
        />
      )}
    </>
  )
}

export default DeleteButton
