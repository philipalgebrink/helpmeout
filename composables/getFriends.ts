import { ref, onMounted } from 'vue'
import { useCookie } from '#app'

export const useGetFriends = () => {
  const friends = ref([])
  const authCookie = useCookie('auth')

  const fetchFriends = async () => {
    const token = authCookie.value
    if (!token) {
      console.error('You need to be logged in to fetch friends.')
      return
    }

    try {
      const response = await fetch('/api/friends/get-friends', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await response.json()
      if (response.ok) {
        friends.value = result.friends
      } else {
        console.error('Failed to fetch friends:', result.error)
      }
    } catch (error) {
      console.error('Error fetching friends:', error)
    }
  }

  onMounted(() => {
    fetchFriends()
  })

  return {
    friends,
    fetchFriends
  }
}