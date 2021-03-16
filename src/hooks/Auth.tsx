import React, { createContext, useCallback, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import api from '../services/api'

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthState {
  token: string
  user: User
}

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: User
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
  updateUser(user: User): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = Cookies.get('WeDoToken')
    const user = Cookies.get('WeDoUser')

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`

      return { token, user: JSON.parse(user) }
    }

    return {} as AuthState
  })

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/api/sessions', {
      email,
      password
    })

    const { token, user } = response.data

    Cookies.set('WeDoToken', token)
    Cookies.set('WeDoUser', JSON.stringify(user))

    api.defaults.headers.authorization = `Bearer ${token}`

    setData({ token, user })
  }, [])

  const signOut = useCallback(() => {
    Cookies.remove('WeDoToken')
    Cookies.remove('WeDoUser')

    setData({} as AuthState)
  }, [])

  const updateUser = useCallback(
    (user: User) => {
      Cookies.set('WeDoUser', JSON.stringify(user))

      setData({
        token: data.token,
        user
      })
    },
    [setData, data.token]
  )

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }
