// UXTID Formatter Portal JavaScript

class UXTIDFormatter {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.removeFile = document.getElementById('removeFile');
        this.processingSection = document.getElementById('processingSection');
        this.progressFill = document.getElementById('progressFill');
        this.resultsSection = document.getElementById('resultsSection');
        this.formattedOutput = document.getElementById('formattedOutput');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.errorSection = document.getElementById('errorSection');
        this.errorText = document.getElementById('errorText');
    }

    attachEventListeners() {
        // File input change
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Click to upload
        this.uploadArea.addEventListener('click', () => this.fileInput.click());

        // Remove file
        this.removeFile.addEventListener('click', () => this.clearFile());

        // Copy button
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());

        // Download button
        this.downloadBtn.addEventListener('click', () => this.downloadResults());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        // Validate file type
        const allowedTypes = [
            'text/plain',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|csv|xlsx|xls)$/i)) {
            this.showError('Please upload a valid file (TXT, CSV, or Excel format)');
            return;
        }

        // Show file info
        this.showFileInfo(file);

        // Process the file
        this.processFileContent(file);
    }

    showFileInfo(file) {
        this.fileName.textContent = file.name;
        this.fileSize.textContent = this.formatFileSize(file.size);
        this.fileInfo.style.display = 'flex';
        this.uploadArea.style.display = 'none';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async processFileContent(file) {
        this.showProcessing();
        
        try {
            let content = '';
            
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                content = await this.readTextFile(file);
            } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                content = await this.readTextFile(file);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                content = await this.readExcelFile(file);
            }

            // Extract UXTID values
            const uxtidValues = this.extractUXTIDValues(content);
            
            if (uxtidValues.length === 0) {
                this.showError('No UXTID values found in the file. Please ensure the file contains a "UXTID" heading followed by values.');
                return;
            }

            // Format the values
            const formattedResult = this.formatIds(uxtidValues.join('\n'));
            
            // Show results
            this.showResults(formattedResult);
            
        } catch (error) {
            console.error('Error processing file:', error);
            this.showError('Error processing file: ' + error.message);
        }
    }

    readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    readExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    
                    // Convert to text format
                    const textContent = jsonData.map(row => row.join('\t')).join('\n');
                    resolve(textContent);
                } catch (error) {
                    reject(new Error('Failed to parse Excel file'));
                }
            };
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    }

    extractUXTIDValues(content) {
        const lines = content.split('\n');
        const uxtidValues = [];
        let foundUXTID = false;

        for (let line of lines) {
            const trimmedLine = line.trim();
            
            // Check if this line contains "UXTID" (case insensitive)
            if (trimmedLine.toUpperCase().includes('UXTID')) {
                foundUXTID = true;
                continue;
            }

            // If we found UXTID and this line is not empty, add it to values
            if (foundUXTID && trimmedLine) {
                // Skip if this line looks like another header
                if (trimmedLine.toUpperCase().includes('ID') && trimmedLine.length < 20) {
                    break;
                }
                uxtidValues.push(trimmedLine);
            }
        }

        return uxtidValues;
    }

    formatIds(rawText) {
        // Split the input by newlines, strip spaces, and ignore empty lines
        const lines = rawText.split('\n').map(line => line.trim()).filter(line => line);
        
        // Wrap each line with quotes and comma
        const formatted = lines.map(line => `'${line}',`);
        
        // Join them back into one block
        return formatted.join('\n');
    }

    showProcessing() {
        this.hideAllSections();
        this.processingSection.style.display = 'block';
        
        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) progress = 100;
            this.progressFill.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 200);
    }

    showResults(formattedResult) {
        this.hideAllSections();
        this.formattedOutput.textContent = formattedResult;
        this.resultsSection.style.display = 'block';
        this.resultsSection.classList.add('success-animation');
        
        // Store result for copy/download
        this.currentResult = formattedResult;
    }

    showError(message) {
        this.hideAllSections();
        this.errorText.textContent = message;
        this.errorSection.style.display = 'block';
    }

    hideAllSections() {
        this.processingSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.errorSection.style.display = 'none';
        this.resultsSection.classList.remove('success-animation');
    }

    clearFile() {
        this.fileInput.value = '';
        this.fileInfo.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.hideAllSections();
        this.currentResult = null;
    }

    async copyToClipboard() {
        if (!this.currentResult) return;

        try {
            await navigator.clipboard.writeText(this.currentResult);
            
            // Visual feedback
            const originalText = this.copyBtn.innerHTML;
            this.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            this.copyBtn.style.background = '#38a169';
            
            setTimeout(() => {
                this.copyBtn.innerHTML = originalText;
                this.copyBtn.style.background = '#4299e1';
            }, 2000);
            
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showError('Failed to copy to clipboard. Please try again.');
        }
    }

    downloadResults() {
        if (!this.currentResult) return;

        const blob = new Blob([this.currentResult], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted_uxtid_values.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UXTIDFormatter();
});

// Add some utility functions for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading states
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});
