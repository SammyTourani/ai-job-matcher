import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/utils/constants';
import { formatFileSize } from '@/utils/helpers';
import LoadingSpinner from './LoadingSpinner';

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<void>;
  loading?: boolean;
}

export default function ResumeUpload({ onUpload, loading }: ResumeUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadError(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setUploadError(`File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setUploadError('Please upload a PDF or Word document.');
      } else {
        setUploadError('Invalid file. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES.reduce((acc, type) => ({
      ...acc,
      [type]: []
    }), {}),
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    multiple: false
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      await onUpload(selectedFile);
    } catch (error) {
      setUploadError('Failed to upload file. Please try again.');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadError(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            
            {isDragActive ? (
              <p className="text-lg text-blue-600 mb-2">Drop your resume here</p>
            ) : (
              <p className="text-lg text-gray-600 mb-2">
                Drag & drop your resume here, or click to select
              </p>
            )}
            
            <p className="text-sm text-gray-500 mb-4">
              Supports PDF and Word documents up to {formatFileSize(MAX_FILE_SIZE)}
            </p>
            
            <button className="btn-primary">
              Choose File
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload & Analyze
                </>
              )}
            </button>
            
            <button
              onClick={removeFile}
              disabled={loading}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {uploadError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          What happens next?
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• We&apos;ll extract your skills and experience using AI</li>
          <li>• Match you with relevant job opportunities</li>
          <li>• Provide personalized recommendations</li>
          <li>• Your data is kept secure and private</li>
        </ul>
      </div>
    </div>
  );
}