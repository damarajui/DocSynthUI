import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, shaderMaterial, useTexture, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';

const CodeMaterial = shaderMaterial(
  {
    time: 0,
    paperTexture: null,
    noiseTexture: null,
  },
  // vertex shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float time;
    uniform sampler2D paperTexture;
    uniform sampler2D noiseTexture;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
      vec4 paper = texture2D(paperTexture, vUv);
      vec4 noise = texture2D(noiseTexture, vUv * 2.0 + time * 0.05);
      
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float diff = max(dot(vNormal, lightDir), 0.0);
      
      vec3 lineColor = vec3(0.8, 0.8, 1.0);
      vec3 codeColor = vec3(0.2, 0.7, 0.2);
      
      float line = step(0.98, fract(vUv.y * 40.0));
      float codeLine = step(0.95, noise.r);
      
      vec3 finalColor = mix(paper.rgb, lineColor, line * 0.3);
      finalColor = mix(finalColor, codeColor, codeLine * 0.7);
      finalColor *= (diff * 0.5 + 0.5);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ CodeMaterial });

const DocumentStack = () => {
  const groupRef = useRef();
  const materialRef = useRef();
  const paperTexture = useTexture('./textures/paper_texture.jpg');
  const noiseTexture = useTexture('./textures/noise_texture.png');

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
    }
  });

  const sheets = useMemo(() => {
    return Array(10).fill().map((_, i) => (
      <mesh key={i} position={[0, i * 0.02, 0]} rotation={[0, 0, Math.random() * 0.1 - 0.05]}>
        <planeGeometry args={[3, 4, 64, 64]} />
        <codeMaterial ref={materialRef} paperTexture={paperTexture} noiseTexture={noiseTexture} />
      </mesh>
    ));
  }, [paperTexture, noiseTexture]);

  return (
    <group ref={groupRef} rotation={[0.2, -Math.PI / 6, 0]}>
      {sheets}
    </group>
  );
};

const LandingPage = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#1a1a2e' }}>
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          <Suspense fallback={null}>
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
            <DocumentStack />
            <EffectComposer>
              <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
              <Noise opacity={0.02} />
            </EffectComposer>
          </Suspense>
        </Canvas>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h2" gutterBottom sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              DocSynth
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              Revolutionize Your Setup Guides
            </Typography>
            <Button
              component={Link}
              to="/generate"
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                backgroundColor: '#8352FD',
                '&:hover': { backgroundColor: '#6B42D1' },
              }}
            >
              Get Started
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;