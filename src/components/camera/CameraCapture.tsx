
import React, { useState, useRef } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Camera as CameraIcon, ImageIcon, X, RefreshCw, CameraIcon as LucideCameraIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CameraCaptureProps {
  onImageCapture: (image: string) => void;
  disabled?: boolean;
  className?: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onImageCapture, 
  disabled = false,
  className 
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Check if running in a native app or browser
  const isNative = typeof window !== 'undefined' && window?.Capacitor?.isNativePlatform?.() || false;
  
  const startCamera = async () => {
    if (disabled) return;
    
    try {
      setCameraError(null);
      setIsCapturing(true);
      
      if (isNative) {
        // Use native camera directly
        const image = await takePicture();
        if (image) {
          setCapturedImage(image);
          onImageCapture(image);
          setIsCapturing(false);
        } else {
          setIsCapturing(false);
          setCameraError("Camera capture canceled or failed.");
        }
      } else {
        // Web implementation stays in "capturing" state
        // The actual capture will happen when user clicks the capture button
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(
        err instanceof Error && err.message.includes('denied')
          ? "Camera access denied. Please grant permission in your device settings."
          : "Couldn't access your camera. Try uploading an image instead."
      );
      setIsCapturing(false);
    }
  };

  const takePicture = async (): Promise<string | null> => {
    try {
      // Check and request permissions
      const cameraPermissions = await Camera.checkPermissions();
      
      if (cameraPermissions.camera !== 'granted') {
        const requested = await Camera.requestPermissions();
        if (requested.camera !== 'granted') {
          toast({
            title: "Permission denied",
            description: "Camera permission is required to capture images",
            variant: "destructive"
          });
          return null;
        }
      }
      
      // Take picture with device camera
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1920,
        height: 1080,
        saveToGallery: false,
      });
      
      if (!photo || !photo.dataUrl) {
        throw new Error("Failed to capture photo");
      }
      
      toast({
        title: "Image captured",
        description: "Processing your wine list...",
      });
      
      return photo.dataUrl;
    } catch (error) {
      console.error("Error taking picture:", error);
      if ((error as any).message === 'User cancelled photos app') {
        // User canceled, no need to show an error
        return null;
      }
      
      toast({
        title: "Capture failed",
        description: "There was a problem capturing the image.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
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
      
      let imageUrl: string;
      
      if (isNative) {
        // Save the file to app storage for native platforms
        const fileName = new Date().getTime() + '.jpeg';
        const mimeType = file.type;
        const reader = new FileReader();
        
        imageUrl = await new Promise((resolve, reject) => {
          reader.onload = async (event) => {
            try {
              const base64Data = (event.target?.result as string)?.split(',')[1] || '';
              
              // Write the file to filesystem
              const savedFile = await Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: Directory.Cache,
                recursive: true
              });
              
              // Convert to data URL for displaying
              resolve(`data:${mimeType};base64,${base64Data}`);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });
      } else {
        // Web implementation - use FileReader
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (typeof event.target?.result === 'string') {
              resolve(event.target.result);
            } else {
              reject(new Error("Failed to read file"));
            }
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });
      }
      
      setCapturedImage(imageUrl);
      onImageCapture(imageUrl);
      toast({
        title: "Image uploaded",
        description: "Processing your wine list...",
      });
    } catch (err) {
      console.error("Error uploading file:", err);
      toast({
        title: "Upload failed",
        description: "There was a problem processing the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Web camera view - only shown on web when isCapturing is true and no cameraError
  const WebCameraView = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    React.useEffect(() => {
      let stream: MediaStream | null = null;
      
      const setupCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: "environment",
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setCameraError(
            err instanceof DOMException && err.name === 'NotAllowedError'
              ? "Camera access denied. Please grant permission in your browser settings."
              : "Couldn't access your camera. Try uploading an image instead."
          );
        }
      };
      
      if (isCapturing && !isNative) {
        setupCamera();
      }
      
      return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }, [isCapturing]);
    
    const captureImageFromVideo = () => {
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
            setIsCapturing(false);
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
    
    return (
      <>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-auto"
          onCanPlay={(e) => e.currentTarget.play()}
        />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
          <Button 
            onClick={captureImageFromVideo} 
            size="lg" 
            className="rounded-full w-16 h-16 bg-wine hover:bg-wine-dark"
          >
            <CameraIcon size={24} />
          </Button>
        </div>
        <div className="absolute top-4 right-4">
          <Button 
            onClick={() => setIsCapturing(false)} 
            size="sm" 
            variant="outline" 
            className="rounded-full w-10 h-10 bg-white/70 border-0 hover:bg-white"
            aria-label="Close camera"
          >
            <X size={20} className="text-wine" />
          </Button>
        </div>
      </>
    );
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
            disabled={disabled}
          >
            <CameraIcon size={18} />
            {isNative ? "Take Photo" : "Open Camera"}
          </Button>
          
          <div className="relative w-full max-w-xs">
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              variant="outline" 
              className="w-full border-wine text-wine hover:bg-wine/10 gap-2"
              disabled={disabled}
            >
              <ImageIcon size={18} />
              Upload Image
            </Button>
            <input 
              type="file" 
              accept="image/*"
              capture="environment"
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              disabled={disabled}
            />
          </div>
        </div>
      )}

      {isCapturing && !isNative && (
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
            <WebCameraView />
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
            disabled={disabled}
          >
            <X size={20} className="text-wine" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
