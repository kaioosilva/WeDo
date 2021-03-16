import React, { ChangeEvent, useCallback, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'

import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import api from '../services/api'
import { upload } from '../services/cloudinary'

import { useToast } from '../hooks/Toast'

import getValidationErrors from '../utils/getValidationErrors'

import Input from '../components/Input'
import Button from '../components/Button'

import { useAuth } from '../hooks/Auth'
import { Container, Content, AvatarInput } from '../styles/pages/profile'

interface ProfileFormData {
  name: string
  email: string
  old_password: string
  password: string
  password_confirmation: string
}

export default function Profile() {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  // const history = useHistory()

  const { user, updateUser } = useAuth()

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Name required'),
          email: Yup.string()
            .required('Email required')
            .email('Please insert a valid email'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Required field'),
            otherwise: Yup.string()
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Required field'),
              otherwise: Yup.string()
            })
            .oneOf([Yup.ref('password')], 'Passwords must match.')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation
        } = data

        const formData = {
          id: user.id,
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation
              }
            : {})
        }

        const response = await api.put('/api/updateProfile', formData)
        updateUser(response.data)

        Router.push('/dashboard')

        addToast({
          type: 'success',
          title: 'Profile updated',
          description: 'Your profile was succesffully updated'
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Profile update error',
          description: "Sorry, we couldn't update your profile, try again"
        })
      }
    },
    [addToast]
  )

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const formData = new FormData()
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
        formData.append(
          'upload_preset',
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        )

        formData.append('avatar', e.target.files[0])

        formData.append('file', e.target.files[0])
        formData.append('timestamp', String((Date.now() / 1000) | 0))

        const data = await upload(formData, 'image')

        console.log('data', data)

        const avatarUpdatedData = {
          id: user.id,
          avatarFilename: data.url
        }

        api.patch('/api/avatar', avatarUpdatedData).then(response => {
          updateUser(response.data)

          addToast({
            type: 'success',
            title: 'Avatar updated'
          })
        })
      }
    },
    [addToast, updateUser]
  )

  return (
    <Container>
      <Head>
        <title>WeDo - Profile</title>
      </Head>
      <header>
        <div>
          <Link href="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user?.name,
            email: user?.email
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            {user?.avatar !== undefined ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div>
                <p>{user?.name?.charAt(0)}</p>
              </div>
            )}
            <label htmlFor="avatar">
              <FiCamera size={20} />
              <input
                data-testid="input-file"
                type="file"
                id="avatar"
                onChange={handleAvatarChange}
              />
            </label>
          </AvatarInput>

          <h1>My profile</h1>

          <Input name="name" icon={FiUser} placeholder="Name" />

          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Old password"
          />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="New password"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirm new password"
          />

          <Button type="submit">Update profile</Button>
        </Form>
      </Content>
    </Container>
  )
}
