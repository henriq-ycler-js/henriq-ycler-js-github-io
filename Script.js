let posts = [];

// 🔥 CONFIG FIREBASE (GLOBAL)
const firebaseConfig = {
  apiKey: "AIzaSyDC2dJ1EZ2dadKM4B0oSypZhtH-ymRMaRU",
  authDomain: "midia-lourdes.firebaseapp.com",
  projectId: "midia-lourdes",
  storageBucket: "midia-lourdes.appspot.com",
  messagingSenderId: "595141322347",
  appId: "1:595141322347:web:1c110d2f5d6a587e74732e"
};

let db;

// 🚀 INICIAR FIREBASE UMA VEZ
async function iniciarFirebase() {
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js");
  const { getFirestore } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js");

  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  carregarPosts();
}

// 🔥 CARREGAR POSTS
async function carregarPosts() {
  const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js");

  const querySnapshot = await getDocs(collection(db, "posts"));

  posts = [];

  querySnapshot.forEach(doc => {
    posts.push({
      id: doc.id,
      ...doc.data()
    });
  });

  render();
}

// 🎬 CONVERTER YOUTUBE
function converterYouTube(link) {
  if (!link) return "";

  let id = "";

  if (link.includes("watch?v=")) {
    id = link.split("watch?v=")[1].split("&")[0];
  } else if (link.includes("youtu.be/")) {
    id = link.split("youtu.be/")[1];
  }

  return "https://www.youtube.com/embed/" + id;
}

// 🎨 RENDER
function render() {
  let nine = document.getElementById("ninecastPosts");
  let lourdes = document.getElementById("lourdesPosts");
  let eventos = document.getElementById("eventosPosts");

  nine.innerHTML = "";
  lourdes.innerHTML = "";
  eventos.innerHTML = "";

  posts.forEach((p, i) => {

    let card = document.createElement("div");
    card.classList.add("card");

    let slides = "";
    let total = 0;

    // 🎬 vídeo
    if (p.video) {
      slides += `
        <div class="slide">
          <iframe src="${converterYouTube(p.video)}" allowfullscreen></iframe>
        </div>
      `;
      total++;
    }

    // 🖼️ imagens
    if (p.imagens) {
      p.imagens.forEach(img => {
        slides += `
          <div class="slide">
            <img src="${img}">
          </div>
        `;
        total++;
      });
    }

    let dots = "";
    for (let d = 0; d < total; d++) {
      dots += `<span class="dot ${d === 0 ? "active" : ""}"></span>`;
    }

    let midia = `
      <div class="carousel">
        <div class="carousel-track">
          ${slides}
        </div>
        <div class="dots">${dots}</div>
      </div>
    `;

    card.innerHTML = `
      ${midia}

      <div class="card-content">
        <h3>${p.titulo}</h3>
        <p>${p.descricao}</p>
        <small>${p.autor || "Anônimo"} • ${p.data || ""}</small>

        <div class="actions">
          <button onclick="curtir(${i})">❤️ ${p.curtidas || 0}</button>
          <button onclick="comentar(${i})">💬</button>
          <button onclick="compartilhar('${p.titulo}')">📤</button>
        </div>

        <div class="comentarios">
          ${(p.comentarios || []).map(c => `<p>💬 ${c}</p>`).join("")}
        </div>
      </div>
    `;

    if (p.categoria === "NineCast") {
      nine.appendChild(card);
    } else if (p.categoria === "Eventos") {
      eventos.appendChild(card);
    } else {
      lourdes.appendChild(card);
    }

  });

  ativarCarousel();
}

// 🔘 CARROSSEL
function ativarCarousel() {
  document.querySelectorAll(".carousel").forEach(carousel => {

    let track = carousel.querySelector(".carousel-track");
    let dots = carousel.querySelectorAll(".dot");

    track.addEventListener("scroll", () => {
      let index = Math.round(track.scrollLeft / track.clientWidth);

      dots.forEach(d => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    });

  });
}

// ❤️ CURTIR (SALVA NO FIREBASE)
async function curtir(i) {
  const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js");

  let post = posts[i];

  post.curtidas = (post.curtidas || 0) + 1;

  await updateDoc(doc(db, "posts", post.id), {
    curtidas: post.curtidas
  });

  render(); // 🔥 só renderiza, não recarrega tudo
}

// 💬 COMENTAR
async function comentar(i) {
  const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js");

  let texto = prompt("Digite um comentário:");
  if (!texto) return;

  let post = posts[i];

  if (!post.comentarios) post.comentarios = [];
  post.comentarios.push(texto);

  await updateDoc(doc(db, "posts", post.id), {
    comentarios: post.comentarios
  });

  render(); // 🔥 não recarrega tudo
}

// 📤 COMPARTILHAR
function compartilhar(titulo) {
  navigator.clipboard.writeText(titulo);
  alert("Copiado 🔥");
}
window.curtir = curtir;
window.comentar = comentar;
window.compartilhar = compartilhar;

// 🚀 START
iniciarFirebase();
