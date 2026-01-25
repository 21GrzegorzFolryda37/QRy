import Link from 'next/link'
import { Button } from '@/components/ui'

const features = [
  {
    name: 'Dynamic QR Codes',
    description:
      'Unlike static QR codes, our dynamic codes let you change the destination URL anytime without reprinting. Perfect for marketing campaigns, product packaging, and business cards.',
    details: [
      'Change destination URL anytime',
      'No reprinting required',
      'Track all scans automatically',
      'A/B test different landing pages',
    ],
  },
  {
    name: 'Powerful Analytics',
    description:
      'Get detailed insights into who scans your QR codes, when, and where. Make data-driven decisions with comprehensive analytics.',
    details: [
      'Real-time scan tracking',
      'Geographic location data',
      'Device and browser breakdown',
      'Time-based analytics',
    ],
  },
  {
    name: 'Custom Branding',
    description:
      'Create QR codes that match your brand identity. Customize colors, add your logo, and maintain brand consistency across all touchpoints.',
    details: [
      'Custom foreground/background colors',
      'Logo overlay support',
      'Adjustable error correction',
      'Multiple sizes and formats',
    ],
  },
  {
    name: 'UTM Parameter Tracking',
    description:
      'Track the effectiveness of your marketing campaigns with full UTM parameter support. Know exactly where your traffic is coming from.',
    details: [
      'Automatic UTM capture',
      'Campaign performance tracking',
      'Source/medium attribution',
      'Easy integration with analytics tools',
    ],
  },
  {
    name: 'Easy Management',
    description:
      'Manage all your QR codes from a single, intuitive dashboard. Create, edit, organize, and analyze with ease.',
    details: [
      'Centralized dashboard',
      'Bulk operations',
      'Search and filter',
      'Export capabilities',
    ],
  },
  {
    name: 'Reliable Infrastructure',
    description:
      'Built on enterprise-grade infrastructure for maximum reliability. Your QR codes will always work when your customers need them.',
    details: [
      '99.9% uptime guarantee',
      'Global CDN distribution',
      'Fast redirect times',
      'Secure HTTPS endpoints',
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everything you need to succeed with QR codes
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Powerful features designed for modern marketers, businesses, and creators.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="space-y-16">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className={`flex flex-col gap-8 lg:flex-row ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{feature.name}</h2>
                  <p className="mt-4 text-gray-600">{feature.description}</p>
                  <ul className="mt-6 space-y-3">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">[Feature illustration]</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Ready to get started?</h2>
          <p className="mt-4 text-gray-600">
            Create your first QR code in seconds. No credit card required.
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-4">
            <Link href="/register">
              <Button size="lg">Start for free</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}
