import Camera from './Camera';
import Lights from './Lights';
import Controls from './Controls';

function Scene() {
  return (
    <>
      <Camera />
      <Lights />
      <Controls />

      <mesh>
        <boxBufferGeometry args={[1, 1, 1]}></boxBufferGeometry>
        <meshBasicMaterial color={'red'} wireframe></meshBasicMaterial>
      </mesh>
    </>
  );
}

export default Scene;
