import { VercelRequest, VercelResponse } from '@vercel/node'
import AppError from '../../utils/AppError'
import { v4 as uuidv4 } from 'uuid'

import connectToDatabase from '../../database/mongoDBConfig'

export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method === 'POST') {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const { id_list, id_user, task_name } = request.body

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('lists')

    const checkListExists = await collection.findOne({
      id: id_list,
      id_user
    })

    if (!checkListExists) {
      throw new AppError('List does not exist.')
    }

    const newTask = {
      id: uuidv4(),
      task_name,
      done: false,
      subtask: []
    }

    checkListExists.tasks.push(newTask)

    await collection.findOneAndUpdate(
      {
        id: id_list,
        id_user
      },
      {
        $set: {
          tasks: checkListExists.tasks
        }
      },
      { returnOriginal: false }
    )

    return response.json({ message: 'ok' })
  } else if (request.method === 'PUT') {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const { id_list, id_user, task_name, id_task, done } = request.body

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('lists')

    const checkListExists = await collection.findOne({
      id: id_list,
      id_user
    })

    if (!checkListExists) {
      throw new AppError('List does not exist.')
    }

    const newTask = checkListExists.tasks.map(task => {
      if (task.id === id_task) {
        let getDone = null
        if (done === undefined) {
          getDone = task.done
        }
        return { ...task, task_name, done: done ? done : getDone }
      }

      return task
    })

    await collection.findOneAndUpdate(
      {
        id: id_list,
        id_user
      },
      {
        $set: {
          tasks: newTask
        }
      },
      { returnOriginal: false }
    )

    return response.json({ message: 'ok' })
  } else {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const { id_list, id_user, id_task } = request.body

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('lists')

    const checkListExists = await collection.findOne({
      id: id_list,
      id_user
    })

    if (!checkListExists) {
      throw new AppError('List does not exist.')
    }

    const newTask = checkListExists.tasks.filter(task => task.id !== id_task)

    await collection.findOneAndUpdate(
      {
        id: id_list,
        id_user
      },
      {
        $set: {
          tasks: newTask
        }
      },
      { returnOriginal: false }
    )

    return response.status(204).json({ message: 'Task deleted' })
  }
}
