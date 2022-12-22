import express from 'express'
import {
  addComment,
  deleteComment,
  getComment,
  getComments,
  getReportedComments,
  reportComment,
} from '../controller/commentController.js'
import auth from '../middleware/auth.js'
const router = express.Router()

router.delete('/delete/:commentId', auth, deleteComment)

router.post('/report/:commentId', auth, reportComment)

router.post('/add/:videoId', auth, addComment)

router.get('/reported/get', getReportedComments)
router.get('/:videoId', getComments)
router.get('/get/:commentId', getComment)

export default router
