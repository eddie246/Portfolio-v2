import { OrbitControls } from '@react-three/drei';

function Controls() {
  return <OrbitControls target={[0, 0, 0]}></OrbitControls>;
}

export default Controls;
