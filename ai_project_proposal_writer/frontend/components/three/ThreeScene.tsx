'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Grid } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { motion } from 'framer-motion';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function ParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 800;
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i*3] = (Math.random() - 0.5) * 50;
    positions[i*3+1] = (Math.random() - 0.5) * 30;
    positions[i*3+2] = (Math.random() - 0.5) * 30 - 20;
  }
  
  useGSAP(() => {
    if (particlesRef.current) {
      gsap.to(particlesRef.current.rotation, {
        y: Math.PI * 2,
        duration: 60,
        repeat: -1,
        ease: "none"
      });
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00FFE0"
        size={0.1}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ThreeScene() {
  return (
    <motion.div 
      className="fixed top-0 left-0 w-full h-full -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0A0A0F' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#FF007F" />
          <pointLight position={[-10, 5, -5]} intensity={0.3} color="#00FFE0" />
          
          <Grid
            args={[30, 30]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#00FFE0"
            sectionSize={3}
            sectionThickness={1.5}
            sectionColor="#FF007F"
            fadeDistance={25}
            fadeStrength={1.5}
          />
          
          <ParticleSystem />
          
          <Stars
            radius={100}
            depth={50}
            count={1500}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
          
          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              blendFunction={BlendFunction.SCREEN}
            />
            <ChromaticAberration
              offset={[0.002, 0.002]}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
