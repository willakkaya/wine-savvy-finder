
import React, { useRef, useState, useEffect } from 'react';
import { Camera, ImageIcon, X, RefreshCw, Camera as CameraIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CameraCaptureProps {
  onImageCapture: (image: string) => void;
  className?: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture, className }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Clean up camera on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsCapturing(true);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraPermission(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? "Camera access denied. Please grant permission in your browser settings."
          : "Couldn't access your camera. Try uploading an image instead."
      );
      setCameraPermission(false);
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCapturing(false);
  };

  const switchCamera = async () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    if (isCapturing) {
      // Restart camera with new facing mode
      stopCamera();
      setTimeout(() => {
        startCamera();
      }, 300);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      try {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          
          const image = canvasRef.current.toDataURL('image/jpeg', 0.9);
          setCapturedImage(image);
          onImageCapture(image);
          stopCamera();
          toast({
            title: "Image captured",
            description: "Processing your wine list...",
          });
        }
      } catch (err) {
        console.error("Error capturing image:", err);
        toast({
          title: "Capture failed",
          description: "There was a problem capturing the image. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const image = event.target?.result as string;
          setCapturedImage(image);
          onImageCapture(image);
          toast({
            title: "Image uploaded",
            description: "Processing your wine list...",
          });
        } catch (err) {
          console.error("Error processing image:", err);
          toast({
            title: "Upload failed",
            description: "There was a problem processing the image. Please try again.",
            variant: "destructive"
          });
        }
      };
      
      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "There was a problem reading the file. Please try another image.",
          variant: "destructive"
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return (
    <div className={cn("w-full flex flex-col items-center", className)}>
      {!capturedImage && !isCapturing && (
        <div className="w-full max-w-md p-8 rounded-lg bg-card border flex flex-col items-center gap-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-serif text-wine-dark mb-2">Capture Wine List</h2>
            <p className="text-muted-foreground">Take a photo or upload an image of the restaurant's wine list</p>
          </div>
          
          <Button 
            onClick={startCamera} 
            className="w-full max-w-xs bg-wine hover:bg-wine-dark text-cream gap-2"
          >
            <Camera size={18} />
            Open Camera
          </Button>
          
          <div className="relative w-full max-w-xs">
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              variant="outline" 
              className="w-full border-wine text-wine hover:bg-wine/10 gap-2"
            >
              <ImageIcon size={18} />
              Upload Image
            </Button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </div>
        </div>
      )}

      {isCapturing && (
        <div className="relative w-full max-w-md rounded-lg overflow-hidden border-2 border-wine">
          {cameraError ? (
            <div className="p-6 bg-muted/50">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{cameraError}</AlertDescription>
              </Alert>
              <div className="flex justify-center gap-4 mt-4">
                <Button 
                  onClick={() => setIsCapturing(false)} 
                  variant="outline"
                  className="border-wine text-wine"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="bg-wine hover:bg-wine-dark text-cream"
                >
                  Upload Instead
                </Button>
              </div>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-auto"
                onCanPlay={(e) => e.currentTarget.play()}
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button 
                  onClick={captureImage} 
                  size="lg" 
                  className="rounded-full w-16 h-16 bg-wine hover:bg-wine-dark"
                >
                  <CameraIcon size={24} />
                </Button>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                  onClick={switchCamera} 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full w-10 h-10 bg-white/70 border-0 hover:bg-white"
                  aria-label="Switch camera"
                >
                  <RefreshCw size={20} className="text-wine" />
                </Button>
                <Button 
                  onClick={stopCamera} 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full w-10 h-10 bg-white/70 border-0 hover:bg-white"
                  aria-label="Close camera"
                >
                  <X size={20} className="text-wine" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {capturedImage && (
        <div className="relative w-full max-w-md rounded-lg overflow-hidden border-2 border-wine">
          <img src={capturedImage} alt="Captured wine list" className="w-full h-auto" />
          <Button 
            onClick={resetCapture} 
            size="sm" 
            variant="outline" 
            className="absolute top-4 right-4 rounded-full w-10 h-10 bg-white/70 border-0 hover:bg-white"
          >
            <X size={20} className="text-wine" />
          </Button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
