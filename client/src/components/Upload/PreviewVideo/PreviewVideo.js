import styles from './PreviewVideo.module.scss'
import classNames from 'classnames/bind'
import { AddVideoIcon } from '~/components/icons'

const cn = classNames.bind(styles)

function PreviewVideo({ videoPerc, inputs, setVideo }) {
  if (videoPerc === 0) {
    return (
      <div className={cn('wrapper')}>
        <label className={cn('input-label')} htmlFor={cn('video-input')}>
          <AddVideoIcon />
          <span style={{ marginTop: '4px' }}>Tải video lên (bắt buộc)</span>
        </label>
        <input
          className={cn('video-input')}
          type="file"
          accept="video/*"
          id={cn('video-input')}
          onChange={(e) => setVideo(e.target.files[0])}
        />
      </div>
    )
  } else if (videoPerc >= 100) {
    return (
      <div className={cn('wrapper', 'preview-wrapper')}>
        <video
          className={cn('video-player')}
          src={inputs.videoUrl}
          id="video_player"
          controls
        ></video>
      </div>
    )
  } else {
    return (
      <div className={cn('wrapper')} style={{ color: 'var(--text-color)' }}>
        {'Uploading: ' + videoPerc + '%'}
      </div>
    )
  }
}

export default PreviewVideo
