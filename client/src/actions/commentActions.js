import * as api from '../api/api.js'

export const addComment = (comment, videoId, setUpdate) => async (dispatch) => {
  try {
    await api.addComment(comment, videoId)
    setUpdate((preState) => !preState)
  } catch (error) {
    console.log(error)
  }
}

export const deleteComment = (commentId, notify) => async () => {
  try {
    await api.deleteComment(commentId)
    notify()
  } catch (error) {
    console.log(error)
  }
}
