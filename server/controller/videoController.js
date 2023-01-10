import Video from '../models/Video.js'
import Comment from '../models/Comment.js'
import User from '../models/User.js'

export const addVideo = async (req, res, next) => {
  const userId = req.userId
  const video = new Video({ userId, ...req.body })

  try {
    video.save()
    res.status(200).json(video)
  } catch (err) {
    next(err)
  }
}

export const editVideo = async (req, res, next) => {
  const { videoId } = req.params
  const userId = req.userId

  try {
    const video = await Video.findById(videoId)
    if (userId === video.userId) {
      await Video.findByIdAndUpdate(videoId, { ...req.body })
      res.status(200).json({ message: 'edit successfully' })
    } else {
      return next(createError(403, 'You can only edit your video!'))
    }
  } catch (err) {
    next(err)
  }
}

export const fetchVideos = async (req, res) => {
  try {
    const videos = await Video.aggregate([
      { $match: { status: 'approved' } },
      { $sample: { size: 500 } },
    ])

    res.status(200).json({ data: videos })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getVideo = async (req, res) => {
  const { id } = req.params

  try {
    const video = await Video.findById(id)

    res.status(200).json(video)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const addView = async (req, res) => {
  const { id } = req.params

  try {
    await Video.findByIdAndUpdate(id, {
      $inc: { views: 1 },
    })
    res.status(200).json({ message: 'Added' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getTopView = async (req, res) => {
  try {
    const videos = await Video.find({ status: 'approved' }).sort({ views: -1 })
    res.status(200).json({ videos })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getUserVideos = async (req, res) => {
  const { id } = req.query
  const { page } = req.query

  try {
    const startIndex = (Number(page) - 1) * 20
    const total = await Video.find({
      userId: id,
      status: 'approved',
    }).countDocuments({})

    const videos = await Video.find({ userId: id, status: 'approved' })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(20)

    res
      .status(200)
      .json({ data: videos, numberOfPages: Math.ceil(total / 20), total })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getUserVideosPending = async (req, res) => {
  const { id, page } = req.query

  try {
    const startIndex = (Number(page) - 1) * 20
    const total = await Video.find({
      userId: id,
      status: ['draft', 'pending', 'denied'],
    }).countDocuments({})

    const videos = await Video.find({
      userId: id,
      status: ['draft', 'pending', 'denied'],
    })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(20)

    res
      .status(200)
      .json({ data: videos, numberOfPages: Math.ceil(total / 20), total })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getUserVideosToApproval = async (req, res) => {
  const { page } = req.query

  try {
    const startIndex = (Number(page) - 1) * 20
    const total = await Video.find({
      status: 'pending',
    }).countDocuments({})

    const videos = await Video.find({
      status: 'pending',
    })
      .sort({ createdAt: 1 })
      .skip(startIndex)
      .limit(20)

    res
      .status(200)
      .json({ data: videos, numberOfPages: Math.ceil(total / 20), total })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const approveVideo = async (req, res) => {
  const { videoId } = req.params

  try {
    if (req.body.role === 'admin') {
      await Video.findByIdAndUpdate(videoId, {
        status: 'approved',
      })
      res.status(200).json({ message: 'Approved' })
    } else {
      return next(createError(403, 'You not an admin!'))
    }
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const denyVideo = async (req, res) => {
  const { videoId } = req.params

  try {
    if (req.body.role === 'admin') {
      await Video.findByIdAndUpdate(videoId, {
        status: 'denied',
      })
      res.status(200).json({ message: 'denied' })
    } else {
      return next(createError(403, 'You not an admin!'))
    }
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const deleteVideo = async (req, res, next) => {
  const { videoId } = req.params
  const userId = req.userId

  try {
    const video = await Video.findById(videoId)
    if (userId === video.userId) {
      await Video.findByIdAndDelete(videoId)
      await Comment.deleteMany({
        videoId: videoId,
      })
      await User.updateMany(
        {},
        {
          $pull: {
            likedVideos: {
              videoId: videoId,
            },
            watchedVideos: {
              videoId: videoId,
            },
          },
        },
      )
      res.status(200).json({ message: 'delete successfully' })
    } else {
      return next(createError(403, 'You can only delete your video!'))
    }
  } catch (err) {
    next(err)
  }
}

export const getVideosBySearch = async (req, res, next) => {
  const { search_query } = req.query

  try {
    const result = await Video.find({
      title: { $regex: search_query, $options: 'i' },
      status: 'approved',
    })
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}
