import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
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
      <PerspectiveCamera
        makeDefault
        fov={60}
        ref={camRef}
        position={new Vector3(...position).add(vec3)}
      />

      <OrbitControls
        makeDefault
        target={[position[0], position[1] + 3, position[2]]}
        // enableZoom={false}
        enablePan={false}
        // maxAzimuthAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.7}
        // minAzimuthAngle={-Math.PI / 4}
        minPolarAngle={Math.PI / 6}
      />
    </>
  );
}

export default Camera;
