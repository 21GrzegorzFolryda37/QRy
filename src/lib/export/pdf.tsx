'use client'

import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import {
  OverviewStats,
  ScansOverTime,
  GeographicData,
  DeviceBreakdown,
  BrowserBreakdown,
  OsBreakdown,
  TopQrCode,
  TimePatternData
} from '@/types/analytics'

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
    backgroundColor: '#f3f4f6',
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    width: '48%',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableCell: {
    flex: 1,
  },
  tableCellHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: '#374151',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 8,
  },
})

interface ExportData {
  stats: OverviewStats | null
  scansOverTime: ScansOverTime[]
  geographic: GeographicData[]
  devices: DeviceBreakdown[]
  browsers: BrowserBreakdown[]
  os: OsBreakdown[]
  topQrCodes: TopQrCode[]
  timePatterns: TimePatternData | null
  dateRange: string
}

function AnalyticsReport({ data }: { data: ExportData }) {
  const now = new Date().toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const dateRangeLabel = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    '12m': 'Last 12 months',
    'all': 'All time',
  }[data.dateRange] || data.dateRange

  return (
    <Document>
      {/* Page 1: Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>QR Analytics Report</Text>
          <Text style={styles.subtitle}>
            Generated: {now} | Period: {dateRangeLabel}
          </Text>
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total QR Codes</Text>
              <Text style={styles.statValue}>{data.stats?.totalQrCodes || 0}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Scans</Text>
              <Text style={styles.statValue}>{data.stats?.totalScans || 0}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Scans This Month</Text>
              <Text style={styles.statValue}>{data.stats?.scansThisMonth || 0}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Monthly Limit</Text>
              <Text style={styles.statValue}>
                {data.stats?.scanLimit === -1 ? 'Unlimited' : data.stats?.scanLimit || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Top QR Codes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing QR Codes</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { flex: 0.5 }]}>#</Text>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Name</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Short Code</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Scans</Text>
            </View>
            {data.topQrCodes.slice(0, 10).map((qr, index) => (
              <View key={qr.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{qr.name}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{qr.shortCode}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{qr.scanCount}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Geographic Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Geographic Distribution</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Country</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Scans</Text>
            </View>
            {data.geographic.slice(0, 10).map((geo) => (
              <View key={geo.country} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{geo.country}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{geo.scans}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.footer}>
          Generated by QRenixy | engageqr.com
        </Text>
      </Page>

      {/* Page 2: Devices & Time Patterns */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Device & Time Analysis</Text>
          <Text style={styles.subtitle}>Period: {dateRangeLabel}</Text>
        </View>

        {/* Devices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Devices</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Device Type</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Count</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Percentage</Text>
            </View>
            {data.devices.map((device) => (
              <View key={device.deviceType} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{device.deviceType}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{device.count}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{device.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Browsers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browsers</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Browser</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Count</Text>
              <Text style={[styles.tableCellHeader, { flex: 1 }]}>Percentage</Text>
            </View>
            {data.browsers.slice(0, 8).map((browser) => (
              <View key={browser.browser} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{browser.browser}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{browser.count}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{browser.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Peak Times */}
        {data.timePatterns && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Peak Activity Times</Text>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Top Hours</Text>
                {data.timePatterns.hourly
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((item) => (
                    <Text key={item.hour} style={{ marginBottom: 4 }}>
                      {item.hour.toString().padStart(2, '0')}:00 - {item.count} scans
                    </Text>
                  ))}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Top Days</Text>
                {data.timePatterns.daily
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((item) => (
                    <Text key={item.day} style={{ marginBottom: 4 }}>
                      {item.dayName} - {item.count} scans
                    </Text>
                  ))}
              </View>
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          Generated by QRenixy | engageqr.com
        </Text>
      </Page>
    </Document>
  )
}

export async function downloadPDF(data: ExportData, filename?: string) {
  const blob = await pdf(<AnalyticsReport data={data} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `qr-analytics-${new Date().toISOString().split('T')[0]}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
