import { useState, useEffect, useRef } from "react";

// ─── PALETA NUMBERBLOCKS ───────────────────────────────────────────────────
const COLORS = {
  red:    "#FF3B3B", orange: "#FF8C00", yellow: "#FFD600",
  green:  "#2ECC40", blue:   "#1E90FF", purple: "#B044FF",
  pink:   "#FF69B4", teal:   "#00CEC9", white:  "#FFFFFF",
  dark:   "#1A1A2E", card:   "#FFFFF0",
};

const BLOCK_COLORS = [COLORS.red, COLORS.orange, COLORS.yellow, COLORS.green, COLORS.blue, COLORS.purple, COLORS.pink, COLORS.teal];

// ─── UTILIDADES ───────────────────────────────────────────────────────────
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────
function Block({ n, color, size = 60, onClick, bounce = false, style = {} }) {
  const stacks = [];
  for (let i = 0; i < n; i++) stacks.push(i);
  return (
    <div onClick={onClick} style={{
      display: "inline-flex", flexDirection: "column-reverse",
      cursor: onClick ? "pointer" : "default",
      animation: bounce ? "bounce 0.5s ease" : undefined,
      ...style
    }}>
      {stacks.map(i => (
        <div key={i} style={{
          width: size, height: size,
          background: color,
          border: "3px solid rgba(0,0,0,0.2)",
          borderRadius: i === n - 1 ? "8px 8px 0 0" : "0",
          borderBottomLeftRadius: i === 0 ? "8px" : "0",
          borderBottomRightRadius: i === 0 ? "8px" : "0",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Fredoka One', cursive",
          fontSize: n === 1 ? size * 0.5 : size * 0.35,
          color: "white",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          boxSizing: "border-box",
        }}>
          {i === n - 1 ? n : ""}
        </div>
      ))}
    </div>
  );
}

function StarScore({ score }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {"⭐".repeat(Math.min(score, 5))}
      <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: COLORS.yellow }}>{score}</span>
    </div>
  );
}

function Btn({ children, color = COLORS.blue, onClick, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#ccc" : color,
      color: "white", border: "none",
      padding: "12px 28px", borderRadius: 16,
      fontFamily: "'Fredoka One', cursive", fontSize: 20,
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : `0 6px 0 rgba(0,0,0,0.2)`,
      transform: "translateY(0)",
      transition: "all 0.1s",
      ...style
    }}>{children}</button>
  );
}

function Card({ children, color = COLORS.card, style = {} }) {
  return (
    <div style={{
      background: color, borderRadius: 24,
      padding: 28, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      border: "3px solid rgba(0,0,0,0.06)",
      ...style
    }}>{children}</div>
  );
}

function FeedbackBanner({ text, success }) {
  if (!text) return null;
  return (
    <div style={{
      background: success ? COLORS.green : COLORS.red,
      color: "white", borderRadius: 16, padding: "14px 28px",
      fontFamily: "'Fredoka One', cursive", fontSize: 22,
      textAlign: "center", margin: "16px 0",
      animation: "pop 0.3s ease",
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
    }}>{text}</div>
  );
}

