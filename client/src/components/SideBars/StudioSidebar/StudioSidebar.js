import classNames from 'classnames/bind'
import styles from './StudioSidebar.module.scss'
import { MenuItem } from './Menu'
import { HomeIcon, HomeIconActive } from '../../icons'

const cn = classNames.bind(styles)

function StudioSidebar() {
  const currentUser = JSON.parse(localStorage.getItem('profile'))

  return (
    <aside className={cn('wrapper')}>
      <div className={cn('start')}>
        <img
          className={cn('user-img')}
          src={currentUser.result.picture}
          alt="user img"
        />
        <div className={cn('user-title')}>Kênh của bạn</div>
        <div className={cn('user-name')}>{currentUser.result.name}</div>
      </div>
      <div className={cn('center')}>
        <nav className={cn('nav-wrap')}>
          <div
            className={cn('nav-box')}
            style={{ borderTop: 'none', marginTop: '0', paddingTop: '0' }}
          >
            <MenuItem
              to={'/studio/videos'}
              title="Nội dung"
              icon={<HomeIcon />}
              activeIcon={<HomeIconActive />}
            ></MenuItem>
            {/* <MenuItem
              to={'/notyet'}
              title="Số liệu phân tích"
              icon={<SubcribedIcon />}
            ></MenuItem> */}
            {/* <MenuItem
              to={'/notyet'}
              title="Bình luận"
              icon={<SubcribedIcon />}
            ></MenuItem> */}
          </div>
          {/* <div className={cn('nav-box')}>
            <MenuItem
              to={'/notyet'}
              title="Cài đặt"
              icon={<WatchedIcon />}
            ></MenuItem>
            <MenuItem
              to={'/notyet'}
              title="Gửi phản hồi"
              icon={<MyVideosIcon />}
              unusable
            ></MenuItem>
          </div> */}
        </nav>
      </div>
    </aside>
  )
}

export default StudioSidebar
