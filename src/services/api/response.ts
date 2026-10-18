import { NextResponse } from 'next/server'

export function Ok<T>(data?: T): NextResponse<T | Record<string, never>> {
  return NextResponse.json(data ?? {}, { status: 200 })
}

export interface ErrorResponseDto {
  message?: string
}

export function BadRequest(): NextResponse<ErrorResponseDto> {
  return NextResponse.json({ message: 'BadRequest' }, { status: 401 })
}

export function InternalServerError(): NextResponse<ErrorResponseDto> {
  return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
}
