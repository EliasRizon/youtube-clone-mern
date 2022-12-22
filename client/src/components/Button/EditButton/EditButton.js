import classNames from 'classnames/bind'
import { useState } from 'react'
import { toast } from 'react-toastify'
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from '~/components/Tooltip/Tooltip.tsx'
import TooltipTag from '~/components/Tooltip/TooltipTag'
import { EditIcon } from '../../icons'
import Upload from '../../Upload'
import styles from './EditButton.module.scss'

const cn = classNames.bind(styles)

function EditButton({ video }) {
  const [open, setOpen] = useState(false)

  const notify = () =>
    toast.success('Chỉnh sửa video thành công.', {
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
            className={cn('option-icon')}
          >
            <EditIcon />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <TooltipTag>Chỉnh sửa</TooltipTag>
        </TooltipContent>
      </Tooltip>
      <div className={cn('edit-form')}>
        {open && (
          <Upload
            setOpen={setOpen}
            title="Chỉnh sửa video"
            edit={true}
            videoEdit={video}
            notify={notify}
          />
        )}
      </div>
    </>
  )
}

export default EditButton
