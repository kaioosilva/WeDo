import React, { FormEvent } from 'react'
import Head from 'next/head'

import Router from 'next/router'
import Link from 'next/link'

import TodoList from '../components/TodoList'

import { useAuth } from '../hooks/Auth'

import { FiPower } from 'react-icons/fi'
import logoImg from '../assets/wedo.png'

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content
} from '../styles/pages/dashboard'

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()

  function handleSignOut(event: FormEvent) {
    event.preventDefault()
    signOut()

    if (typeof window !== 'undefined') Router.push(`/`)
  }

  return (
    <Container>
      <Head>
        <title>WeDo - Dashboard</title>
      </Head>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="WeDo" />

          <Profile>
            {user?.avatar !== undefined ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div>
                <p>{user?.name.charAt(0)}</p>
              </div>
            )}

            <div>
              <span>Welcome,</span>
              <Link href="/profile">
                <strong>{user?.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={handleSignOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <TodoList />
      </Content>
    </Container>
  )
}

export default Dashboard
