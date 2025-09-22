import * as XLSX from 'xlsx'
import Papa from 'papaparse'

/**
 * Process uploaded file and extract UXTID values
 * @param {File} file - The uploaded file
 * @returns {Promise<string>} - Formatted UXTID values
 */
export const processFile = async (file) => {
  try {
    let content = ''
    
    // Determine file type and read content
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      content = await readTextFile(file)
    } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      content = await readCSVFile(file)
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      content = await readExcelFile(file)
    } else {
      throw new Error('Unsupported file format. Please upload TXT, CSV, or Excel files.')
    }

    // Extract UTXID values
    const utxidValues = extractUTXIDValues(content)
    
    if (utxidValues.length === 0) {
      throw new Error('No UTXID values found. Please ensure your file contains a "UTXID" heading followed by values.')
    }

    // Format the values
    return formatIds(utxidValues.join('\n'))
    
  } catch (error) {
    console.error('File processing error:', error)
    throw new Error(error.message || 'Failed to process file')
  }
}

/**
 * Read text file content
 * @param {File} file - Text file
 * @returns {Promise<string>} - File content
 */
const readTextFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(new Error('Failed to read text file'))
    reader.readAsText(file)
  })
}

/**
 * Read CSV file content
 * @param {File} file - CSV file
 * @returns {Promise<string>} - File content
 */
const readCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvText = e.target.result
        // Parse CSV and convert back to text format
        Papa.parse(csvText, {
          complete: (results) => {
            const textContent = results.data
              .map(row => Array.isArray(row) ? row.join('\t') : row)
              .join('\n')
            resolve(textContent)
          },
          error: (error) => reject(new Error('Failed to parse CSV file'))
        })
      } catch (error) {
        reject(new Error('Failed to read CSV file'))
      }
    }
    reader.onerror = (e) => reject(new Error('Failed to read CSV file'))
    reader.readAsText(file)
  })
}

/**
 * Read Excel file content
 * @param {File} file - Excel file
 * @returns {Promise<string>} - File content
 */
const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        
        // Convert to JSON and then to text format
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: ''
        })
        
        const textContent = jsonData
          .map(row => Array.isArray(row) ? row.join('\t') : String(row))
          .join('\n')
        
        resolve(textContent)
      } catch (error) {
        reject(new Error('Failed to parse Excel file'))
      }
    }
    reader.onerror = (e) => reject(new Error('Failed to read Excel file'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Extract UTXID values from file content
 * @param {string} content - File content
 * @returns {string[]} - Array of UTXID values
 */
const extractUTXIDValues = (content) => {
  const lines = content.split('\n')
  const utxidValues = []
  let foundUTXID = false

  for (let line of lines) {
    const trimmedLine = line.trim()
    
    // Check if this line contains "UTXID" (case insensitive)
    if (trimmedLine.toUpperCase().includes('UTXID')) {
      foundUTXID = true
      continue
    }

    // If we found UTXID and this line is not empty, process the line
    if (foundUTXID && trimmedLine) {
      // Skip if this line looks like another header
      if (isHeaderLine(trimmedLine)) {
        break
      }
      
      // Extract transaction ID from the line
      const transactionId = extractTransactionId(trimmedLine)
      if (transactionId) {
        utxidValues.push(transactionId)
      }
    }
  }

  return utxidValues
}

/**
 * Extract transaction ID from a data line
 * @param {string} line - Data line
 * @returns {string|null} - Transaction ID or null if not found
 */
const extractTransactionId = (line) => {
  // Split by tab or space to get columns
  const columns = line.split(/\s+/)
  
  // Look for COB1F pattern in the line
  for (let column of columns) {
    if (column.includes('COB1F') && column.length > 20) {
      return column
    }
  }
  
  // If no COB1F pattern found, return the last column (assuming it's the transaction ID)
  if (columns.length > 0) {
    const lastColumn = columns[columns.length - 1]
    // Check if it looks like a transaction ID (starts with COB and is long enough)
    if (lastColumn.startsWith('COB') && lastColumn.length > 20) {
      return lastColumn
    }
  }
  
  return null
}

/**
 * Check if a line looks like a header
 * @param {string} line - Line to check
 * @returns {boolean} - True if line looks like a header
 */
const isHeaderLine = (line) => {
  const upperLine = line.toUpperCase()
  
  // Common header patterns
  const headerPatterns = [
    /^[A-Z\s]+$/, // All caps
    /ID$/, // Ends with ID
    /NAME$/, // Ends with NAME
    /DATE$/, // Ends with DATE
    /STATUS$/, // Ends with STATUS
    /TYPE$/, // Ends with TYPE
    /^[A-Z]{2,}$/ // Short all-caps words
  ]
  
  // Check if line is too short to be data
  if (line.length < 3) return true
  
  // Check against header patterns
  return headerPatterns.some(pattern => pattern.test(upperLine))
}

/**
 * Format UTXID values according to requirements
 * @param {string} rawText - Raw UTXID values
 * @returns {string} - Formatted SQL query with UTXID values
 */
const formatIds = (rawText) => {
  // Split the input by newlines, strip spaces, and ignore empty lines
  const lines = rawText.split('\n')
    .map(line => line.trim())
    .filter(line => line)
  
  // Wrap each line with quotes and comma
  const formattedValues = lines.map(line => `'${line}',`)
  
  // Create the complete SQL query template
  const sqlQuery = `Hi @Pankaj Kumar
 TimePay_Daily BBPS Refunds Valid_Records query.

@Jitendra Sir, Kindly approve.


UPDATE customertxns SET initiateRefundDate = '2025-09-18 00:00:00', completeRefundDate='2025-09-18 00:00:00', bbpsState='refund_completed_manual', bbpsRefundStatus='2' WHERE txnId IN (
${formattedValues.join('\n')}
) AND status='2' AND refId IS NOT NULL AND refId != 'null';`
  
  return sqlQuery
}

/**
 * Validate file type
 * @param {File} file - File to validate
 * @returns {boolean} - True if valid
 */
export const validateFileType = (file) => {
  const allowedTypes = [
    'text/plain',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  
  const allowedExtensions = ['.txt', '.csv', '.xlsx', '.xls']
  
  return allowedTypes.includes(file.type) || 
         allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
