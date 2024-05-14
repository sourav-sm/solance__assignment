import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [showPDF, setShowPDF] = useState(false);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new window.FileReader();
      reader.onloadend = () => {
        const newFiles = [...files, { name: file.name, type: file.type, content: reader.result }];
        setFiles(newFiles);
        setActiveFile(newFiles.length - 1);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  const handleCloseFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    if (activeFile === index) {
      setActiveFile(newFiles.length > 0 ? 0 : null);
      setShowPDF(false);
    } else if (activeFile > index) {
      setActiveFile(activeFile - 1);
    }
  };

  const handleShowPDF = () => {
    setShowPDF(!showPDF);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileUpload} />
      <div>
        {files.map((file, index) => (
          <div key={index}>
            <button onClick={() => handleCloseFile(index)}>Close</button>
            <span>{file.name}</span>
            <button onClick={handleShowPDF}>
              {showPDF ? 'Hide PDF' : 'Show PDF'}
            </button>
            {activeFile === index && showPDF && (
              <div>
                {file.type === 'application/pdf' ? (
                  <Document file={{ data: file.content }}>
                    {[...Array(20).keys()].map(pageNumber => (
                      <Page key={pageNumber + 1} pageNumber={pageNumber + 1} />
                    ))}
                  </Document>
                ) : (
                  <pre>{file.content}</pre>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;