# UTXID Formatter Portal - React Edition

A modern, professional web portal built with React for uploading files and extracting UTXID values for formatting. This application processes uploaded files, finds values under the "UTXID" heading, and formats them according to your specifications.

## **Features**

- **Modern React Architecture**: Built with React 18 and Vite for optimal performance
- **Professional UI/UX**: Clean, responsive design with smooth animations
- **File Upload Support**: Drag & drop or click to upload files
- **Multiple File Formats**: Supports TXT, CSV, and Excel files (.xlsx, .xls)
- **Smart UTXID Extraction**: Automatically finds and extracts values under "UTXID" heading
- **SQL Query Generation**: Creates complete SQL query templates with extracted UTXID values
- **Copy to Clipboard**: One-click copying of formatted results
- **Download Results**: Save formatted output as a text file
- **Error Handling**: Comprehensive error messages and validation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Toast Notifications**: Real-time feedback for user actions

## **Technology Stack**

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite (fast development and building)
- **Styling**: Modern CSS with animations and responsive design
- **File Processing**: SheetJS for Excel, PapaParse for CSV
- **Icons**: Lucide React (modern icon library)
- **Notifications**: React Hot Toast

## **How It Works**

1. **Upload File**: Drag and drop or click to select a file (TXT, CSV, or Excel)
2. **Automatic Processing**: The app reads the file and searches for "UTXID" heading
3. **Value Extraction**: Extracts all values that appear after the "UTXID" heading
4. **SQL Query Generation**: Creates a complete SQL query template with the extracted values
5. **Results**: View, copy, or download the complete SQL query ready for your mail template

## **File Format Requirements**

The uploaded file should contain a "UTXID" heading followed by the values to be formatted:

```
Some header information
More data

UTXID
12345
67890
ABCDE
FGHIJ

Other data
```

## **Supported File Types**

- **Text Files** (.txt)
- **CSV Files** (.csv)
- **Excel Files** (.xlsx, .xls)

## **Installation & Setup**

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

## **Usage**

1. Open the application in your browser (usually `http://localhost:3000`)
2. Upload your file using drag & drop or the browse button
3. Wait for processing to complete
4. Copy the formatted results or download them as a text file
5. Paste the results into your mail template

## **Project Structure**

```
record-mailer/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Header.jsx     # Header component
│   │   ├── FileUpload.jsx # File upload component
│   │   ├── Processing.jsx # Processing indicator
│   │   ├── Results.jsx    # Results display
│   │   ├── ErrorMessage.jsx # Error handling
│   │   └── Footer.jsx     # Footer component
│   ├── utils/             # Utility functions
│   │   └── fileProcessor.js # File processing logic
│   ├── App.jsx            # Main App component
│   ├── App.css            # App styles
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # This documentation
```

## **Key Components**

### **FileUpload Component**
- Drag & drop functionality using react-dropzone
- File type validation
- Visual feedback for upload states
- Support for multiple file formats

### **Processing Component**
- Animated progress indicator
- Step-by-step processing visualization
- Loading states with smooth transitions

### **Results Component**
- Formatted output display
- Copy to clipboard functionality
- Download results as text file
- File metadata display

### **File Processor Utility**
- Handles multiple file formats (TXT, CSV, Excel)
- Smart UXTID value extraction
- Advanced formatting logic
- Error handling and validation

## **Browser Requirements**

- Modern web browser with JavaScript enabled
- Support for ES6+ features
- FileReader API support
- Clipboard API support (for copy functionality)

## **Testing**

Use the included `sample_data.txt` file to test the application functionality. The sample file contains UTXID values that will be properly extracted and formatted into a complete SQL query template.

## **Customization**

The application can be easily customized by modifying:
- `src/components/*.css` for component-specific styling
- `src/App.css` for global app styling
- `src/utils/fileProcessor.js` for processing logic
- `src/components/*.jsx` for component behavior

## **Performance Features**

- **Vite Build Tool**: Lightning-fast development and building
- **Code Splitting**: Optimized bundle sizes
- **Lazy Loading**: Components load as needed
- **Modern CSS**: Hardware-accelerated animations
- **Efficient File Processing**: Client-side processing for privacy

## **Security Features**

- **Client-Side Processing**: No files are uploaded to any server
- **File Type Validation**: Strict validation of uploaded files
- **Size Limits**: Configurable file size limits
- **Error Boundaries**: Graceful error handling

## **Responsive Design**

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Perfect experience on tablets
- **Desktop Enhanced**: Rich features for desktop users
- **Touch-Friendly**: Optimized for touch interactions

---

**Professional UTXID Formatter Portal - Built with React & Modern Web Technologies**