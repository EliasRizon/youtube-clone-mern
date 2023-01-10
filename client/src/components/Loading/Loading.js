import { CircularProgress } from '@mui/material'
import styles from './Loading.module.scss'
import classNames from 'classnames/bind'

const cn = classNames.bind(styles)

function Loading({ mgt = '165px', size = '5em' }) {
  return (
    <div className={cn('loadingPaper')}>
      <CircularProgress
        className={cn('circularProgress')}
        size={size}
        style={{ marginTop: mgt }}
      />
    </div>
  )
}

export default Loading
