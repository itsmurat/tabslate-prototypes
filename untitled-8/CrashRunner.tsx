import { useCallback, useEffect, useReducer, useRef } from "react";
import { AlertTriangle, Cone, RotateCcw, TrafficCone } from "lucide-react";
import { Body, Badge, Button, cn } from "@tabs/toretto";

/**
 * CrashRunner — an offline "press Space to run" mini-game in the spirit of
 * Chrome's dino page. Meant to be dropped into a crash/error fallback
 * (see CrashBoundary.tsx) so a broken screen still leaves the PM with
 * something to do while they wait on a fix.
 *
 * Built entirely from Tailwind spacing-scale rectangles (no hand-drawn SVG)
 * plus real lucide obstacle icons — no off-system assets.
 */

// Physics + track constants, all expressed in px so obstacle/dino math stays
// in one place. Kept 1:1 with the Tailwind spacing classes used below.
const GROUND_BOTTOM = 32; // bottom-8
const DINO_LEFT = 40; // left-10
const DINO_WIDTH = 64; // w-16 — the sprite's bounding box (tail to snout)
const DINO_HITBOX = 34; // narrower than the full sprite (tail/snout are mostly air), classic dino-game fairness
const GRAVITY = 0.0026; // px/ms^2
const JUMP_VELOCITY = 0.62; // px/ms, upward
const BASE_SPEED = 0.3; // px/ms
const MAX_SPEED = 0.62;
const SPEED_RAMP = 0.00002; // speed gained per point scored
const MIN_GAP = 260; // px between obstacles at low speed
const MAX_GAP = 460;
const HIGH_SCORE_KEY = "tabslate-crash-runner-high-score";

const OBSTACLE_TYPES = [
  { Icon: Cone, height: 26, width: 22 },
  { Icon: TrafficCone, height: 30, width: 24 },
  { Icon: AlertTriangle, height: 24, width: 24 },
];

