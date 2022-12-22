import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    picture: {
      type: String,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: {
      type: [String],
      default: [],
    },
    likedVideos: [
      {
        type: new mongoose.Schema(
          { videoId: { type: String, unique: true } },
          { timestamps: true },
        ),
      },
    ],
    watchedVideos: [
      {
        type: new mongoose.Schema(
          {
            videoId: { type: String, unique: true },
          },
          { timestamps: true },
        ),
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.model('User', UserSchema)
