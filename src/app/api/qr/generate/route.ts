import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

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

// Inline script content as fallback for serverless environments
const INLINE_SCRIPT = `
const { QRCodeJs } = require('@qr-platform/qr-code.js');

function convertGradient(gradient) {
  if (!gradient) return undefined;
  return {
    type: gradient.type,
    rotation: (gradient.rotation * Math.PI) / 180,
    colorStops: gradient.colorStops,
  };
}

function mapDotsType(type) {
  const mapping = {
    'square': 'square', 'dots': 'dot', 'rounded': 'rounded',
    'extra-rounded': 'extra-rounded', 'classy': 'classy', 'classy-rounded': 'classy-rounded',
    'diamond': 'diamond', 'star': 'star', 'vertical-line': 'vertical-line',
    'horizontal-line': 'horizontal-line', 'random-dot': 'random-dot',
    'small-square': 'small-square', 'tiny-square': 'tiny-square',
  };
  return mapping[type] || 'square';
}

function mapCornersSquareType(type) {
  const mapping = {
    'square': 'square', 'dot': 'dot', 'extra-rounded': 'rounded',
    'rounded': 'rounded', 'classy': 'classy', 'classy-rounded': 'rounded',
    'dotted': 'dot', 'outpoint': 'outpoint', 'inpoint': 'inpoint',
  };
  return mapping[type] || 'square';
}

function mapCornersDotType(type) {
  const mapping = {
    'square': 'square', 'dot': 'dot', 'heart': 'heart',
    'star': 'dot', 'diamond': 'square', 'rounded': 'rounded',
    'classy': 'classy', 'outpoint': 'outpoint', 'inpoint': 'inpoint',
  };
  return mapping[type] || 'square';
}

const DEFAULT_QR_STYLE = {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  errorCorrectionLevel: 'M',
  margin: 2,
  dotsType: 'square',
  cornersSquareType: 'square',
  cornersDotType: 'square',
};

async function generateQR(input) {
  const { url, style, size, logoUrl, logoSize } = input;
  if (!url) throw new Error('URL is required');

  const finalStyle = { ...DEFAULT_QR_STYLE, ...style };
  const options = {
    width: size || 300,
    height: size || 300,
    data: url,
    margin: Math.round(finalStyle.margin * (size / 40)),
    qrOptions: { errorCorrectionLevel: finalStyle.errorCorrectionLevel },
    dotsOptions: {
      type: mapDotsType(finalStyle.dotsType),
      color: finalStyle.foregroundColor,
      gradient: convertGradient(finalStyle.dotsGradient),
    },
    cornersSquareOptions: {
      type: mapCornersSquareType(finalStyle.cornersSquareType),
      color: finalStyle.cornersSquareColor || finalStyle.foregroundColor,
      gradient: convertGradient(finalStyle.cornersSquareGradient),
    },
    cornersDotOptions: {
      type: mapCornersDotType(finalStyle.cornersDotType),
      color: finalStyle.cornersDotColor || finalStyle.foregroundColor,
      gradient: convertGradient(finalStyle.cornersDotGradient),
    },
    backgroundOptions: { color: finalStyle.backgroundColor },
  };

  if (logoUrl) {
    const effectiveLogoSize = logoSize || Math.round(size * 0.3);
    options.image = logoUrl;
    options.imageOptions = {
      imageSize: effectiveLogoSize / size,
      margin: 5,
      ...(logoUrl.startsWith('data:') ? {} : { crossOrigin: 'anonymous' }),
    };
  }

  const qrCode = new QRCodeJs(options);
  const svgString = await qrCode.serialize();
  if (!svgString) throw new Error('Failed to generate QR code');

  const base64 = Buffer.from(svgString).toString('base64');
  return { dataUrl: 'data:image/svg+xml;base64,' + base64, svg: svgString };
}

let inputData = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { inputData += chunk; });
process.stdin.on('end', async () => {
  try {
    const input = JSON.parse(inputData);
    const result = await generateQR(input);
    console.log(JSON.stringify(result));
    process.exit(0);
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
});
`;

async function generateQRViaScript(input: GenerateRequest): Promise<{ dataUrl: string; svg: string }> {
  return new Promise((resolve, reject) => {
    // Try to find the script file first
    const possiblePaths = [
      path.join(process.cwd(), 'scripts', 'generate-qr.mjs'),
      path.join(process.cwd(), '.next', 'server', 'scripts', 'generate-qr.mjs'),
      path.join(__dirname, '..', '..', '..', '..', 'scripts', 'generate-qr.mjs'),
    ];

    let scriptPath: string | null = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        scriptPath = p;
        break;
      }
    }

    let child;
    if (scriptPath) {
      // Use external script file
      child = spawn(process.execPath, [scriptPath], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } else {
      // Fallback: use inline script via -e flag
      child = spawn(process.execPath, ['-e', INLINE_SCRIPT], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    }

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    child.on('close', (code: number | null) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch {
          reject(new Error('Failed to parse QR generation result: ' + stdout));
        }
      } else {
        try {
          const errorResult = JSON.parse(stderr);
          reject(new Error(errorResult.error || 'QR generation failed'));
        } catch {
          reject(new Error(stderr || 'QR generation failed with code ' + code));
        }
      }
    });

    child.on('error', (err: Error) => {
      reject(err);
    });

    // Send input to script via stdin
    child.stdin.write(JSON.stringify(input));
    child.stdin.end();
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { url, style, size, logoUrl, logoSize } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await generateQRViaScript({
      url,
      style: style || {},
      size: size || 300,
      logoUrl,
      logoSize,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
