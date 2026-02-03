import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

/**
 * Server-side QR code generation using @qr-platform/qr-code.js
 * Uses a separate script via child_process to avoid Turbopack bundling issues
 */

interface GenerateRequest {
  url: string
  style: Record<string, unknown>
  size: number
  logoUrl?: string
  logoSize?: number
}

async function generateQRViaScript(input: GenerateRequest): Promise<{ dataUrl: string; svg: string }> {
  return new Promise((resolve, reject) => {
    // Build script path dynamically to avoid Turbopack static analysis
    const scriptParts = ['scripts', 'generate-qr.mjs']
    const scriptPath = scriptParts.join(process.platform === 'win32' ? '\\' : '/')

    const child = spawn(process.execPath, [scriptPath], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data: Buffer) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data: Buffer) => {
      stderr += data.toString()
    })

    child.on('close', (code: number | null) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout)
          resolve(result)
        } catch {
          reject(new Error('Failed to parse QR generation result'))
        }
      } else {
        try {
          const errorResult = JSON.parse(stderr)
          reject(new Error(errorResult.error || 'QR generation failed'))
        } catch {
          reject(new Error(stderr || 'QR generation failed'))
        }
      }
    })

    child.on('error', (err: Error) => {
      reject(err)
    })

    // Send input to script via stdin
    child.stdin.write(JSON.stringify(input))
    child.stdin.end()
  })
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { url, style, size, logoUrl, logoSize } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const result = await generateQRViaScript({
      url,
      style,
      size: size || 300,
      logoUrl,
      logoSize,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
