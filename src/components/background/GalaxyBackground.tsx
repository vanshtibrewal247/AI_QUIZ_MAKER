"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const GalaxyBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: 1,
        },
        background: {
          color: {
            value: "#0a0a1f",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
              parallax: {
                enable: true,
                force: 60,
                smooth: 10,
              },
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#ffffff", "#87ceeb", "#ff1493", "#00ffff", "#ffd700"],
          },
          links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
            triangles: {
              enable: true,
              frequency: 5,
            },
          },
          collisions: {
            enable: false,
          },
          move: {
            enable: true,
            speed: {
              min: 0.5,
              max: 2,
            },
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "out",
            },
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
          number: {
            density: {
              enable: true,
              value_area: 800,
            },
            value: 200,
          },
          opacity: {
            value: {
              min: 0.3,
              max: 0.8,
            },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: {
              min: 0.5,
              max: 3,
            },
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.3,
              sync: false,
            },
          },
          tilt: {
            animation: {
              enable: true,
              speed: 3,
              sync: false,
            },
            direction: "clockwise",
            enable: true,
            value: 0,
          },
          rotate: {
            animation: {
              enable: true,
              speed: 2,
              sync: false,
            },
            direction: "random",
            path: true,
            enable: true,
            value: 0,
          },
          twinkle: {
            lines: {
              enable: false,
            },
            particles: {
              enable: true,
              frequency: 0.05,
              opacity: 1,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default GalaxyBackground;
