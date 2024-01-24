import React, { ChangeEvent } from 'react';
import { Input } from '@mantine/core';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

export const Upload: React.FC<FileUploadProps> = ({ onFileSelected }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];

    if (selectedFile) {
      onFileSelected(selectedFile);
    }
  };

  return (
    <div>
      <h2>Upload de Arquivos</h2>
      <Input
        type="file"
        onChange={handleFileChange}
      />
    </div>
  );
}
