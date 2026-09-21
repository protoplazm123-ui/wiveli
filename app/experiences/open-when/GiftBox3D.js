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


/* --------------------------------
   ONE FLYING ENVELOPE
-------------------------------- */

function FlyingEnvelope({
  index,
  total,
}) {
  const ref = useRef();
  const startTime = useRef(null);

  const data = useMemo(() => {
    const angle =
      (index / Math.max(total, 1)) *
        Math.PI *
        2 +
      (Math.random() - 0.5) * 0.55;

    const distance =
      1.15 + Math.random() * 1.25;

    return {
      delay:
        index * 0.045 +
        Math.random() * 0.12,

      x:
        Math.cos(angle) *
        distance,

      y:
        1.6 +
        Math.random() * 1.25,

      z:
        0.25 +
        Math.sin(angle) *
          0.65,

      spinX:
        (Math.random() - 0.5) *
        2.5,

      spinY:
        (Math.random() - 0.5) *
        3.5,

      spinZ:
        (Math.random() - 0.5) *
        2.2,

      scale:
        0.18 +
        Math.random() * 0.07,
    };
  }, [index, total]);


  useFrame((state) => {
    if (!ref.current) return;

    if (startTime.current === null) {
      startTime.current =
        state.clock.elapsedTime;
    }

    const elapsed =
      state.clock.elapsedTime -
      startTime.current -
      data.delay;

    if (elapsed < 0) {
      ref.current.visible = false;
      return;
    }

    ref.current.visible = true;

    const duration = 1.35;

    const progress =
      Math.min(
        elapsed / duration,
        1
      );

    /*
      Fast launch,
      then softer landing.
    */

    const ease =
      1 -
      Math.pow(
        1 - progress,
        3
      );

    /*
      Starts INSIDE the box.
    */

    ref.current.position.x =
      data.x * ease;

    ref.current.position.y =
      0.18 +
      data.y * ease -
      0.45 *
        progress *
        progress;

    ref.current.position.z =
      data.z * ease;

    /*
      Rotation while flying.
    */

    ref.current.rotation.x =
      data.spinX *
      progress;

    ref.current.rotation.y =
      data.spinY *
      progress;

    ref.current.rotation.z =
      data.spinZ *
      progress;

    /*
      Small "pop" as envelope
      leaves the box.
    */

    const pop =
      Math.min(
        progress * 6,
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
      {/* BODY */}

      <mesh castShadow>
        <boxGeometry
          args={[
            1.35,
            0.82,
            0.06,
          ]}
        />

        <meshStandardMaterial
          color="#fff5ea"
          roughness={0.68}
        />
      </mesh>


      {/* FLAP */}

      <mesh
        position={[
          0,
          0.06,
          0.036,
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
          side={THREE.DoubleSide}
          roughness={0.75}
        />
      </mesh>


      {/* SEAL */}

      <mesh
        position={[
          0,
          -0.03,
          0.08,
        ]}
      >
        <sphereGeometry
          args={[
            0.105,
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


/* --------------------------------
   ENVELOPE BURST
-------------------------------- */

function EnvelopeBurst({
  count = 6,
}) {
  const safeCount =
    Math.min(
      Math.max(count, 1),
      30
    );

  return (
    <group
      position={[
        0,
        0.15,
        0.55,
      ]}
    >
      {Array.from({
        length: safeCount,
      }).map((_, index) => (
        <FlyingEnvelope
          key={index}
          index={index}
          total={safeCount}
        />
      ))}
    </group>
  );
}


/* --------------------------------
   EXISTING GIFT BOX
-------------------------------- */

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

    if (!action) return;

    action.reset();

    action.setLoop(
      THREE.LoopOnce,
      1
    );

    action.clampWhenFinished =
      true;

    action.play();
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


/* --------------------------------
   COMPLETE SCENE
-------------------------------- */

export default function GiftBox3D({
  open = false,
  onClick,
  envelopeCount = 6,
}) {
  return (
    <div
      onClick={
        open
          ? undefined
          : onClick
      }
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
          castShadow
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


          {open && (
            <EnvelopeBurst
              count={
                envelopeCount
              }
            />
          )}


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
