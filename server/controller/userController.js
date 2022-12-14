import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import Video from '../models/Video.js'
import mongoose from 'mongoose'

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      if (user.role === 'admin' || user.role === 'user') {
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT,
        )
        res.status(200).json({ result: user, token })
      } else {
        res.status(200).json({ message: user.role })
      }
    } else {
      const newUser = new User({
        ...req.body,
      })
      const savedUser = await newUser.save()
      const token = jwt.sign(
        { id: savedUser._id, role: savedUser.role },
        process.env.JWT,
      )
      res.status(200).json({ result: savedUser, token })
    }
  } catch (err) {
    next(err)
  }
}

export const getUser = async (req, res) => {
  const userId = req.params.userId

  try {
    const user = await User.findById(userId)

    res.status(200).json(user)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const like = async (req, res) => {
  const videoId = req.params.videoId
  const userId = req.userId

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    })
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        likedVideos: { videoId },
      },
    })
    res.status(200).json({ message: 'Liked' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const dislike = async (req, res) => {
  const videoId = req.params.videoId
  const userId = req.userId

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    })
    await User.findByIdAndUpdate(userId, {
      $pull: {
        likedVideos: { videoId },
      },
    })
    res.status(200).json({ message: 'Disliked' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const sub = async (req, res, next) => {
  const userId = req.userId
  const channelId = req.params.channelId

  try {
    await User.findByIdAndUpdate(userId, {
      $push: { subscribedUsers: channelId },
    })
    await User.findByIdAndUpdate(channelId, {
      $inc: { subscribers: 1 },
    })
    const updatedUser = await User.findById(userId)
    res.status(200).json(updatedUser)
  } catch (err) {
    next(err)
  }
}

export const unsub = async (req, res, next) => {
  const userId = req.userId
  const channelId = req.params.channelId

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { subscribedUsers: channelId },
    })
    await User.findByIdAndUpdate(channelId, {
      $inc: { subscribers: -1 },
    })
    const updatedUser = await User.findById(userId)
    res.status(200).json(updatedUser)
  } catch (err) {
    next(err)
  }
}

export const getLiked = async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.userId)

  try {
    const likedVideos = await User.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: '$likedVideos',
      },
      { $replaceRoot: { newRoot: '$likedVideos' } },
      {
        $sort: { updatedAt: -1 },
      },
      { $addFields: { videoObjectId: { $toObjectId: '$videoId' } } },
      {
        $lookup: {
          from: 'videos',
          localField: 'videoObjectId',
          foreignField: '_id',
          as: 'liked',
        },
      },
      {
        $unwind: '$liked',
      },
      { $replaceRoot: { newRoot: '$liked' } },
    ])
    res.status(200).json({ data: likedVideos })
  } catch (err) {
    next(err)
  }
}

export const addWatchedVideo = async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.userId)
  const { videoId } = req.params

  try {
    const exist = await User.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: '$watchedVideos',
      },
      { $replaceRoot: { newRoot: '$watchedVideos' } },
      {
        $match: { videoId },
      },
    ])
    if (exist.length > 0) {
      await User.findByIdAndUpdate(userId, {
        $pull: {
          watchedVideos: { videoId },
        },
      })
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          watchedVideos: { videoId },
        },
      })
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          watchedVideos: { videoId },
        },
      })
    }
    res.status(200).json({ data: exist })
  } catch (err) {
    next(err)
  }
}

export const getWatched = async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.userId)

  try {
    const watchedVideos = await User.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: '$watchedVideos',
      },
      { $replaceRoot: { newRoot: '$watchedVideos' } },
      {
        $sort: { updatedAt: -1 },
      },
      { $addFields: { videoObjectId: { $toObjectId: '$videoId' } } },
      {
        $lookup: {
          from: 'videos',
          localField: 'videoObjectId',
          foreignField: '_id',
          as: 'watched',
        },
      },
      {
        $unwind: '$watched',
      },
      { $replaceRoot: { newRoot: '$watched' } },
    ])
    res.status(200).json({ watchedVideos })
  } catch (err) {
    next(err)
  }
}

export const block = async (req, res, next) => {
  const userId = req.params.userId
  const message = req.body.blockMessage
  const role = req.role

  try {
    if (role === 'admin') {
      if (message === '') {
        await User.findByIdAndUpdate(userId, { role: 'blocked' })
        res.status(200).json({ message: 'Blocked' })
      } else {
        await User.findByIdAndUpdate(userId, { role: message })
        res.status(200).json({ message: 'Blocked' })
      }
    } else {
      return next(createError(403, 'You not an admin!'))
    }
  } catch (error) {
    next(err)
  }
}

export const unBlock = async (req, res, next) => {
  const userId = req.params.userId
  const role = req.role

  try {
    if (role === 'admin') {
      await User.findByIdAndUpdate(userId, { role: 'user' })
      res.status(200).json({ message: 'Unblock successfully' })
    } else {
      return next(createError(403, 'You not an admin!'))
    }
  } catch (error) {
    next(err)
  }
}
