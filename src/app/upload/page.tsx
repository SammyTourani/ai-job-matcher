'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ResumeUpload from '@/components/ResumeUpload';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase';
import { ParsedResumeData } from '@/types';

export default function UploadPage() {
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setError(null);
      
      // Simulate file upload and parsing
      // In a real app, this would involve:
      // 1. Uploading file to Supabase Storage
      // 2. Extracting text from PDF/DOC
      // 3. Parsing with AI to extract skills, experience, etc.
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock parsed data
      const mockParsedData: ParsedResumeData = {
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker'],
        experience_years: 5,
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            school: 'University of Technology',
            year: 2018,
            field: 'Computer Science'
          }
        ],
        job_titles: ['Software Engineer', 'Full Stack Developer', 'Senior Developer'],
        summary: 'Experienced full-stack developer with expertise in modern web technologies and cloud platforms.'
      };
      
      setParsedData(mockParsedData);
      setUploaded(true);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload and parse resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Your Resume
          </h1>
          <p className="text-gray-600">
            Upload your resume to get personalized job recommendations powered by AI
          </p>
        </div>

        {!uploaded ? (
          <div className="max-w-2xl mx-auto">
            <ResumeUpload onUpload={handleUpload} loading={uploading} />
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Resume Uploaded Successfully!
                </h2>
                <p className="text-gray-600">
                  We've analyzed your resume and extracted key information
                </p>
              </div>

              {parsedData && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Summary
                    </h3>
                    <p className="text-gray-700">{parsedData.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Experience Level
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {parsedData.experience_years} years of experience
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Skills Detected
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Education
                    </h3>
                    {parsedData.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-blue-500 pl-4 mb-4">
                        <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.school}</p>
                        {edu.year && <p className="text-sm text-gray-500">{edu.year}</p>}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      Job Titles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.job_titles.map((title, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                        >
                          {title}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => window.location.href = '/matches'}
                        className="btn-primary flex-1"
                      >
                        Find Job Matches
                      </button>
                      <button 
                        onClick={() => {
                          setUploaded(false);
                          setParsedData(null);
                        }}
                        className="btn-outline flex-1"
                      >
                        Upload New Resume
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}