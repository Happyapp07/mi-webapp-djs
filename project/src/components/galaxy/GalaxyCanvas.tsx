import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, OrbitControls, Html, Stars } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { Galaxy, Planet as PlanetType } from '../../types';
import { Vector3, MathUtils, Color, AdditiveBlending, TextureLoader, RepeatWrapping, MeshStandardMaterial } from 'three';
import { motion } from 'framer-motion';

interface GalaxyCanvasProps {
  galaxies: Galaxy[];
  onSelectGalaxy: (galaxyId: string) => void;
}

const galaxyColors = {
  brimfull: {
    primary: new Color('#FF6F1F'), // Orange primary - represents vibrant sound
    secondary: new Color('#1FAEFF'), // Blue nebula - represents harmony
    particles: new Color('#FF6F1F'), 
    sphere: new Color('#1FAEFF'),
    silenceAffected: false // This galaxy is still vibrant
  },
  burning: {
    primary: new Color('#FFD700'), // Yellow primary - represents energy
    secondary: new Color('#D81E5B'), // Red nebula - represents passion
    particles: new Color('#FFD700'),
    sphere: new Color('#D81E5B'),
    silenceAffected: true // This galaxy is partially affected by silence
  },
  bright: {
    primary: new Color('#F5DEB3'), // Vanilla primary - represents melody
    secondary: new Color('#9B30FF'), // Purple nebula - represents creativity
    particles: new Color('#F5DEB3'),
    sphere: new Color('#9B30FF'),
    silenceAffected: true // This galaxy is heavily affected by silence
  },
  breaker: {
    primary: new Color('#9B30FF'), // Purple primary - represents rhythm
    secondary: new Color('#00FF9C'), // Green nebula - represents bass
    particles: new Color('#9B30FF'),
    sphere: new Color('#00FF9C'),
    silenceAffected: true // This galaxy is almost completely silenced
  }
};

const createPlanetTexture = (waterColor: string, landColor: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Draw base water color
  ctx.fillStyle = waterColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw continent shapes with organic edges - representing sound waves
  ctx.fillStyle = landColor;
  
  // Create organic shapes for continents using bezier curves
  ctx.beginPath();
  ctx.moveTo(200, 100);
  ctx.bezierCurveTo(250, 80, 300, 90, 350, 150);
  ctx.bezierCurveTo(320, 180, 290, 200, 280, 220);
  ctx.bezierCurveTo(240, 200, 220, 190, 200, 180);
  ctx.fill();

  // Add texture and noise
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 20 - 10;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);

  // Add atmospheric glow
  const gradient = ctx.createRadialGradient(
    canvas.width/2, canvas.height/2, 0,
    canvas.width/2, canvas.height/2, canvas.width/2
  );
  gradient.addColorStop(0, 'rgba(255,255,255,0.2)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new TextureLoader().load(canvas.toDataURL());
  texture.repeat.set(2, 1);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
};

const createDiscoBallTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(
    canvas.width/2, canvas.height/2, 0,
    canvas.width/2, canvas.height/2, canvas.width/2
  );
  gradient.addColorStop(0, '#FFD700');
  gradient.addColorStop(1, '#FFA500');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const tileSize = 32;
  for (let x = 0; x < canvas.width; x += tileSize) {
    for (let y = 0; y < canvas.height; y += tileSize) {
      const angleX = (x - canvas.width/2) / (canvas.width/2);
      const angleY = (y - canvas.height/2) / (canvas.height/2);
      const brightness = 0.5 + 0.5 * Math.cos(Math.atan2(angleY, angleX));
      
      const tileGradient = ctx.createLinearGradient(
        x, y, x + tileSize, y + tileSize
      );
      tileGradient.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.8})`);
      tileGradient.addColorStop(1, `rgba(255, 255, 255, ${brightness * 0.2})`);
      
      ctx.fillStyle = tileGradient;
      ctx.fillRect(x, y, tileSize - 2, tileSize - 2);
    }
  }

  const texture = new TextureLoader().load(canvas.toDataURL());
  texture.repeat.set(2, 2);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
};

const CentralStar = ({ onBackToGalaxies, showBackButton }: { onBackToGalaxies: () => void, showBackButton: boolean }) => {
  const starRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const discoBallTexture = createDiscoBallTexture();
  
  useFrame((state, delta) => {
    if (starRef.current) {
      starRef.current.rotation.y += delta * 0.2;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime) * 0.05);
    }
  });

  return (
    <group onClick={showBackButton ? onBackToGalaxies : undefined} style={{ cursor: showBackButton ? 'pointer' : 'default' }}>
      <Sphere ref={starRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          map={discoBallTexture}
          emissive={0xffd700}
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.9}
        />
      </Sphere>
      
      <Sphere ref={glowRef} args={[2.5, 64, 64]}>
        <meshStandardMaterial
          color={0xffd700}
          transparent
          opacity={0.1}
          emissive={0xffd700}
          emissiveIntensity={1}
          blending={AdditiveBlending}
        />
      </Sphere>

      {showBackButton && (
        <Html position={[0, 3, 0]} center>
          <motion.div 
            className="text-center transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white font-display text-sm bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
              Volver al Mapa Cósmico
            </p>
          </motion.div>
        </Html>
      )}
    </group>
  );
};

const GalaxyParticles = ({ count = 5000, color, spread = 10 }) => {
  const points = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.0001;
      points.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * spread;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    
    positions[i3] = radius * Math.sin(theta) * Math.cos(phi);
    positions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
    positions[i3 + 2] = radius * Math.cos(theta);
  }

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={color}
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
      />
    </points>
  );
};

const Planet = ({ 
  planet, 
  position, 
  color,
  galaxyId,
  onClick,
  visible = true,
  scale = 1,
  silenceAffected = false
}: { 
  planet: any; 
  position: [number, number, number]; 
  color: string;
  galaxyId: string;
  onClick: () => void;
  visible?: boolean;
  scale?: number;
  silenceAffected?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const planetRef = useRef<THREE.Mesh>(null);
  const initialScale = useRef(scale);

  const galaxyColor = galaxyColors[galaxyId as keyof typeof galaxyColors];
  const texture = createPlanetTexture(
    galaxyColor.secondary.getStyle(),
    galaxyColor.primary.getStyle()
  );

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.5;
      
      const floatOffset = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      planetRef.current.position.y = floatOffset;

      const targetScale = visible ? (hovered ? scale * 1.1 : scale) : 0;
      planetRef.current.scale.x = MathUtils.lerp(planetRef.current.scale.x, targetScale, 0.1);
      planetRef.current.scale.y = planetRef.current.scale.x;
      planetRef.current.scale.z = planetRef.current.scale.x;
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={planetRef}
        args={[0.4, 32, 32]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <meshStandardMaterial
          map={texture || undefined}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : silenceAffected ? 0.1 : 0.2}
          roughness={0.7}
          metalness={0.3}
          opacity={silenceAffected ? 0.7 : 1}
          transparent={true}
        />
      </Sphere>

      {visible && (
        <Html position={[0, -0.8, 0]} center>
          <motion.div 
            className={`text-center transition-all ${hovered ? 'scale-110' : 'scale-100'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className={`text-white font-display text-xs bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm ${silenceAffected ? 'opacity-70' : ''}`}>
              {planet.name}
              {silenceAffected && <span className="ml-1 text-red-400">🔇</span>}
            </p>
          </motion.div>
        </Html>
      )}
    </group>
  );
};

