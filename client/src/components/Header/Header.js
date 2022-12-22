import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import SearchBar from '../SearchBar'
import logo from '~/assets/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { SidebarIcon, UploadIcon } from '../icons'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import UserMenu from '../UserMenu'
import { useDispatch } from 'react-redux'
import { signin } from '~/actions/authActions'
import { useCallback, useEffect, useState } from 'react'
import { LOGOUT } from '~/constants/actionsTypes'
import Upload from '../Upload'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const cn = classNames.bind(styles)

function Header() {
  const dispatch = useDispatch()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('profile')),
  )
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const uploading = searchParams.get('upload')

  useEffect(() => {
    if (uploading) {
      setOpen(true)
    }
  }, [uploading])

  const login = useGoogleLogin({
    onSuccess: async (respose) => {
      try {
        const res = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${respose.access_token}`,
            },
          },
        )
        dispatch(
          signin({
            name: res.data.name,
            email: res.data.email,
            picture: res.data.picture,
          }),
        )
      } catch (err) {
        console.log(err)
      }
    },
  })

  const logout = useCallback(() => {
    dispatch({ type: LOGOUT })
    setCurrentUser(null)
    navigate('/')
  }, [dispatch, navigate])

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('profile')))
  }, [])

  const notify = () =>
    toast.success('Đăng tải video thành công.', {
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
      <header className={cn('wrapper')}>
        <div className={cn('inner')}>
          <div className={cn('start')}>
            <div className={cn('sidebar-btn')}>
              <SidebarIcon height="25px" />
            </div>
            <Link to="/" className={cn('logo-link')}>
              <img className={cn('logo-img')} src={logo} alt="logo" />
            </Link>
            <SearchBar />
          </div>

          <div className={cn('end')}>
            {currentUser?.result ? (
              <>
                <div
                  className={cn('upload-btn')}
                  onClick={() => {
                    navigate('/studio/videos/pending?upload=true')
                    setOpen(true)
                  }}
                >
                  <UploadIcon className={cn('upload-icon')} />
                  Tạo video
                </div>
                {/* <div className={cn('notification-btn')}>
                  <NotificationIcon className={cn('notification-icon')} />
                </div> */}
                <div className={cn('user-box')}>
                  <img
                    referrerPolicy="no-referrer"
                    className={cn('user-img')}
                    src={currentUser?.result.picture}
                    alt="user img"
                  />

                  <UserMenu
                    menuId={cn('user-menu-id')}
                    currentUser={currentUser}
                    logout={logout}
                  />
                </div>
              </>
            ) : (
              <>
                {/* <button className={cn('menu-btn')}>
                  <FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon>
                </button> */}
                <div className={cn('login-box')}>
                  <div className={cn('login-box-btn')} onClick={() => login()}>
                    <FontAwesomeIcon
                      className={cn('login-box-btn-icon')}
                      icon={faUser}
                    ></FontAwesomeIcon>
                    <span>Đăng nhập</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      {open && (
        <Upload
          notify={notify}
          setOpen={setOpen}
          edit={false}
          title="Đăng tải video"
        />
      )}
    </>
  )
}

export default Header
