import classNames from 'classnames/bind'
import { Link } from 'react-router-dom'
import styles from './Button.module.scss'

const cn = classNames.bind(styles)

function Button({
  to,
  href,
  small = false,
  large = false,
  red = false,
  primary = false,
  normal = false,
  children,
  className,
  onClick,
  ...passProps
}) {
  let Comp = 'button'
  const props = {
    onClick,
    ...passProps,
  }

  if (to) {
    props.to = to
    Comp = Link
  } else if (href) {
    props.href = href
    Comp = 'a'
  }

  const classes = cn('wrapper', {
    [className]: className,
    small,
    large,
    red,
    primary,
    normal,
  })

  return (
    <Comp className={classes} {...props}>
      <span className={cn('title')}>{children}</span>
    </Comp>
  )
}

export default Button
