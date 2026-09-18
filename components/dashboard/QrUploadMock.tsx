'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QrUploadMockProps {
  onProcessComplete: (code: string) => void;
  isProcessing: boolean;
}

export function QrUploadMock({ onProcessComplete, isProcessing }: QrUploadMockProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleProcess = () => {
    if (!selectedImage) return;

    // Derive simulated code based on filename or random test code
    let detectedCode = 'TT-GENUINE-QR';
    if (fileName.toLowerCase().includes('lux') || fileName.toLowerCase().includes('watch')) {
      detectedCode = 'TT-LUX-9941';
    } else if (fileName.toLowerCase().includes('elec') || fileName.toLowerCase().includes('headphone')) {
      detectedCode = 'TT-ELEC-4420';
    } else if (fileName.toLowerCase().includes('fake') || fileName.toLowerCase().includes('counterfeit')) {
      detectedCode = 'TT-FAKE-0000';
    } else {
      detectedCode = `TT-QR-${fileName.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    onProcessComplete(detectedCode);
  };

  const handleRemove = () => {
    setSelectedImage(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto">
      {/* Upload Zone or Preview */}
      {!selectedImage ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
            dragOver
              ? 'border-cyan-400 bg-cyan-500/15 scale-[1.02] shadow-glow-cyan/30'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 hover:border-cyan-500/50 hover:bg-cyan-500/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 mb-4 shadow-glow-cyan/10">
            <UploadCloud className="h-8 w-8" />
          </div>

          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            {dragOver ? 'Drop QR image here' : 'Upload QR Code Image'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-4">
            Drag & drop an image or click to browse (PNG, JPG, WebP)
          </p>

          <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Browse Files
          </span>
        </div>
      ) : (
        /* Image Preview State */
        <div className="w-full space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Uploaded QR Preview"
              className="max-h-full max-w-full object-contain rounded-xl"
            />

            {/* Quick Remove Button */}
            <button
              onClick={handleRemove}
              className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-black text-white text-xs backdrop-blur-md transition-colors"
              title="Remove Image"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Processing scanning line if verifying */}
            {isProcessing && (
              <div className="absolute inset-x-0 top-0 h-1 bg-cyan-400 shadow-[0_0_10px_#00F0FF] animate-scan-line" />
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="truncate max-w-[200px]">{fileName}</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
            >
              Change Image
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isProcessing}
            onClick={handleProcess}
            isMagnetic
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            Decode & Verify QR Code
          </Button>
        </div>
      )}
    </div>
  );
}
