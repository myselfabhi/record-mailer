import React from 'react'
import { Loader2, FileText, Zap } from 'lucide-react'
import './Processing.css'

const Processing = () => {
  return (
    <div className="processing-container">
      <div className="processing-content">
        <div className="processing-icon">
          <Loader2 className="spinner" />
        </div>
        
        <div className="processing-text">
          <h3>Processing Your File</h3>
          <p>Extracting UTXID values and formatting them...</p>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        
        <div className="processing-steps">
          <div className="step">
            <FileText className="step-icon" />
            <span>Reading file content</span>
          </div>
          <div className="step">
            <Zap className="step-icon" />
            <span>Extracting UTXID values</span>
          </div>
          <div className="step">
            <FileText className="step-icon" />
            <span>Formatting results</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Processing
