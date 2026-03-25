import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ScanAction from './ScanAction'
import * as ScanUseCase from '../../../application/usecases/ExecuteScanUseCase'

vi.mock('../../../application/usecases/ExecuteScanUseCase', () => ({
  executeScan: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
}))

describe('ScanAction', () => {
  it('shows an error if validation fails', async () => {
    vi.mocked(ScanUseCase.executeScan).mockRejectedValueOnce(new Error('No content provided'))
    
    // Pass empty payload
    render(<ScanAction payload={{ mode: 'DIRECT_CODE', files: [], code: '', language: '.js' }} />)
    
    const button = screen.getByRole('button', { name: /initiate security scan/i })
    fireEvent.click(button)
    
    const errorMsg = await screen.findByText('No content provided')
    expect(errorMsg).toBeInTheDocument()
  })

  it('shows loading state during scan and resets after', async () => {
    // Resolve immediately for test
    vi.mocked(ScanUseCase.executeScan).mockResolvedValueOnce([])
    
    render(<ScanAction payload={{ mode: 'DIRECT_CODE', files: [], code: 'test code', language: '.js' }} />)
    
    const button = screen.getByRole('button', { name: /initiate security scan/i })
    fireEvent.click(button)
    
    // Should show loading state (Scanning...)
    expect(button).toBeDisabled()
    expect(screen.getByText(/Scanning.../i)).toBeInTheDocument()
    
    // Wait for the mock to resolve and state to reset
    // This is simple since we used mockResolvedValueOnce
    await screen.findByRole('button', { name: /initiate security scan/i })
  })
})
