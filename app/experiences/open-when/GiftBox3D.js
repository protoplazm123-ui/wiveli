'use client';

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import {
  Canvas,
  useFrame,
} from '@react-three/fiber';

import {
  Bounds,
  Center,
  Environment,
  useAnimations,
  useGLTF,
} from '@react-three/drei';

import * as THREE from 'three';

const MODEL_URL =
  '/assets/open-when/gift_box_animation.glb';


/* -----------------------------
   ONE FLYING ENVELOPE
----------------------------- */

function FlyingEnvelope({
  index,
  total,
  open,
}) {
  const ref = useRef();

  const data = useMemo(() => {
    const angle =
      (index / Math.max(total, 1)) *
        Math.PI *
        2 +
      (Math.random() - 0.5) * 0.7;

    const distance =
      1.3 + Math.random() * 1.8;

    return {
      delay: Math.random() * 0.35,

      x:
        Math.cos(angle) *
        distance,

      y:
        1.8 +
        Math.random() * 1.8,

      z:
        Math.sin(angle) *
        distance *
        0.55,

      rotation:
        (Math.random() - 0.5) *
        Math.PI *
        2,

      spin:
        (Math.random() - 0.5) *
        2.5,

      scale:
        0.16 +
        Math.random() * 0.09,
    };
  }, [index, total]);


  useFrame((state) => {
    if (!ref.current) return;

    if (!open) {
      ref.current.visible = false;
      return;
    }

    const time =
      state.clock.elapsedTime -
      data.delay;

    if (time < 0) {
      ref.current.visible = false;
      return;
    }

    ref.current.visible = true;

    const progress =
      Math.min(time / 1.35, 1);

    const ease =
      1 -
      Math.pow(
        1 - progress,
        3
      );

    /*
      Start inside the box
    */

    ref.current.position.x =
      data.x * ease;

    ref.current.position.y =
      0.15 +
      data.y * ease -
      Math.pow(progress, 2) *
        0.55;

    ref.current.position.z =
      data.z * ease;

    ref.current.rotation.x =
      progress *
      data.spin;

    ref.current.rotation.y =
      progress *
      data.rotation;

    ref.current.rotation.z =
      progress *
      data.spin *
      0.7;

    const pop =
      Math.min(
        progress * 5,
        1
      );

    ref.current.scale.setScalar(
      data.scale * pop
    );
  });


  return (
    <group
      ref={ref}
      visible={false}
    >
      {/* envelope body */}

      <mesh>
        <boxGeometry
          args={[
            1.35,
            0.82,
            0.055,
          ]}
        />

        <meshStandardMaterial
          color="#fff4e9"
          roughness={0.72}
        />
      </mesh>


      {/* envelope flap */}

      <mesh
        position={[
          0,
          0.04,
          0.035,
        ]}
        rotation={[
          0,
          0,
          Math.PI / 4,
        ]}
        scale={[
          0.58,
          0.58,
          1,
        ]}
      >
        <planeGeometry
          args={[
            0.9,
            0.9,
          ]}
        />

        <meshStandardMaterial
          color="#ead7ca"
          side={
            THREE.DoubleSide
          }
        />
      </mesh>


      {/* little heart seal */}

      <mesh
        position={[
          0,
          -0.02,
          0.075,
        ]}
      >
        <sphereGeometry
          args={[
            0.11,
            20,
            20,
          ]}
        />

        <meshStandardMaterial
          color="#8d4050"
          roughness={0.45}
        />
      </mesh>
    </group>
  );
}


/* -----------------------------
   ENVELOPE BURST
----------------------------- */

function EnvelopeBurst({
  open,
  count,
}) {
  const safeCount =
    Math.min(
      Math.max(count || 0, 0),
      30
    );

  if (!open) return null;

  return (
    <group
      position={[
        0,
        0.25,
        0.4,
      ]}
    >
      {Array.from({
        length: safeCount,
      }).map((_, index) => (
        <FlyingEnvelope
          key={index}
          index={index}
          total={safeCount}
          open={open}
        />
      ))}
    </group>
  );
}


/* -----------------------------
   GIFT BOX
----------------------------- */

function GiftBoxModel({
  open = false,
}) {
  const group = useRef();

  const {
    scene,
    animations,
  } = useGLTF(MODEL_URL);

  const {
    actions,
    names,
  } = useAnimations(
    animations,
    group
  );


  useEffect(() => {
    if (
      !open ||
      !names.length
    ) {
      return;
    }

    const action =
      actions[names[0]];

    if (action) {
      action.reset();

      action.setLoop(
        THREE.LoopOnce,
        1
      );

      action.clampWhenFinished =
        true;

      action.play();
    }
  }, [
    open,
    actions,
    names,
  ]);


  useFrame((state) => {
    if (
      !group.current ||
      open
    ) {
      return;
    }

    const targetY =
      state.pointer.x *
      0.12;

    const targetX =
      -state.pointer.y *
      0.05;

    group.current.rotation.y +=
      (
        targetY -
        group.current.rotation.y
      ) *
      0.04;

    group.current.rotation.x +=
      (
        targetX -
        group.current.rotation.x
      ) *
      0.04;
  });


  return (
    <group ref={group}>
      <Center>
        <primitive
          object={scene}
        />
      </Center>
    </group>
  );
}


/* -----------------------------
   COMPLETE 3D SCENE
----------------------------- */

export default function GiftBox3D({
  open = false,
  onClick,
  envelopeCount = 6,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '100%',
        height: '430px',
        cursor:
          open
            ? 'default'
            : 'pointer',
      }}
    >
      <Canvas
        camera={{
          position: [
            0,
            1,
            5,
          ],
          fov: 35,
        }}
        dpr={[1, 2]}
        shadows
      >
        <ambientLight
          intensity={1.5}
        />

        <directionalLight
          position={[
            4,
            6,
            5,
          ]}
          intensity={2.5}
        />


        <Suspense
          fallback={null}
        >
          <Bounds
            fit
            clip
            observe
            margin={1.35}
          >
            <GiftBoxModel
              open={open}
            />
          </Bounds>


          <EnvelopeBurst
            open={open}
            count={
              envelopeCount
            }
          />


          <Environment
            preset="studio"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}


useGLTF.preload(
  MODEL_URL
);
