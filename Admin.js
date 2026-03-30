import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDC2dJ1EZ2dadKM4B0oSypZhtH-ymRMaRU",
  authDomain: "midia-lourdes.firebaseapp.com",
  projectId: "midia-lourdes",
  storageBucket: "midia-lourdes.appspot.com",
  messagingSenderId: "595141322347",
  appId: "1:595141322347:web:1c110d2f5d6a587e74732e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 SALVAR POST
async function salvarPost() {
  const tituloEl = document.getElementById("titulo");
  const descricaoEl = document.getElementById("descricao");
  const imagemEl = document.getElementById("imagem");
  const videoEl = document.getElementById("video");
  const categoriaEl = document.getElementById("categoria");
  const destaqueEl = document.getElementById("destaque");
  const autorEl = document.getElementById("autor");
  const dataEl = document.getElementById("data");

  let listaImagens = imagemEl.value
    .split("\n")
    .map(img => img.trim())
    .filter(img => img !== "");

  let post = {
    titulo: tituloEl.value,
    descricao: descricaoEl.value,
    imagens: listaImagens,
    video: videoEl.value,
    categoria: categoriaEl.value,
    destaque: destaqueEl.checked,
    autor: autorEl.value,
    data: dataEl.value,
    curtidas: 0,
    comentarios: []
  };

  try {
    await addDoc(collection(db, "posts"), post);

    alert("Post salvo 🔥");

    // limpar campos
    tituloEl.value = "";
    descricaoEl.value = "";
    imagemEl.value = "";
    videoEl.value = "";
    autorEl.value = "";
    dataEl.value = "";

    carregarLista(); // 🔥 atualiza lista
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar ❌");
  }
}

// 🔥 CARREGAR POSTS NO ADMIN
async function carregarLista() {
  const lista = document.getElementById("lista");

  if (!lista) return; // evita erro se não existir

  lista.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "posts"));

  querySnapshot.forEach((docSnap) => {
    let p = docSnap.data();

    lista.innerHTML += `
      <div style="margin-bottom:10px;">
        <strong>${p.titulo}</strong>
        <button onclick="deletar('${docSnap.id}')">Excluir</button>
      </div>
    `;
  });
}

// 🔥 DELETAR
async function deletar(id) {
  if (!confirm("Apagar post?")) return;

  await deleteDoc(doc(db, "posts", id));

  carregarLista();
}

// 🔥 DEIXAR GLOBAL
window.salvarPost = salvarPost;
window.deletar = deletar;

// 🚀 INICIAR
carregarLista();
