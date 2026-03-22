// =========================
// CONFIGURACIÓN FIREBASE (CHAT COMUNITARIO)
// =========================

const firebaseConfig = {
  apiKey: "AIzaSyBszXCEQ-qtDPtg3KuezkZKmagrEeTOygM",
  authDomain: "aaaa-4e0a6.firebaseapp.com",
  databaseURL: "https://aaaa-4e0a6-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "aaaa-4e0a6",
  storageBucket: "aaaa-4e0a6.firebasestorage.app",
  messagingSenderId: "64291051328",
  appId: "1:64291051328:web:96b8a424491bc96a870ca5"
};

let db = null;

if (typeof firebase !== "undefined") {
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();
}

// =========================
// CARGAR FUENTE ESCOLAR PARA PDF
// =========================
async function cargarFuenteEscolar(doc) {
  try {
    const url = "https://fonts.gstatic.com/s/patrickhand/v17/LDI1apSQOAYtSuYWp8ZhfYe8U6s.woff2";
    const font = await fetch(url).then(r => r.arrayBuffer());
    const base64 = btoa(
      new Uint8Array(font).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    doc.addFileToVFS("PatrickHand.ttf", base64);
    doc.addFont("PatrickHand.ttf", "PatrickHand", "normal");
    doc.setFont("PatrickHand");
  } catch (e) {
    console.error("Error cargando fuente escolar:", e);
    doc.setFont("helvetica"); // fallback
  }
}


// =========================
// AUDIO DICCIONARIO LOCAL
// =========================

function playFonema(src) {
  const audio = document.getElementById("audio-player");
  if (!audio) return;
  audio.src = src;
  audio.play();
}

// =========================
// MATERIALES ADAPTADOS (SIMULACIÓN)
// =========================

function generarFichaAdaptada() {
  const fonema = document.getElementById("mat-fonema")?.value || "";
  const pictos = document.getElementById("mat-pictos")?.checked;
  const open = document.getElementById("mat-open")?.checked;
  const trazo = document.getElementById("mat-trazo")?.checked;
  const cont = document.getElementById("mat-preview");
  if (!cont) return;

  const apoyos = [];
  if (pictos) apoyos.push("Pictogramas");
  if (open) apoyos.push("Fuente OpenDyslexic");
  if (trazo) apoyos.push("Guías de trazo");

  cont.innerHTML = `
    <h1 style="color:#1d4ed8;">Ficha del fonema ${fonema}</h1>

    <h2>Objetivo general</h2>
    <p>Desarrollar la conciencia fonológica del fonema <strong>${fonema}</strong> mediante actividades multisensoriales, visuales y motoras adaptadas a las necesidades del alumnado.</p>

    <h2>Materiales necesarios</h2>
    <ul>
      <li>Tarjetas del fonema ${fonema}</li>
      <li>Pictogramas o imágenes reales</li>
      <li>Hojas de trazo y lápices gruesos</li>
      <li>Objetos reales que empiecen por ${fonema}</li>
      <li>Espejo para observar la articulación</li>
    </ul>

    <h2>Apoyos seleccionados</h2>
    <p>${apoyos.length ? apoyos.join(", ") : "Ninguno"}</p>

    <h2>Actividades propuestas</h2>

    <h3>1. Activación multisensorial</h3>
    <p>El alumnado escucha el fonema, observa el gesto asociado y practica la articulación frente al espejo.</p>

    <h3>2. Discriminación auditiva</h3>
    <p>El docente pronuncia palabras que contienen o no el fonema ${fonema}. El alumnado levanta una tarjeta cuando lo escucha.</p>

    <h3>3. Asociación visual</h3>
    <p>Clasificar imágenes en dos grupos: “Sí contiene ${fonema}” y “No contiene ${fonema}”.</p>

    <h3>4. Trazado guiado</h3>
    <p>Realizar el trazo del fonema en grande, siguiendo flechas, puntos o guías táctiles.</p>

    <h3>5. Producción oral</h3>
    <p>Nombrar objetos reales o imágenes que empiecen por ${fonema}. Practicar la articulación.</p>

    <h3>6. Juego final</h3>
    <p>“Encuentra el fonema”: buscar por la clase objetos que empiecen por ${fonema}.</p>

    <h2>Evaluación</h2>
    <ul>
      <li>Identifica el fonema en palabras orales.</li>
      <li>Relaciona imágenes con el fonema.</li>
      <li>Realiza el trazo correctamente.</li>
      <li>Pronuncia el fonema de forma clara.</li>
      <li>Participa activamente en las actividades.</li>
    </ul>

    <h2>Recomendaciones para el docente</h2>
    <p>Refuerza el fonema con gestos, canciones, rutinas diarias y apoyos visuales constantes. Mantén un enfoque lúdico y multisensorial.</p>
  `;
}

// =========================
// DESCARGA PDF (PROFESIONAL)
// =========================

async function descargarFichaPDF() {
  const cont = document.getElementById("mat-preview");
  if (!cont || !cont.innerHTML.trim()) {
    alert("Primero genera una ficha.");
    return;
  }

  if (!window.jspdf) {
    alert("jsPDF no está cargado. Revisa el <script> en el HTML.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    unit: "pt",
    format: "a4"
  });

  // ============================
  // PORTADA BONITA Y SEGURA
  // ============================

  // Fondo suave
  doc.setFillColor(255, 245, 200);
  doc.rect(0, 0, 595, 842, "F");

  // Título principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(40, 40, 40);
  doc.text("Ficha Fonética Adaptada", 60, 120);

  // Subtítulo
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text("Ecosistema Fonético Inclusivo", 60, 160);

  // Línea decorativa
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(2);
  doc.line(60, 190, 535, 190);

  // Pie de portada
  doc.setFontSize(12);
  doc.text("Material generado automáticamente", 60, 220);

  doc.addPage();

  // ============================
  // CONTENIDO
  // ============================

  const texto = cont.innerText.split("\n").filter(l => l.trim() !== "");
  let y = 80;

  const header = () => {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Ecosistema Fonético Inclusivo · Ficha Fonética", 60, 40);
    doc.setDrawColor(200, 200, 200);
    doc.line(60, 50, 535, 50);
  };

  header();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);

  texto.forEach(linea => {
    const lineas = doc.splitTextToSize(linea, 475);

    lineas.forEach(l => {
      if (y > 760) {
        doc.addPage();
        y = 80;
        header();
      }

      doc.text(l, 60, y);
      y += 18;
    });
  });

  doc.save("ficha-fonetica.pdf");
}


