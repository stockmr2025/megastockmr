// Firebase App (the core Firebase SDK) est toujours requis et doit être listé en premier
// Ajoutez ce script dans votre HTML :
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>

// --- Configuration Firebase (à personnaliser avec vos propres clés) ---
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- STOCK ---
function chargerStockDepuisFirebase() {
  db.collection('stock').onSnapshot((querySnapshot) => {
    const tbody = document.querySelector('#vehicles-table tbody');
    if (tbody) tbody.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const vehicule = doc.data();
      const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${vehicule.MR || ''}</td>
          <td>${vehicule.Marque || ''}</td>
          <td>${vehicule["Modèle"] || ''}</td>
          <td>${vehicule.Année || ''}</td>
          <td>${vehicule.Coût || ''}</td>
          <td>${vehicule.Statut || ''}</td>
          <td>
            <button class="btn btn-secondary" onclick="editVehicle(this, '${doc.id}')">✏️</button>
            <button class="btn btn-danger" onclick="deleteVehicle('${doc.id}')">🗑️</button>
            ${vehicule.Statut === 'Vendu' ? `<button class="btn btn-danger" onclick="deleteVehicle('${doc.id}')">🗑️ Vente</button>` : ''}
            <button class="btn btn-info" onclick="showProfil('${doc.id}')">👁️ Profil</button>
          </td>
        `;
      tbody.appendChild(tr);
    });
  });
}

function ajouterVehiculeFirebase(vehicule) {
  db.collection('stock').add(vehicule);
}

// --- FACTURES ---
function chargerFacturesDepuisFirebase() {
  db.collection('factures').onSnapshot((querySnapshot) => {
    const tbody = document.querySelector('#invoices-table tbody');
    if (tbody) tbody.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const facture = doc.data();
      const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${facture.Type || ''}</td>
          <td>${facture.Date || ''}</td>
          <td>${facture["No Facture"] || ''}</td>
          <td>${facture.Description || ''}</td>
          <td>${facture.Montant || ''}</td>
          <td>
            <button class="btn btn-secondary" onclick="editInvoice(this, '${doc.id}')">✏️</button>
            <button class="btn btn-danger" onclick="deleteInvoice('${doc.id}')">🗑️</button>
          </td>
        `;
      tbody.appendChild(tr);
    });
  });
}

function ajouterFactureFirebase(facture) {
  db.collection('factures').add(facture);
}

// --- Initialisation automatique à l'ouverture ---
document.addEventListener('DOMContentLoaded', function() {
  chargerStockDepuisFirebase();
  chargerFacturesDepuisFirebase();
});

// --- À utiliser lors de l'ajout d'un véhicule ou d'une facture ---
// ajouterVehiculeFirebase({ MR: '...', Marque: '...', Modèle: '...', Année: '...', Coût: '...', Statut: '...' });
// ajouterFactureFirebase({ Type: '...', Date: '...', 'No Facture': '...', Description: '...', Montant: '...' });

// --- À compléter : édition, suppression, gestion des formulaires ---
