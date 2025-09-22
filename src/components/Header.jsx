import React from 'react'
import { FileText, Upload } from 'lucide-react'
import npstLogo from '../npstlogo.jpg'
import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-text">
          <div className="title-with-logo">
            <h1>BBPS Refund Email Generator</h1>
            <img src={npstLogo} alt="NPST" className="npst-header-logo" />
          </div>
          <p>Upload your file and get the mail ready in seconds. <br/> No more manual formatting of transaction IDs with commas and quotes!</p>
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
