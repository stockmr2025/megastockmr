// --- Gestion Fournisseurs (Admin) ---
function chargerFournisseurs() {
  db.collection('fournisseurs').onSnapshot((snap) => {
    const ul = document.getElementById('liste-fournisseurs');
    ul.innerHTML = '';
    snap.forEach(doc => {
      const f = doc.data();
      const li = document.createElement('li');
      li.textContent = f.nom;
      const btn = document.createElement('button');
      btn.textContent = '🗑️';
      btn.className = 'btn btn-danger';
      btn.onclick = () => db.collection('fournisseurs').doc(doc.id).delete();
      li.appendChild(btn);
      ul.appendChild(li);
    });
  });
}

document.getElementById('form-fournisseur').onsubmit = function(e) {
  e.preventDefault();
  const nom = document.getElementById('nom-fournisseur').value.trim();
  if(nom) db.collection('fournisseurs').add({nom});
  this.reset();
};

// --- Gestion Champs dynamiques (Admin) ---
function chargerChampsDynamiques() {
  db.collection('champs_stock').onSnapshot((snap) => {
    const ul = document.getElementById('liste-champs');
    ul.innerHTML = '';
    snap.forEach(doc => {
      const c = doc.data();
      const li = document.createElement('li');
      li.textContent = c.nom;
      const btn = document.createElement('button');
      btn.textContent = '🗑️';
      btn.className = 'btn btn-danger';
      btn.onclick = () => db.collection('champs_stock').doc(doc.id).delete();
      li.appendChild(btn);
      ul.appendChild(li);
    });
  });
}

document.getElementById('form-champ').onsubmit = function(e) {
  e.preventDefault();
  const nom = document.getElementById('nom-champ').value.trim();
  if(nom) db.collection('champs_stock').add({nom});
  this.reset();
};

// Initialisation des listes admin à l'ouverture de l'onglet
document.addEventListener('DOMContentLoaded', function() {
  chargerFournisseurs();
  chargerChampsDynamiques();
});
// Affiche le profil détaillé d'un véhicule (achats, factures associées)
function showProfil(vehiculeId) {
  // Récupère les infos du véhicule
  db.collection('stock').doc(vehiculeId).get().then(doc => {
    if (!doc.exists) return alert('Véhicule introuvable');
    const v = doc.data();
    let html = `<h2>Profil du véhicule</h2>`;
    html += `<b>MR:</b> ${v.MR || ''}<br>`;
    html += `<b>Marque:</b> ${v.Marque || ''}<br>`;
    html += `<b>Modèle:</b> ${v['Modèle'] || ''}<br>`;
    html += `<b>Année:</b> ${v.Année || ''}<br>`;
    html += `<b>Coût:</b> ${v.Coût || ''}<br>`;
    html += `<b>Statut:</b> ${v.Statut || ''}<br>`;
    // Recherche des factures associées (par MR ou autre clé)
    db.collection('factures').where('MR', '==', v.MR).get().then(snap => {
      html += `<h3>Factures associées</h3>`;
      if (snap.empty) {
        html += '<i>Aucune facture liée</i>';
      } else {
        html += '<ul>';
        snap.forEach(fact => {
          const f = fact.data();
          html += `<li>${f['No Facture'] || ''} - ${f.Description || ''} - ${f.Montant || ''}€</li>`;
        });
        html += '</ul>';
      }
      // Affichage dans une modale ou une section dédiée
      let profilModal = document.getElementById('profil-modal');
      if (!profilModal) {
        profilModal = document.createElement('div');
        profilModal.id = 'profil-modal';
        profilModal.style.position = 'fixed';
        profilModal.style.top = '10%';
        profilModal.style.left = '50%';
        profilModal.style.transform = 'translateX(-50%)';
        profilModal.style.background = '#fff';
        profilModal.style.padding = '2em';
        profilModal.style.border = '2px solid #333';
        profilModal.style.zIndex = 10000;
        profilModal.style.maxWidth = '90vw';
        profilModal.style.maxHeight = '80vh';
        profilModal.style.overflowY = 'auto';
        document.body.appendChild(profilModal);
      }
      profilModal.innerHTML = html + '<br><button onclick="document.getElementById(\'profil-modal\').remove()">Fermer</button>';
      profilModal.style.display = 'block';
    });
  });
}
// Ce script permet d'importer des données depuis un fichier CSV exporté de Google Sheets
// et d'ajouter automatiquement les véhicules dans le tableau de stock de l'application.
// À inclure dans votre projet avec la balise <script src="script.js"></script>

// Fonction utilitaire pour parser un CSV simple (séparateur virgule, pas de guillemets imbriqués)
function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i] ? values[i].trim() : '';
    });
    return obj;
  });
}

