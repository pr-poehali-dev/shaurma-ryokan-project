import { useEffect, useState } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  tx: string;
  ty: string;
  color: string;
}

interface Props {
  onReset: () => void;
}

const LIGHTNING_BOLTS = [
  { left: "8%", height: "180px", top: "10%", delay: "0s", rotate: "-15deg" },
  { left: "88%", height: "140px", top: "5%", delay: "0.4s", rotate: "12deg" },
  { left: "20%", height: "100px", top: "60%", delay: "0.8s", rotate: "-8deg" },
  { left: "75%", height: "120px", top: "55%", delay: "0.2s", rotate: "20deg" },
  { left: "50%", height: "200px", top: "0%", delay: "1.1s", rotate: "0deg" },
];

const NEON_COLORS = ["#ff00ff", "#00ffff", "#ffff00", "#ff6600", "#00ff66"];

export default function OrderSuccess({ onReset }: Props) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Генерируем искры волнами
    let id = 0;
    const burst = () => {
      const newSparks: Spark[] = Array.from({ length: 16 }, () => {
        const angle = Math.random() * 360;
        const dist = 60 + Math.random() * 120;
        return {
          id: id++,
          x: 40 + Math.random() * 20,
          y: 30 + Math.random() * 20,
          tx: `${Math.cos((angle * Math.PI) / 180) * dist}px`,
          ty: `${Math.sin((angle * Math.PI) / 180) * dist}px`,
          color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
        };
      });
      setSparks((prev) => [...prev, ...newSparks]);
      setTimeout(() => setSparks((prev) => prev.filter((s) => !newSparks.find((n) => n.id === s.id))), 900);
    };

    burst();
    const t1 = setTimeout(burst, 400);
    const t2 = setTimeout(burst, 900);
    const t3 = setTimeout(burst, 1400);

    const phaseTimer = setInterval(() => setPhase((p) => (p + 1) % 3), 600);

    // Звук молнии через Web Audio API
    const playLightning = () => {
      try {
        const ctx = new AudioContext();
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.7, 0);
        gain.gain.exponentialRampToValueAtTime(0.001, 0.6);
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 800;
        filter.Q.value = 0.5;
        src.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        src.start();
        setTimeout(() => ctx.close(), 700);
      } catch (e) { console.warn("audio", e); }
    };

    playLightning();
    const ls1 = setTimeout(playLightning, 500);
    const ls2 = setTimeout(playLightning, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(ls1);
      clearTimeout(ls2);
      clearInterval(phaseTimer);
    };
  }, []);

  const neonColors = ["#ff00ff", "#00ffff", "#ff6600"];
  const currentColor = neonColors[phase];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center neon-pulse-bg overflow-hidden"
      style={{ background: "#050005" }}
    >
      {/* Молнии */}
      {LIGHTNING_BOLTS.map((bolt, i) => (
        <div
          key={i}
          className="lightning"
          style={{
            left: bolt.left,
            height: bolt.height,
            top: bolt.top,
            animationDelay: bolt.delay,
            transform: `rotate(${bolt.rotate})`,
            background: `linear-gradient(180deg, ${NEON_COLORS[i % NEON_COLORS.length]}, transparent)`,
            animationDuration: `${1.5 + i * 0.3}s`,
          }}
        />
      ))}

      {/* Доп молнии (класс2) */}
      {LIGHTNING_BOLTS.map((bolt, i) => (
        <div
          key={`b${i}`}
          className="lightning lightning2"
          style={{
            left: `${parseInt(bolt.left) + 5}%`,
            height: `${parseInt(bolt.height) * 0.6}px`,
            top: `${parseInt(bolt.top) + 15}%`,
            animationDelay: `${parseFloat(bolt.delay) + 0.3}s`,
            transform: `rotate(${parseInt(bolt.rotate) + 5}deg)`,
            background: `linear-gradient(180deg, #ffffff, ${NEON_COLORS[(i + 2) % NEON_COLORS.length]}, transparent)`,
          }}
        />
      ))}

      {/* Искры */}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="spark"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            background: spark.color,
            boxShadow: `0 0 6px ${spark.color}`,
            ["--tx" as string]: spark.tx,
            ["--ty" as string]: spark.ty,
          }}
        />
      ))}

      {/* Неоновые круги */}
      <div
        className="absolute w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{ background: currentColor, transition: "background 0.5s" }}
      />
      <div
        className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: neonColors[(phase + 1) % 3], transition: "background 0.5s", transform: "translate(80px, -40px)" }}
      />

      {/* Контент */}
      <div className="relative z-10 text-center px-6 animate-explode-in">
        <div
          className="text-8xl mb-4 shawarma-spin"
          style={{ filter: `drop-shadow(0 0 20px ${currentColor})` }}
        >
          🌯
        </div>

        <h2
          className="font-display text-5xl md:text-7xl font-bold mb-2 neon-text"
          style={{
            color: currentColor,
            textShadow: `0 0 10px ${currentColor}, 0 0 30px ${currentColor}, 0 0 60px ${currentColor}`,
            transition: "color 0.5s, text-shadow 0.5s",
          }}
        >
          ЗАКАЗ ПРИНЯТ!
        </h2>

        <p
          className="font-display text-xl md:text-2xl mb-2"
          style={{
            color: neonColors[(phase + 1) % 3],
            textShadow: `0 0 8px ${neonColors[(phase + 1) % 3]}`,
            transition: "all 0.5s",
          }}
        >
          ⚡ ШАУРМА ЛЕТИТ К ТЕБЕ ⚡
        </p>

        <p className="text-gray-400 mb-8 text-sm">
          Ожидай звонка оператора
        </p>

        <button
          onClick={onReset}
          className="font-display font-bold text-lg px-10 py-4 border-2 neon-border tracking-widest uppercase transition-all hover:scale-105"
          style={{
            borderColor: currentColor,
            color: currentColor,
            background: "transparent",
            boxShadow: `0 0 15px ${currentColor}, inset 0 0 15px ${currentColor}22`,
            transition: "all 0.5s",
          }}
        >
          ⚡ ЕЩЁ ШАУРМУ ⚡
        </button>
      </div>

      {/* Сканлайны */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
      />
    </div>
  );
}