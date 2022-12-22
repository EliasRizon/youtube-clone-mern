import express from 'express'
const router = express.Router()

import {
  addWatchedVideo,
  block,
  dislike,
  getLiked,
  getUser,
  getWatched,
  googleAuth,
  like,
  sub,
  unBlock,
  unsub,
} from '../controller/userController.js'
import auth from '../middleware/auth.js'

router.get('/find/:userId', getUser)
router.get('/getLiked', auth, getLiked)
router.get('/getWatched', auth, getWatched)

router.post('/google', googleAuth)
router.post('/block/:userId', auth, block)

router.patch('/unblock/:userId', auth, unBlock)
router.patch('/watched/add/:videoId', auth, addWatchedVideo)
router.patch('/like/:videoId', auth, like)
router.patch('/dislike/:videoId', auth, dislike)
router.patch('/sub/:channelId', auth, sub)
router.patch('/unsub/:channelId', auth, unsub)

export default router
