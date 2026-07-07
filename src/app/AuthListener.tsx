import { useEffect } from 'react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { setUser, setInitialized } from '../store/slices/authSlice'
import { authService } from '../services/auth.service'

export function AuthListener() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Restore session on mount — always call setInitialized regardless of outcome
    authService
      .getSession()
      .then((session) => {
        if (session?.user) {
          dispatch(setUser({ id: session.user.id, email: session.user.email! }))
        } else {
          dispatch(setInitialized())
        }
      })
      .catch(() => {
        // Network error or Supabase unreachable — mark as initialized so the
        // app renders (the user will see the login page)
        dispatch(setInitialized())
      })

    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        dispatch(setUser({ id: session.user.id, email: session.user.email! }))
      } else {
        dispatch(setUser(null))
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  return null
}
