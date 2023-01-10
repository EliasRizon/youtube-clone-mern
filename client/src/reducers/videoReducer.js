import {
  CREATE,
  DISLIKE,
  END_LOADING,
  FETCH_ALL,
  FETCH_VIDEO,
  LIKE,
  RELOAD,
  START_LOADING,
  UNDISLIKE,
  UNLIKE,
} from '~/constants/actionsTypes'

const videoReducer = (
  state = { isLoading: true, videos: [], video: {}, reload: false },
  action,
) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true }
    case END_LOADING:
      return { ...state, isLoading: false }
    case RELOAD:
      return { ...state, reload: !state.reload }
    case FETCH_ALL:
      return { ...state, videos: action.payload.data }
    case FETCH_VIDEO:
      return { ...state, video: action.payload.video }
    case CREATE:
      return { ...state, videos: [...state.videos, action.payload] }
    case LIKE: {
      let archive = structuredClone(state)

      if (!archive.video.likes.includes(action.payload)) {
        archive.video.likes.push(action.payload)
        archive.video.dislikes.splice(
          archive.video.dislikes.findIndex(
            (userId) => userId === action.payload,
          ),
          1,
        )
      }
      return { ...archive }
    }
    case UNLIKE: {
      let archive = structuredClone(state)

      if (archive.video.likes.includes(action.payload)) {
        archive.video.likes.splice(
          archive.video.likes.findIndex((userId) => userId === action.payload),
          1,
        )
      }
      return { ...archive }
    }
    case DISLIKE: {
      let archive = structuredClone(state)

      if (!archive.video.dislikes.includes(action.payload)) {
        archive.video.dislikes.push(action.payload)
        archive.video.likes.splice(
          archive.video.likes.findIndex((userId) => userId === action.payload),
          1,
        )
      }
      return { ...archive }
    }
    case UNDISLIKE: {
      let archive = structuredClone(state)

      if (archive.video.dislikes.includes(action.payload)) {
        archive.video.dislikes.splice(
          archive.video.dislikes.findIndex(
            (userId) => userId === action.payload,
          ),
          1,
        )
      }
      return { ...archive }
    }
    default:
      return state
  }
}

export default videoReducer
