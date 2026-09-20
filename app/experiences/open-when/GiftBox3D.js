'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Bounds,
  Center,
  Environment,
  useAnimations,
  useGLTF,
} from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/assets/open-when/gift_box_animation.glb';

function GiftBoxModel({ open = false }) {
  const group = useRef();
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (!open || !names.length) return;

    const action = actions[names[0]];

    if (action) {
      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
    }
  }, [open, actions, names]);

  useFrame((state) => {
    if (!group.current || open) return;

    const targetY = state.pointer.x * 0.12;
    const targetX = -state.pointer.y * 0.05;

    group.current.rotation.y +=
      (targetY - group.current.rotation.y) * 0.04;

    group.current.rotation.x +=
      (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

export default function GiftBox3D({
  open = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '100%',
        height: '430px',
        cursor: 'pointer',
      }}
    >
      <Canvas
        camera={{
          position: [0, 1, 5],
          fov: 35,
        }}
        dpr={[1, 2]}
        shadows
      >
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[4, 6, 5]}
          intensity={2.5}
        />

        <Suspense fallback={null}>
          <Bounds
            fit
            clip
            observe
            margin={1.35}
          >
            <GiftBoxModel open={open} />
          </Bounds>

          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
