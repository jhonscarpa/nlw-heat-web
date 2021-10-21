import { api } from '../../services/api'
import styles from './styles.module.scss'
import logoImg from '../../assets/logo.svg'
import { useEffect, useState } from 'react'

type Message = {
  id: string
  text: string
  user: {
    name: string
    avatar_url: string
  }
}

export function MessageList() {
  const [messages, setMessases] = useState<Message[]>([])
  useEffect(() => {
    api.get<Message[]>('messages/last3').then(response => {
      setMessases(response.data)
    })
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />
      <ul className={styles.messageList}>
        {messages.map(data => {
          return (
            <li className={styles.message} key={data.id}>
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
