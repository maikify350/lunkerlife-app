import { FC, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../services/supabase'
import Button from '../components/ui/Button'
import { FishSpecies } from '../types/fish'
import { getImageUrl } from '../utils/imageHelpers'
import { useSelection } from '../contexts/SelectionContext'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Extend jsPDF type for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

const Reports: FC = () => {
  const { selectedFishIds } = useSelection()
  const navigate = useNavigate()
  const [showNoSelectionDialog, setShowNoSelectionDialog] = useState(false)
  
  // Check if any fish are selected on mount
  useEffect(() => {
    if (selectedFishIds.size === 0) {
      setShowNoSelectionDialog(true)
    }
  }, [])
  
  // Fetch only selected fish species
  const { data: selectedFishSpecies = [], isLoading } = useQuery({
    queryKey: ['fish-species-report', Array.from(selectedFishIds)],
    queryFn: async () => {
      if (selectedFishIds.size === 0) return []
      
      const { data, error } = await supabase
        .from('fish_species')
        .select('*')
        .in('id', Array.from(selectedFishIds))
        .order('common_name')
      
      if (error) throw error
      return (data as FishSpecies[]) || []
    },
    enabled: selectedFishIds.size > 0
  })
  
  // Generate PDF report
  const generatePDFReport = async () => {
    if (selectedFishSpecies.length === 0) {
      setShowNoSelectionDialog(true)
      return
    }
    
    const selectedFish = selectedFishSpecies
    
    // Create PDF in landscape
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })
    
    // Add title
    doc.setFontSize(20)
    doc.text('LuckerLife Fish Species Report', 148, 15, { align: 'center' })
    
    // Add generation date
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 148, 22, { align: 'center' })
    doc.text(`Total Species: ${selectedFish.length}`, 148, 28, { align: 'center' })
    
    // Prepare table data
    const tableData = selectedFish.map((fish, index) => [
      (index + 1).toString(),
      fish.common_name,
      fish.family || '-',
      fish.species || '-',
      fish.class || 'Fresh',
      fish.invasive ? 'Yes' : 'No',
      fish.environmental_status || '-',
      fish.avg_adult_length_inches ? `${fish.avg_adult_length_inches}"` : '-',
      fish.avg_adult_weight_lbs ? `${fish.avg_adult_weight_lbs} lbs` : '-'
    ])
    
    // Add table
    doc.autoTable({
      head: [['#', 'Common Name', 'Family', 'Scientific Name', 'Water', 'Invasive', 'Status', 'Avg Length', 'Avg Weight']],
      body: tableData,
      startY: 35,
      styles: { 
        fontSize: 9,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 45 },
        2: { cellWidth: 35 },
        3: { cellWidth: 45 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 30 },
        7: { cellWidth: 25 },
        8: { cellWidth: 25 }
      },
      headStyles: {
        fillColor: [2, 132, 199], // Ocean blue
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    })
    
    // Save the PDF
    doc.save(`fish-report-${new Date().toISOString().split('T')[0]}.pdf`)
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Fish Species Reports</h1>
        <p className="text-gray-600">Generate PDF reports for selected fish species</p>
      </div>
      
      <div className="flex-1 p-6">
        {selectedFishIds.size > 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Selected Fish Species</h2>
              {isLoading ? (
                <p className="text-gray-500">Loading selected fish...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    You have selected {selectedFishSpecies.length} fish species for the report.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-6 max-h-60 overflow-y-auto">
                    {selectedFishSpecies.map(fish => (
                      <div key={fish.id} className="text-sm px-3 py-2 bg-gray-50 rounded">
                        {fish.common_name} • {fish.class || 'Fresh'} • {fish.invasive ? 'Invasive' : 'Native'}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Report Options</h3>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Quick Summary Report</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Generates a landscape PDF with key information for selected fish species including name, family, water type, invasive status, and size.
                  </p>
                  <Button
                    onClick={generatePDFReport}
                    className="w-full bg-ocean-600 hover:bg-ocean-700"
                    disabled={isLoading}
                  >
                    Generate PDF Report
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 opacity-50">
                  <h4 className="font-medium mb-2 text-gray-400">Detailed Report</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Coming soon: Detailed reports with images, habitat, diet, and fishing techniques.
                  </p>
                  <Button className="w-full" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-xl text-gray-600 mb-4">No fish species selected</p>
            </div>
          </div>
        )}
      </div>
      
      {/* No Selection Dialog */}
      {showNoSelectionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-2">No Fish Selected</h3>
            <p className="text-gray-600 mb-4">
              Please select at least one fish species before generating a report.
            </p>
            <Button
              onClick={() => setShowNoSelectionDialog(false)}
              className="w-full bg-ocean-600 hover:bg-ocean-700"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports