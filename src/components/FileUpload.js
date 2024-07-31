import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paper, Typography } from '@mui/material';

function FileUpload({ onFileUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    onFileUpload(acceptedFiles);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Paper {...getRootProps()} style={{ padding: 20, textAlign: 'center', cursor: 'pointer' }}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography>Drop the files here ...</Typography>
      ) : (
        <Typography>Drag 'n' drop some files here, or click to select files</Typography>
      )}
    </Paper>
  );
}

export default FileUpload;