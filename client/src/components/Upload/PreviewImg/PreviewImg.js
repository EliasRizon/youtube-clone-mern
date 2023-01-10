import styles from './PreviewImg.module.scss'
import classNames from 'classnames/bind'
import { AddImgIcon } from '~/components/icons'

const cn = classNames.bind(styles)

function PreviewImg({ imgPerc, inputs, setImg }) {
  if (imgPerc === 0) {
    return (
      <div className={cn('wrapper')}>
        <label className={cn('input-label')} htmlFor={cn('img-input')}>
          <AddImgIcon />
          <span style={{ marginTop: '4px' }}>
            Tải hình thu nhỏ lên (bắt buộc)
          </span>
        </label>
        <input
          className={cn('img-input')}
          type="file"
          accept="image/*"
          id={cn('img-input')}
          onChange={(e) => setImg(e.target.files[0])}
        />
      </div>
    )
  } else if (imgPerc >= 100) {
    return (
      <div
        className={cn('wrapper')}
        style={{ backgroundImage: `url(${inputs.imgUrl})` }}
      ></div>
    )
  } else {
    return (
      <div className={cn('wrapper')} style={{ color: 'var(--text-color)' }}>
        {'Uploading: ' + imgPerc + '%'}
      </div>
    )
  }
}

export default PreviewImg
