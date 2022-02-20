import createBox from 'blackbox.js'

export const appBox = createBox({
  user: null,
  messages: [],
  users: [],
})

export const appMutations = {
  setUser(user) {
    appBox.set((state) => {
      state.user = user
      return state
    })
  },
  setUsers(users) {
    appBox.set((state) => {
      state.users = users

      return state
    })
  },
  pushMessage(message) {
    appBox.set((state) => {
      state.messages = [...state.messages, message]
      return state
    })
  },
}
