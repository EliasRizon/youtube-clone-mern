import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { block, unBlock } from '~/api/api'
import ConfirmOverlay from '~/components/ConfirmOverlay'
import { RELOAD } from '~/constants/actionsTypes'
import Button from '../Button'

function BlockButton({ channel, currentUser }) {
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [blockMessage, setBlockMessage] = useState('')
  const dispatch = useDispatch()

  const handleBlock = async () => {
    await block(channel._id, { blockMessage })
    dispatch({ type: RELOAD })
    notify()
  }

  const handleUnBlock = async () => {
    await unBlock(channel._id)
    dispatch({ type: RELOAD })
    notify2()
  }

  const notify = () =>
    toast.success('Chặn người dùng thành công.', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  const notify2 = () =>
    toast.success('Bỏ chặn người dùng thành công.', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  let button
  if (channel.role === 'user') {
    button = (
      <Button
        children="Chặn người dùng"
        small
        red
        onClick={() => {
          setOpen(true)
        }}
      />
    )
  } else if (channel?.role && channel.role !== 'admin') {
    button = (
      <Button
        children="Bỏ chặn người dùng"
        small
        onClick={() => {
          setOpen2(true)
        }}
      />
    )
  }

  if (currentUser?.result.role === 'admin') {
    return (
      <>
        {button}
        {open && (
          <ConfirmOverlay
            title={`Bạn có chắc muốn chặn ${channel.name}?`}
            setOpen={setOpen}
            confirmText="Chặn"
            setMessage={setBlockMessage}
            onConfirm={handleBlock}
          />
        )}
        {open2 && (
          <ConfirmOverlay
            title={`Bạn có chắc muốn bỏ chặn ${channel.name}?`}
            setOpen={setOpen2}
            confirmText="Bỏ chặn"
            onConfirm={handleUnBlock}
          />
        )}
      </>
    )
  }
}

export default BlockButton
