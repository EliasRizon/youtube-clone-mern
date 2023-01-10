import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5002' })

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = JSON.parse(
      localStorage.getItem('profile'),
    ).token
  }

  return req
})

// User
export const signIn = (data) => API.post('users/google', data)
export const block = (userId, data) => API.post(`/users/block/${userId}`, data)

export const like = (videoId) => API.patch(`/users/like/${videoId}`)
export const unlike = (videoId) => API.patch(`/users/unlike/${videoId}`)
export const dislike = (videoId) => API.patch(`/users/dislike/${videoId}`)
export const undislike = (videoId) => API.patch(`/users/undislike/${videoId}`)
export const sub = (channelId) => API.patch(`/users/sub/${channelId}`)
export const unsub = (channelId) => API.patch(`/users/unsub/${channelId}`)
export const addWatchedVideo = (videoId) =>
  API.patch(`/users/watched/add/${videoId}`)
export const unBlock = (userId) => API.patch(`/users/unblock/${userId}`)

export const fetchChannel = (userId) => API.get(`/users/find/${userId}`)
export const getWatched = (page) => API.get(`/users/getWatched?page=${page}`)
export const getLiked = (page) => API.get(`/users/getLiked?page=${page}`)

//Video
export const addVideo = (data) => API.post('videos/add', data)
export const editVideo = (videoId, data) =>
  API.post(`/videos/edit/${videoId}`, data)
export const approveVideo = (videoId, data) =>
  API.post(`/videos/approval/approve/${videoId}`, data)
export const denyVideo = (videoId, data) =>
  API.post(`/videos/approval/deny/${videoId}`, data)

export const deleteVideo = (videoId) => API.delete(`/videos/delete/${videoId}`)

export const addView = (videoId) => API.patch(`/videos/addview/${videoId}`)

export const fetchVideos = () => API.get(`/videos`)
export const getVideosBySearch = (searchQuery) =>
  API.get(`/videos/search?${searchQuery}`)
export const getVideo = (videoId) => API.get(`/videos/${videoId}`)
export const getTopView = () => API.get(`/videos/topview`)
export const getUserVideos = (userId, page) =>
  API.get(`/videos/author?id=${userId}&page=${page}`)
export const getUserVideosPending = (userId, page) =>
  API.get(`/videos/author/pending?id=${userId}&page=${page}`)
export const getUserVideosToApproval = (page) =>
  API.get(`/videos/approval?page=${page}`)

//Comment
export const addComment = (comment, videoId) =>
  API.post(`/comment/add/${videoId}`, { comment })

export const deleteComment = (commentId) =>
  API.delete(`/comment/delete/${commentId}`)

export const reportComment = (commentId, data) =>
  API.post(`/comment/report/${commentId}`, data)

export const getComments = (videoId, page) =>
  API.get(`/comment/${videoId}?page=${page}`)
export const getComment = (commentId) => API.get(`/comment/get/${commentId}`)
export const getReportedComment = () => API.get(`/comment/reported/get`)

//Search
export const getSearchResult = (value) => API.get(`/search/get/${value}`)
export const addSearchResult = (value) => API.get(`/search/add/${value}`)
export const getAllSearch = () => API.get(`/search/getAll`)
