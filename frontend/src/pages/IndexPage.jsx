import React, { useState } from 'react'
import { useBox } from 'blackbox.js'
import { PaperAirplaneIcon } from '@heroicons/react/outline'

import { appBox, appMutations } from '@/contexts/app'
import { getUserImage } from '@/services/images'

const socket = new WebSocket('ws://localhost:1337')

socket.onmessage = (rawMessage) => {
  const message = JSON.parse(rawMessage.data)
  console.log(message)

  switch (message.type) {
    case 'CONNECTION':
    case 'DISCONNECTION':
    case 'MESSAGE': {
      return appMutations.pushMessage(message.data)
    }

    case 'CONNECTED_CLIENTS': {
      return appMutations.setUsers(message.data)
    }
    case 'REGISTRATION': {
      return appMutations.setUser(message.data.username)
    }
  }
}

export default function IndexPage() {
  const app = useBox(appBox)
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    socket.send(message)
    setMessage('')
  }

  return (
    <div className="flex h-screen w-full bg-chat-black text-white">
      <nav className="flex w-64 flex-col gap-4 bg-chat-black-900 p-8 2xl:w-96">
        {app.users.map((user) => (
          <div className="flex items-center gap-4" key={user.id}>
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
            <img
              className="h-8 w-8 rounded-full"
              src={getUserImage(user.name)}
              alt={user.name}
            />
            <span>{user.name}</span>
          </div>
        ))}
      </nav>
      <main className="mx-auto h-full w-full max-w-screen-xl flex-1">
        <div className="flex h-[calc(100%-5rem)] flex-col gap-4 overflow-auto pt-6">
          {app.messages.map((message) =>
            message.user === 'Server' ? (
              <h1 className="text-center text-neutral-400">
                {message.message}
              </h1>
            ) : (
              <div
                className={`rounded-b-2xl  ${
                  message.user === app.user
                    ? 'ml-auto mr-4 rounded-tl-2xl bg-chat-blue'
                    : 'mr-auto ml-4 rounded-tr-2xl bg-chat-gray'
                } py-3 px-4`}
                key={message.id}
              >
                <p>{message.message}</p>
              </div>
            ),
          )}
        </div>
        <form
          className="mx-4 mt-auto flex h-20 items-center"
          onSubmit={(e) => e.preventDefault() || handleSubmit()}
        >
          <div className="mx-auto flex flex-1 gap-4 rounded-2xl bg-chat-gray py-3 px-6">
            <input
              type="text"
              placeholder="Your message..."
              className="w-full bg-transparent outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              aria-label="Send message"
              title="Send message"
            >
              <PaperAirplaneIcon className="h-6 w-6" />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