function readHighScore() {
  try {
    return Number(window.localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeHighScore(value: number) {
  try {
    window.localStorage.setItem(HIGH_SCORE_KEY, String(Math.floor(value)));
  } catch {
    // localStorage unavailable (e.g. private mode) — high score just won't persist
  }
}

function randomGap(speed: number) {
  const spread = MAX_GAP - MIN_GAP;
  return MIN_GAP + Math.random() * spread * (BASE_SPEED / speed);
}

let obstacleId = 0;

function createEngine() {
  return {
    status: "idle" as "idle" | "running" | "gameover",
    dinoY: 0,
    velocity: 0,
    jumping: false,
    frame: 0,
    frameTimer: 0,
    score: 0,
    highScore: readHighScore(),
    speed: BASE_SPEED,
    distanceToNextSpawn: 400,
    obstacles: [] as { id: number; x: number; height: number; width: number; Icon: typeof Cone }[],
    dashes: Array.from({ length: 10 }, (_, i) => ({ id: i, x: i * 90 })),
    trackWidth: 640,
    lastTimestamp: 0,
  };
}

/**
 * Blocky dinosaur silhouette, built only from spacing-scale rectangles (no
 * hand-drawn SVG). Proportioned like a small T-Rex: hunched back, raised
 * head + snout, a stubby arm, and a tapered tail — side-on, facing right.
 */
function Dino({ jumping, frame, dead }: { jumping: boolean; frame: number; dead: boolean }) {
  return (
    <div
      className={cn(
        "relative h-14 w-16 shrink-0 transition-transform",
        dead && "rotate-12 opacity-70",
      )}
    >
      {/* tail */}
      <div className="absolute -left-2 bottom-3 h-2 w-4 rotate-12 rounded-full bg-neutral-800" />
      {/* body */}
      <div className="absolute bottom-2 left-2 h-5 w-8 rounded-md bg-neutral-800" />
      {/* back hump, sits flush on top of the body for an arched spine */}
      <div className="absolute bottom-7 left-3 h-2 w-4 rounded-t-full bg-neutral-800" />
      {/* neck, rising from the body's front to the head */}
      <div className="absolute bottom-5 left-9 h-6 w-3 rounded-sm bg-neutral-800" />
      {/* head */}
      <div className="absolute bottom-9 left-8 h-4 w-5 rounded-md bg-neutral-800" />
      {/* snout, set a touch lower than the head to read as an open jaw */}
      <div className="absolute bottom-8 left-12 h-2 w-3 rounded-sm bg-neutral-800" />
      {/* eye — flattens to a line for a defeated look on game over */}
      <div
        className={cn(
          "absolute left-11 bg-white",
          dead ? "bottom-11 h-0.5 w-1.5 rounded-full" : "bottom-11 size-1 rounded-full",
        )}
      />
      {/* stubby arm */}
      <div className="absolute bottom-4 left-9 h-1.5 w-1 rounded-sm bg-neutral-800" />
      {/* legs */}
      {jumping || dead ? (
        <>
          <div className="absolute bottom-0 left-3 h-2 w-2 rounded-sm bg-neutral-800" />
          <div className="absolute bottom-0 left-7 h-2 w-2 rounded-sm bg-neutral-800" />
        </>
      ) : (
        <>
          <div
            className={cn(
              "absolute left-3 w-2 rounded-sm bg-neutral-800",
              frame % 2 === 0 ? "bottom-0 h-3" : "bottom-0.5 h-2",
            )}
          />
          <div
            className={cn(
              "absolute left-7 w-2 rounded-sm bg-neutral-800",
              frame % 2 === 0 ? "bottom-0.5 h-2" : "bottom-0 h-3",
            )}
          />
        </>
      )}
    </div>
  );
}

export function CrashRunner({ className }: { className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(createEngine());
  const rafRef = useRef<number | null>(null);
  const [, forceRender] = useReducer((n: number) => n + 1, 0);

  const reset = useCallback(() => {
    const engine = engineRef.current;
    engine.dinoY = 0;
    engine.velocity = 0;
    engine.jumping = false;
    engine.frame = 0;
    engine.frameTimer = 0;
    engine.score = 0;
    engine.speed = BASE_SPEED;
    engine.obstacles = [];
    engine.distanceToNextSpawn = 400;
  }, []);

  const act = useCallback(() => {
    const engine = engineRef.current;
    if (engine.status === "idle") {
      engine.status = "running";
      engine.velocity = JUMP_VELOCITY;
      engine.jumping = true;
    } else if (engine.status === "running" && !engine.jumping) {
      engine.velocity = JUMP_VELOCITY;
      engine.jumping = true;
    } else if (engine.status === "gameover") {
      reset();
      engine.status = "running";
      engine.velocity = JUMP_VELOCITY;
      engine.jumping = true;
    }
  }, [reset]);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) engineRef.current.trackWidth = trackRef.current.clientWidth;
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        act();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [act]);

  useEffect(() => {
    const tick = (timestamp: number) => {
      const engine = engineRef.current;
      if (!engine.lastTimestamp) engine.lastTimestamp = timestamp;
      const dt = Math.min(timestamp - engine.lastTimestamp, 48);
      engine.lastTimestamp = timestamp;

      if (engine.status === "running") {
        // jump physics
        engine.velocity -= GRAVITY * dt;
        engine.dinoY += engine.velocity * dt;
        if (engine.dinoY <= 0) {
          engine.dinoY = 0;
          engine.velocity = 0;
          engine.jumping = false;
        }

        // run-cycle leg swap
        engine.frameTimer += dt;
        if (engine.frameTimer > 140) {
          engine.frameTimer = 0;
          engine.frame += 1;
        }

        engine.speed = Math.min(MAX_SPEED, BASE_SPEED + engine.score * SPEED_RAMP);
        const travel = engine.speed * dt;
        engine.score += travel * 0.08;

        // ground dashes (parallax)
        engine.dashes = engine.dashes.map((dash) => {
          const x = dash.x - travel;
          return x < -20 ? { ...dash, x: x + engine.trackWidth + 20 } : { ...dash, x };
        });

        // obstacles
        engine.distanceToNextSpawn -= travel;
        if (engine.distanceToNextSpawn <= 0) {
          const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
          engine.obstacles = [
            ...engine.obstacles,
            { id: obstacleId++, x: engine.trackWidth, ...type },
          ];
          engine.distanceToNextSpawn = randomGap(engine.speed);
        }
        engine.obstacles = engine.obstacles
          .map((o) => ({ ...o, x: o.x - travel }))
          .filter((o) => o.x + o.width > -10);

        // collision: horizontal overlap + dino hasn't jumped above the obstacle
        const dinoLeft = DINO_LEFT + (DINO_WIDTH - DINO_HITBOX) / 2;
        const dinoRight = dinoLeft + DINO_HITBOX;
        for (const o of engine.obstacles) {
          const overlaps = dinoRight > o.x + 3 && dinoLeft < o.x + o.width - 3;
          const tooLow = engine.dinoY < o.height * 0.85;
          if (overlaps && tooLow) {
            engine.status = "gameover";
            if (engine.score > engine.highScore) {
              engine.highScore = engine.score;
              writeHighScore(engine.score);
            }
            break;
          }
        }
      }

      forceRender();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const engine = engineRef.current;
  const score = Math.floor(engine.score);
  const highScore = Math.floor(engine.highScore);

  return (
    <div
      ref={trackRef}
      role="button"
      tabIndex={0}
      aria-label="Dino runner mini-game — press space, arrow up, or tap to jump"
      onClick={act}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") act();
      }}
      className={cn(
        "relative h-44 w-full cursor-pointer overflow-hidden rounded-md border border-neutral-200 bg-white outline-none",
        className,
      )}
    >
      <div className="absolute right-3 top-3 flex flex-col items-end gap-0.5">
        <Body family="mono" weight="medium" className="text-neutral-700">
          {String(score).padStart(5, "0")}
        </Body>
        <Body family="mono" size="xs" shade="muted">
          BEST {String(highScore).padStart(5, "0")}
        </Body>
      </div>

      {/* ground */}
      <div className="absolute inset-x-0 border-t border-neutral-200" style={{ bottom: GROUND_BOTTOM }} />
      {engine.dashes.map((dash) => (
        <div
          key={dash.id}
          className="absolute h-0.5 w-6 rounded-full bg-neutral-300"
          style={{ left: dash.x, bottom: GROUND_BOTTOM - 1 }}
        />
      ))}

      {/* obstacles */}
      {engine.obstacles.map((o) => (
        <o.Icon
          key={o.id}
          size={o.height}
          className="absolute text-neutral-700"
          style={{ left: o.x, bottom: GROUND_BOTTOM }}
        />
      ))}

      {/* dino */}
      <div
        className="absolute"
        style={{ left: DINO_LEFT, bottom: GROUND_BOTTOM + engine.dinoY }}
      >
        <Dino jumping={engine.jumping} frame={engine.frame} dead={engine.status === "gameover"} />
      </div>

      {engine.status === "idle" && (
        <div className="absolute inset-x-0 top-1/3 flex justify-center">
          <Body shade="muted">Press space, ↑, or tap to run</Body>
        </div>
      )}

      {engine.status === "gameover" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80">
          <Badge color="red" shade="light" icon={AlertTriangle}>
            Game over
          </Badge>
          <Button
            variant="secondary"
            size="small"
            before={<RotateCcw size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              act();
            }}
          >
            Run again
          </Button>
        </div>
      )}
    </div>
  );
}
