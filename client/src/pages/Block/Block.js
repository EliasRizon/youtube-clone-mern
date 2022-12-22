import classNames from 'classnames/bind'
import { useSearchParams } from 'react-router-dom'
import Button from '~/components/Button'
import styles from './Block.module.scss'

const cn = classNames.bind(styles)

function Block() {
  const [searchParams] = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className={cn('wrapper')}>
      <div className={cn('message-window')}>
        <h2 className={cn('message-title')}>Tài khoản của bạn đã bị cấm!</h2>
        <div className={cn('message-lable')}>Lời nhắn: </div>
        <div className={cn('message')}>{message}</div>
        <div className={cn('btn-wrap')}>
          <Button to="/" children="Trở về trang chủ" small primary />
        </div>
      </div>
    </div>
  )
}

export default Block
