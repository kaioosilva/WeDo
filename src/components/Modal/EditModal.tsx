import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef } from 'react'
import { FiList } from 'react-icons/fi'
import * as Yup from 'yup'
import { useToast } from '../../hooks/Toast'
import api from '../../services/api'
import { Container, Overlay } from '../../styles/components/Modal/AddModal'
import getValidationErrors from '../../utils/getValidationErrors'
import Button from '../Button'
import Input from '../Input'

interface ListFormData {
  id: number
  task: string
  done: boolean
}

interface EditModalProps {
  onCloseModal: () => void
  isEditTask: boolean
  idList: string
  id_user: string
  id_task: string
  id_subtask?: string
  taskName: string
}

const EditModal: React.FC<EditModalProps> = ({
  onCloseModal,
  isEditTask,
  idList,
  id_user,
  id_task,
  taskName,
  id_subtask
}) => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()

  const closeModal = useCallback(() => {
    onCloseModal()
  }, [])

  const handleListSubmit = useCallback(
    async (data: ListFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          task: Yup.string().required('task required')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        let newData = {}

        if (isEditTask) {
          newData = { id_list: idList, task_name: data.task, id_user, id_task }

          await api.put('/api/task', newData)

          addToast({
            type: 'success',
            title: 'Task updated',
            description: 'Your task was succesffully updated'
          })
        } else {
          newData = {
            id_list: idList,
            subtask_name: data.task,
            id_user,
            id_task,
            id_subtask
          }

          await api.put('/api/subtask', newData)

          addToast({
            type: 'success',
            title: 'Subtask updated',
            description: 'Your subtask was succesffully updated'
          })
        }

        formRef.current.reset()
        onCloseModal()
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }
      }
    },
    [addToast]
  )

  return (
    <Overlay>
      <Container>
        {isEditTask ? <h1>Edit task</h1> : <h1>Edit subtask</h1>}

        <Form ref={formRef} onSubmit={handleListSubmit}>
          {isEditTask ? (
            <Input
              name="task"
              icon={FiList}
              placeholder="Edit task"
              defaultValue={taskName}
            />
          ) : (
            <Input
              name="task"
              icon={FiList}
              placeholder="Edit Subtask"
              defaultValue={taskName}
            />
          )}
        </Form>

        <Button onClick={closeModal}>Cancel</Button>
      </Container>
    </Overlay>
  )
}

export default EditModal
