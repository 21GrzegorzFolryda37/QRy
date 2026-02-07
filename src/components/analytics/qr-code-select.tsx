'use client'

interface QrCodeOption {
  id: string
  name: string
  scanCount: number
}

interface QrCodeSelectProps {
  value: string
  onChange: (id: string) => void
  options: QrCodeOption[]
  excludeId?: string
  placeholder?: string
}

export function QrCodeSelect({ value, onChange, options, excludeId, placeholder = 'Wybierz kod QR...' }: QrCodeSelectProps) {
  const filtered = excludeId ? options.filter((o) => o.id !== excludeId) : options

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
    >
      <option value="">{placeholder}</option>
      {filtered.map((qr) => (
        <option key={qr.id} value={qr.id}>
          {qr.name} ({qr.scanCount} skanów)
        </option>
      ))}
    </select>
  )
}
