import { ScanMode } from '../../domain/entities/ScanType'

export interface ScanPayload {
  mode: ScanMode
  files: File[]
  code: string
}

export interface ScanResult {
  success: boolean
  jobId: string
  message: string
}

export async function executeScan(payload: ScanPayload): Promise<ScanResult> {
  // Validate input
  if (payload.mode === 'UPLOAD_FILES' && payload.files.length === 0) {
    throw new Error('No content provided for scanning')
  }
  if (payload.mode === 'DIRECT_CODE' && !payload.code.trim()) {
    throw new Error('No content provided for scanning')
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    success: true,
    jobId: `JOB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    message: 'Scan initiated successfully',
  }
}
