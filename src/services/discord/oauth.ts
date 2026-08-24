interface GetAccessToken {
  token_type: string
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
}

export async function getAccessToken(code: string): Promise<GetAccessToken> {
  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${process.env.BASE_URL}/api/callback`,
    }).toString()

    const response = await fetch(`${process.env.DISCORD_API}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'),
      },
      body: body,
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.log('Error in get token from discord:', error)
    throw error
  }
}
