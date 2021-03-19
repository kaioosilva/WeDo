import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactLoading from 'react-loading'
import { v4 as uuidv4 } from 'uuid'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import Input from './Input'
import api from '../services/api'
import * as Yup from 'yup'
import { useAuth } from '../hooks/Auth'
import { useToast } from '../hooks/Toast'

import AddModal from '../components/Modal/AddModal'
import EditModal from '../components/Modal/EditModal'

import { FiList, FiEdit3 } from 'react-icons/fi'
import { AiOutlineDelete } from 'react-icons/ai'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { IoMdAddCircleOutline } from 'react-icons/io'

import getValidationErrors from '../utils/getValidationErrors'

import Dropdown from './Dropdown'

import {
  Container,
  LoadingContainer,
  ItemContainer
} from '../styles/components/TodoList'

interface ListFormData {
  id: number
  list: string
  disabled: boolean
}

const optionsDropdown = [
  {
    id: 1,
    name: 'Add task'
  },
  // {
  //   id: 2,
  //   name: 'Edit list'
  // },
  {
    id: 3,
    name: 'Remove list'
  }
]

export default function TodoList() {
  const { user } = useAuth()
  const { addToast } = useToast()

  const formRef = useRef<FormHandles>(null)
  const [todoList, setTodoList] = useState([])
  const [indexRef, setIndexRef] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isNewTask, setIsNewTask] = useState(false)
  const [isEditTask, setIsEditTask] = useState(false)

  const [idList, setIdList] = useState('')
  const [idTask, setIdTask] = useState('')
  const [idSubtask, setIdSubtask] = useState('')

  const [taskName, setTaskName] = useState('')

  const tentRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    getlistData()
  }, [])

  async function getlistData() {
    const { data } = await api.patch('/api/list', {
      data: {
        user_id: user.id
      }
    })

    const newData = data.map(obj => ({ ...obj, disabled: true }))
    setTodoList(newData)
    setLoading(true)
  }

  useEffect(() => {
    if (tentRefs) {
      tentRefs?.current[indexRef]?.focus()
      setIndexRef(null)
    }
  }, [todoList, getlistData, indexRef])

  const handleListSubmit = useCallback(
    async (data: ListFormData) => {
      try {
        formRef.current?.setErrors({})
        const schema = Yup.object().shape({
          list: Yup.string().required('List name required')
        })

        await schema.validate(data, {
          abortEarly: false
        })

        setTodoList(todoList => [
          ...todoList,
          { id: uuidv4(), list_name: data.list, disabled: true }
        ])

        const newData = { id: uuidv4(), list_name: data.list, id_user: user.id }

        await api.post('/api/list', newData)

        formRef.current.reset()

        addToast({
          type: 'success',
          title: 'New list created',
          description: 'Your list was succesffully created'
        })

        getlistData()
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)

          return
        }
      }
    },
    [addToast, todoList, getlistData]
  )

  const handleDropdown = useCallback(
    async (value, id, indexOption) => {
      //delete item of list
      if (value === 3) {
        const newList = todoList.filter(item => item.id !== id)

        tentRefs.current.splice(indexOption, 1)

        await api.delete('/api/list', {
          data: {
            id_user: user.id,
            id
          }
        })

        addToast({
          type: 'success',
          title: 'List deleted',
          description: 'Your list was succesffully deleted'
        })

        setTodoList(newList)

        getlistData()

        //update item of list
      } else if (value === 2) {
        const newArray = todoList.map((item, index) => {
          if (item.id === id) {
            setIndexRef(index)
            return { ...item, disabled: false }
          }

          return item
        })

        setTodoList(newArray)
      } else {
        handleAddTask(id, true, '')
      }
    },
    [
      todoList,
      idList,
      isNewTask,
      isAddModalOpen,
      indexRef,
      addToast,
      getlistData
    ]
  )

  const handleOnChange = useCallback(
    (event, id) => {
      const newArray = todoList.map(item => {
        if (item.id === id) {
          return { ...item, list_name: event.target.value }
        }

        return item
      })
      setTodoList(newArray)
    },
    [todoList]
  )

  const handleKeyDown = useCallback(
    async (event, id, indexOption) => {
      if (event.key === 'Enter') {
        if (event.target.value === '') {
          const newList = todoList.filter(item => item.id !== id)

          tentRefs.current.splice(indexOption, 1)
          setTodoList(newList)

          return
        }

        const newArray = todoList.map(item => {
          if (item.id === id) {
            return { ...item, disabled: true }
          }

          return item
        })

        setIndexRef(indexOption)
        setTodoList(newArray)

        const formData = {
          id_user: user.id,
          id,
          list_name: newArray[indexOption].list_name
        }

        await api.put('/api/list', formData)

        addToast({
          type: 'success',
          title: 'List updated',
          description: 'Your list name was succesffully updated'
        })
      }
    },
    [todoList, addToast, indexRef]
  )

  const handleRefs = useCallback(ref => {
    const existRef = tentRefs.current.indexOf(ref)

    if (existRef < 0) {
      if (ref) {
        tentRefs.current.push(ref)
      }
    }
  }, [])

  const closeModal = useCallback(() => {
    setIsAddModalOpen(false)
    setIsEditModalOpen(false)
    setLoading(false)
    getlistData()
  }, [getlistData, loading, isAddModalOpen, isEditModalOpen])

  const handleAddTask = useCallback(
    (idList, isTask, idTask) => {
      setIdList(idList)
      setIsNewTask(isTask)
      setIdTask(idTask)
      setIsAddModalOpen(true)
    },
    [idList, isNewTask, idTask, isAddModalOpen]
  )

  const handleUpdateTask = useCallback(
    (idTask, taskName, listId, idSubtask) => {
      if (idSubtask === '') {
        setIsEditTask(true)
      } else {
        setIsEditTask(false)
      }
      setIdList(listId)
      setIdTask(idTask)
      setIdSubtask(idSubtask)
      setTaskName(taskName)

      setIsEditModalOpen(true)
    },
    [idTask, isEditTask, isEditModalOpen, idList, taskName, idSubtask]
  )

  const handleDeleteTask = useCallback(
    async (idTask, listId, idSubtask, indexSubtask) => {
      if (idSubtask === '') {
        await api.delete('/api/task', {
          data: {
            id_user: user.id,
            id_list: listId,
            id_task: idTask
          }
        })

        addToast({
          type: 'success',
          title: 'Task deleted',
          description: 'Your task was succesffully deleted'
        })
      } else {
        await api.delete('/api/subtask', {
          data: {
            id_user: user.id,
            id_list: listId,
            id_task: idTask,
            id_subtask: idSubtask,
            index_subtask: indexSubtask
          }
        })

        addToast({
          type: 'success',
          title: 'Task deleted',
          description: 'Your task was succesffully deleted'
        })
      }

      setLoading(false)
      getlistData()
    },
    [getlistData, loading, addToast]
  )

  const handleDoneTask = useCallback(
    async (idTask, taskName, listId, done) => {
      try {
        const newData = {
          id_list: listId,
          task_name: taskName,
          id_user: user.id,
          id_task: idTask,
          done
        }
        await api.put('/api/task', newData)
      } catch (err) {}

      getlistData()
    },
    [getlistData]
  )

  const handleDoneSubtask = useCallback(
    async (idTask, taskName, listId, done, idSubtask) => {
      try {
        const newData = {
          id_list: listId,
          subtask_name: taskName,
          id_user: user.id,
          id_task: idTask,
          done,
          id_subtask: idSubtask
        }
        await api.put('/api/subtask', newData)
      } catch (err) {}

      getlistData()
    },
    [getlistData]
  )

  return (
    <Container>
      {isAddModalOpen && (
        <AddModal
          onCloseModal={closeModal}
          isNewTask={isNewTask}
          idList={idList}
          id_user={user.id}
          idTask={idTask}
        />
      )}

      {isEditModalOpen && (
        <EditModal
          onCloseModal={closeModal}
          isEditTask={isEditTask}
          idList={idList}
          id_user={user.id}
          id_task={idTask}
          id_subtask={idSubtask}
          taskName={taskName}
        />
      )}
      <h1>Your Tasks</h1>

      <Form ref={formRef} onSubmit={handleListSubmit}>
        <Input name="list" icon={FiList} placeholder="Create a new list" />
      </Form>
      {!loading ? (
        <LoadingContainer>
          <ReactLoading
            type="spin"
            color="#999591"
            height={'16%'}
            width={'16%'}
          />
        </LoadingContainer>
      ) : (
        <ul id="listContainer">
          {todoList.map((list, index) => {
            return (
              <div key={list.id}>
                <ItemContainer>
                  <li key={list.id}>
                    <input
                      type="text"
                      value={list.list_name}
                      onChange={e => handleOnChange(e, list.id)}
                      // disabled={list.disabled}
                      disabled
                      onKeyDown={e => handleKeyDown(e, list.id, index)}
                      ref={ref => {
                        handleRefs(ref)
                      }}
                    />
                  </li>
                  {list?.tasks?.length > 0 && (
                    <>
                      <ul id="taskContainer">
                        {list?.tasks?.map((task, index) => {
                          return (
                            <React.Fragment key={task.id}>
                              <li key={task.id}>
                                <input
                                  type="checkbox"
                                  // checked={task.done}
                                  defaultChecked={task.done}
                                  onChange={() =>
                                    handleDoneTask(
                                      task.id,
                                      task.task_name,
                                      list.id,
                                      !task.done
                                    )
                                  }
                                />
                                <input
                                  type="text"
                                  value={task.task_name}
                                  disabled
                                  onKeyDown={e =>
                                    handleKeyDown(e, task.id, index)
                                  }
                                  style={
                                    task.done
                                      ? {
                                          textDecoration: 'line-through'
                                        }
                                      : {
                                          textDecoration: 'none'
                                        }
                                  }
                                />
                                <IoMdAddCircleOutline
                                  size={20}
                                  onClick={() =>
                                    handleAddTask(list.id, false, task.id)
                                  }
                                />
                                <FiEdit3
                                  size={20}
                                  onClick={() =>
                                    handleUpdateTask(
                                      task.id,
                                      task.task_name,
                                      list.id,
                                      ''
                                    )
                                  }
                                />
                                <AiOutlineDelete
                                  size={20}
                                  onClick={() =>
                                    handleDeleteTask(task.id, list.id, '', 0)
                                  }
                                />
                              </li>
                              {task?.subtask?.length > 0 && (
                                <>
                                  <ul id="subtaskContainer">
                                    {task?.subtask?.map((subtask, index) => {
                                      return (
                                        <li key={subtask.id}>
                                          <input
                                            type="checkbox"
                                            defaultChecked={subtask.done}
                                            onChange={() =>
                                              handleDoneSubtask(
                                                task.id,
                                                subtask.subtask_name,
                                                list.id,
                                                !subtask.done,
                                                subtask.id
                                              )
                                            }
                                          />
                                          <input
                                            type="text"
                                            value={subtask.subtask_name}
                                            disabled
                                            onKeyDown={e =>
                                              handleKeyDown(
                                                e,
                                                subtask.id,
                                                index
                                              )
                                            }
                                            style={
                                              subtask.done
                                                ? {
                                                    textDecoration:
                                                      'line-through'
                                                  }
                                                : {
                                                    textDecoration: 'none'
                                                  }
                                            }
                                          />
                                          <FiEdit3
                                            size={20}
                                            onClick={() =>
                                              handleUpdateTask(
                                                task.id,
                                                subtask.subtask_name,
                                                list.id,
                                                subtask.id
                                              )
                                            }
                                          />
                                          <AiOutlineDelete
                                            size={20}
                                            onClick={() =>
                                              handleDeleteTask(
                                                task.id,
                                                list.id,
                                                subtask.id,
                                                index
                                              )
                                            }
                                          />
                                        </li>
                                      )
                                    })}
                                  </ul>
                                </>
                              )}
                            </React.Fragment>
                          )
                        })}
                      </ul>
                    </>
                  )}
                </ItemContainer>
                <Dropdown
                  icon={HiOutlineDotsVertical}
                  options={optionsDropdown}
                  onClick={handleDropdown}
                  id={list.id}
                />
              </div>
            )
          })}
        </ul>
      )}
    </Container>
  )
}