// ─── JUEGO 1: SUMA CON BLOQUES ────────────────────────────────────────────
function GameSumaBloques({ onBack, addScore }) {
  const [a, setA] = useState(rnd(1, 5));
  const [b, setB] = useState(rnd(1, 5));
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [merged, setMerged] = useState(false);

  function newRound() {
    setA(rnd(1, 5)); setB(rnd(1, 5));
    setInput(""); setFeedback(null); setMerged(false);
  }

  function check() {
    if (parseInt(input) === a + b) {
      setFeedback({ text: "¡Perfecto! 🎉", ok: true });
      setMerged(true);
      addScore(1);
      setCorrect(c => c + 1);
      setTimeout(newRound, 1800);
    } else {
      setFeedback({ text: "Intenta de nuevo 💪", ok: false });
      setTimeout(() => setFeedback(null), 1200);
    }
  }

  const colorA = BLOCK_COLORS[a - 1];
  const colorB = BLOCK_COLORS[b - 1];
  const colorM = BLOCK_COLORS[(a + b - 1) % BLOCK_COLORS.length];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Btn onClick={onBack} color={COLORS.orange} style={{ fontSize: 15, padding: "8px 18px" }}>← Volver</Btn>
        <h2 style={{ fontFamily: "'Fredoka One'", color: COLORS.blue, margin: 0 }}>Suma con Bloques</h2>
        <span style={{ fontFamily: "'Fredoka One'", color: COLORS.green, fontSize: 18 }}>✅ {correct}</span>
      </div>

      <Card style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Fredoka One'", fontSize: 20, color: "#555", marginBottom: 24 }}>
          ¿Cuánto suman los dos bloques?
        </p>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 20, marginBottom: 28 }}>
          {merged ? (
            <Block n={a + b} color={colorM} bounce />
          ) : (
            <>
              <Block n={a} color={colorA} />
              <span style={{ fontFamily: "'Fredoka One'", fontSize: 48, color: COLORS.orange, paddingBottom: 8 }}>+</span>
              <Block n={b} color={colorB} />
              <span style={{ fontFamily: "'Fredoka One'", fontSize: 48, color: COLORS.purple, paddingBottom: 8 }}>= ?</span>
            </>
          )}
        </div>

        <FeedbackBanner text={feedback?.text} success={feedback?.ok} />

        {!merged && (
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {[...Array(10)].map((_, i) => (
              <Btn key={i + 1} color={BLOCK_COLORS[i % BLOCK_COLORS.length]}
                onClick={() => { setInput(String(i + 1)); setTimeout(() => { setInput(String(i + 1)); }, 10); }}
                style={{ fontSize: 22, padding: "10px 18px", minWidth: 52 }}>
                {i + 1}
              </Btn>
            ))}
          </div>
        )}
        {!merged && input && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontFamily: "'Fredoka One'", fontSize: 22 }}>Tu respuesta: <b style={{ color: COLORS.blue }}>{input}</b></p>
            <Btn onClick={check} color={COLORS.green}>¡Listo!</Btn>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── JUEGO 2: NÚMERO MISTERIOSO (IA) ─────────────────────────────────────
