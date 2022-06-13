import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, Debug } from '@react-three/cannon';
import { Stats } from '@react-three/drei';

import Experience from './Scene/Experience';

function App() {
  const [keyLog, setKeyLog] = useState({});

  function downHandler(e) {
    if (['Space'].includes(e.code) && !e.repeat) {
      setKeyLog((prev) => {
        return { ...prev, [e.code]: true };
      });
    }
    if (['KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code)) {
      setKeyLog((prev) => {
        return { ...prev, [e.code]: true };
      });
    }
  }

  function upHandler(e) {
    if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space'].includes(e.code)) {
      setKeyLog((prev) => {
        return { ...prev, [e.code]: false };
      });
    }
  }

  return (
    <Suspense fallback={null}>
      <Canvas tabIndex='0' onKeyDown={downHandler} onKeyUp={upHandler} shadows>
        <Stats showPanel={0} className='stats' />
        <Physics>
          <Debug color='black'>
            <Experience keyLog={keyLog} />
          </Debug>
        </Physics>
      </Canvas>
    </Suspense>
  );
}

export default App;
