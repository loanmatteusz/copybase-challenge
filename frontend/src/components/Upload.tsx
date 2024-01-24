import React, { useEffect, useState } from 'react';
import { Box, FileInput, LoadingOverlay } from '@mantine/core';

interface FileUploadProps {
  onFileSelected: (file: File) => Promise<void>;
  placeholder: string;
  fileLoading?: boolean;
}

export const Upload: React.FC<FileUploadProps> = ({ onFileSelected, placeholder, fileLoading = false }) => {
  const [value, setValue] = useState<File | null>(null);

  const handleFileSelected = async (file: File) => {
    await onFileSelected(file);
  }

  useEffect(() => {
    if (value) {
      handleFileSelected(value);
    }
  }, [value]);

  return (
    <Box h={140}>
      {
        fileLoading ?
          <Box w="100%" h={60} pos="relative">
            <LoadingOverlay visible={true} overlayProps={{ radius: "sm", blur: 2, backgroundOpacity: 0 }} />
          </Box> :
          <FileInput
            value={value}
            onChange={setValue}
            placeholder={placeholder}
            size='xl'
          />
      }
    </Box>
  );
}
