import Lights from './Lights';
import Camera from './Camera';

import Scene from './Scene';
import { useState } from 'react';

function Experience({ keyLog }) {
  const [playPos, setPlayerPos] = useState([0, 0, 0]);
  const [camDirect, setCamDirect] = useState(null);

  return (
    <>
      <Lights />
      <Camera position={playPos} setCamDirect={setCamDirect} />
      <Scene
        setPlayerPos={setPlayerPos}
        camDirect={camDirect}
        keyLog={keyLog}
      />
    </>
  );
}

export default Experience;
