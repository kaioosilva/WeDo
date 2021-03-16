import React from 'react'

import { ToastProvider } from '../hooks/Toast'
import { AuthProvider } from '../hooks/Auth'

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
)

export default AppProvider
