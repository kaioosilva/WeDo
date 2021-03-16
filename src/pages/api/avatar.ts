import { VercelRequest, VercelResponse } from '@vercel/node'
import AppError from '../../utils/AppError'
import connectToDatabase from '../../database/mongoDBConfig'
import HashProvider from '../../providers/HashProvider/BCryptHashProvider'

export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method === 'PATCH') {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const { id, avatarFilename } = request.body

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('users')

    const user = await collection.findOne({
      id
    })

    if (!user) {
      throw new AppError('Only authenticated users can change avatar')
    }

    await collection.findOneAndUpdate(
      {
        id
      },
      { $set: { avatar: avatarFilename } },
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
    response.status(405).json({ message: 'We only support PATCH' })
  }
}
