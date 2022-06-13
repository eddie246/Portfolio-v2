import {
  OrbitControls,
  PerspectiveCamera,
  TrackballControls,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useState, useRef, useEffect } from 'react';
import { Vector2, Vector3 } from 'three';

function Camera({ position, setCamDirect }) {
  const [vec3, setVec3] = useState(new Vector3(0, 2, 8));
  const camRef = useRef();

  useFrame(() => {
    if (!camRef.current) return;
    setVec3((prev) =>
      prev.subVectors(camRef.current.position, new Vector3(...position))
    );
    setCamDirect(camRef.current.getWorldDirection(new Vector3()));
    // setCamDirect(camRef.current.rotation);
  });

  return (
    <>
      {/* Default Camera */}
      <PerspectiveCamera
        makeDefault
        fov={60}
        ref={camRef}
        position={new Vector3(...position).add(vec3)}
      />

      {/* Only purpose is for smoother zoom */}
      <TrackballControls
        noPan={true}
        noRotate={true}
        dynamicDampingFactor={0.05}
        zoomSpeed={0.5}
        keys={[null, null, null]}
        minDistance={1}
        maxDistance={10}
        target={[position[0], position[1], position[2]]}
      />

      {/* Primary camera controls for 3rd POV */}
      <OrbitControls
        makeDefault
        dampingFactor={0.12}
        target={[position[0], position[1], position[2]]}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.7}
        minPolarAngle={Math.PI / 6}
      />
    </>
  );
}

export default Camera;