const GalaxyObject = ({ 
  galaxy, 
  position, 
  onSelect,
  isSelected,
  showPlanets,
  silenceAffected
}: { 
  galaxy: Galaxy; 
  position: [number, number, number]; 
  onSelect: (galaxyId: string) => void;
  isSelected: boolean;
  showPlanets: boolean;
  silenceAffected?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const planetsRef = useRef<THREE.Group>(null);
  const galaxyRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const navigate = useNavigate();
  
  const colors = galaxyColors[galaxy.id as keyof typeof galaxyColors];
  const isSilenced = colors.silenceAffected || silenceAffected;

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (!isSelected) {
        groupRef.current.rotation.y += delta * 0.1;
      }
      
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;

      if (isSelected) {
        camera.position.lerp(new Vector3(...position).add(new Vector3(0, 0, 3)), 0.05);
        camera.lookAt(new Vector3(...position));

        if (showPlanets) {
          groupRef.current.scale.lerp(new Vector3(0.5, 0.5, 0.5), 0.05);
        }
      }
    }

    if (galaxyRef.current) {
      galaxyRef.current.rotation.z += delta * 0.1;
      
      const material = galaxyRef.current.material as MeshStandardMaterial;
      const t = state.clock.elapsedTime;
      
      // Affected galaxies have reduced emissive intensity and opacity
      const baseEmissive = isSilenced ? 0.3 : 0.5;
      const baseOpacity = isSilenced ? 0.6 : 0.8;
      material.emissiveIntensity = baseEmissive + Math.sin(t) * 0.2;
      material.opacity = baseOpacity + Math.sin(t * 0.5) * 0.1;
    }

    if (planetsRef.current && showPlanets) {
      planetsRef.current.rotation.y += delta * 0.2;
    }
  });

  const planetPositions = galaxy.planets.map((_, index) => {
    const angle = (index / galaxy.planets.length) * Math.PI * 2;
    const radius = 3;
    return [
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ] as [number, number, number];
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={() => !isSelected && onSelect(galaxy.id)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Sphere 
        ref={galaxyRef}
        args={[2, 64, 64]}
        visible={!showPlanets}
      >
        <meshStandardMaterial
          color={colors.primary}
          emissive={colors.secondary}
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
          metalness={0.3}
          roughness={0.4}
          blending={AdditiveBlending}
        />
      </Sphere>

      {!showPlanets && (
        <GalaxyParticles 
          count={2000} 
          color={colors.particles} 
          spread={5}
        />
      )}

      <Html position={[0, -2, 0]} center>
        <motion.div 
          className={`text-center transition-all ${hovered ? 'scale-110' : 'scale-100'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className={`text-white font-display text-lg mb-1 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm ${isSilenced ? 'text-red-300' : ''}`}>
            {galaxy.name}
            {isSilenced && <span className="ml-2 text-red-400">🔇</span>}
          </p>
          <p className="text-sm text-gray-400 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {galaxy.planets.length} Planetas {isSilenced ? 'Silenciados' : 'Sonoros'}
          </p>
        </motion.div>
      </Html>

      <group ref={planetsRef}>
        {galaxy.planets.map((planet, index) => (
          <Planet
            key={planet.id}
            planet={planet}
            position={planetPositions[index]}
            color={galaxy.color}
            galaxyId={galaxy.id}
            onClick={() => navigate(`/planet/${galaxy.id}/${planet.id}`)}
            visible={showPlanets}
            scale={showPlanets ? 1 : 0}
            silenceAffected={isSilenced}
          />
        ))}
      </group>
    </group>
  );
};

const GalaxyCanvas: React.FC<GalaxyCanvasProps> = ({ galaxies, onSelectGalaxy }) => {
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(null);
  const [showPlanets, setShowPlanets] = useState(false);

  const handleGalaxySelect = (galaxyId: string) => {
    setSelectedGalaxy(galaxyId);
    onSelectGalaxy(galaxyId);
    
    setTimeout(() => {
      setShowPlanets(true);
    }, 1000);
  };

  const handleBackToGalaxies = () => {
    setShowPlanets(false);
    setSelectedGalaxy(null);
    onSelectGalaxy('');
  };

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2} color={0xffd700} />
        
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        <CentralStar 
          onBackToGalaxies={handleBackToGalaxies} 
          showBackButton={selectedGalaxy !== null}
        />
        
        {galaxies.map((galaxy, index) => {
          const angle = (index / galaxies.length) * Math.PI * 2;
          const radius = 8;
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;
          return (
            <GalaxyObject 
              key={galaxy.id} 
              galaxy={galaxy} 
              position={[x, 0, z]} 
              onSelect={handleGalaxySelect}
              isSelected={selectedGalaxy === galaxy.id}
              showPlanets={showPlanets && selectedGalaxy === galaxy.id}
            />
          );
        })}
        
        <OrbitControls 
          enableZoom={true} 
          maxDistance={25} 
          minDistance={10}
          autoRotate={!selectedGalaxy}
          autoRotateSpeed={0.5}
          enabled={!selectedGalaxy}
        />
      </Canvas>
    </div>
  );
};

export default GalaxyCanvas;