// =========================
// GENERADOR DE MATERIALES CON IA (GROQ vía backend)
// =========================

async function generarMaterialIA() {
  const fonema = document.getElementById("gen-fonema")?.value || "";
  const pictos = document.getElementById("gen-pictos")?.checked;
  const open = document.getElementById("gen-open")?.checked;
  const trazo = document.getElementById("gen-trazo")?.checked;
  const cont = document.getElementById("gen-result");
  if (!cont) return;

  cont.innerHTML = "<p>Pensando con la IA...</p>";

  const apoyos = [];
  if (pictos) apoyos.push("pictogramas");
  if (open) apoyos.push("fuente OpenDyslexic");
  if (trazo) apoyos.push("guías de trazo");

  const prompt = `
Eres una maestra de infantil experta en Jolly Phonics e inclusión.
Devuelve SIEMPRE la respuesta en HTML limpio (<h1>, <h2>, <p>, <ul>, <li>, <strong>).
Diseña una ficha y 3 actividades para trabajar el fonema ${fonema}
con los siguientes apoyos: ${apoyos.length ? apoyos.join(", ") : "sin apoyos específicos"}.
Incluye instrucciones claras para el docente y pasos sencillos para el alumnado.
`;

  try {
    const res = await fetch("https://ecosistema-fonetico-backend.onrender.com/api/chat-ia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) throw new Error("Error en la respuesta del servidor");

    const data = await res.json();

    cont.innerHTML = data.texto || "<p>No se recibió texto de la IA.</p>";

  } catch (e) {
    console.error(e);
    cont.innerHTML = "<p style='color:#ef4444;'>Error al conectar con la IA.</p>";
  }
}

// =========================
// STT (Deepgram vía backend)
// =========================

async function enviarAudioSTT() {
  const fileInput = document.getElementById("stt-file");
  const cont = document.getElementById("stt-result");
  if (!fileInput || !cont) return;

  const file = fileInput.files[0];
  if (!file) {
    cont.innerHTML = "<p class='placeholder'>Selecciona un archivo de audio primero.</p>";
    return;
  }

  cont.innerHTML = "<p>Transcribiendo audio...</p>";

  const formData = new FormData();
  formData.append("audio", file);

  try {
    const res = await fetch("https://ecosistema-fonetico-backend.onrender.com/api/sst", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Error en /api/stt");

    const data = await res.json();

    cont.innerHTML = `
      <h2>Transcripción</h2>
      <p>${data.texto || "No se obtuvo texto."}</p>
    `;

  } catch (e) {
    console.error(e);
    cont.innerHTML = "<p style='color:#ef4444;'>Error al conectar con /api/stt.</p>";
  }
}

// =========================
// TTS (ElevenLabs vía backend)
// =========================

async function enviarTextoTTS() {
  const input = document.getElementById("tts-text");
  const audioElem = document.getElementById("tts-audio");
  if (!input || !audioElem) return;

  const texto = input.value.trim();
  if (!texto) return;

  try {
    const res = await fetch("https://ecosistema-fonetico-backend.onrender.com/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto })
    });

    if (!res.ok) throw new Error("Error en /api/tts");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    audioElem.src = url;
    audioElem.style.display = "block";
    audioElem.play();

  } catch (e) {
    console.error(e);
    alert("Error al conectar con /api/tts.");
  }
}

// =========================
// CHAT COMUNITARIO (Firebase)
// =========================

function initChat() {
  if (!db) return;
  const messagesRef = db.ref("chat-mensajes");
  const cont = document.getElementById("chat-messages");
  if (!cont) return;

  messagesRef.limitToLast(100).on("child_added", (snap) => {
    const msg = snap.val();
    const div = document.createElement("div");
    div.className = "chat-message";
    const time = new Date(msg.timestamp || Date.now());
    const hh = time.getHours().toString().padStart(2, "0");
    const mm = time.getMinutes().toString().padStart(2, "0");
    div.innerHTML = `
      <span class="chat-message-name">${escapeHtml(msg.name || "Anónimo")}:</span>
      <span>${escapeHtml(msg.text || "")}</span>
      <span class="chat-message-time">(${hh}:${mm})</span>
    `;
    cont.appendChild(div);
    cont.scrollTop = cont.scrollHeight;
  });
}

async function enviarMensajeChat() {
  if (!db) {
    alert("El chat no está configurado (Firebase).");
    return;
  }
  const nameInput = document.getElementById("chat-name");
  const msgInput = document.getElementById("chat-message");
  if (!nameInput || !msgInput) return;

  const name = nameInput.value.trim() || "Anónimo";
  const text = msgInput.value.trim();
  if (!text) return;

  const messagesRef = db.ref("chat-mensajes");
  await messagesRef.push({
    name,
    text,
    timestamp: Date.now()
  });

  msgInput.value = "";
}

// =========================
// ENVIAR CHAT
// =========================
async function enviarChat() {
  const input = document.getElementById("chat-input");
  const prompt = input.value.trim();

  if (!prompt) return;

  const res = await fetch("https://ecosistema-fonetico-backend.onrender.com/api/chat-ia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();

  document.getElementById("mat-preview").innerHTML = data.texto;
}

// =========================
// ENVIAR MENSAJE
// =========================

function enviarMensajeChat() {
  const nombre = document.getElementById("chat-name").value.trim();
  const mensaje = document.getElementById("chat-message").value.trim();

  if (!nombre || !mensaje) return;

  db.ref("chat").push({
    nombre,
    mensaje,
    timestamp: Date.now()
  });

  document.getElementById("chat-message").value = "";
}

// Escuchar mensajes en tiempo real
db.ref("chat").on("child_added", (snapshot) => {
  const data = snapshot.val();

  const cont = document.getElementById("chat-messages");
  const div = document.createElement("div");

  div.className = "mensaje";
  div.innerHTML = `<strong>${data.nombre}:</strong> ${data.mensaje}`;

  cont.appendChild(div);
  cont.scrollTop = cont.scrollHeight;
});

// =========================
// UTILIDAD: escape HTML
// =========================

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// =========================
// INICIALIZACIÓN POR PÁGINA
// =========================

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("chat-messages")) {
    initChat();
  }
});
