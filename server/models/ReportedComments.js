import mongoose from 'mongoose'

const ReportedCommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    commentId: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    reportUserId: {
      type: String,
      required: true,
    },
    reportContent: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
)

export default mongoose.model('ReportedComment', ReportedCommentSchema)
