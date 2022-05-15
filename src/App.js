import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

import Scene from './Scene/Scene';

function App() {
  return (
    <Suspense fallback={null}>
      <Canvas shadows>
        <Scene />
      </Canvas>
    </Suspense>
  );
}

export default App;
