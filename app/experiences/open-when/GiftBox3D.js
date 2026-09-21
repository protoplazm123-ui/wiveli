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

  const started = useRef(false);
  const startTime = useRef(null);

  const velocity = useRef(
    new THREE.Vector3()
  );

  const GRAVITY = -3.4;
  const FLOOR_Y = -2.2;


  const data = useMemo(() => {
    const angle =
      (index / Math.max(total, 1)) *
        Math.PI *
        2 +
      (Math.random() - 0.5) *
        0.9;

    const outSpeed =
      1.4 +
      Math.random() *
        2.2;

    const upSpeed =
      2.4 +
      Math.random() *
        2.4;

    return {
      delay:
        index * 0.03 +
        Math.random() *
          0.18,

      vx:
        Math.cos(angle) *
        outSpeed,

      vy:
        upSpeed,

      vz:
        Math.sin(angle) *
        outSpeed *
        0.6,

      spinX:
        (Math.random() - 0.5) *
        7,

      spinY:
        (Math.random() - 0.5) *
        9,

      spinZ:
        (Math.random() - 0.5) *
        7,

      drag:
        0.986 +
        Math.random() *
          0.01,

      scale:
        0.16 +
        Math.random() *
          0.08,
    };
  }, [
    index,
    total,
  ]);


  useFrame((
    state,
    delta
  ) => {
    if (!ref.current) return;


    if (
      startTime.current ===
      null
    ) {
      startTime.current =
        state.clock.elapsedTime;
    }


    const elapsed =
      state.clock.elapsedTime -
      startTime.current -
      data.delay;


    if (elapsed < 0) {
      ref.current.visible =
        false;

      return;
    }


    if (!started.current) {
      started.current = true;

      velocity.current.set(
        data.vx,
        data.vy,
        data.vz
      );

      ref.current.position.set(
        0,
        0.18,
        0
      );

      ref.current.scale.setScalar(
        0
      );
    }


    if (
      ref.current.position.y <
      FLOOR_Y
    ) {
      ref.current.visible =
        false;

      return;
    }


    ref.current.visible = true;


    /* GRAVITY */

    velocity.current.y +=
      GRAVITY *
      delta;


    /* AIR RESISTANCE */

    velocity.current.multiplyScalar(
      data.drag
    );


    /* MOVEMENT */

    ref.current.position.x +=
      velocity.current.x *
      delta;

    ref.current.position.y +=
      velocity.current.y *
      delta;

    ref.current.position.z +=
      velocity.current.z *
      delta;


    /* ROTATION */

    ref.current.rotation.x +=
      data.spinX *
      delta;

    ref.current.rotation.y +=
      data.spinY *
      delta;

    ref.current.rotation.z +=
      data.spinZ *
      delta;


    /* POP OUT OF BOX */

    const pop =
      Math.min(
        elapsed * 7,
        1
      );

    ref.current.scale.setScalar(
      data.scale *
      pop
    );
  });


  return (
    <group
      ref={ref}
      visible={false}
    >

      {/* ENVELOPE BODY */}

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


      {/* ENVELOPE FLAP */}

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
          side={
            THREE.DoubleSide
          }
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
      Math.max(
        count,
        1
      ),
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
      }).map((
        _,
        index
      ) => (
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
   GIFT BOX
-------------------------------- */

function GiftBoxModel({
  open = false,
}) {
  const group = useRef();

  const {
    scene,
    animations,
  } = useGLTF(
    MODEL_URL
  );

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


    if (!action) {
      return;
    }


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
        dpr={[
          1,
          2,
        ]}
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

          {/*

            IMPORTANT:

            Gift box + envelopes are now
            inside the SAME Bounds.

          */}

          <Bounds
            fit
            clip
            observe
            margin={1.35}
          >

            <group>

              <GiftBoxModel
                open={open}
              />


              {open && (
                <EnvelopeBurst
                  count={
                    envelopeCount
                  }
                />
              )}

            </group>

          </Bounds>


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
