import axios from 'axios'
import history from '../history'

/**
 * INITIAL STATE
 */
// const defaultUser = {}
const initialState = {
  users: [],
  user: [],
  defaultUser: {}
}

/**
 * ACTION TYPES
 */
const SET_USERS = 'SET_USERS'
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const setUsers = users => {
  return {
    type: SET_USERS,
    users
  }
}
/**
 * THUNK CREATORS
 */

export const getUsers = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/users')
    dispatch(setUsers(data))
  } catch (error) {
    console.log(error)
  }
}

export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (email, password, method) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {email, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    history.push('/home')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout')
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    // case GOT_USERS:
    //   return {...state, users: action.users}
    case SET_USERS:
      return {...state, users: action.users}
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return state.defaultUser
    default:
      return state
  }
}
