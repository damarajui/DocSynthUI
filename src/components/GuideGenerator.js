import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Paper, CircularProgress, Chip, Stepper, Step, StepLabel, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CloudUpload, Delete, ArrowForward } from '@mui/icons-material';
import { useGuideContext } from '../context/GuideContext';

const GuideGenerator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [urls, setUrls] = useState('');
  const [files, setFiles] = useState([]);
  const [projectType, setProjectType] = useState('');
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState(null);
  const { updateHistory } = useGuideContext();

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles]);
    },
  });

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('urls', urls);
    formData.append('project_type', projectType);
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await axios.post('http://localhost:8000/generate_guide', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setGuide(response.data);
      setActiveStep(3);
      
      // Update the history
      const newHistoryItem = {
        id: response.data.id,
        projectType: projectType,
        status: 'Completed',
        createdAt: new Date().toISOString(),
      };
      updateHistory(newHistoryItem);
    } catch (error) {
      console.error('Error generating guide:', error);
      // Add error handling here, e.g., display an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Enter URLs', 'Upload Files', 'Specify Project Type', 'Generated Guide'];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TextField
            fullWidth
            label="Documentation URLs (one per line)"
            multiline
            rows={4}
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            margin="normal"
            variant="outlined"
          />
        );
      case 1:
        return (
          <Box>
            <Paper
              {...getRootProps()}
              elevation={0}
              sx={{
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                p: 4,
                mb: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <input {...getInputProps()} />
              <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography>Drag 'n' drop files here, or click to select</Typography>
            </Paper>
            {files.length > 0 && (
              <Box sx={{ mb: 2 }}>
                {files.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => setFiles(files.filter((_, i) => i !== index))}
                    sx={{ mr: 1, mb: 1 }}
                    deleteIcon={<Delete />}
                  />
                ))}
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <TextField
            fullWidth
            label="Project Type"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            margin="normal"
            variant="outlined"
          />
        );
      case 3:
        return guide && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: 'background.paper' }}>
              <Typography variant="h5" gutterBottom color="primary">
                Generated Guide
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {guide.content}
              </Typography>
            </Paper>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Generate Setup Guide
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderStepContent(activeStep)}
      </motion.div>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {activeStep < 3 && (
          <Button
            variant="contained"
            color="primary"
            endIcon={activeStep === 2 ? <CloudUpload /> : <ArrowForward />}
            onClick={activeStep === 2 ? handleSubmit : () => setActiveStep((prev) => prev + 1)}
            disabled={loading}
          >
            {activeStep === 2 ? (loading ? <CircularProgress size={24} /> : 'Generate Guide') : 'Next'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default GuideGenerator;