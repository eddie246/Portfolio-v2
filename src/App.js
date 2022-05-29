import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, Debug } from '@react-three/cannon';
import styled from '@emotion/styled';

import Experience from './Scene/Experience';

function App() {
  const [keyLog, setKeyLog] = useState({});

  function downHandler(e) {
    if (e.key === 'w') {
      setKeyLog((prev) => {
        return { ...prev, w: true };
      });
    } else if (e.key === 's') {
      setKeyLog((prev) => {
        return { ...prev, s: true };
      });
    } else if (e.key === 'a') {
      setKeyLog((prev) => {
        return { ...prev, a: true };
      });
    } else if (e.key === 'd') {
      setKeyLog((prev) => {
        return { ...prev, d: true };
      });
    } else if (e.code === 'Space') {
      setKeyLog((prev) => {
        return { ...prev, Space: true };
      });
    }
  }

  function upHandler(e) {
    if (e.key === 'w') {
      setKeyLog((prev) => {
        return { ...prev, w: false };
      });
    } else if (e.key === 's') {
      setKeyLog((prev) => {
        return { ...prev, s: false };
      });
    } else if (e.key === 'a') {
      setKeyLog((prev) => {
        return { ...prev, a: false };
      });
    } else if (e.key === 'd') {
      setKeyLog((prev) => {
        return { ...prev, d: false };
      });
    } else if (e.code === 'Space') {
      setKeyLog((prev) => {
        return { ...prev, Space: false };
      });
    }
  }

  return (
    <Suspense fallback={null}>
      <Canvas tabIndex='0' onKeyDown={downHandler} onKeyUp={upHandler} shadows>
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
