import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { Camera, Upload, X } from 'lucide-react';
import { ValidationMessage } from './ValidationMessage';

export interface ImageUploaderProps {
  id: string;
  title: string;
  description?: string;
  acceptedTypes?: string;
  maxSizeMB?: number;
  previewUrl?: string | null;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  title,
  description,
  acceptedTypes = 'image/jpeg, image/png, image/webp',
  maxSizeMB = 5,
  previewUrl,
  onChange,
  error,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file?: File) => {
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-[14px] font-semibold text-[#111111]">{title}</span>
      {description && <span className="text-[12px] text-[#94A3B8]">{description}</span>}

      <div
        className={`relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group ${
          isDragging ? 'border-[#1E73E8] bg-blue-50' : error ? 'border-red-500' : 'border-[#E5E7EB] bg-[#F9FAFB] hover:bg-[#F3F4F6] hover:border-[#1E73E8]/30'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById(id)?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Upload ${title}`}
      >
        {previewUrl ? (
          <>
            <Image src={previewUrl} alt={`${title} Preview`} fill className="object-cover" />
            {!disabled && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-2">
                <div className="bg-white/90 p-2 rounded-full text-[#111111]">
                  <Camera className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  aria-label={`Remove ${title}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <Upload className={`w-8 h-8 mb-2 ${error ? 'text-red-500' : 'text-[#1E73E8]'}`} />
            <span className="text-[12px] font-medium text-[#475569]">
              {isDragging ? 'Drop Image Here' : 'Click or Drag & Drop'}
            </span>
          </div>
        )}
      </div>

      <input
        type="file"
        id={id}
        accept={acceptedTypes}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      
      <ValidationMessage error={error} />
    </div>
  );
};
