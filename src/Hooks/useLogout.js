import { useAuthContext } from './useAuthContext'
export const useLogout = () => { 
    const { dispatch } = useAuthContext()
    const logout = async () => {
        // remove user info from localStorage
        sessionStorage.removeItem('user')

        // using dispatch to access logout state
        dispatch({ type: 'LOGOUT' })
        
    }
    return {logout}
}