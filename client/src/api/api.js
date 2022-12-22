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
export const fetchChannel = (userId) => API.get(`/users/find/${userId}`)
export const getLiked = () => API.get(`users/getLiked`)
export const getWatched = () => API.get(`users/getWatched`)

export const like = (videoId) => API.patch(`/users/like/${videoId}`)
export const dislike = (videoId) => API.patch(`/users/dislike/${videoId}`)
export const sub = (channelId) => API.patch(`/users/sub/${channelId}`)
export const unsub = (channelId) => API.patch(`/users/unsub/${channelId}`)
export const addWatchedVideo = (videoId) =>
  API.patch(`/users/watched/add/${videoId}`)
export const unBlock = (userId) => API.patch(`/users/unblock/${userId}`)

export const signIn = (data) => API.post('/users/google', data)
export const block = (userId, data) => API.post(`/users/block/${userId}`, data)

//Video
export const fetchVideos = () => API.get(`/videos`)
export const getVideosBySearch = (searchQuery) =>
  API.get(`/videos/search?${searchQuery}`)
export const getVideo = (videoId) => API.get(`/videos/${videoId}`)
export const getTopView = () => API.get(`videos/topview`)
export const getUserVideos = (userId) => API.get(`/videos/author?id=${userId}`)
export const getUserVideosPending = (userId) =>
  API.get(`/videos/author/pending?id=${userId}`)
export const getUserVideosToApproval = () => API.get(`/videos/approval`)

export const addVideo = (data) => API.post('/videos/add', data)
export const editVideo = (videoId, data) =>
  API.post(`/videos/edit/${videoId}`, data)
export const approveVideo = (videoId, data) =>
  API.post(`/videos/approval/approve/${videoId}`, data)
export const denyVideo = (videoId, data) =>
  API.post(`/videos/approval/deny/${videoId}`, data)

export const addView = (videoId) => API.patch(`/videos/addview/${videoId}`)

export const deleteVideo = (videoId) => API.delete(`/videos/delete/${videoId}`)

//Comment
export const getComments = (videoId) => API.get(`/comment/${videoId}`)
export const getComment = (commentId) => API.get(`/comment/get/${commentId}`)
export const getReportedComment = () => API.get(`/comment/reported/get`)

export const reportComment = (commentId, data) =>
  API.post(`comment/report/${commentId}`, data)

export const deleteComment = (commentId) =>
  API.delete(`/comment/delete/${commentId}`)

export const addComment = (comment, videoId) =>
  API.post(`/comment/add/${videoId}`, { comment })

//Search
export const getSearchResult = (value) => API.get(`/search/get/${value}`)
export const addSearchResult = (value) => API.get(`/search/add/${value}`)
export const getAllSearch = () => API.get(`/search/getAll`)
