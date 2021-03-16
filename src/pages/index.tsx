import React, { useRef, useCallback } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import { GetServerSideProps } from 'next'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import Link from 'next/link'
import { useAuth } from '../hooks/Auth'
import { useToast } from '../hooks/Toast'

import getValidationErrors from '../utils/getValidationErrors'

import logoImg from '../assets/wedo.png'
import Input from '../components/Input'
import Button from '../components/Button'

import {
  Container,
  Content,
  AnimationContainer,
  Background
} from '../styles/pages/home'

interface SignInFormData {
  email: string
  password: string
}

interface UserDataProps {
  id: string
  email: string
  name: string
}

interface HomeProps {
  userParse: UserDataProps
}

export default function Home(props: HomeProps) {
  if (props?.userParse?.name) {
    if (typeof window !== 'undefined') {
      Router.push('/dashboard')
    }
  }

  const formRef = useRef<FormHandles>(null)

  const { signIn } = useAuth()
  const { addToast } = useToast()

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email required')
            .email('Please insert a valid email'),
          password: Yup.string().required('Password required')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        await signIn({
          email: data.email,
          password: data.password
        })

        Router.push('/dashboard')
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Authentication error',
          description: 'Authentication failure check credential properties.'
        })
      }
    },
    [signIn, addToast]
  )

  return (
    <Container>
      <Head>
        <title>WeDo - Sign in</title>
      </Head>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Join WeDo today</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />

            <Button type="submit">Log in</Button>
          </Form>

          <Link href="/signup">
            <a>
              <FiLogIn />
              Sign Up
            </a>
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { WeDoUser } = ctx.req.cookies

  let userParse = {}

  if (WeDoUser) {
    userParse = JSON.parse(WeDoUser)

    return {
      props: {
        userParse
      }
    }
  } else {
    return {
      props: {}
    }
  }
}
