import asnList from '@/services/vpn/asn.json'

export function getASN(org: string): number | null {
  try {
    const match = org?.match(/AS(\d+)/)
    if (match && match[1]) {
      return parseInt(match[1], 10)
    }
    console.error('No ASN found')
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}

export function usingVpn(org: string): boolean {
  const asn = getASN(org)
  if (!asn) return false
  return asnList.includes(asn)
}
