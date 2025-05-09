import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { TextureLoader } from 'three'; // To load textures
import { SoftShadows, Environment, OrbitControls } from '@react-three/drei'; // For soft shadows
import * as THREE from 'three'; // Import THREE to access constants like DoubleSide

// Function to convert the SVG to an image and use it as a texture
const createMusicIconTexture = () => {
  const svgString = `
    <svg fill="#40C057" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="250px" height="250px">
      <path d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.104,4,24,4z M21,18.453
        c0,1.132-0.914,2.535-2.999,2.535c-1.862,0-2.333-1.194-2.333-1.999c0-0.991,0.598-2.005,2.335-2.004c1.573,0,1.664-0.401,1.664-1.193v-4.028l-7.331,1.195c0,0,0,5.965,0,6.632c0,1.132-0.914,2.41-2.999,2.41c-1.862,0-2.333-1.194-2.333-1.999c0-0.991,0.598-2.005,2.335-2.005c1.573,0,1.664-0.401,1.664-1.193c0-2.21,0-6.804,0-6.804c0-0.33,0.244-0.591,0.558-0.645l8.688-1.349c0,0,0.058-0.005,0.085-0.005C20.702,8,21,8.298,21,8.666C21,8.666,21,17.787,21,18.453z"
        fill="#40C057" stroke="none" stroke-width="0"/>
    </svg>
  `;
  
  // Create an image from the SVG string and draw it onto a canvas
  const image = new Image();
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = 300; // Set canvas width and height to match the icon size
  canvas.height = 250;

  // Convert SVG string to data URL and set it as image source
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);
  image.src = url;

  return new Promise((resolve) => {
    image.onload = () => {
      // Draw the image (SVG) onto the canvas once it's loaded
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const texture = new TextureLoader().load(canvas.toDataURL());
      resolve(texture);
    };
  });
};

const RotatingLogo = () => {
  const [texture, setTexture] = useState(null);

  // Load the texture on component mount
  useEffect(() => {
    createMusicIconTexture().then(setTexture);
  }, []);

  return (
    <Canvas style={{ height: '300px', width: '300px' }}>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Directional light for more intense lighting */}
      <directionalLight position={[10, 10, 5]} intensity={0.9} castShadow />
      
      {/* Soft Shadows */}
      <SoftShadows />
      
      {/* Rotating object with the music icon as texture */}
      {texture && (
        <mesh rotation={[0.3, 0.8, 0]} scale={2} castShadow receiveShadow>
          {/* Use a more dynamic geometry like Sphere or Torus */}
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial 
            map={texture} 
            side={THREE.DoubleSide}
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      )}

      {/* Orbit controls to interact with the scene */}
      <OrbitControls />
      
      {/* Environment preset for lighting effects */}
      <Environment preset="city" />
    </Canvas>
  );
};

export default RotatingLogo;
