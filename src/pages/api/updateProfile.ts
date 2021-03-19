import { VercelRequest, VercelResponse } from '@vercel/node'
import AppError from '../../utils/AppError'
import connectToDatabase from '../../database/mongoDBConfig'
import HashProvider from '../../providers/HashProvider/BCryptHashProvider'

export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method === 'PUT') {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const { id, name, email, old_password, password } = request.body

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('users')

    const user = await collection.findOne({
      id
    })

    if (!user) {
      throw new AppError('User not found.')
    }

    const userWithUpdatedEmail = await collection.findOne({
      email
    })

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== id) {
      throw new AppError('Email already in use.')
    }

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new passord.'
      )
    }

    let newPassword = ''

    if (password && old_password) {
      const hashProvider = new HashProvider()
      const checkPassword = hashProvider.compareHash(
        old_password,
        user.password
      )

      if (!checkPassword) {
        throw new AppError('Old password does not match.')
      }

      newPassword = await hashProvider.generateHash(password)
    }

    await collection.findOneAndUpdate(
      {
        id
      },
      {
        $set: {
          name: name,
          email: email,
          password: newPassword !== '' ? newPassword : user.password
        }
      },
      { returnOriginal: false }
    )

    const userUpdated = await collection.findOne({
      id
    })

    const userWithoutPassword = {
      name: userUpdated.name,
      email: userUpdated.email,
      id: userUpdated.id,
      avatar: userUpdated.avatar
    }

    return response.json(userWithoutPassword)
  } else {
    response.status(405).json({ message: 'We only support PUT' })
  }
}
