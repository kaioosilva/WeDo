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

interface AddModalProps {
  onCloseModal: () => void
  isNewTask: boolean
  idList: string
  id_user: string
  idTask?: string
}

const ModalAdd: React.FC<AddModalProps> = ({
  onCloseModal,
  isNewTask,
  idList,
  id_user,
  idTask
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

        if (isNewTask) {
          newData = { id_list: idList, task_name: data.task, id_user }

          await api.post('/api/task', newData)

          addToast({
            type: 'success',
            title: 'Task created',
            description: 'Your task was succesffully created'
          })
        } else {
          newData = {
            id_list: idList,
            subtask_name: data.task,
            id_user,
            idTask
          }

          await api.post('/api/subtask', newData)

          addToast({
            type: 'success',
            title: 'Subtask created',
            description: 'Your subtask was succesffully created'
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
        {isNewTask ? <h1>Add new task</h1> : <h1>Add new subtask</h1>}

        <Form ref={formRef} onSubmit={handleListSubmit}>
          <Input name="task" icon={FiList} placeholder="Create a new task" />
        </Form>

        <Button onClick={closeModal}>Cancel</Button>
      </Container>
    </Overlay>
  )
}

export default ModalAdd
