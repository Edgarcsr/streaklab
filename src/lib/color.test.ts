import { describe, expect, it } from 'vitest'

import {
  hexToRgb,
  hsvToRgb,
  rgbString,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from '@/lib/color'

describe('hexToRgb', () => {
  it('parses six and three digit hex, with or without #', () => {
    expect(hexToRgb('#1c9a42')).toEqual([28, 154, 66])
    expect(hexToRgb('1C9A42')).toEqual([28, 154, 66])
    expect(hexToRgb('#fa0')).toEqual([255, 170, 0])
  })

  it('rejects anything else', () => {
    expect(hexToRgb('#12')).toBeNull()
    expect(hexToRgb('#gggggg')).toBeNull()
    expect(hexToRgb('')).toBeNull()
  })
})

describe('rgbToHex', () => {
  it('pads, rounds and clamps', () => {
    expect(rgbToHex([0, 0, 0])).toBe('#000000')
    expect(rgbToHex([255.4, 300, -5])).toBe('#ffff00')
  })
})

describe('HSV round trip', () => {
  it.each(['#1c9a42', '#e11d74', '#3420d6', '#ffffff', '#000000', '#808080'])(
    'keeps %s intact',
    (hex) => {
      const rgb = hexToRgb(hex)!
      expect(rgbToHex(hsvToRgb(rgbToHsv(rgb)))).toBe(hex)
    },
  )

  it('keeps the hue of a pure red', () => {
    expect(rgbToHsv([255, 0, 0])).toEqual({ h: 0, s: 100, v: 100 })
  })
})

describe('rgbToHsl', () => {
  it('converts a known color', () => {
    const { h, s, l } = rgbToHsl([28, 154, 66])
    expect(Math.round(h)).toBe(138)
    expect(Math.round(s)).toBe(69)
    expect(Math.round(l)).toBe(36)
  })
})

describe('rgbString', () => {
  it('formats for rgba()', () => {
    expect(rgbString('#aaff96')).toBe('170,255,150')
  })

  it('falls back to white on invalid input', () => {
    expect(rgbString('nope')).toBe('255,255,255')
  })
})
