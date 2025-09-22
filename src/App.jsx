import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import Processing from './components/Processing'
import Results from './components/Results'
import ErrorMessage from './components/ErrorMessage'
import Footer from './components/Footer'
import { processFile } from './utils/fileProcessor'
import './App.css'

function App() {
  const [currentFile, setCurrentFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleFileUpload = async (file) => {
    setCurrentFile(file)
    setError(null)
    setResults(null)
    setIsProcessing(true)

    try {
      const formattedResult = await processFile(file)
      setResults(formattedResult)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClearFile = () => {
    setCurrentFile(null)
    setResults(null)
    setError(null)
    setIsProcessing(false)
  }

  const handleRetry = () => {
    if (currentFile) {
      handleFileUpload(currentFile)
    }
  }

  return (
    <div className="app">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="container">
        <Header />
        
        <main className="main-content">
          {!currentFile && !isProcessing && (
            <FileUpload onFileUpload={handleFileUpload} />
          )}
          
          {isProcessing && (
            <Processing />
          )}
          
          {error && (
            <ErrorMessage 
              error={error} 
              onRetry={handleRetry}
              onClear={handleClearFile}
            />
          )}
          
          {results && !isProcessing && (
            <Results 
              results={results}
              fileName={currentFile?.name}
              onClear={handleClearFile}
            />
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  )
}

export default App
