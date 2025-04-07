
import { WineInfo } from '@/components/wine/WineCard';
import { searchWinesByQuery } from './wineUtils';
import { WineOcrService } from './wineOcrService';
import { toast } from 'sonner';

// Interface for OCR results
export interface OCRResult {
  text: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Interface for extracted wine data (before processing)
export interface ExtractedWineData {
  name?: string;
  winery?: string;
  year?: string;
  price?: string;
  region?: string;
  country?: string;
}

/**
 * Process the wine list image and extract wine information using real OCR API
 */
export const processWineListImage = async (imageData: string): Promise<WineInfo[]> => {
  console.log('Processing wine list image with real OCR API...');
  
  try {
    // Step 1: Extract text blocks from image using OCR
    const ocrResults = await performOCR(imageData);
    
    if (!ocrResults || ocrResults.length === 0) {
      throw new Error('No text was detected in the image');
    }
    
    // Step 2: Parse the OCR results to identify potential wine entries
    const extractedWineData = WineOcrService.parseOcrResults(ocrResults);
    
    if (!extractedWineData || extractedWineData.length === 0) {
      throw new Error('No wine information could be extracted from the image');
    }
    
    // Step 3: Search real wine database using the extracted data
    const wineResults = await WineOcrService.enrichWineData(extractedWineData);
    
    // Step 4: Sort wines by value score (highest to lowest)
    return wineResults.sort((a, b) => b.valueScore - a.valueScore);
  } catch (error) {
    console.error('Error processing wine list image:', error);
    
    // More specific error messages based on the error type
    if (error instanceof TypeError) {
      toast.error('Network connection error', {
        description: 'Please check your internet connection and try again.'
      });
      throw new Error('Network connection error. Please check your internet connection.');
    } else if (error.message.includes('API')) {
      toast.error('OCR service unavailable', {
        description: 'Our image recognition service is temporarily unavailable.'
      });
      throw new Error('OCR service unavailable. Please try again later.');
    } else {
      toast.error('Failed to process wine list', {
        description: error.message || 'Please try again or use a clearer image.'
      });
      throw error;
    }
  }
};

/**
 * Extract text blocks from an image using Google Cloud Vision API
 */
export const performOCR = async (imageData: string): Promise<OCRResult[]> => {
  console.log('Performing OCR on image with Vision API...');
  
  try {
    // Remove data URL prefix if present to get just the base64 data
    const base64Data = imageData.split(',')[1] || imageData;
    
    // Call Google Cloud Vision API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=YOUR_GOOGLE_CLOUD_API_KEY', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Data
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 50
              }
            ]
          }
        ]
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId); // Clear the timeout if the request completed
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OCR API error:', errorData);
      
      // Handle different HTTP status codes
      if (response.status === 403) {
        throw new Error('API key error: Permission denied');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      } else if (response.status >= 500) {
        throw new Error('OCR service is currently unavailable');
      } else {
        throw new Error(`OCR API error: ${response.status}`);
      }
    }
    
    const data = await response.json();
    
    // Check if we have text annotations
    if (!data.responses?.[0]?.textAnnotations) {
      console.log('No text detected in image');
      return [];
    }
    
    // Format results to match our OCRResult interface
    // Skip the first result which is the entire text
    const textAnnotations = data.responses[0].textAnnotations.slice(1);
    
    const ocrResults: OCRResult[] = textAnnotations.map((annotation: any) => {
      // Calculate confidence (Vision API doesn't provide per-annotation confidence)
      // So we use a default high value
      const confidence = 0.95;
      
      // Get bounding box coordinates
      const vertices = annotation.boundingPoly?.vertices || [];
      let boundingBox;
      
      if (vertices.length === 4) {
        // Calculate the bounding box from the vertices
        const xs = vertices.map((v: any) => v.x || 0);
        const ys = vertices.map((v: any) => v.y || 0);
        
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        
        boundingBox = {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY
        };
      }
      
      return {
        text: annotation.description || '',
        confidence,
        boundingBox
      };
    });
    
    return ocrResults;
  } catch (error) {
    console.error('OCR processing error:', error);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      toast.error('OCR request timed out', {
        description: 'The image processing took too long. Please try again with a smaller image.'
      });
      throw new Error('OCR request timed out. Please try again with a smaller image.');
    } else if (error.name === 'TypeError' || error.message.includes('fetch')) {
      toast.error('Network connection error', {
        description: 'Please check your internet connection and try again.'
      });
      throw new Error('Network connection error. Please check your internet connection.');
    } else {
      toast.error('Failed to extract text from image', {
        description: error.message || 'Our OCR service is currently experiencing issues.'
      });
      throw error;
    }
  }
};

// Export what we need directly from the WineOcrService
export const parseWineInformation = WineOcrService.parseOcrResults;
export const enhanceWineData = WineOcrService.enrichWineData;
