'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  title: string;
  description: string;
  onImageSelect: (file: File | null) => void;
  selectedImage?: File | null;
  required?: boolean;
}

export default function ImageUpload({ 
  title, 
  description, 
  onImageSelect, 
  selectedImage, 
  required = false 
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageSelect(imageFile);
    }
  }, [onImageSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleRemove = useCallback(() => {
    onImageSelect(null);
  }, [onImageSelect]);

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          {title}
          {required && <span className="text-destructive ml-1">*</span>}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-primary bg-primary/5' 
            : selectedImage 
            ? 'border-green-500 bg-green-50' 
            : 'border-muted-foreground/25 hover:border-primary/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedImage ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div>
              <p className="font-medium text-green-700">{selectedImage.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              제거
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              {isDragOver ? (
                <Upload className="h-12 w-12 text-primary" />
              ) : (
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium mb-2">
                {isDragOver ? '이미지를 놓아주세요' : '이미지를 업로드하세요'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                드래그 앤 드롭하거나 클릭하여 파일을 선택하세요
              </p>
              <Button asChild>
                <label htmlFor={`file-input-${title}`} className="cursor-pointer">
                  파일 선택
                </label>
              </Button>
            </div>
          </div>
        )}

        <input
          id={`file-input-${title}`}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
