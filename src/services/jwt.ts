import type { JwtClaims } from "@/contracts/api-contracts";

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const b64 = padded + "=".repeat(padLen);

  const bytes = atob(b64);
  return decodeURIComponent(
    bytes
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join(""),
  );
}


function base64UrlEncode(input: string): string {
  const utf8 = unescape(encodeURIComponent(input));
  return btoa(utf8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeJwt(token: string): JwtClaims {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('[jwt] Malformed token: expected 3 dot-separated parts');
  }
  const payloadPart = parts[1];
  if (!payloadPart) {
    throw new Error('[jwt] Malformed token: missing payload');
  }
  const json = base64UrlDecode(payloadPart);
  return JSON.parse(json) as JwtClaims;
}


export function forgeMockJwt(claims: JwtClaims): string {
  const header = { alg: 'none', typ: 'JWT' };
  const headerPart = base64UrlEncode(JSON.stringify(header));
  const payloadPart = base64UrlEncode(JSON.stringify(claims));
  return `${headerPart}.${payloadPart}.mocksig`;
}


export function isExpired(claims: JwtClaims, nowSec: number = Date.now() / 1000): boolean {
  return claims.exp <= nowSec;
}