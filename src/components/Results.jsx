import React, { useState } from 'react'
import { CheckCircle, Copy, Download, X, FileText, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import './Results.css'

const Results = ({ results, fileName, onClear }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(results)
      setCopied(true)
      toast.success('Results copied to clipboard!')
      
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([results], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sql_query_with_utxid_values_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('SQL query downloaded successfully!')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const estimatedSize = new Blob([results]).size

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="results-title">
          <CheckCircle className="success-icon" />
          <h3>Formatted Results</h3>
        </div>
        <button className="close-btn" onClick={onClear}>
          <X className="close-icon" />
        </button>
      </div>

      <div className="file-info">
        <div className="file-details">
          <FileText className="file-icon" />
          <div className="file-meta">
            <span className="file-name">{fileName}</span>
            <span className="file-size">~{formatFileSize(estimatedSize)}</span>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className={`action-btn copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          disabled={copied}
        >
          {copied ? <Check className="btn-icon" /> : <Copy className="btn-icon" />}
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        
        <button className="action-btn download-btn" onClick={handleDownload}>
          <Download className="btn-icon" />
          Download Results
        </button>
      </div>

      <div className="results-content">
        <div className="results-header-bar">
          <span>SQL Query with UTXID Values</span>
          <span className="line-count">
            {results.split('\n').length} lines
          </span>
        </div>
        <pre className="formatted-output">{results}</pre>
      </div>

      <div className="results-footer">
        <p>SQL query is ready to copy and paste into your mail template</p>
      </div>
    </div>
  )
}

export default Results
