import { AUTH, SUBSCRIBTION } from '~/constants/actionsTypes'
import * as api from '../api/api.js'

export const signin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData)
    if (data.message) {
      window.location.href = `/block?message=${data.message}`
    } else {
      dispatch({ type: AUTH, data })
      window.location.reload(false)
    }
  } catch (error) {
    console.log(error)
  }
}

export const sub = (id, setCurrentUser) => async (dispatch) => {
  try {
    const { data } = await api.sub(id)

    dispatch({ type: SUBSCRIBTION, data })
    setCurrentUser(JSON.parse(localStorage.getItem('profile')))
  } catch (error) {
    console.log(error)
  }
}

export const unsub = (id, setCurrentUser) => async (dispatch) => {
  try {
    const { data } = await api.unsub(id)

    dispatch({ type: SUBSCRIBTION, data })
    setCurrentUser(JSON.parse(localStorage.getItem('profile')))
  } catch (error) {
    console.log(error)
  }
}
