import {
  usePlane,
  useBox,
  useSphere,
  useCylinder,
  useCompoundBody,
} from '@react-three/cannon';
import { useEffect, useState, useRef } from 'react';

import { useFrame } from '@react-three/fiber';
import { Vector3, Matrix4, Quaternion, Euler, Raycaster } from 'three';

import Character from '../Character/Character';

function Scene({ setPlayerPos, camDirect, keyLog }) {
  const [spherePRef, spherePApi] = useCompoundBody(() => ({
    mass: 1,
    angularDamping: 1,
    position: [0, 1, 0],
    shapes: [
      {
        type: 'Sphere',
        position: [0, 1.4, 0],
        args: [0.3],
      },
      {
        type: 'Sphere',
        position: [0, 0, 0],
        args: [0.3],
      },
      {
        type: 'Cylinder',
        position: [0, 0.7, 0],
        args: [0.3, 0.3, 1.4],
      },
    ],
    material: {
      friction: 0.2,
    },
    collisionFilterGroup: 2,
    collisionFilterMask: 1,
  }));

  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    material: {
      friction: 0.2,
    },
    collisionFilterGroup: 1,
    collisionFilterMask: 1 | 2 | 4,
  }));

  const pVol = useRef([0, 0, 0]);
  const pPos = useRef([0, 0, 0]);
  const raycaster = useRef(new Raycaster());

  const MOVEVELOCITY = 3;

  function turnChar(direction) {
    const directions = {
      forward: 0,
      left: Math.PI / 2,
      right: -Math.PI / 2,
      back: Math.PI,
    };
    const angle = Math.atan2(camDirect.x, camDirect.z);
    spherePApi.rotation.set(0, angle + directions[direction], 0);
  }

  useFrame(({ clock }) => {
    if (keyLog['KeyW']) {
      spherePApi.velocity.set(
        camDirect.x * MOVEVELOCITY,
        pVol.current[1],
        camDirect.z * MOVEVELOCITY
      );
      turnChar('forward');
    }
    if (keyLog['KeyS']) {
      spherePApi.velocity.set(
        camDirect.x * -MOVEVELOCITY,
        pVol.current[1],
        camDirect.z * -MOVEVELOCITY
      );
      turnChar('back');
    }
    if (keyLog['KeyA']) {
      spherePApi.velocity.set(
        camDirect.z * MOVEVELOCITY,
        pVol.current[1],
        camDirect.x * -MOVEVELOCITY
      );
      turnChar('left');
    }
    if (keyLog['KeyD']) {
      spherePApi.velocity.set(
        camDirect.z * -MOVEVELOCITY,
        pVol.current[1],
        camDirect.x * MOVEVELOCITY
      );
      turnChar('right');
    }
    if (keyLog['Space']) {
      keyLog['Space'] = false;
      console.log('Player is grounded, jumping!');
      raycaster.current.far = 1;
      const origin = new Vector3(
        pPos.current[0],
        pPos.current[1],
        pPos.current[2]
      );
      const direction = new Vector3(0, -1, 0);
      raycaster.current.set(origin, direction);

      if (raycaster.current.intersectObject(ref.current)[0]?.distance < 0.4) {
        spherePApi.velocity.set(pVol.current[0], 3, pVol.current[2]);
      }
    }
  });

  useEffect(() => {
    const unsubscribePos = spherePApi.position.subscribe((p) => {
      setPlayerPos(p);
      pPos.current = p;
    });
    const unsubscribeVol = spherePApi.velocity.subscribe((v) => {
      pVol.current = v;
    });

    return () => {
      unsubscribePos();
      unsubscribeVol();
    };
  }, []);

  return (
    <>
      {/* <Character
        pPos={pPos}
        spherePRef={spherePRef}
        setPlayerPos={setPlayerPos}
      ></Character> */}

      <group ref={spherePRef} visible={true} onClick={(e) => console.log(e)}>
        <mesh position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color={'blue'} wireframe></meshStandardMaterial>
        </mesh>

        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color={'blue'} wireframe></meshStandardMaterial>
        </mesh>

        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.4]} />
          <meshStandardMaterial color={'blue'} wireframe></meshStandardMaterial>
        </mesh>
      </group>

      <mesh ref={ref} name='floor'>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={'gray'}></meshStandardMaterial>
      </mesh>
    </>
  );
}

export default Scene;
