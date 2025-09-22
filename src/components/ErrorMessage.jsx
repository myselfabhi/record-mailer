import React from 'react'
import { AlertTriangle, RotateCcw, X } from 'lucide-react'
import './ErrorMessage.css'

const ErrorMessage = ({ error, onRetry, onClear }) => {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-icon">
          <AlertTriangle className="icon" />
        </div>
        
        <div className="error-text">
          <h3>Processing Error</h3>
          <p>{error}</p>
        </div>
        
        <div className="error-actions">
          <button className="retry-btn" onClick={onRetry}>
            <RotateCcw className="btn-icon" />
            Try Again
          </button>
          
          <button className="clear-btn" onClick={onClear}>
            <X className="btn-icon" />
            Clear
          </button>
        </div>
      </div>
      
      <div className="error-suggestions">
        <h4>Common Solutions:</h4>
        <ul>
          <li>Ensure your file contains a "UTXID" heading followed by values</li>
          <li>Check that the file format is supported (TXT, CSV, Excel)</li>
          <li>Verify the file is not corrupted or password-protected</li>
          <li>Try with a smaller file if the current one is very large</li>
        </ul>
      </div>
    </div>
  )
}

export default ErrorMessage
