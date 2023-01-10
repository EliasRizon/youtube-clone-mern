import Comment from '../models/Comment.js'
import ReportedComment from '../models/ReportedComments.js'

export const addComment = async (req, res, next) => {
  const userId = req.userId
  const { videoId } = req.params
  const { comment } = req.body
  const newComment = new Comment({ userId, videoId, desc: comment })

  try {
    const savedComment = await newComment.save()
    res.status(200).json(savedComment)
  } catch (err) {
    next(err)
  }
}

export const getComments = async (req, res, next) => {
  const { videoId } = req.params
  const { page } = req.query

  try {
    const startIndex = (Number(page) - 1) * 20
    const total = await Comment.find({ videoId }).countDocuments({})

    const comments = await Comment.find({
      videoId,
    })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(20)

    res
      .status(200)
      .json({ data: comments, numberOfPages: Math.ceil(total / 20), total })
  } catch (err) {
    next(err)
  }
}

export const getReportedComments = async (req, res, next) => {
  try {
    const reportedComments = await ReportedComment.find()
    res.status(200).json(reportedComments)
  } catch (err) {
    next(err)
  }
}

export const deleteComment = async (req, res, next) => {
  const { commentId } = req.params
  const userId = req.userId
  const userRole = req.role

  try {
    const comment = await Comment.findById(commentId)
    if (userRole === 'admin' || userId === comment.userId) {
      await Comment.findByIdAndDelete(commentId)
      res.status(200).json({ message: 'delete successfully' })
    } else {
      return next(createError(403, 'You can only delete your comment!'))
    }
  } catch (err) {
    next(err)
  }
}

export const reportComment = async (req, res, next) => {
  const reportUserId = req.userId
  const { commentId } = req.params
  const reportContent = req.body.reportMessage
  const videoId = req.body.videoId
  const userId = req.body.userId
  const newReportedComment = new ReportedComment({
    userId,
    commentId,
    videoId,
    reportUserId,
    reportContent,
  })

  try {
    await newReportedComment.save()
    res.status(200).json({ message: 'Reported' })
  } catch (err) {
    next(err)
  }
}

export const getComment = async (req, res, next) => {
  const { commentId } = req.params

  try {
    const comment = await Comment.findById(commentId)

    res.status(200).json(comment)
  } catch (err) {
    next(err)
  }
}
