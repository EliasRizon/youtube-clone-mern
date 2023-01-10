import express from 'express'
import {
  addVideo,
  addView,
  approveVideo,
  deleteVideo,
  denyVideo,
  editVideo,
  fetchVideos,
  getTopView,
  getUserVideos,
  getUserVideosPending,
  getUserVideosToApproval,
  getVideo,
  getVideosBySearch,
} from '../controller/videoController.js'
import auth from '../middleware/auth.js'
const router = express.Router()

router.post('/approval/approve/:videoId', auth, approveVideo)
router.post('/approval/deny/:videoId', auth, denyVideo)
router.post('/edit/:videoId', auth, editVideo)
router.post('/add', auth, addVideo)

router.delete('/delete/:videoId', auth, deleteVideo)

router.patch('/addview/:id', addView)

router.get('/author/pending', getUserVideosPending)
router.get('/search', getVideosBySearch)
router.get('/author', getUserVideos)
router.get('/topview', getTopView)
router.get('/approval', getUserVideosToApproval)
router.get('/:id', getVideo)
router.get('/', fetchVideos)

export default router
