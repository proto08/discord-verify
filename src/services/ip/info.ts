import type { IpInfoDto } from '@/entities/user'

export async function getIpInfo(ip: string): Promise<IpInfoDto> {
  try {
    const response = await fetch(`https://ipinfo.io/${ip}/json`)

    if (!response.ok) {
      throw new Error(`Failed to fetch IP info: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.log('Error in getIpInfo:', error)
    throw error
  }
}
