import { VercelRequest, VercelResponse } from '@vercel/node'
import { sign } from 'jsonwebtoken'
import AppError from '../../utils/AppError'
import authConfig from '../../config/auth'
import connectToDatabase from '../../database/mongoDBConfig'
import HashProvider from '../../providers/HashProvider/BCryptHashProvider'

export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method === 'POST') {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const { email, password } = request.body

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('users')

    const user = await collection.findOne({
      email
    })

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    const hashProvider = new HashProvider()

    const passwordMatched = await hashProvider.compareHash(
      password,
      user.password
    )

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    const userWithoutPassword = {
      name: user.name,
      email: user.email,
      id: user.id
    }

    return response.json({ user: userWithoutPassword, token })
  } else {
    response.status(405).json({ message: 'We only support POST' })
  }
}
