"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Look-around viewer. A tiny WebGL shader, no 3D library.
 *  - "equirect": a real 360° photo (2:1, e.g. from a 360 camera or the Google Street View app). Full spin.
 *  - "wide": an ordinary wide photo wrapped on a curved wall, so you can pan across it without distortion.
 * Drag, swipe or use the arrow keys to look around; on phones you can also tilt to look.
 */

type Scene = { id: string; label: string; src: string; mode: "equirect" | "wide"; span?: number; note: string };

const SCENES: Scene[] = [
  { id: "dining", label: "Dining room", src: "/images/tour/dining-wide.webp", mode: "wide", span: 150, note: "Window tables, the long squad tables and the bar corner." },
];

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `precision highp float;
uniform sampler2D t;uniform vec2 res;uniform float yaw,pitch,fh,mode,span,tanV;
const float PI=3.14159265;
void main(){
  vec2 uv=(gl_FragCoord.xy/res)*2.-1.;
  uv.x*=res.x/res.y;
  vec3 d=normalize(vec3(uv.x*fh,uv.y*fh,-1.));
  float cp=cos(pitch),sp=sin(pitch);
  d=vec3(d.x,d.y*cp+d.z*sp,-d.y*sp+d.z*cp);
  float cy=cos(yaw),sy=sin(yaw);
  d=vec3(d.x*cy+d.z*sy,d.y,-d.x*sy+d.z*cy);
  float lon=atan(d.x,-d.z);
  vec2 st;
  if(mode<.5){st=vec2(lon/(2.*PI)+.5,.5-asin(clamp(d.y,-1.,1.))/PI);}
  else{float h=d.y/length(d.xz);st=vec2(lon/span+.5,.5-h/(2.*tanV));}
  vec4 c=texture2D(t,clamp(st,0.,1.));
  float edge=mode<.5?1.:smoothstep(0.,.015,st.x)*smoothstep(1.,.985,st.x)*smoothstep(0.,.02,st.y)*smoothstep(1.,.98,st.y);
  gl_FragColor=vec4(c.rgb*edge,1.);
}`;

