import type { UserDto } from '@/entities/user'

export async function getUserInfo(accessToken: string): Promise<UserDto> {
  try {
    const response = await fetch(`https://discord.com/api/users/@me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`)
    }

    const data = await response.json()
    return {
      id: data.id,
      username: data.username,
      global_name: data.global_name || data.username,
      avatar_id: data.avatar || '',
      locale: data.locale || 'en',
      mfa_enabled: data.mfa_enabled || false,
    }
  } catch (error) {
    console.log('Error in getInfo:', error)
    throw error
  }
}
