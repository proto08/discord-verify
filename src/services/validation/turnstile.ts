interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
  action?: string
  cdata?: string
}

// Cloudflare returns HTTP 200 with `success: false` for invalid tokens,
// so the caller must check the returned boolean, not just rely on exceptions.
export async function validateToken(token: string, remoteIp?: string): Promise<boolean> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY as string,
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to verify token')
    }

    const result = (await response.json()) as TurnstileVerifyResponse
    if (result.success !== true) {
      console.error('Turnstile verification failed:', result['error-codes'])
      return false
    }

    return true
  } catch (error) {
    console.log('Error in verify csrf token:', error)
    throw error
  }
}
