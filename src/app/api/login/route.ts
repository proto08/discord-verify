import crypto from 'node:crypto'
import { getIronSession } from 'iron-session'
import { type NextRequest, NextResponse } from 'next/server'
import type { SessionData } from '@/entities/session'
import { sessionOptions } from '@/services/session'

export async function GET(req: NextRequest) {
  const res = new NextResponse()
  const session = await getIronSession<SessionData>(req, res, sessionOptions)

  const state = crypto.randomBytes(32).toString('hex')
  session.state = state
  await session.save()

  const authorizeUrl = new URL('https://discord.com/oauth2/authorize')
  authorizeUrl.searchParams.set('client_id', process.env.CLIENT_ID ?? '')
  authorizeUrl.searchParams.set('response_type', 'code')
  authorizeUrl.searchParams.set('redirect_uri', `${process.env.BASE_URL}/api/callback`)
  authorizeUrl.searchParams.set('scope', 'identify')
  authorizeUrl.searchParams.set('state', state)

  return NextResponse.redirect(authorizeUrl, { headers: res.headers })
}
