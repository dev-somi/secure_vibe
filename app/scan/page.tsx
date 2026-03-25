'use client'

import { useEffect, useState } from 'react'
import NavBar from '@/src/presentation/components/layout/NavBar'
import { VulnerabilityResult } from '@/src/application/usecases/ExecuteScanUseCase'
import { useRouter } from 'next/navigation'

export default function ScanPage() {
  const [results, setResults] = useState<VulnerabilityResult[] | null>(null)
  const router = useRouter()

  useEffect(() => {
    const data = sessionStorage.getItem('secureVibe_scanResults')
    if (data) {
      try {
        setResults(JSON.parse(data))
      } catch (e) {
        console.error('Failed to parse scan results', e)
        setResults([])
      }
    } else {
      // If accessed directly without scanning, redirect or show empty
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-[Arial,Helvetica,sans-serif]">
      <NavBar />
      
      <main className="flex-1 flex flex-col pt-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6 pb-6 border-b">
            <h1 className="text-3xl font-bold text-gray-800">Scan Report</h1>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
            >
              New Scan
            </button>
          </div>
          
          {results === null ? (
            <div className="text-center py-12 text-gray-500">
              <p>Loading scan results...</p>
              <p className="text-sm mt-2">If you didn't run a scan, go back to the dashboard to start one.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 bg-green-50 border border-green-200 rounded-xl flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">No vulnerabilities found</h2>
              <p className="text-green-700">Your code passed all security checks and looks safe for deployment.</p>
            </div>
          ) : (
            <div>
              <h4 className="text-red-600 font-bold text-xl mb-6 flex items-center">
                <span className="text-2xl mr-2">🚨</span>
                Found {results.length} Vulnerabilit{results.length > 1 ? 'ies' : 'y'}
              </h4>
              <div className="flex flex-col gap-6">
                {results.map((vuln, index) => {
                  const cwe = vuln.extra.metadata.cwe?.[0] ?? 'No CWE metadata'
                  return (
                    <div key={index} className="p-6 bg-red-50 border-l-[6px] border-red-500 rounded-xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-lg text-gray-900">
                          <span className="text-red-500 mr-2">[{index + 1}]</span>
                          Line {vuln.start.line}
                        </p>
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase rounded-full">
                          {vuln.extra.severity}
                        </span>
                      </div>
                      
                      <p className="text-sm font-mono text-red-700 bg-red-100/50 p-2 rounded mb-3 inline-block">
                        {cwe}
                      </p>
                      
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {vuln.extra.message}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
