export interface UserDto {
  id: number
  username: string
  global_name: string
  avatar_id: string
  locale: string
  mfa_enabled: boolean
}

export interface IpInfoDto {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
}

export interface LoggerDto extends UserDto {
  ipinfo: IpInfoDto
  userAgent: string
}
