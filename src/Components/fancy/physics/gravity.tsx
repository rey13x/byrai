"use client";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PropsWithChildren, type RefObject } from "react";
import { Bodies, Body, Engine, Runner, World, type IChamferableBodyDefinition } from "matter-js";

type GravityProps = PropsWithChildren<{
  gravity?: { x: number; y: number };
  className?: string;
}>;

type GravityContextValue = {
  engine: Engine;
  world: World;
  containerRef: RefObject<HTMLDivElement | null>;
} | null;

const GravityContext = createContext<GravityContextValue>(null);

export default function Gravity({ gravity = { x: 0, y: 0.7 }, className = "", children }: GravityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [engine] = useState(() => Engine.create({ gravity: { x: gravity.x, y: gravity.y, scale: 0.002 } }));
  const [runner] = useState(() => Runner.create());

  useEffect(() => {
    engine.gravity.x = gravity.x;
    engine.gravity.y = gravity.y;
  }, [engine, gravity.x, gravity.y]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const boundaryIds = ["boundary-ground", "boundary-left", "boundary-right", "boundary-ceiling"];

    const updateBounds = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(rect.width, 0);
      const height = Math.max(rect.height, 0);
      const thickness = 64;

      const existing = engine.world.bodies.filter((body: Body) => boundaryIds.includes(body.label));
      if (existing.length) {
        World.remove(engine.world, existing);
      }

      const ground = Bodies.rectangle(width / 2, height + thickness / 2, width + thickness * 2, thickness, {
        isStatic: true,
        label: "boundary-ground",
      });
      const left = Bodies.rectangle(-thickness / 2, height / 2, thickness, height + thickness * 2, {
        isStatic: true,
        label: "boundary-left",
      });
      const right = Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + thickness * 2, {
        isStatic: true,
        label: "boundary-right",
      });
      const ceiling = Bodies.rectangle(width / 2, -thickness / 2, width + thickness * 2, thickness, {
        isStatic: true,
        label: "boundary-ceiling",
      });

      World.add(engine.world, [ground, left, right, ceiling]);
    };

    updateBounds();

    const resizeObserver = new ResizeObserver(() => {
      updateBounds();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [engine]);

  useEffect(() => {
    const status = Runner.run(runner, engine);
    return () => {
      Runner.stop(runner);
      if (status) {
        Runner.stop(status);
      }
    };
  }, [engine, runner]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 0;
      engine.gravity.x = Math.max(-1, Math.min(1, gamma / 45));
      engine.gravity.y = Math.max(0.2, Math.min(1.5, 0.7 + beta / 90));
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [engine]);

  return (
    <GravityContext.Provider value={{ engine, world: engine.world, containerRef }}>
      <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
        {children}
      </div>
    </GravityContext.Provider>
  );
}

export function MatterBody({
  matterBodyOptions,
  x,
  y,
  angle,
  children,
}: PropsWithChildren<{
  matterBodyOptions?: IChamferableBodyDefinition;
  x: string;
  y: string;
  angle?: number;
}>) {
  const context = useContext(GravityContext);
  const elementRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<Body | null>(null);
  const rafRef = useRef<number | null>(null);
  const [style, setStyle] = useState<CSSProperties>({
    position: "absolute",
    left: 0,
    top: 0,
    transform: "translate(0px, 0px) rotate(0rad)",
    width: "auto",
    height: "auto",
  });

  useLayoutEffect(() => {
    if (!context || !context.containerRef.current || !elementRef.current) return;
    const container = context.containerRef.current;
    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const startX = (parseFloat(x) / 100) * containerRect.width;
    const startY = (parseFloat(y) / 100) * containerRect.height;
    const body = Bodies.rectangle(startX, startY, rect.width, rect.height, {
      angle: ((angle ?? 0) * Math.PI) / 180,
      friction: 0.05,
      restitution: 0.8,
      ...matterBodyOptions,
    });

    Body.set(body, { position: { x: startX, y: startY } });
    bodyRef.current = body;
    World.add(context.world, body);

    const update = () => {
      const currentBody = bodyRef.current;
      if (!currentBody) return;
      setStyle({
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${currentBody.position.x - rect.width / 2}px, ${currentBody.position.y - rect.height / 2}px) rotate(${currentBody.angle}rad)`,
        width: rect.width,
        height: rect.height,
      });
      rafRef.current = window.requestAnimationFrame(update);
    };

    rafRef.current = window.requestAnimationFrame(update);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (bodyRef.current) {
        World.remove(context.world, bodyRef.current);
        bodyRef.current = null;
      }
    };
  }, [context, x, y, angle, matterBodyOptions]);

  return (
    <div ref={elementRef} style={style} className="pointer-events-none">
      {children}
    </div>
  );
}
