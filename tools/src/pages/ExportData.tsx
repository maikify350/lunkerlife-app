import { FC, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { supabase } from '../services/supabase'

// Exact column names from fish_species table (editable fields only, in DB order)
const TEMPLATE_COLUMNS = [
    'image',
    'image_name_location',
    'common_name',
    'also_known_as',
    'invasive',
    'description',
    'family',
    'species',
    'environmental_status',
    'habitat',
    'fishing_techniques',
    'spawning_habits_lifecycle',
    'diet_feeding_habits',
    'range_distribution',
    'water_body_type',
    'avg_adult_weight_lbs',
    'known_for',
    'avg_adult_length_inches',
    'world_record',
    'world_record_link',
    'class'
]

// Helper: escape CSV value
const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`
    }
    return str
}

const ExportData: FC = () => {
    const [isExporting, setIsExporting] = useState(false)

    // Download blank template (headers only)
    const downloadBlankTemplate = (format: 'csv' | 'xlsx') => {
        const headerRow = TEMPLATE_COLUMNS.join(',')
        const blob = new Blob([headerRow + '\n'], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `fish_species_template.${format === 'xlsx' ? 'csv' : 'csv'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    // Download current data as CSV
    const downloadDataCSV = async () => {
        setIsExporting(true)
        try {
            const { data, error } = await supabase
                .from('fish_species')
                .select('*')
                .order('common_name')

            if (error) throw error

            // Build CSV with headers
            const rows = [TEMPLATE_COLUMNS.join(',')]
            for (const fish of data || []) {
                const row = TEMPLATE_COLUMNS.map(col => escapeCSV((fish as any)[col]))
                rows.push(row.join(','))
            }

            const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
            link.download = `fish_species_export_${timestamp}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Export error:', err)
            alert('Failed to export data. Check console for details.')
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Data Export</h1>
                <p className="text-gray-600 mt-1">Export fish species data or download a blank import template</p>
            </div>

            {/* Blank Template Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        📋 Blank Import Template
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">
                        Download an empty CSV file with <strong>only the column headers</strong> from the current Supabase
                        <code className="mx-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">fish_species</code>
                        table. Fill it in and upload via the Import page — all columns will map correctly.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Columns included ({TEMPLATE_COLUMNS.length})</p>
                        <div className="flex flex-wrap gap-1.5">
                            {TEMPLATE_COLUMNS.map(col => (
                                <span
                                    key={col}
                                    className={`text-xs px-2 py-1 rounded-full font-mono ${col === 'common_name'
                                            ? 'bg-red-100 text-red-700 border border-red-200'
                                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                                        }`}
                                >
                                    {col}{col === 'common_name' ? ' *' : ''}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2 italic">
                            * Required field. System fields (id, created_at, updated_at, etc.) are excluded — they are auto-generated.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => downloadBlankTemplate('csv')}
                            className="bg-ocean-600 hover:bg-ocean-700"
                        >
                            📥 Download Blank CSV Template
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Export Current Data */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        📤 Export Current Data
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">
                        Export all current fish species data as a CSV file. Uses the same column structure as the blank template,
                        so you can edit the exported file and re-import it.
                    </p>

                    <div className="flex gap-3">
                        <Button
                            onClick={downloadDataCSV}
                            disabled={isExporting}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isExporting ? '⏳ Exporting...' : '📤 Export All Fish Data (CSV)'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Column Reference */}
            <Card>
                <CardHeader>
                    <CardTitle>📖 Column Reference</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 px-3 font-medium text-gray-700">#</th>
                                    <th className="text-left py-2 px-3 font-medium text-gray-700">Column Name</th>
                                    <th className="text-left py-2 px-3 font-medium text-gray-700">Description</th>
                                    <th className="text-left py-2 px-3 font-medium text-gray-700">Example</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600">
                                {[
                                    ['image', 'Image filename', 'Bass-Largemouth.png'],
                                    ['image_name_location', 'Image path/filename', 'Bass-Largemouth.png'],
                                    ['common_name', 'Common name (required)', 'Largemouth Bass'],
                                    ['also_known_as', 'Alternative names', 'Black Bass, Bigmouth'],
                                    ['invasive', 'Is invasive? (true/false)', 'false'],
                                    ['description', 'General description', 'A popular freshwater...'],
                                    ['family', 'Taxonomic family', 'Centrarchidae'],
                                    ['species', 'Scientific species name', 'Micropterus salmoides'],
                                    ['environmental_status', 'Conservation status', 'Least Concern'],
                                    ['habitat', 'Habitat description', 'Lakes, ponds, rivers...'],
                                    ['fishing_techniques', 'How to catch', 'Topwater, soft plastics...'],
                                    ['spawning_habits_lifecycle', 'Spawning info', 'Spawns in spring...'],
                                    ['diet_feeding_habits', 'Diet info', 'Feeds on minnows...'],
                                    ['range_distribution', 'Geographic range', 'Eastern US, Great Lakes...'],
                                    ['water_body_type', 'Water body types', 'Lake, River, Pond'],
                                    ['avg_adult_weight_lbs', 'Average weight (lbs)', '3.5'],
                                    ['known_for', 'Notable characteristics', 'Aggressive strikes...'],
                                    ['avg_adult_length_inches', 'Average length (inches)', '15.5'],
                                    ['world_record', 'World record info', '22 lbs 4 oz - Georgia, 1932'],
                                    ['world_record_link', 'Link to record source', 'https://...'],
                                    ['class', 'Fresh or Salt water', 'Fresh'],
                                ].map(([col, desc, example], i) => (
                                    <tr key={col} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-2 px-3 text-gray-400">{i + 1}</td>
                                        <td className="py-2 px-3 font-mono text-xs text-blue-700">{col}</td>
                                        <td className="py-2 px-3">{desc}</td>
                                        <td className="py-2 px-3 text-gray-400 italic text-xs">{example}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ExportData
