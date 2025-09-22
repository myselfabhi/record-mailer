import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X } from 'lucide-react'
import toast from 'react-hot-toast'
import './FileUpload.css'

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      if (error.code === 'file-invalid-type') {
        toast.error('Please upload a valid file (TXT, CSV, or Excel format)')
      } else if (error.code === 'file-too-large') {
        toast.error('File size too large. Please choose a smaller file.')
      } else {
        toast.error('Invalid file. Please try again.')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      onFileUpload(file)
      toast.success(`File "${file.name}" uploaded successfully!`)
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  })

  return (
    <div className="file-upload-container">
      <div 
        {...getRootProps()} 
        className={`upload-area ${isDragActive ? 'dragover' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="upload-content">
          <div className="upload-icon">
            <Upload className="icon" />
          </div>
          
          <div className="upload-text">
            <h3>
              {isDragActive ? 'Drop your file here' : 'Drag & Drop Your File Here'}
            </h3>
            <p>or click to browse files</p>
          </div>
          
          <div className="upload-button">
            <button type="button" className="browse-btn">
              <File className="btn-icon" />
              Browse Files
            </button>
          </div>
        </div>
        
        <div className="upload-info">
          <p>Supported formats: TXT, CSV, Excel (.xlsx, .xls)</p>
          <p>Maximum file size: 10MB</p>
        </div>
      </div>
      
      <div className="made-by-section">
        <p className="made-by-title">Made By</p>
        <p className="made-by-name">Abhinav Verma</p>
        <p className="made-by-role">(Associate Developer)</p>
      </div>
    </div>
  )
}

export default FileUpload
