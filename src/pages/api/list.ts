import { VercelRequest, VercelResponse } from '@vercel/node'
import AppError from '../../utils/AppError'
import connectToDatabase from '../../database/mongoDBConfig'

export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method === 'POST') {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const { id, list_name, id_user } = request.body

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('lists')

    const checkListExists = await collection.findOne({
      list_name,
      id_user
    })

    if (checkListExists) {
      throw new AppError('List already used.')
    }

    await collection.insertOne({
      id,
      list_name,
      id_user,
      tasks: []
    })

    const list = await collection.findOne({
      list_name
    })

    return response.json(list)
  } else if (request.method === 'PATCH') {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const { user_id } = request.body.data

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('lists')

    const cursor = collection.find({
      id_user: user_id
    })

    const allValues = await cursor.toArray()

    await cursor.close()

    if (!allValues) {
      throw new AppError('User does not exist')
    }

    return response.json(allValues)
  } else if (request.method === 'PUT') {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const { id, id_user, list_name } = request.body

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('lists')

    const list = await collection.findOne({
      id,
      id_user
    })

    if (!list) {
      throw new AppError('List not found.')
    }

    await collection.findOneAndUpdate(
      {
        id,
        id_user
      },
      {
        $set: {
          list_name: list_name
        }
      },
      { returnOriginal: false }
    )

    const listUpdated = await collection.findOne({
      id,
      id_user
    })

    return response.json(listUpdated)
  } else {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const { id, id_user } = request.body

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('lists')

    await collection.deleteOne({
      id,
      id_user
    })

    return response.status(204).json({ message: 'List deleted' })
  }
}
