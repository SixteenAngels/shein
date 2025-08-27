import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GLView } from 'expo-gl';
import * as SplashScreen from 'expo-splash-screen';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

type Props = { onDone?: () => void };

export default function Splash3D({ onDone }: Props) {
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      try { await SplashScreen.preventAutoHideAsync(); } catch {}
      Animated.timing(fade, { toValue: 0, duration: 600, delay: 1600, useNativeDriver: true, easing: Easing.out(Easing.quad) }).start(async () => {
        try { await SplashScreen.hideAsync(); } catch {}
        onDone?.();
      });
    })();
  }, [onDone]);

  const onContextCreate = async (gl: any) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const renderer = new Renderer({ gl, width, height });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.z = 3.5;

    const light = new THREE.PointLight(0xffffff, 1.2);
    light.position.set(5, 5, 10);
    scene.add(light);

    const geometry = new THREE.IcosahedronGeometry(1.2, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff3366, roughness: 0.4, metalness: 0.6, wireframe: false });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.013;
      (renderer as unknown as { render: (s: THREE.Scene, c: THREE.Camera) => void }).render(scene, camera);
      gl.endFrameEXP();
      requestAnimationFrame(animate);
    };
    animate();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <LinearGradient colors={["#000000", "#12010f"]} style={{ position: 'absolute', inset: 0 }} />
      <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
      <Animated.View style={{ position: 'absolute', inset: 0, backgroundColor: '#000', opacity: fade }} />
    </View>
  );
}

