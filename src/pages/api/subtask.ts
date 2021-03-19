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

    const { id_list, id_user, subtask_name, idTask } = request.body

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('lists')

    const checkListExists = await collection.findOne({
      id: id_list,
      id_user
    })

    if (!checkListExists) {
      throw new AppError('List does not exist.')
    }

    const newSubtask = {
      id: uuidv4(),
      subtask_name,
      done: false
    }

    const newArraySubtask = checkListExists.tasks.map(task => {
      if (task.id === idTask) {
        task.subtask.push(newSubtask)
        return task
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
          tasks: newArraySubtask
        }
      },
      { returnOriginal: false }
    )

    return response.json({ message: 'Subtask created' })
  } else if (request.method === 'PUT') {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const {
      id_list,
      id_user,
      subtask_name,
      id_task,
      id_subtask,
      done
    } = request.body

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
        const newSubtask = task.subtask.map(subtask => {
          if (subtask.id === id_subtask) {
            let getDone = null
            if (done === undefined) {
              getDone = subtask.done
            }
            return { ...subtask, subtask_name, done: done ? done : getDone }
          }

          return subtask
        })

        return { ...task, subtask: newSubtask }
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

    return response.json({ message: 'Subtask updated' })
  } else {
    if (!request.body) {
      response.statusCode = 404
      response.end('Error')
      return
    }

    const {
      id_list,
      id_user,
      id_task,
      id_subtask,
      index_subtask
    } = request.body

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
        task.subtask.map(subtask => {
          if (subtask.id === id_subtask) {
            task.subtask.splice(index_subtask, 1)
            return task
          }
        })
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

    return response.status(204).json({ message: 'Subtask deleted' })
  }
}
