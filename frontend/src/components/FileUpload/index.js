import React, { useState, useRef } from 'react';
import './index.css';

const UploadSvg = () => (
    <svg width="30" height="22" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.66732 21.6673C5.6451 21.6673 3.91754 20.9673 2.48465 19.5673C1.05087 18.1673 0.333984 16.4562 0.333984 14.434C0.333984 12.7007 0.856207 11.1562 1.90065 9.80065C2.9451 8.4451 4.31176 7.57843 6.00065 7.20065C6.55621 5.15621 7.66732 3.50065 9.33398 2.23398C11.0007 0.967318 12.8895 0.333984 15.0007 0.333984C17.6007 0.333984 19.806 1.23932 21.6167 3.04998C23.4282 4.86154 24.334 7.06732 24.334 9.66732C25.8673 9.8451 27.1398 10.506 28.1513 11.65C29.162 12.7949 29.6673 14.134 29.6673 15.6673C29.6673 17.334 29.0842 18.7509 27.918 19.918C26.7509 21.0842 25.334 21.6673 23.6673 21.6673H16.334C15.6007 21.6673 14.9731 21.4064 14.4513 20.8847C13.9287 20.362 13.6673 19.734 13.6673 19.0007V12.0673L12.4673 13.2673C12.2229 13.5118 11.9118 13.634 11.534 13.634C11.1562 13.634 10.8451 13.5118 10.6007 13.2673C10.3562 13.0229 10.234 12.7118 10.234 12.334C10.234 11.9562 10.3562 11.6451 10.6007 11.4007L14.0673 7.93398C14.2007 7.80065 14.3451 7.70599 14.5007 7.64999C14.6562 7.59487 14.8229 7.56732 15.0007 7.56732C15.1784 7.56732 15.3451 7.59487 15.5007 7.64999C15.6562 7.70599 15.8007 7.80065 15.934 7.93398L19.4007 11.4007C19.6451 11.6451 19.7673 11.9562 19.7673 12.334C19.7673 12.7118 19.6451 13.0229 19.4007 13.2673C19.1562 13.5118 18.8451 13.634 18.4673 13.634C18.0895 13.634 17.7784 13.5118 17.534 13.2673L16.334 12.0673V19.0007H23.6673C24.6007 19.0007 25.3895 18.6784 26.034 18.034C26.6784 17.3895 27.0007 16.6007 27.0007 15.6673C27.0007 14.734 26.6784 13.9451 26.034 13.3007C25.3895 12.6562 24.6007 12.334 23.6673 12.334H21.6673V9.66732C21.6673 7.82287 21.0175 6.25043 19.718 4.94998C18.4175 3.65043 16.8451 3.00065 15.0007 3.00065C13.1562 3.00065 11.5842 3.65043 10.2847 4.94998C8.98421 6.25043 8.33398 7.82287 8.33398 9.66732H7.66732C6.37843 9.66732 5.27843 10.1229 4.36732 11.034C3.45621 11.9451 3.00065 13.0451 3.00065 14.334C3.00065 15.6229 3.45621 16.7229 4.36732 17.634C5.27843 18.5451 6.37843 19.0007 7.66732 19.0007H9.66732C10.0451 19.0007 10.362 19.1287 10.618 19.3847C10.8731 19.6398 11.0007 19.9562 11.0007 20.334C11.0007 20.7118 10.8731 21.0282 10.618 21.2833C10.362 21.5393 10.0451 21.6673 9.66732 21.6673H7.66732Z" fill="#8E8E93"/>
    </svg>
)

const FileUpload = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-area ${isDragging ? 'dragging' : ''}`}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div className="upload-icon">
          <UploadSvg />
        </div>
        <p className="upload-text">Carregar arquivo</p>
        <p className="upload-subtext">
          Escolha um arquivo ou arraste e solte aqui
        </p>
      </div>
    </div>
  );
};

export default FileUpload;