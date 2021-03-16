import React, { useCallback, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import api from '../services/api'
import * as Yup from 'yup'

import getValidationErrors from '../utils/getValidationErrors'
import { useToast } from '../hooks/Toast'

import Input from '../components/Input'
import Button from '../components/Button'

import logoImg from '../assets/wedo.png'

import {
  Container,
  Content,
  AnimationContainer,
  Background
} from '../styles/pages/signup'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()

  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        name: Yup.string().required('Name required'),
        email: Yup.string()
          .required('Email required')
          .email('Please insert a valid email'),
        password: Yup.string().min(6, 'Min 6 characters')
      })

      await schema.validate(data, {
        abortEarly: false
      })

      await api.post('/api/signUp', data)

      Router.push('/')

      addToast({
        type: 'success',
        title: 'Account registration confirmation',
        description: 'You can login on WeDo.'
      })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)

        return
      }

      addToast({
        type: 'error',
        title: 'Registration error',
        description: 'Registration failure, try again'
      })
    }
  }, [])
  return (
    <Container>
      <Head>
        <title>WeDo - Sing up</title>
      </Head>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Create your account</h1>

            <Input name="name" icon={FiUser} placeholder="Name" />

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />

            <Button type="submit">Sign up</Button>
          </Form>

          <Link href="/">
            <a>
              <FiArrowLeft />
              Back to sign in page
            </a>
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  )
}

export default SignUp
