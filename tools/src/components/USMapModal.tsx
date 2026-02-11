import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface USMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  rangeDistribution: string;
}

const USMapModal: React.FC<USMapModalProps> = ({ isOpen, onClose, rangeDistribution }) => {
  const [mapImageUrl, setMapImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Parse state abbreviations from the range distribution string
  const parseStates = (range: string): Set<string> => {
    if (!range) return new Set();
    
    const stateAbbreviations = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 
      'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 
      'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 
      'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];
    
    const states = new Set<string>();
    const upperRange = range.toUpperCase();
    
    stateAbbreviations.forEach(state => {
      const regex = new RegExp(`\\b${state}\\b`, 'g');
      if (regex.test(upperRange)) {
        states.add(state);
      }
    });
    
    return states;
  };

  // Generate map when modal opens or range changes
  useEffect(() => {
    if (!isOpen || !rangeDistribution) return;

    const generateMap = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const highlightedStates = parseStates(rangeDistribution);
        const statesList = Array.from(highlightedStates).join(', ');
        
        // Create the prompt for the image generation
        const prompt = `Create a simple, clean map of the United States with state boundaries. 
          IMPORTANT RULES:
          - Fill ONLY these states with solid blue color: ${statesList}
          - All other states should be white or light gray
          - Show ONLY state abbreviations (like FL, GA, TX) - one label per state
          - NO decorations, NO fish, NO icons, NO illustrations
          - NO duplicate state names
          - Simple flat design with clear state borders
          - Professional geographic map style only`;

        // Use the API key from Vercel environment
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        
        console.log('API Key exists:', !!apiKey);
        console.log('Highlighted states:', statesList);
        
        if (!apiKey) {
          throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
        }
        
        const requestBody = {
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1792x1024', // Landscape format for better US map
          quality: 'standard',
          response_format: 'url',
        };
        
        console.log('Making API request with prompt:', prompt);
        
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
        });
        
        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to generate map');
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error.message || 'Failed to generate image');
        }
        
        // OpenAI returns the URL in data.data[0].url
        const imageUrl = data.data?.[0]?.url;
        if (!imageUrl) {
          throw new Error('No image URL returned');
        }
        
        setMapImageUrl(imageUrl);
        
      } catch (err: any) {
        console.error('Error generating map:', err);
        console.error('Error details:', err.message);
        setError(`Failed to generate map: ${err.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    generateMap();
  }, [isOpen, rangeDistribution]);

  if (!isOpen) return null;

  const highlightedStates = parseStates(rangeDistribution);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            United States Fish Distribution
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong>Range/Distribution:</strong> {rangeDistribution || 'No distribution data available'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>States detected:</strong> {highlightedStates.size > 0 ? Array.from(highlightedStates).join(', ') : 'None'}
            </p>
          </div>

          <div className="relative bg-gray-50 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
            {isLoading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">Generating map...</p>
              </div>
            )}
            
            {error && (
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            )}
            
            {mapImageUrl && !isLoading && !error && (
              <img 
                src={mapImageUrl} 
                alt="US Fish Distribution Map" 
                className="max-w-full h-auto"
                style={{ maxHeight: '500px' }}
              />
            )}
            
            {/* Fallback to SVG map if image generation fails */}
            {!mapImageUrl && !isLoading && !error && (
              <div className="text-center text-gray-500">
                <p>No map generated yet</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Legend:</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-blue-500 border border-gray-400"></div>
                  <span>Fish present in state</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-gray-100 border border-gray-400"></div>
                  <span>Fish not reported</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {highlightedStates.size} state{highlightedStates.size !== 1 ? 's' : ''} highlighted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default USMapModal;