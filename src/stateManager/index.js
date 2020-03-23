import { createGlobalState } from 'react-hooks-global-state'

const initialState = { 
  isSnackSuccessVisible : false,
  isLoggedIn: false,
  loginState: 'pending',
  profileData: {},
  test: 'test'
}

const { useGlobalState } = createGlobalState(initialState)

export default useGlobalState