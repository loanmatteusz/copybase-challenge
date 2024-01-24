import React, { useEffect, useState } from 'react';
import { Box, FileInput } from '@mantine/core';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  placeholder: string;
}

export const Upload: React.FC<FileUploadProps> = ({ onFileSelected, placeholder }) => {
  const [value, setValue] = useState<File | null>(null);

  useEffect(() => {
    if (value) {
      onFileSelected(value);
    }
  }, [value]);

  return (
    <Box h={140}>
        <FileInput
          accept=''
          value={value}
          onChange={setValue}
          placeholder={placeholder}
          size='xl'
        />
    </Box>
  );
}