export function TourViewer() {
  const [sceneId, setSceneId] = useState(SCENES[0].id);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [tiltAvailable, setTiltAvailable] = useState(false);
  const [tiltOn, setTiltOn] = useState(false);
  const [hint, setHint] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ setTilt: (on: boolean) => void; nudge: (dy: number) => void } | null>(null);
  const scene = SCENES.find((s) => s.id === sceneId)!;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature check needs the browser
    setTiltAvailable(typeof window !== "undefined" && "DeviceOrientationEvent" in window && matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
      setFailed(true);
      return;
    }
    setReady(false);
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("res"), uYaw = U("yaw"), uPitch = U("pitch"), uFh = U("fh"), uMode = U("mode"), uSpan = U("span"), uTanV = U("tanV");

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const span = scene.mode === "wide" ? ((scene.span ?? 150) * Math.PI) / 180 : Math.PI * 2;
    let tanV = 0.5; // set from the image's shape once loaded
    let yaw = 0, pitch = 0, vYaw = 0, vPitch = 0, fh = 0.62;
    let tiltYaw: number | null = null, tiltBase = 0, tiltOn = false;
    let w = 0, h = 0, raf = 0, dragging = false, lastX = 0, lastY = 0, idleSince = performance.now(), visible = true, loaded = false;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const limits = () => {
      const aspect = w / Math.max(1, h);
      const halfH = Math.atan(fh * aspect);
      const halfV = Math.atan(fh);
      if (scene.mode === "equirect") return { yMin: -Infinity, yMax: Infinity, pMax: Math.PI / 2 - halfV };
      const room = Math.max(0, span / 2 - halfH);
      return { yMin: -room, yMax: room, pMax: Math.max(0, Math.atan(tanV) - halfV) };
    };
    const fit = () => {
      // make sure the picture always fills the frame vertically
      if (scene.mode === "wide") fh = Math.min(w / Math.max(1, h) > 1.6 ? 0.5 : 0.62, tanV * 0.98, Math.tan(span / 2) / Math.max(0.5, w / Math.max(1, h)));
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      fit();
    };

    const draw = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uYaw, yaw);
      gl.uniform1f(uPitch, pitch);
      gl.uniform1f(uFh, fh);
      gl.uniform1f(uMode, scene.mode === "equirect" ? 0 : 1);
      gl.uniform1f(uSpan, span);
      gl.uniform1f(uTanV, tanV);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let dir = 1;
    const tick = (now: number) => {
      raf = 0;
      if (!loaded || !visible) return;
      const L = limits();
      if (!dragging) {
        yaw += vYaw;
        pitch += vPitch;
        vYaw *= 0.92;
        vPitch *= 0.92;
        // gentle drift when nobody is touching it
        if (!reduce && !tiltOn && now - idleSince > 2500 && Math.abs(vYaw) < 0.0004) {
          yaw += 0.0011 * dir;
          if (yaw >= L.yMax) dir = -1;
          if (yaw <= L.yMin) dir = 1;
        }
      }
      yaw = Math.min(L.yMax, Math.max(L.yMin, yaw));
      pitch = Math.min(L.pMax, Math.max(-L.pMax, pitch));
      draw();
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      // the wall's height follows from the picture's shape and how wide it is
      tanV = ((img.naturalHeight / img.naturalWidth) * span) / 2;
      fit();
      yaw = 0;
      pitch = 0;
      loaded = true;
      setReady(true);
      kick();
    };
    img.onerror = () => setFailed(true);
    img.src = scene.src;

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      vYaw = vPitch = 0;
      canvas.setPointerCapture(e.pointerId);
      setHint(false);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const k = (2 * Math.atan(fh)) / Math.max(1, h);
      const dx = (e.clientX - lastX) * k, dy = (e.clientY - lastY) * k;
      // drag the picture: right reveals what is to the left, down reveals what is above
      yaw += dx;
      pitch -= dy;
      vYaw = dx;
      vPitch = -dy;
      lastX = e.clientX;
      lastY = e.clientY;
      idleSince = performance.now();
      kick();
    };
    const up = () => {
      dragging = false;
      idleSince = performance.now();
    };
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey && Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; // let the page scroll
      e.preventDefault();
      yaw -= e.deltaX * 0.002;
      idleSince = performance.now();
    };
    const orient = (e: DeviceOrientationEvent) => {
      if (!tiltOn || e.alpha == null) return;
      const a = (e.alpha * Math.PI) / 180;
      if (tiltYaw === null) {
        tiltYaw = a;
        tiltBase = yaw;
      }
      let d = a - tiltYaw;
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      yaw = tiltBase + d;
      idleSince = performance.now();
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("wheel", wheel, { passive: false });
    addEventListener("deviceorientation", orient);
    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(wrap);
    resize();

    api.current = {
      setTilt: (on) => {
        tiltOn = on;
        tiltYaw = null;
      },
      nudge: (d) => {
        vYaw = d;
        idleSince = performance.now();
        setHint(false);
        kick();
      },
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("wheel", wheel);
      removeEventListener("deviceorientation", orient);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      api.current = null;
    };
  }, [scene]);

  const toggleTilt = async () => {
    const next = !tiltOn;
    if (next) {
      const D = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (typeof D.requestPermission === "function") {
        try {
          if ((await D.requestPermission()) !== "granted") return;
        } catch {
          return;
        }
      }
    }
    setTiltOn(next);
    api.current?.setTilt(next);
    setHint(false);
  };

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative aspect-[4/5] w-full touch-pan-y overflow-hidden rounded-[28px] bg-ember ring-1 ring-white/10 sm:aspect-[16/10] lg:aspect-[21/9]"
        tabIndex={0}
        role="img"
        aria-label={`Look-around view: ${scene.label}. ${scene.note} Use the left and right arrow keys to look around.`}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") api.current?.nudge(0.05);
          if (e.key === "ArrowRight") api.current?.nudge(-0.05);
        }}
      >
        {failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={scene.src} alt="" className="h-full w-full object-cover" />
        ) : (
          <canvas ref={canvasRef} className={`h-full w-full cursor-grab touch-pan-y transition-opacity duration-700 active:cursor-grabbing ${ready ? "opacity-100" : "opacity-0"}`} />
        )}
        {!ready && !failed && <div aria-hidden className="absolute inset-0 animate-pulse bg-gradient-to-br from-ember to-charcoal" />}

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          <span className="rounded-full bg-charcoal/80 px-3 py-1.5 text-xs font-semibold backdrop-blur">{scene.label}</span>
        </div>

        {hint && ready && (
          <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="tour-hint flex items-center gap-2 rounded-full bg-charcoal/80 px-4 py-2.5 text-sm font-semibold backdrop-blur">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 12h10M7 12l3-3M7 12l3 3M17 12l-3-3M17 12l-3 3" />
              </svg>
              Drag to look around
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 sm:p-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => api.current?.nudge(0.06)} className="grid h-11 w-11 place-items-center rounded-full bg-charcoal/80 backdrop-blur hover:bg-charcoal" aria-label="Look left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 6-6 6 6 6" /></svg>
            </button>
            <button type="button" onClick={() => api.current?.nudge(-0.06)} className="grid h-11 w-11 place-items-center rounded-full bg-charcoal/80 backdrop-blur hover:bg-charcoal" aria-label="Look right">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 6 6 6-6 6" /></svg>
            </button>
          </div>
          {tiltAvailable && (
            <button
              type="button"
              onClick={toggleTilt}
              aria-pressed={tiltOn}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold backdrop-blur transition ${tiltOn ? "bg-flame text-[#1a0b04]" : "bg-charcoal/80"}`}
            >
              {tiltOn ? "Tilt on" : "Tilt your phone"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2" role="tablist" aria-label="Choose a spot">
        {SCENES.length > 1 && SCENES.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={s.id === sceneId}
            onClick={() => {
              setSceneId(s.id);
              setHint(true);
            }}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${s.id === sceneId ? "bg-bone text-ink" : "bg-white/[0.06] text-bone/80 ring-1 ring-white/15 hover:text-bone"}`}
          >
            {s.label}
          </button>
        ))}
        <p className="basis-full text-sm text-bone/60 sm:ml-2 sm:basis-auto">{scene.note}</p>
      </div>
    </div>
  );
}
