
import React, { useRef, useState } from 'react';
import { Camera, ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";

interface CameraCaptureProps {
  onImageCapture: (image: string) => void;
  className?: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture, className }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Couldn't access your camera. Please grant permission or try uploading an image instead.",
        variant: "destructive"
      });
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const image = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(image);
        onImageCapture(image);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = event.target?.result as string;
        setCapturedImage(image);
        onImageCapture(image);
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
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-auto"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button 
              onClick={captureImage} 
              size="lg" 
              className="rounded-full w-16 h-16 bg-wine hover:bg-wine-dark"
            >
              <Camera size={24} />
            </Button>
            <Button 
              onClick={stopCamera} 
              size="sm" 
              variant="outline" 
              className="absolute top-4 right-4 rounded-full w-10 h-10 bg-white/70 border-0 hover:bg-white"
            >
              <X size={20} className="text-wine" />
            </Button>
          </div>
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
