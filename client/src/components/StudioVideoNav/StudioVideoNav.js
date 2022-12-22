import styles from './StudioVideoNav.module.scss'
import classNames from 'classnames/bind'
import { NavLink } from 'react-router-dom'

const cn = classNames.bind(styles)

function StudioVideoNav() {
  const currentUser = JSON.parse(localStorage.getItem('profile'))

  return (
    <div className={cn('wrapper')}>
      <h2 className={cn('title')} style={{ marginLeft: '8px' }}>
        Nội dung của kênh
      </h2>
      <div className={cn('nav-box')}>
        <NavLink
          to={'/studio/videos/upload'}
          className={(nav) => cn('menu-item', { active: nav.isActive })}
          end
        >
          <div className={cn('nav-link-btn')}>Video của bạn</div>
        </NavLink>
        <NavLink
          to={'/studio/videos/pending'}
          className={(nav) => cn('menu-item', { active: nav.isActive })}
          end
        >
          <div className={cn('nav-link-btn')}>Video chờ duyệt</div>
        </NavLink>
        {currentUser.result.role === 'admin' && (
          <>
            <NavLink
              to={'/studio/videos/approval'}
              className={(nav) => cn('menu-item', { active: nav.isActive })}
              end
            >
              <div className={cn('nav-link-btn')}>Duyệt video</div>
            </NavLink>
            <NavLink
              to={'/studio/videos/reported'}
              className={(nav) => cn('menu-item', { active: nav.isActive })}
              end
            >
              <div className={cn('nav-link-btn')}>Bình luận vi phạm</div>
            </NavLink>
          </>
        )}
      </div>
    </div>
  )
}

export default StudioVideoNav
