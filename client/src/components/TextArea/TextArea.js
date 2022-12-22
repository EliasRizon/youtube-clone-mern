import classNames from 'classnames/bind'
import styles from './TextArea.module.scss'

const cn = classNames.bind(styles)

function TextArea({
  title,
  name,
  value,
  onChange,
  className,
  rows,
  placeholder,
}) {
  const classes = cn('title-box', {
    [className]: className,
  })

  return (
    <div className={classes}>
      <div className={cn('title-text')}>{title}</div>
      <textarea
        className={cn('text-input')}
        placeholder={placeholder}
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default TextArea
