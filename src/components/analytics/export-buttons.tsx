'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { downloadCSV } from '@/lib/export/csv'
import {
  OverviewStats,
  ScansOverTime,
  GeographicData,
  DeviceBreakdown,
  BrowserBreakdown,
  OsBreakdown,
  TopQrCode,
  TimePatternData,
  DateRange,
} from '@/types/analytics'

interface ExportButtonsProps {
  stats: OverviewStats | null
  scansOverTime: ScansOverTime[]
  geographic: GeographicData[]
  devices: DeviceBreakdown[]
  browsers: BrowserBreakdown[]
  os: OsBreakdown[]
  topQrCodes: TopQrCode[]
  timePatterns: TimePatternData | null
  dateRange: DateRange
}

export function ExportButtons({
  stats,
  scansOverTime,
  geographic,
  devices,
  browsers,
  os,
  topQrCodes,
  timePatterns,
  dateRange,
}: ExportButtonsProps) {
  const [isExportingCSV, setIsExportingCSV] = useState(false)
  const [isExportingPDF, setIsExportingPDF] = useState(false)

  const exportData = {
    stats,
    scansOverTime,
    geographic,
    devices,
    browsers,
    os,
    topQrCodes,
    timePatterns,
    dateRange,
  }

  const handleCSVExport = () => {
    setIsExportingCSV(true)
    try {
      downloadCSV(exportData)
    } finally {
      setIsExportingCSV(false)
    }
  }

  const handlePDFExport = async () => {
    setIsExportingPDF(true)
    try {
      // Dynamic import to avoid SSR issues
      const { downloadPDF } = await import('@/lib/export/pdf')
      await downloadPDF(exportData)
    } finally {
      setIsExportingPDF(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCSVExport}
        disabled={isExportingCSV}
        className="px-2 sm:px-3"
      >
        {isExportingCSV ? (
          <span className="flex items-center gap-1.5">
            <LoadingSpinner />
            <span className="hidden sm:inline">Eksport...</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <CSVIcon />
            CSV
          </span>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePDFExport}
        disabled={isExportingPDF}
        className="px-2 sm:px-3"
      >
        {isExportingPDF ? (
          <span className="flex items-center gap-1.5">
            <LoadingSpinner />
            <span className="hidden sm:inline">Generowanie...</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <PDFIcon />
            PDF
          </span>
        )}
      </Button>
    </div>
  )
}

function CSVIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}

function PDFIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
