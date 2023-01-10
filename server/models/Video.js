import mongoose from 'mongoose'

const VideoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: 'Video không có tiêu đề',
    },
    desc: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 0,
    },
    imgUrl: {
      type: String,
      default: '',
    },
    imgPath: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    videoPath: {
      type: String,
      default: '',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      default: 'trash',
    },
  },
  { timestamps: true },
)

export default mongoose.model('Video', VideoSchema)
