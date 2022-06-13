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
    // mountBody('mixamorigSpine', pPos, 0, -0.3, 0);
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
    pivotB: [0, -0.5, 0],
    axisA: [0, 1, 0],
    axisB: [0, 1, 0],
    angle: 0,
    twistAngle: 0,
  });
  // useConeTwistConstraint(hipRef, spineRef, {
  //   pivotA: [0, 0.25, 0],
  //   pivotB: [0, 0, 0],
  //   axisA: [0, 1, 0],
  //   axisB: [0, 1, 0],
  //   angle: Math.PI / 16,
  //   twistAngle: Math.PI / 8,
  // });
  useConeTwistConstraint(hipRef, spherePRef, {
    pivotA: [0, 0.25, 0],
    pivotB: [0, 1, 0],
    axisA: [0, 1, 0],
    axisB: [0, 1, 0],
    angle: Math.PI / 16,
    twistAngle: Math.PI / 8,
  });

  const [rLegRef, rLegApi] = useBindBone(
    {
      mass: 0.2,
      args: [0.18, 0.2, 0.15],
      linearDamping: 0.99,
      angularDamping: 0.99,
      collisionFilterGroup: 1,
      collisionFilterMask: 1,
    },
    hipRef,
    {
      pivotA: [0.1, 0.18, 0],
      pivotB: [0, 0, 0],
      axisA: [0, 1, 0],
      axisB: [0, 1, 0],
      angle: Math.PI / 16,
      twistAngle: Math.PI / 8,
    }
  );

  const [lLegRef, lLegApi] = useBindBone(
    {
      mass: 0.2,
      args: [0.18, 0.2, 0.15],
      linearDamping: 0.99,
      angularDamping: 0.99,
      collisionFilterGroup: 1,
      collisionFilterMask: 1,
    },
    hipRef,
    {
      pivotA: [-0.1, 0.18, 0],
      pivotB: [0, 0, 0],
      axisA: [0, 1, 0],
      axisB: [0, 1, 0],
      angle: Math.PI / 16,
      twistAngle: Math.PI / 8,
    }
  );

  useEffect(() => {
    console.log(nodes);
    // SPINE
    const unSubSpineP = spineApi.position.subscribe((p) => {
      nodes['mixamorigSpine'].position.set(p[0], p[1] - 0.2, p[2]);
      setPlayerPos(p);
    });
    const unSubSpineR = spineApi.rotation.subscribe((r) => {
      nodes['mixamorigSpine'].rotation.set(...r);
    });

    // LEGS
    const unSubRLegP = rLegApi.position.subscribe((p) =>
      nodes['mixamorigRightUpLeg'].position.set(p[0], p[1] + 0.1, p[2])
    );
    const unSubRLegR = rLegApi.rotation.subscribe((r) =>
      nodes['mixamorigRightUpLeg'].rotation.set(...r)
    );

    const unSubLLegP = lLegApi.position.subscribe((p) =>
      nodes['mixamorigLeftUpLeg'].position.set(p[0], p[1] + 0.1, p[2])
    );
    const unSubLLegR = lLegApi.rotation.subscribe((r) =>
      nodes['mixamorigLeftUpLeg'].rotation.set(...r)
    );

    return () => {
      unSubSpineP();
      unSubSpineR();
      unSubRLegP();
      unSubRLegR();
      unSubLLegP();
      unSubLLegR();
    };
  }, []);

  function useBindBone(boxConfig, parentRef, constraintConfig) {
    const [ref, api] = useBox(() => boxConfig);

    useConeTwistConstraint(ref, parentRef, constraintConfig);

    return [ref, api];
  }

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
        // ref={rLegRef}
        scale={[0.01, 0.01, 0.01]}
        object={nodes['mixamorigRightUpLeg']}
      />
      <primitive
        // ref={rLegRef}
        scale={[0.01, 0.01, 0.01]}
        object={nodes['mixamorigLeftUpLeg']}
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
