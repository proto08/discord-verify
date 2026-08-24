import { NextResponse } from 'next/server'

export interface ResponseDto<T> {
  data?: T
}

export function Ok<T>(data?: T): NextResponse<T | Record<string, never>> {
  return NextResponse.json(data ?? {}, { status: 200 })
}

export function Created<T>(data?: T): NextResponse<T | Record<string, never>> {
  return NextResponse.json(data ?? {}, { status: 201 })
}

export function Updated<T>(data?: T): NextResponse<T | Record<string, never>> {
  return NextResponse.json(data ?? {}, { status: 200 })
}

export interface ErrorResponseDto {
  message?: string
}

export function NotFound(): NextResponse<ErrorResponseDto> {
  return NextResponse.json({ message: 'Resource Not Found' }, { status: 404 })
}

export function BadRequest(): NextResponse<ErrorResponseDto> {
  return NextResponse.json({ message: 'BadRequest' }, { status: 401 })
}

export function Unauthorized(): NextResponse<ErrorResponseDto> {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
}

export function Forbidden(): NextResponse<ErrorResponseDto> {
  return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
}

export function UnprocessableEntity(): NextResponse<ErrorResponseDto> {
  return NextResponse.json({ message: 'Unprocessable Entity' }, { status: 422 })
}

export function InternalServerError(): NextResponse<ErrorResponseDto> {
  return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
}
