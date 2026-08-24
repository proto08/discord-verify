import { getIronSession } from 'iron-session'
import { type NextRequest, NextResponse } from 'next/server'
import type { SessionData } from '@/entities/session'
import { sessionOptions } from '@/services/session'

export async function GET(req: NextRequest) {
  const res = new NextResponse()
  try {
    const session = await getIronSession<SessionData>(req, res, sessionOptions)
    const code = req.nextUrl.searchParams.get('code')
    const state = req.nextUrl.searchParams.get('state')

    if (!code || !state || !session.state || state !== session.state) {
      console.error('Invalid OAuth callback: missing or mismatched code/state', {
        code: !!code,
        state: !!state,
        sessionState: !!session.state,
        match: state === session.state,
      })
      session.state = undefined
      await session.save()
      return NextResponse.redirect(new URL('/verify/error', process.env.BASE_URL), {
        headers: res.headers,
      })
    }

    session.code = code
    session.state = undefined
    await session.save()

    return NextResponse.redirect(new URL('/verify', process.env.BASE_URL), {
      headers: res.headers,
    })
  } catch (error) {
    console.error('Error in api/callback:', error)
    return NextResponse.redirect(new URL('/verify/error', process.env.BASE_URL))
  }
}