function GameNumeroMisterioso({ onBack, addScore }) {
  const [secret, setSecret] = useState(null);
  const [clues, setClues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [won, setWon] = useState(false);

  async function generateClues() {
    const num = rnd(1, 20);
    setSecret(num); setClues([]); setGuess(""); setFeedback(null); setAttempts(0); setWon(false);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: "Eres un asistente para un juego de niños. Responde SOLO con JSON válido, sin texto extra, sin markdown.",
          messages: [{
            role: "user",
            content: `Genera 3 pistas divertidas y sencillas para que un niño de 9 años adivine el número ${num} (entre 1 y 20). Usa emojis. Responde solo con JSON: {"clues": ["pista1", "pista2", "pista3"]}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content[0].text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      setClues(parsed.clues);
    } catch {
      setClues([
        `Soy ${secret % 2 === 0 ? "par" : "impar"} 🔢`,
        `Soy ${secret > 10 ? "mayor que 10" : "menor o igual a 10"} 📏`,
        `La suma de mis dígitos es ${String(num).split("").reduce((a, c) => a + parseInt(c), 0)} ✨`
      ]);
    }
    setLoading(false);
  }

  useEffect(() => { generateClues(); }, []);

  function check() {
    const g = parseInt(guess);
    setAttempts(a => a + 1);
    if (g === secret) {
      setFeedback({ text: "¡Lo adivinaste! 🎊", ok: true });
      addScore(attempts < 2 ? 3 : attempts < 4 ? 2 : 1);
      setWon(true);
    } else if (g < secret) {
      setFeedback({ text: `${g} es muy pequeño, intenta más grande 📈`, ok: false });
      setTimeout(() => setFeedback(null), 1500);
    } else {
      setFeedback({ text: `${g} es muy grande, intenta más pequeño 📉`, ok: false });
      setTimeout(() => setFeedback(null), 1500);
    }
    setGuess("");
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Btn onClick={onBack} color={COLORS.orange} style={{ fontSize: 15, padding: "8px 18px" }}>← Volver</Btn>
        <h2 style={{ fontFamily: "'Fredoka One'", color: COLORS.purple, margin: 0 }}>Número Misterioso 🔮</h2>
        <span style={{ fontFamily: "'Fredoka One'", color: "#999", fontSize: 15 }}>Intentos: {attempts}</span>
      </div>

      <Card>
        <p style={{ fontFamily: "'Fredoka One'", fontSize: 19, color: "#555", textAlign: "center" }}>
          Tengo un número entre 1 y 20. ¿Puedes adivinarlo con estas pistas?
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 48, animation: "spin 1s linear infinite", display: "inline-block" }}>🔮</div>
            <p style={{ fontFamily: "'Fredoka One'", color: COLORS.purple }}>Preparando pistas mágicas...</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "16px 0" }}>
            {clues.map((c, i) => (
              <div key={i} style={{
                background: [COLORS.yellow, COLORS.teal, COLORS.pink][i] + "33",
                border: `3px solid ${[COLORS.yellow, COLORS.teal, COLORS.pink][i]}`,
                borderRadius: 16, padding: "12px 20px",
                fontFamily: "'Nunito', sans-serif", fontSize: 17, color: "#333"
              }}>
                <b style={{ fontFamily: "'Fredoka One'" }}>Pista {i + 1}:</b> {c}
              </div>
            ))}
          </div>
        )}

        <FeedbackBanner text={feedback?.text} success={feedback?.ok} />

        {!won && !loading && (
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
            {[...Array(20)].map((_, i) => (
              <Btn key={i + 1} color={guess === String(i + 1) ? COLORS.purple : BLOCK_COLORS[i % BLOCK_COLORS.length]}
                onClick={() => setGuess(String(i + 1))}
                style={{ fontSize: 18, padding: "8px 14px", minWidth: 46 }}>
                {i + 1}
              </Btn>
            ))}
          </div>
        )}
        {!won && !loading && guess && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <Btn onClick={check} color={COLORS.purple}>¡Es el {guess}!</Btn>
          </div>
        )}
        {won && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <p style={{ fontFamily: "'Fredoka One'", fontSize: 22, color: COLORS.green }}>
              El número era el <b>{secret}</b> 🎉
            </p>
            <Btn onClick={generateClues} color={COLORS.blue}>Otro número →</Btn>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── JUEGO 3: CAZADOR DE PALABRAS EN INGLÉS ───────────────────────────────
function GameCazadorPalabras({ onBack, addScore }) {
  const WORDS = [
    { word: "cat", emoji: "🐱", es: "gato" },
    { word: "dog", emoji: "🐶", es: "perro" },
    { word: "sun", emoji: "☀️", es: "sol" },
    { word: "tree", emoji: "🌳", es: "árbol" },
    { word: "fish", emoji: "🐟", es: "pez" },
    { word: "bird", emoji: "🐦", es: "pájaro" },
    { word: "apple", emoji: "🍎", es: "manzana" },
    { word: "house", emoji: "🏠", es: "casa" },
    { word: "moon", emoji: "🌙", es: "luna" },
    { word: "star", emoji: "⭐", es: "estrella" },
    { word: "book", emoji: "📚", es: "libro" },
    { word: "ball", emoji: "⚽", es: "pelota" },
  ];

  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(0);

  function newRound() {
    const word = WORDS[rnd(0, WORDS.length - 1)];
    const others = shuffle(WORDS.filter(w => w.word !== word.word)).slice(0, 3);
    setOptions(shuffle([word, ...others]));
    setCurrent(word);
    setFeedback(null);
  }

  useEffect(() => { newRound(); }, []);

  function pick(w) {
    if (w.word === current.word) {
      setFeedback({ text: `¡Correcto! ${w.emoji} = ${w.word}`, ok: true });
      addScore(1); setCorrect(c => c + 1);
      setTimeout(newRound, 1800);
    } else {
      setFeedback({ text: `No... era "${current.word}" 😅`, ok: false });
      setTimeout(() => { setFeedback(null); newRound(); }, 1800);
    }
  }

  if (!current) return null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Btn onClick={onBack} color={COLORS.orange} style={{ fontSize: 15, padding: "8px 18px" }}>← Volver</Btn>
        <h2 style={{ fontFamily: "'Fredoka One'", color: COLORS.green, margin: 0 }}>Cazador de Palabras 🔤</h2>
        <span style={{ fontFamily: "'Fredoka One'", color: COLORS.green, fontSize: 18 }}>✅ {correct}</span>
      </div>

      <Card style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "'Fredoka One'", fontSize: 20, color: "#555" }}>
          ¿Cómo se dice en inglés?
        </p>
        <div style={{
          fontSize: 90, margin: "16px 0",
          animation: "pop 0.3s ease",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))"
        }}>
          {current.emoji}
        </div>
        <p style={{
          fontFamily: "'Fredoka One'", fontSize: 28, color: COLORS.blue,
          background: COLORS.blue + "15", borderRadius: 12, padding: "8px 24px",
          display: "inline-block"
        }}>
          {current.es}
        </p>

        <FeedbackBanner text={feedback?.text} success={feedback?.ok} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 }}>
          {options.map((opt, i) => (
            <Btn key={opt.word} color={BLOCK_COLORS[i * 2]} onClick={() => pick(opt)}
              style={{ fontSize: 22, padding: "16px", width: "100%", borderRadius: 20 }}>
              {opt.word}
            </Btn>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── JUEGO 4: MAD LIBS EN ESPAÑOL ─────────────────────────────────────────
function GameMadLibs({ onBack, addScore }) {
  const [phase, setPhase] = useState("fill"); // fill | story
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState({ nombre: "", animal: "", lugar: "", adjetivo: "", accion: "" });
  const fields = [
    { key: "nombre", label: "Un nombre propio", placeholder: "ej. Marco" },
    { key: "animal", label: "Un animal", placeholder: "ej. dragón" },
    { key: "lugar", label: "Un lugar", placeholder: "ej. la Luna" },
    { key: "adjetivo", label: "Un adjetivo", placeholder: "ej. enorme" },
    { key: "accion", label: "Una acción divertida", placeholder: "ej. bailar salsa" },
  ];

  async function generateStory() {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: "Eres un narrador divertido para niños. Escribe historias cortas, locas y llenas de humor. Máximo 4 oraciones.",
          messages: [{
            role: "user",
            content: `Crea una historia corta y RIDÍCULAMENTE divertida usando estas palabras exactas: nombre="${words.nombre}", animal="${words.animal}", lugar="${words.lugar}", adjetivo="${words.adjetivo}", acción="${words.accion}". Resalta cada palabra usando MAYÚSCULAS. La historia debe ser para niños de 4 a 9 años.`
          }]
        })
      });
      const data = await res.json();
      setStory(data.content[0].text);
      addScore(2);
    } catch {
      setStory(`Un día, ${words.nombre.toUpperCase()} encontró un ${words.animal.toUpperCase()} ${words.adjetivo.toUpperCase()} en ${words.lugar.toUpperCase()}. ¡Los dos decidieron ${words.accion.toUpperCase()} hasta el amanecer! Fue el día más loco de sus vidas.`);
    }
    setLoading(false);
    setPhase("story");
  }

  const allFilled = Object.values(words).every(v => v.trim().length > 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Btn onClick={onBack} color={COLORS.orange} style={{ fontSize: 15, padding: "8px 18px" }}>← Volver</Btn>
        <h2 style={{ fontFamily: "'Fredoka One'", color: COLORS.pink, margin: 0 }}>Historia Loca 📖</h2>
        <span style={{ fontSize: 24 }}>🎭</span>
      </div>

      {phase === "fill" && (
        <Card>
          <p style={{ fontFamily: "'Fredoka One'", fontSize: 18, color: "#555", textAlign: "center", marginBottom: 20 }}>
            ¡Llena los espacios y crearemos una historia súper loca! 🤪
          </p>
          {fields.map((f, i) => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "'Fredoka One'", color: BLOCK_COLORS[i], fontSize: 17, display: "block", marginBottom: 4 }}>
                {f.label}:
              </label>
              <input
                value={words[f.key]}
                onChange={e => setWords({ ...words, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                style={{
                  width: "100%", padding: "10px 16px", borderRadius: 12,
                  border: `3px solid ${BLOCK_COLORS[i]}`,
                  fontFamily: "'Nunito', sans-serif", fontSize: 17,
                  outline: "none", boxSizing: "border-box"
                }}
              />
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Btn onClick={generateStory} disabled={!allFilled || loading} color={COLORS.pink}>
              {loading ? "Creando historia... 🪄" : "¡Crear historia! 🎉"}
            </Btn>
          </div>
        </Card>
      )}

      {phase === "story" && (
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
          <div style={{
            background: "linear-gradient(135deg, #fff9c4, #ffe0f7)",
            borderRadius: 20, padding: 24, marginBottom: 20,
            fontFamily: "'Nunito', sans-serif", fontSize: 19, lineHeight: 1.7,
            color: "#333", textAlign: "left", border: "2px dashed " + COLORS.pink
          }}>
            {story}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Btn onClick={() => { setPhase("fill"); setStory(null); setWords({ nombre: "", animal: "", lugar: "", adjetivo: "", accion: "" }); }} color={COLORS.purple}>
              Otra historia 🔄
            </Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── JUEGO 5: TRIVIA DE CIENCIAS ──────────────────────────────────────────
function GameTriviaCiencias({ onBack, addScore }) {
  const QUESTIONS = [
    { q: "¿Cuántas patas tiene una araña?", opts: ["4", "6", "8", "10"], a: "8", emoji: "🕷️" },
    { q: "¿Qué necesitan las plantas para crecer?", opts: ["Leche", "Luz solar", "Jugo", "Arena"], a: "Luz solar", emoji: "🌱" },
    { q: "¿Qué planeta es el más grande del sistema solar?", opts: ["Tierra", "Marte", "Júpiter", "Saturno"], a: "Júpiter", emoji: "🪐" },
    { q: "¿Qué animal es el más rápido del mundo?", opts: ["León", "Guepardo", "Caballo", "Águila"], a: "Guepardo", emoji: "🐆" },
    { q: "¿Cuántos huesos tiene el cuerpo humano adulto?", opts: ["106", "206", "306", "406"], a: "206", emoji: "🦴" },
    { q: "¿Cómo se llama el proceso por el que las plantas hacen comida?", opts: ["Fotosíntesis", "Respiración", "Digestión", "Evaporación"], a: "Fotosíntesis", emoji: "🍃" },
    { q: "¿Qué gas respiramos principalmente?", opts: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Helio"], a: "Oxígeno", emoji: "💨" },
    { q: "¿Cuántos planetas hay en nuestro sistema solar?", opts: ["7", "8", "9", "10"], a: "8", emoji: "🌍" },
  ];

  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const q = QUESTIONS[idx];

  function pick(opt) {
    if (opt === q.a) {
      setFeedback({ text: "¡Correcto! 🎊", ok: true });
      addScore(1); setCorrect(c => c + 1);
    } else {
      setFeedback({ text: `La respuesta era: ${q.a} 🔬`, ok: false });
    }
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= QUESTIONS.length) setDone(true);
      else setIdx(i => i + 1);
    }, 1800);
  }

  if (done) return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Btn onClick={onBack} color={COLORS.orange} style={{ fontSize: 15, padding: "8px 18px" }}>← Volver</Btn>
        <h2 style={{ fontFamily: "'Fredoka One'", color: COLORS.teal, margin: 0 }}>Trivia Ciencias 🔬</h2>
        <span />
      </div>
      <Card style={{ textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🏆</div>
        <p style={{ fontFamily: "'Fredoka One'", fontSize: 26, color: COLORS.blue }}>¡Terminaste!</p>
        <p style={{ fontFamily: "'Fredoka One'", fontSize: 22, color: COLORS.green }}>
          {correct} de {QUESTIONS.length} correctas
        </p>
        <div style={{ margin: "16px 0", fontSize: 32 }}>
          {"⭐".repeat(Math.round(correct / QUESTIONS.length * 5))}
        </div>
        <Btn onClick={() => { setIdx(0); setCorrect(0); setDone(false); }} color={COLORS.teal}>Jugar de nuevo 🔄</Btn>
      </Card>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Btn onClick={onBack} color={COLORS.orange} style={{ fontSize: 15, padding: "8px 18px" }}>← Volver</Btn>
        <h2 style={{ fontFamily: "'Fredoka One'", color: COLORS.teal, margin: 0 }}>Trivia Ciencias 🔬</h2>
        <span style={{ fontFamily: "'Fredoka One'", color: COLORS.teal, fontSize: 16 }}>{idx + 1}/{QUESTIONS.length}</span>
      </div>

      <Card style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, margin: "8px 0 16px" }}>{q.emoji}</div>
        <p style={{
          fontFamily: "'Fredoka One'", fontSize: 22, color: "#333",
          background: COLORS.teal + "18", borderRadius: 16, padding: "14px 20px",
          marginBottom: 24
        }}>{q.q}</p>

        <FeedbackBanner text={feedback?.text} success={feedback?.ok} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {q.opts.map((opt, i) => (
            <Btn key={opt} color={BLOCK_COLORS[i * 2]} onClick={() => pick(opt)}
              style={{ fontSize: 18, padding: "16px", width: "100%", borderRadius: 18 }}>
              {opt}
            </Btn>
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 20 }}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: "50%",
              background: i < idx ? COLORS.green : i === idx ? COLORS.blue : "#ddd"
            }} />
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── PANTALLA PRINCIPAL ───────────────────────────────────────────────────
const GAMES = [
  { id: "suma", title: "Suma con Bloques", emoji: "🧮", desc: "Suma números con bloques de colores", color: COLORS.red, materia: "Matemáticas" },
  { id: "misterioso", title: "Número Misterioso", emoji: "🔮", desc: "Adivina el número con pistas de IA", color: COLORS.purple, materia: "Matemáticas" },
  { id: "palabras", title: "Cazador de Palabras", emoji: "🔤", desc: "Aprende inglés con emojis", color: COLORS.green, materia: "Inglés" },
  { id: "madlibs", title: "Historia Loca", emoji: "📖", desc: "Crea historias ridículas con IA", color: COLORS.pink, materia: "Español" },
  { id: "ciencias", title: "Trivia Ciencias", emoji: "🔬", desc: "Preguntas del mundo natural", color: COLORS.teal, materia: "Ciencias" },
];

export default function App() {
  const [screen, setScreen] = useState("home");
  const [totalScore, setTotalScore] = useState(0);
  const [player, setPlayer] = useState(null); // "daniel" | "alan"

  function addScore(n) { setTotalScore(s => s + n); }

  // ── Selección de jugador ──────────────────────────────────────────────
  if (!player) return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FFD600 0%, #FF8C00 40%, #FF3B3B 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 24, fontFamily: "'Fredoka One', cursive"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pop { 0%{transform:scale(0.7);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        * { box-sizing: border-box; }
      `}</style>
      <div style={{ animation: "float 3s ease-in-out infinite", marginBottom: 24 }}>
        <div style={{ fontSize: 80 }}>🎮</div>
      </div>
      <h1 style={{ fontSize: 40, color: "white", textShadow: "0 4px 12px rgba(0,0,0,0.2)", margin: "0 0 8px", textAlign: "center" }}>
        ¡Aprende Jugando!
      </h1>
      <p style={{ color: "white", fontSize: 20, opacity: 0.9, marginBottom: 40, fontFamily: "'Nunito'" }}>
        ¿Quién va a jugar hoy?
      </p>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { id: "daniel", name: "Daniel", emoji: "🧑", age: "9 años", color: COLORS.blue },
          { id: "alan", name: "Alan", emoji: "👦", age: "4 años", color: COLORS.green },
        ].map(p => (
          <div key={p.id} onClick={() => setPlayer(p.id)}
            style={{
              background: "white", borderRadius: 28, padding: "28px 40px",
              textAlign: "center", cursor: "pointer",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              border: `4px solid ${p.color}`,
              transition: "transform 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <div style={{ fontSize: 64 }}>{p.emoji}</div>
            <div style={{ fontSize: 28, color: p.color, marginTop: 8 }}>{p.name}</div>
            <div style={{ fontSize: 16, color: "#999", fontFamily: "'Nunito'" }}>{p.age}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Home (menú de juegos) ─────────────────────────────────────────────
  if (screen === "home") return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #e8f4ff 0%, #fff9e6 50%, #ffe6f7 100%)",
      padding: "24px 16px", fontFamily: "'Fredoka One', cursive"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pop { 0%{transform:scale(0.7);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 32, margin: 0, color: COLORS.dark }}>¡Hola, {player === "daniel" ? "Daniel" : "Alan"}! 👋</h1>
            <p style={{ margin: 0, fontFamily: "'Nunito'", color: "#888", fontSize: 15 }}>¿Qué quieres aprender hoy?</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <StarScore score={totalScore} />
            <button onClick={() => setPlayer(null)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Nunito'", color: "#aaa", fontSize: 13, marginTop: 4
            }}>cambiar jugador</button>
          </div>
        </div>

        {/* Cards de juegos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {GAMES.map((g, i) => (
            <div key={g.id}
              onClick={() => setScreen(g.id)}
              style={{
                background: "white", borderRadius: 24, padding: "20px 24px",
                display: "flex", alignItems: "center", gap: 20,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: `3px solid ${g.color}22`,
                cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s",
                animation: `pop 0.4s ease ${i * 0.08}s both`,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateX(6px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${g.color}33`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: g.color + "20", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 36, flexShrink: 0,
                border: `3px solid ${g.color}40`
              }}>{g.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, color: COLORS.dark }}>{g.title}</div>
                <div style={{ fontFamily: "'Nunito'", fontSize: 15, color: "#888", marginTop: 2 }}>{g.desc}</div>
                <div style={{
                  display: "inline-block", marginTop: 6,
                  background: g.color + "22", color: g.color,
                  borderRadius: 8, padding: "2px 10px",
                  fontFamily: "'Nunito'", fontSize: 13, fontWeight: 700
                }}>{g.materia}</div>
              </div>
              <div style={{ fontSize: 24, color: g.color }}>→</div>
            </div>
          ))}
        </div>

        {/* Bloques decorativos abajo */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 36 }}>
          {[1,2,3,4,5].map(n => (
            <Block key={n} n={n} color={BLOCK_COLORS[n-1]} size={36} style={{ animation: `bounce ${1 + n * 0.15}s ease-in-out infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );

  // ── Render del juego activo ───────────────────────────────────────────
  const gameProps = { onBack: () => setScreen("home"), addScore };
  const wrapper = (children) => (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #e8f4ff 0%, #fff9e6 50%, #ffe6f7 100%)",
      padding: "24px 16px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pop { 0%{transform:scale(0.7);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
      `}</style>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>{children}</div>
    </div>
  );

  if (screen === "suma")       return wrapper(<GameSumaBloques {...gameProps} />);
  if (screen === "misterioso") return wrapper(<GameNumeroMisterioso {...gameProps} />);
  if (screen === "palabras")   return wrapper(<GameCazadorPalabras {...gameProps} />);
  if (screen === "madlibs")    return wrapper(<GameMadLibs {...gameProps} />);
  if (screen === "ciencias")   return wrapper(<GameTriviaCiencias {...gameProps} />);
}
