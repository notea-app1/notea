  // Api Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAxNJKdL46TuyWvjXXjlJil0Cn298y8rkM",
    authDomain: "notea-77986.firebaseapp.com",
    projectId: "notea-77986",
    storageBucket: "notea-77986.firebasestorage.app",
    messagingSenderId: "232572730880",
    appId: "1:232572730880:web:b1c008ed2b0fee3f49e2e5"
  };
  //Conectar con Firebase/FirebaseStore
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Login
  function login() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
  
    auth.signInWithEmailAndPassword(email, pass)
      .then(() => window.location.href = "notas.html")
      .catch(e => alert("Error: " + e.message));
  }
  // Registrarse
  function register() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
  
    auth.createUserWithEmailAndPassword(email, pass)
      .then(() => window.location.href = "notas.html")
      .catch(e => alert("Error: " + e.message));
  }
  
  // Chekeo de Estado
  auth.onAuthStateChanged(user => {
  if (window.location.pathname.includes("notas")) {
    if (user) {
      const infoDiv = document.getElementById("usuario-info");
      infoDiv.innerText = "Sesión iniciada como: " + user.email;

      cargarNotas(user.uid);
    } else {
      window.location.href = "index.html";
    }
  }
  });

  //Guardar Nota
  function guardarNota() {
    const nota = document.getElementById("nota").value;
    const user = auth.currentUser;
  
    if (user) {
      db.collection("users").doc(user.uid).collection("notas").add({
        texto: nota,
        fecha: new Date()
      }).then(() => {
        alert("Nota guardada");
        document.getElementById("nota").value = "";
        cargarNotas(user.uid);
      });
    }
  }
  //Cargar Notas
  function cargarNotas(uid) {
  db.collection("users").doc(uid).collection("notas").orderBy("fecha", "desc")
    .get().then(snapshot => {
      let html = "";
      snapshot.forEach(doc => {
        html += `
          <div class="nota">
            <p>${doc.data().texto}</p>
            <button onclick="eliminarNota('${uid}', '${doc.id}')">
              <img src="icons/delete_50dp_FFFFFF_FILL0_wght400_GRAD0_opsz48.svg" alt="Eliminar" width="20" style="vertical-align: middle; margin-right: 5px;">
              Eliminar
            </button>

          </div>
        `;
      });
      document.getElementById("notas").innerHTML = html;
    });
  }

  //Eliminar nota
  function eliminarNota(uid, notaId) {
  db.collection("users").doc(uid).collection("notas").doc(notaId).delete()
    .then(() => {
      alert("Nota eliminada");
      cargarNotas(uid);
    });
  }
  //Desloguearse
  function logout() {
    auth.signOut().then(() => {
      window.location.href = "index.html";
    });
  }
  