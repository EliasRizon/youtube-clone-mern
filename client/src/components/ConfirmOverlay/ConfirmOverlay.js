import classNames from 'classnames/bind'
import TextArea from '../TextArea'
import styles from './ConfirmOverlay.module.scss'

const cn = classNames.bind(styles)

function ConfirmOverlay({
  setOpen,
  title,
  confirmText,
  onConfirm,
  setMessage,
}) {
  return (
    <div className={cn('confirm-overlay')}>
      <div className={cn('confirm-wrapper')}>
        <div className={cn('confirm-text')}>{title}</div>
        {setMessage && (
          <TextArea
            className={cn('message-box')}
            title="Lời nhắn: "
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            placeholder="Điền lời nhắn"
            rows="6"
          />
        )}
        <div className={cn('confirm-btn')}>
          <button
            className={cn('close-btn')}
            onClick={() => {
              setOpen(false)
              setMessage('')
            }}
          >
            Hủy
          </button>
          <button
            onClick={() => {
              setOpen(false)
              onConfirm()
            }}
            className={cn('close-btn', 'accept-btn')}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmOverlay
