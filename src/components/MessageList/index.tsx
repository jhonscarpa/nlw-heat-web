import { api } from '../../services/api'
import styles from './styles.module.scss'
import logoImg from '../../assets/logo.svg'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

type Message = {
  id: string
  text: string
  user: {
    name: string
    avatar_url: string
  }
}

const messagesQueue: Message[] = []

const socket = io('http://localhost:4000')

socket.on('new_message', (newMessage: Message) => {
  messagesQueue.push(newMessage)
})

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState =>
          [...messages, messagesQueue[0], prevState[0], prevState[1]].filter(
            Boolean,
          ),
        )
        messagesQueue.shift()
      }
    }, 3000)
  }, [])

  useEffect(() => {
    api.get<Message[]>('messages/last3').then(response => {
      setMessages(response.data)
    })
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />
      <ul className={styles.messageList}>
        {messages.map((data, index) => {
          return (
            <li className={styles.message} key={index}>
              <p className={styles.messageContent}>{data.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={data.user.avatar_url} alt={data.user.name} />
                </div>
                <span>{data.user.name}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
