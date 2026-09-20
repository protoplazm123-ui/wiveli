'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  useAnimations,
  useGLTF,
} from '@react-three/drei';

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
      action.setLoop(2200, 1);
      action.clampWhenFinished = true;
      action.play();
    }
  }, [open, actions, names]);

  useFrame((state) => {
    if (!group.current || open) return;

    const x = state.pointer.x * 0.12;
    const y = state.pointer.y * 0.06;

    group.current.rotation.y +=
      (x - group.current.rotation.y) * 0.04;

    group.current.rotation.x +=
      (-y - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group}>
      <primitive
        object={scene}
        scale={1.7}
      />
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
          position: [0, 1.4, 5],
          fov: 38,
        }}
        shadows
      >
        <ambientLight intensity={1.4} />

        <directionalLight
          position={[4, 6, 4]}
          intensity={2.5}
          castShadow
        />

        <Suspense fallback={null}>
          <GiftBoxModel open={open} />

          <Environment preset="studio" />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
