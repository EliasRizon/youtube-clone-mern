import classNames from 'classnames/bind'
import styles from './Tooltip.module.scss'

const cn = classNames.bind(styles)

function TooltipTag({ children }) {
  return <div className={cn('tooltip')}>{children}</div>
}

export default TooltipTag
