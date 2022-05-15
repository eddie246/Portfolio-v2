import { PerspectiveCamera } from '@react-three/drei';

function Camera() {
  return (
    <PerspectiveCamera
      makeDefault
      fov={50}
      position={[1, 1, 1]}
    ></PerspectiveCamera>
  );
}

export default Camera;
