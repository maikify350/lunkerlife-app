import { FC, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { importMultipleFish, validateSpreadsheetData, parseCSVData } from '../utils/importFishData'

const ImportData: FC = () => {
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState<{ current: number; total: number; fishName: string } | null>(null)
  const [importResults, setImportResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null)
  const [fileData, setFileData] = useState<any[] | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      
      let data: any[]
      
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        data = JSON.parse(text)
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        data = parseCSVData(text)
      } else {
        alert('Please upload a CSV or JSON file')
        return
      }

      const validation = validateSpreadsheetData(data)
      
      if (!validation.valid) {
        alert(`Data validation failed:\n${validation.issues.join('\n')}`)
        return
      }

      setFileData(data)
      console.log('File loaded successfully:', validation.issues)
      
    } catch (error) {
      alert(`Error reading file: ${error}`)
    }
  }

  const handleImport = async () => {
    if (!fileData) return

    setIsImporting(true)
    setImportResults(null)
    setImportProgress(null)

    try {
      const results = await importMultipleFish(
        fileData,
        (current, total, fishName) => {
          setImportProgress({ current, total, fishName })
        }
      )

      setImportResults(results)
      setImportProgress(null)
      
    } catch (error) {
      alert(`Import failed: ${error}`)
    } finally {
      setIsImporting(false)
    }
  }

  const handleSampleDataImport = async () => {
    setIsImporting(true)
    
    // Sample fish data matching your spreadsheet structure
    const sampleFish = [
      {
        'Common Name': 'Alewife',
        'Also Known As': 'Shad, Herring, Gaspereau, Klack, Kyack, Branch Herring, Fresh Water Herring, Grayback',
        'Invasive?': 'Yes',
        'Description': 'The Alewife is a small, silvery fish with a deep, laterally compressed body. They have a dark spot behind their gills and their backs are dark blue-green to black. They are an invasive species in the Great Lakes region.',
        'Family': 'Clupeidae',
        'Species': 'Alosa pseudoharengus',
        'Environmental Status': 'Invasive in Great Lakes',
        'Habitat': 'Coastal streams, lakes, and oceanic waters. Prefers cool, clear waters.',
        'Fishing Techniques': 'Small hooks, light tackle, cast nets during spawning runs',
        'Spawning Habits/Lifecycle': 'Anadromous - spawns in freshwater streams in spring. Adults return to ocean or large lakes.',
        'Diet/Feeding Habits': 'Zooplankton, small crustaceans, insects, and fish larvae',
        'Range': 'Atlantic coast from Newfoundland to North Carolina, introduced to Great Lakes',
        'Water Body Type': 'Lakes, coastal streams, ocean',
        'Avg Adult Weight (lbs)': '0.25',
        'Known For': 'Being a key forage fish and causing ecosystem disruption in Great Lakes',
        'Avg Adult Length (in)': '6.0',
        'World Record': 'Not typically targeted by anglers',
        'Image': 'Alewife.png'
      },
      {
        'Common Name': 'Largemouth Bass',
        'Also Known As': 'Black Bass, Bucket Mouth, Big Mouth Bass',
        'Invasive?': 'No',
        'Description': 'Large, aggressive gamefish with a distinctive large mouth that extends past the eye. Dark green with lighter belly and lateral line stripe.',
        'Family': 'Centrarchidae',
        'Species': 'Micropterus salmoides',
        'Environmental Status': 'Stable',
        'Habitat': 'Shallow, vegetated areas of lakes, ponds, and slow rivers with structure',
        'Fishing Techniques': 'Plastic worms, crankbaits, spinnerbaits, jigs, topwater lures',
        'Spawning Habits/Lifecycle': 'Spawns in shallow beds in spring when water reaches 60-65°F. Males guard nests.',
        'Diet/Feeding Habits': 'Fish, crayfish, frogs, insects, small mammals - opportunistic predators',
        'Range': 'Originally southeastern US, now introduced throughout North America',
        'Water Body Type': 'Lakes, ponds, slow rivers, reservoirs',
        'Avg Adult Weight (lbs)': '4.5',
        'Known For': 'Premier gamefish, aggressive strikes, acrobatic fights',
        'Avg Adult Length (in)': '18.0',
        'World Record': '22 lbs 4 oz - Montgomery Lake, Georgia (1932)',
        'Image': 'LargemouthBass.png'
      }
    ]

    try {
      const results = await importMultipleFish(
        sampleFish,
        (current, total, fishName) => {
          setImportProgress({ current, total, fishName })
        }
      )

      setImportResults(results)
      setImportProgress(null)
      
    } catch (error) {
      alert(`Sample import failed: ${error}`)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Fish Data</h1>
        <p className="text-gray-600 mt-1">
          Import fish species data from your Google Sheets or CSV file
        </p>
      </div>

      {/* Import Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload File */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">📊</span>
              <span>Upload Spreadsheet</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload a CSV or JSON file exported from your Google Sheets with fish data
            </p>
            
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ocean-50 file:text-ocean-700 hover:file:bg-ocean-100"
            />
            
            {fileData && (
              <div className="bg-green-50 p-3 rounded">
                <p className="text-green-700 text-sm">
                  ✅ File loaded: {fileData.length} rows ready for import
                </p>
              </div>
            )}
            
            <Button 
              onClick={handleImport}
              disabled={!fileData || isImporting}
              className="w-full"
            >
              {isImporting ? 'Importing...' : 'Import Fish Data'}
            </Button>
          </CardContent>
        </Card>

        {/* Sample Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">🐟</span>
              <span>Sample Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Import sample fish data including Alewife and Largemouth Bass to test the system
            </p>
            
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Alewife (invasive species from your sheet)</li>
              <li>• Largemouth Bass (popular gamefish)</li>
              <li>• Complete with all 19 spreadsheet fields</li>
            </ul>
            
            <Button 
              onClick={handleSampleDataImport}
              disabled={isImporting}
              variant="secondary"
              className="w-full"
            >
              Import Sample Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Import Progress */}
      {importProgress && (
        <Card>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Importing fish species...</span>
                <span className="text-sm text-gray-500">
                  {importProgress.current} of {importProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-ocean-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Currently importing: <strong>{importProgress.fishName}</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Results */}
      {importResults && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-green-800 font-semibold">✅ Successful</div>
                  <div className="text-green-600 text-lg">{importResults.success}</div>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <div className="text-red-800 font-semibold">❌ Failed</div>
                  <div className="text-red-600 text-lg">{importResults.failed}</div>
                </div>
              </div>
              
              {importResults.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Errors:</h4>
                  <div className="bg-red-50 p-3 rounded max-h-32 overflow-y-auto">
                    {importResults.errors.map((error, index) => (
                      <p key={index} className="text-red-700 text-sm">{error}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {importResults.success > 0 && (
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-blue-700 text-sm">
                    🎉 Import completed! Go to the <strong>Fish Species</strong> page to view your imported data.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Export from Google Sheets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div>
              <strong>Option 1: CSV Export</strong>
              <ol className="list-decimal list-inside ml-4 mt-1 space-y-1 text-gray-600">
                <li>Open your Google Sheet: <a href="https://docs.google.com/spreadsheets/d/1O4U9NTs7otPY8h2mnhJP39d5C3oQBX_5/edit" className="text-ocean-600 underline" target="_blank" rel="noopener noreferrer">Fish Data Sheet</a></li>
                <li>Go to File → Download → CSV (.csv)</li>
                <li>Upload the downloaded CSV file above</li>
              </ol>
            </div>
            
            <div>
              <strong>Option 2: Copy-Paste</strong>
              <ol className="list-decimal list-inside ml-4 mt-1 space-y-1 text-gray-600">
                <li>Select all your data in Google Sheets (Ctrl+A)</li>
                <li>Copy (Ctrl+C)</li>
                <li>Paste into a text editor and save as .csv</li>
                <li>Upload the CSV file above</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ImportData