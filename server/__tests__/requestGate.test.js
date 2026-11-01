import { describe, expect, it } from 'vitest'
import { requestAllowed } from '../requestGate.mjs'

const host = '127.0.0.1:5199'

describe('requestAllowed', () => {
  it('lets the live site and local dev through', () => {
    expect(requestAllowed({ origin: 'https://nnnsightnnn.github.io', host })).toBe(true)
    expect(requestAllowed({ origin: 'http://localhost:5173', host })).toBe(true)
  })

  it('refuses other sites, no origin and rebinding hosts', () => {
    expect(requestAllowed({ origin: 'https://evil.example', host })).toBe(false)
    expect(requestAllowed({ origin: 'https://nnnsightnnn.github.io.evil.example', host })).toBe(false)
    expect(requestAllowed({ host })).toBe(false)
    expect(requestAllowed({ origin: 'https://nnnsightnnn.github.io', host: 'evil.example:5199' })).toBe(false)
  })
})