// Ajoute les véhicules importés dans le tableau HTML
function ajouterVehiculesDepuisCSV(vehicules) {
  const tbody = document.querySelector('#vehicles-table tbody');
  vehicules.forEach(vehicule => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${vehicule['MR'] || ''}</td>
      <td>${vehicule['Marque'] || ''}</td>
      <td>${vehicule['Modèle'] || ''}</td>
      <td>${vehicule['Année'] || ''}</td>
      <td>${vehicule['Coût'] || ''}</td>
      <td>${vehicule['Statut'] || ''}</td>
      <td><button class="btn btn-secondary" onclick="editVehicle(this)">✏️</button></td>
    `;
    tbody.appendChild(tr);
  });
}


// Gestionnaire d'import CSV manuel
function handleImportCSV(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const csv = e.target.result;
    const vehicules = parseCSV(csv);
    ajouterVehiculesDepuisCSV(vehicules);
  };
  reader.readAsText(file);
}

// Import automatique du fichier CSV de stock si présent dans le projet
document.addEventListener('DOMContentLoaded', function() {
  fetch('STOCK MR ACHAT RICHARD - STOCK GLOBAL (1).csv')
    .then(response => {
      if (!response.ok) throw new Error('Fichier CSV non trouvé');
      return response.text();
    })
    .then(csv => {
      const vehicules = parseCSV(csv);
      // Vider le tableau avant d'ajouter les nouvelles données
      const tbody = document.querySelector('#vehicles-table tbody');
      if (tbody) tbody.innerHTML = '';
      ajouterVehiculesDepuisCSV(vehicules);
    })
    .catch(() => {/* Fichier absent, ne rien faire */});
});

document.addEventListener('DOMContentLoaded', function() {
  const headerActions = document.querySelector('#stock-section .header-actions div');
  if (headerActions) {
    const importLabel = document.createElement('label');
    importLabel.className = 'btn btn-secondary';
    importLabel.innerHTML = '📥 Importer CSV';
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.style.display = 'none';
    input.addEventListener('change', handleImportCSV);
    importLabel.appendChild(input);
    headerActions.appendChild(importLabel);
  }
});

// --- Import CSV pour les factures ---
function ajouterFacturesDepuisCSV(factures) {
  const tbody = document.querySelector('#invoices-table tbody');
  factures.forEach(facture => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${facture['Type'] || ''}</td>
      <td>${facture['Date'] || ''}</td>
      <td>${facture['No Facture'] || ''}</td>
      <td>${facture['Description'] || ''}</td>
      <td>${facture['Montant'] || ''}</td>
      <td><button class="btn btn-secondary" onclick="editInvoice(this)">✏️</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function handleImportFacturesCSV(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const csv = e.target.result;
    const factures = parseCSV(csv);
    ajouterFacturesDepuisCSV(factures);
  };
  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', function() {
  const headerActionsFactures = document.querySelector('#invoices-section .header-actions');
  if (headerActionsFactures) {
    const importLabel = document.createElement('label');
    importLabel.className = 'btn btn-secondary';
    importLabel.innerHTML = '📥 Importer CSV';
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.style.display = 'none';
    input.addEventListener('change', handleImportFacturesCSV);
    importLabel.appendChild(input);
    headerActionsFactures.appendChild(importLabel);
  }
});

// Ajout d'un véhicule via le formulaire et Firestore
function addVehicle() {
  document.getElementById('modal-title').textContent = 'Ajouter Véhicule';
  document.getElementById('mr').value = '';
  document.getElementById('marque').value = '';
  document.getElementById('modele').value = '';
  document.getElementById('annee').value = '';
  document.getElementById('cout').value = '';
  document.getElementById('statut').value = 'En stock';
  document.getElementById('modal').style.display = 'block';
  // Gestion de la soumission du formulaire
  const form = document.getElementById('modal-form');
  form.onsubmit = function(e) {
    e.preventDefault();
    const vehicule = {
      MR: document.getElementById('mr').value,
      Marque: document.getElementById('marque').value,
      "Modèle": document.getElementById('modele').value,
      Année: document.getElementById('annee').value,
      Coût: document.getElementById('cout').value,
      Statut: document.getElementById('statut').value
    };
    ajouterVehiculeFirebase(vehicule);
    closeModal();
  };
}

function refreshData() { window.location.reload(); }
function editVehicle(btn, id) {
  // Récupère les données du véhicule depuis Firestore
  db.collection('stock').doc(id).get().then(doc => {
    if (!doc.exists) return;
    const v = doc.data();
    document.getElementById('modal-title').textContent = 'Modifier Véhicule';
    document.getElementById('mr').value = v.MR || '';
    document.getElementById('marque').value = v.Marque || '';
    document.getElementById('modele').value = v["Modèle"] || '';
    document.getElementById('annee').value = v.Année || '';
    document.getElementById('cout').value = v.Coût || '';
    document.getElementById('statut').value = v.Statut || 'En stock';
    document.getElementById('modal').style.display = 'block';
    const form = document.getElementById('modal-form');
    form.onsubmit = function(e) {
      e.preventDefault();
      db.collection('stock').doc(id).set({
        MR: document.getElementById('mr').value,
        Marque: document.getElementById('marque').value,
        "Modèle": document.getElementById('modele').value,
        Année: document.getElementById('annee').value,
        Coût: document.getElementById('cout').value,
        Statut: document.getElementById('statut').value
      });
      closeModal();
    };
  });
}
function closeModal() { document.getElementById('modal').style.display = 'none'; }
function addInvoice() {
  document.getElementById('modal-title').textContent = 'Ajouter Facture';
  // Réutilisation du même formulaire, on adapte les champs pour la facture
  document.getElementById('mr').parentElement.style.display = 'none';
  document.getElementById('marque').parentElement.style.display = 'none';
  document.getElementById('modele').parentElement.style.display = 'none';
  document.getElementById('annee').parentElement.style.display = 'none';
  document.getElementById('cout').parentElement.style.display = 'block';
  document.getElementById('statut').parentElement.style.display = 'none';
  // Ajout de champs spécifiques facture si besoin (sinon on mappe sur les existants)
  document.getElementById('cout').previousElementSibling.textContent = 'Montant';
  document.getElementById('cout').value = '';
  document.getElementById('modal').style.display = 'block';
  const form = document.getElementById('modal-form');
  form.onsubmit = function(e) {
    e.preventDefault();
    const facture = {
      Type: 'Facture',
      Date: new Date().toLocaleDateString('fr-CA'),
      'No Facture': Date.now().toString(),
      Description: 'Ajout manuel',
      Montant: document.getElementById('cout').value
    };
    ajouterFactureFirebase(facture);
    closeModal();
    // Restaure le formulaire pour l'ajout véhicule
    document.getElementById('mr').parentElement.style.display = 'block';
    document.getElementById('marque').parentElement.style.display = 'block';
    document.getElementById('modele').parentElement.style.display = 'block';
    document.getElementById('annee').parentElement.style.display = 'block';
    document.getElementById('statut').parentElement.style.display = 'block';
    document.getElementById('cout').previousElementSibling.textContent = 'Coût ($)';
  };
}
function editInvoice(btn, id) {
  db.collection('factures').doc(id).get().then(doc => {
    if (!doc.exists) return;
    const f = doc.data();
    document.getElementById('modal-title').textContent = 'Modifier Facture';
    // Adapter le formulaire pour facture
    document.getElementById('mr').parentElement.style.display = 'none';
    document.getElementById('marque').parentElement.style.display = 'none';
    document.getElementById('modele').parentElement.style.display = 'none';
    document.getElementById('annee').parentElement.style.display = 'none';
    document.getElementById('statut').parentElement.style.display = 'none';
    document.getElementById('cout').parentElement.style.display = 'block';
    document.getElementById('cout').previousElementSibling.textContent = 'Montant';
    document.getElementById('cout').value = f.Montant || '';
    document.getElementById('modal').style.display = 'block';
    const form = document.getElementById('modal-form');
    form.onsubmit = function(e) {
      e.preventDefault();
      db.collection('factures').doc(id).set({
        Type: f.Type,
        Date: f.Date,
        'No Facture': f['No Facture'],
        Description: f.Description,
        Montant: document.getElementById('cout').value
      });
      closeModal();
      // Restaure le formulaire pour l'ajout véhicule
      document.getElementById('mr').parentElement.style.display = 'block';
      document.getElementById('marque').parentElement.style.display = 'block';
      document.getElementById('modele').parentElement.style.display = 'block';
      document.getElementById('annee').parentElement.style.display = 'block';
      document.getElementById('statut').parentElement.style.display = 'block';
      document.getElementById('cout').previousElementSibling.textContent = 'Coût ($)';
    };
  });
}

// Suppression véhicule
function deleteVehicle(id) {
  if (confirm('Supprimer ce véhicule ?')) {
    db.collection('stock').doc(id).delete();
  }
}

// Suppression facture
function deleteInvoice(id) {
  if (confirm('Supprimer cette facture ?')) {
    db.collection('factures').doc(id).delete();
  }
}
