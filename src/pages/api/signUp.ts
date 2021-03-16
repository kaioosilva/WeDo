import { VercelRequest, VercelResponse } from '@vercel/node'
import { v4 as uuidv4 } from 'uuid'
import AppError from '../../utils/AppError'
import connectToDatabase from '../../database/mongoDBConfig'
import HashProvider from '../../providers/HashProvider/BCryptHashProvider'

export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method === 'POST') {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const { name, email, password } = request.body

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('users')

    const checkUserExists = await collection.findOne({
      email
    })

    if (checkUserExists) {
      throw new AppError('Email address already used.')
    }

    const hashProvider = new HashProvider()

    const hashedPassword = await hashProvider.generateHash(password)

    await collection.insertOne({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      avatar: null
    })

    const user = await collection.findOne({
      email
    })

    const userWithoutPassword = {
      name: user.name,
      email: user.email,
      id: user._id,
      avatar: user.avatar
    }

    return response.json(userWithoutPassword)
  } else {
    response.status(405).json({ message: 'We only support POST' })
  }
}
