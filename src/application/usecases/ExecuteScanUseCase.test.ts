import { describe, it, expect, vi } from 'vitest'
import { executeScan, ScanPayload } from './ExecuteScanUseCase'

global.fetch = vi.fn()

describe('ExecuteScanUseCase', () => {
  it('throws an error if no files and no code is provided', async () => {
    const payload: ScanPayload = { mode: 'UPLOAD_FILES', files: [], code: '' }
    await expect(executeScan(payload)).rejects.toThrow('No content provided for scanning')

    const payloadCode: ScanPayload = { mode: 'DIRECT_CODE', files: [], code: '' }
    await expect(executeScan(payloadCode)).rejects.toThrow('No content provided for scanning')
  })

  it('returns a success and mock job ID when valid files are provided', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ path: 'test.js', start: { line: 1 }, extra: { severity: 'High', message: 'test', metadata: {} } }]
    })

    const validFile = new File([''], 'test.js', { type: 'text/javascript' })
    const payload: ScanPayload = { mode: 'UPLOAD_FILES', files: [validFile], code: '', language: '.js' }

    const result = await executeScan(payload)
    expect(result.length).toBe(1)
    expect(result[0].extra.message).toBe('test')
  })

  it('returns a success and mock job ID when valid code is provided', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })

    const payload: ScanPayload = { mode: 'DIRECT_CODE', files: [], code: 'const x = 1;', language: '.js' }

    const result = await executeScan(payload)
    expect(result.length).toBe(0)
  })
})
