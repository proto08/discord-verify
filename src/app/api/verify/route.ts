import { getIronSession } from 'iron-session'
import { type NextRequest, NextResponse } from 'next/server'
import type { SessionData } from '@/entities/session'
import { BadRequest, InternalServerError, Ok } from '@/services/api/response'
import { getAccessToken } from '@/services/discord/oauth'
import { assignRole } from '@/services/discord/role'
import { getUserInfo } from '@/services/discord/user'
import { sendWebhook } from '@/services/discord/webhook'
import { getIpInfo } from '@/services/ip/info'
import { sessionOptions } from '@/services/session'
import { validateToken } from '@/services/validation/turnstile'
import { usingVpn } from '@/services/vpn/vpn-check'

export async function POST(req: NextRequest) {
  const res = new NextResponse()
  const session = await getIronSession<SessionData>(req, res, sessionOptions)
  try {
    const body = await req.json()
    const { token } = body
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || ''
    const userAgent = req.headers.get('user-agent') || ''

    if (userAgent.length > 256) {
      console.error('User-Agent too long', { length: userAgent.length })
      return BadRequest()
    }
    if (!token || !session.code) {
      console.error('Missing required parameters: token or session.code not found', {
        token: !!token,
        code: !!session.code,
      })
      return BadRequest()
    }

    await validateToken(token)
    const getTokenResult = await getAccessToken(session.code)
    const user = await getUserInfo(getTokenResult.access_token)
    const ipInfo = await getIpInfo(ip)
    const isVpn = usingVpn(ipInfo.org)

    if (isVpn) {
      await sendWebhook({
        logger: {
          ...user,
          ipinfo: ipInfo,
          userAgent,
        },
        type: 'vpn',
      })
      return BadRequest()
    } else {
      await assignRole(user.id.toString())
      await sendWebhook({
        logger: {
          ...user,
          ipinfo: ipInfo,
          userAgent,
        },
        type: 'success',
      })
    }

    session.code = undefined
    await session.save()

    return Ok()
  } catch (error) {
    console.error('Error in /api/verify:', error)

    session.code = undefined
    await session.save()

    return InternalServerError()
  }
}
