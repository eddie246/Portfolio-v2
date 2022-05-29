import {
  usePlane,
  useBox,
  useSphere,
  useCylinder,
  useCompoundBody,
} from '@react-three/cannon';
import { useEffect, useState, useRef } from 'react';
import { Vec3 } from 'cannon-es';

import { useFrame } from '@react-three/fiber';
import { Vector3, Matrix4, Quaternion } from 'three';

import Character from '../Character/Character';

function Scene({ setPlayerPos, camDirect, keyLog }) {
  // const [spherePRef, spherePApi] = useCylinder(() => ({
  //   mass: 1,
  //   position: [0, 1, 0],
  //   angularDamping: 1,
  //   material: {
  //     friction: 1,
  //   },
  //   args: [0.3, 0.3, 2],
  //   collisionFilterGroup: 2,
  //   collisionFilterMask: 1,
  // }));
  const [spherePRef, spherePApi] = useCompoundBody(() => ({
    mass: 1,
    angularDamping: 1,
    position: [0, 1, 0],
    shapes: [
      {
        type: 'Sphere',
        position: [0, 1.4, 0],
        rotation: [0, 0, 0],
        args: [0.3],
      },
      {
        type: 'Sphere',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        args: [0.3],
      },
      {
        type: 'Cylinder',
        position: [0, 0.7, 0],
        rotation: [0, 0, 0],
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

  useFrame(({ clock }) => {
    // if (Math.abs(pVol[0]) + Math.abs(pVol[2]) < 4) {
    //   if (keyLog['w']) {
    //     boxPApi.applyImpulse(
    //       [(camDirect.x * 4) / 20, 0, (camDirect.z * 4) / 20],
    //       [1, 0, 1]
    //     );
    //   } else if (keyLog['s']) {
    //     boxPApi.applyImpulse(
    //       [(camDirect.x * -4) / 20, 0, (camDirect.z * -4) / 20],
    //       [1, 0, 1]
    //     );
    //   } else if (keyLog['a']) {
    //     boxPApi.applyImpulse(
    //       [(camDirect.z * 4) / 20, 0, (camDirect.x * -4) / 20],
    //       [1, 0, 1]
    //     );
    //   } else if (keyLog['d']) {
    //     boxPApi.applyImpulse(
    //       [(camDirect.z * -4) / 20, 0, (camDirect.x * 4) / 20],
    //       [1, 0, 1]
    //     );
    //   }
    // }
    // boxPApi.rotation.set(0, camDirect.y, 0);
    // boxPRef.current.rotation.set(camDirect.z, 0, camDirect.x);
    // spherePApi.rotation.set(0, Math.sin(clock.elapsedTime), 0);

    var mx = new Matrix4().lookAt(
      new Vector3(camDirect.x, camDirect.y, camDirect.z),
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0)
    );
    var qt = new Quaternion().setFromRotationMatrix(mx);
    // console.log(qt);
    spherePApi.quaternion.set(qt.x, qt.y, qt.z, qt.w);
    // spherePApi.rotation.set(0, Math.min(camDirect.x, camDirect.z), 0);

    const MOVEVELOCITY = 3;
    if (keyLog['w']) {
      spherePApi.velocity.set(
        camDirect.x * MOVEVELOCITY,
        pVol.current[1],
        camDirect.z * MOVEVELOCITY
      );
    } else if (keyLog['s']) {
      spherePApi.velocity.set(
        camDirect.x * -MOVEVELOCITY,
        pVol.current[1],
        camDirect.z * -MOVEVELOCITY
      );
    } else if (keyLog['a']) {
      spherePApi.velocity.set(
        camDirect.z * MOVEVELOCITY,
        pVol.current[1],
        camDirect.x * -MOVEVELOCITY
      );
    } else if (keyLog['d']) {
      spherePApi.velocity.set(
        camDirect.z * -MOVEVELOCITY,
        pVol.current[1],
        camDirect.x * MOVEVELOCITY
      );
    } else if (keyLog['Space']) {
      spherePApi.velocity.set(pVol.current[0], 3, pVol.current[2]);
    }

    // console.log(boxPRef?.current?.distanceTo(petRef.current.position));
  });

  useEffect(() => {
    // console.log(spherePApi.position.subscribe((p) => console.log(p)));
    const unsubscribePos = spherePApi.position.subscribe((p) => {
      // setPlayerPos(p);
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
      <Character
        pPos={pPos}
        spherePRef={spherePRef}
        setPlayerPos={setPlayerPos}
      ></Character>

      <group ref={spherePRef} visible={false}>
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

      <mesh ref={ref}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={'gray'}></meshStandardMaterial>
      </mesh>
    </>
  );
}

export default Scene;
