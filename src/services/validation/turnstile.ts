export async function validateToken(token: string) {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY as string,
        response: token,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to verify token')
    }

    return await response.json()
  } catch (error) {
    console.log('Error in verify csrf token:', error)
    throw error
  }
}
