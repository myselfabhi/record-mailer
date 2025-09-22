import React from 'react'
import { Upload, FileText } from 'lucide-react'
import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-icon">
          <Upload className="icon" />
        </div>
        <div className="header-text">
          <h1>BBPS Refund Email Generator</h1>
          <p>Upload your file and get the mail ready in seconds. No more manual formatting of transaction IDs with commas and quotes!</p>
        </div>
      </div>
      <div className="header-features">
        <div className="feature">
          <FileText className="feature-icon" />
          <span>Multiple File Formats</span>
        </div>
        <div className="feature">
          <Upload className="feature-icon" />
          <span>Drag & Drop Upload</span>
        </div>
        <div className="feature">
          <FileText className="feature-icon" />
          <span>Smart Processing</span>
        </div>
      </div>
    </header>
  )
}

export default Header
