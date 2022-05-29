import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import {
  useBox,
  useConeTwistConstraint,
  useHingeConstraint,
  usePointToPointConstraint,
  useLockConstraint,
  useDistanceConstraint,
} from '@react-three/cannon';

import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Character({ pPos, spherePRef, setPlayerPos }) {
  const { nodes, materials } = useLoader(
    GLTFLoader,
    '/Assets/models/character.glb'
  );

  // const [, spineApi] = useBox(() => ({
  //   mass: 1,
  //   position: [0, 2, 0],
  //   args: [0.5, 0.5, 0.3],
  //   collisionFilterGroup: 4,
  //   collisionFilterMask: 1,
  // }));

  useFrame(() => {
    mountBody('Armature', pPos, 0, -0.3, 0);
  });

  function mountBody(boneName, position, x = 0, y = 0, z = 0) {
    if (!position.current) return;
    const bone = nodes['Scene'].getObjectByName(boneName);
    bone.position.set(
      position.current[0] + x,
      position.current[1] + y,
      position.current[2] + z
    );
  }

  const [spineRef, spineApi] = useBox(() => ({
    mass: 0.1,
    args: [0.3, 0.3, 0.2],
    position: [0, 1, 0],
    linearDamping: 0.99,
    angularDamping: 0.99,
    collisionFilterGroup: 1,
    collisionFilterMask: 1,
  }));
  const [hipRef, hipApi] = useBox(() => ({
    mass: 0.1,
    args: [0.3, 0.2, 0.2],
    position: [0, 0, 0],
    linearDamping: 0.99,
    angularDamping: 0.99,
    collisionFilterGroup: 1,
    collisionFilterMask: 1,
  }));

  useConeTwistConstraint(spherePRef, spineRef, {
    pivotA: [0, 0.5, 0],
    pivotB: [0, -0.4, 0],
    axisA: [0, 1, 0],
    axisB: [0, 1, 0],
    angle: 0,
    twistAngle: 0,
  });
  useConeTwistConstraint(hipRef, spineRef, {
    pivotA: [0, 0.2, 0],
    pivotB: [0, 0, 0],
    axisA: [0, 1, 0],
    axisB: [0, 1, 0],
    angle: Math.PI / 16,
    twistAngle: Math.PI / 8,
  });

  useEffect(() => {
    const unSubSpineP = spineApi.position.subscribe((p) => {
      nodes['mixamorigSpine'].position.set(p[0], p[1] - 0.2, p[2]);
      setPlayerPos(p);
    });
    const unSubSpineR = spineApi.rotation.subscribe((r) => {
      nodes['mixamorigSpine'].rotation.set(...r);
    });
    return () => {
      unSubSpineP();
      unSubSpineR();
    };
  }, []);

  return (
    <>
      {/* <mesh ref={ref}>
        <boxBufferGeometry args={[0.5, 0.5, 0.3]} />
        <meshStandardMaterial color={'red'}></meshStandardMaterial>
      </mesh> */}

      <primitive object={nodes['Scene']} />
      <primitive
        ref={hipRef}
        scale={[0.01, 0.01, 0.01]}
        object={nodes['mixamorigHips']}
      />
      <primitive
        // ref={spineRef}
        scale={[0.01, 0.01, 0.01]}
        object={nodes['mixamorigSpine']}
      />
      {/* <group dispose={null}>
        <skinnedMesh
          geometry={nodes['Beta_Surface'].geometry}
          skeleton={nodes['Beta_Surface'].skeleton}
        >
          <meshStandardMaterial color={'red'} wireframe />
        </skinnedMesh>
      </group> */}
    </>
  );
}

// useGLTF.preload('/Assets/models/character.glb');

export default Character;
