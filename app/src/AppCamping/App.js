// Import de la feuille de style
import '../assets/css/style.css';

const DATA_URL = 'http://localhost/reservation/api/js';

class App {

// Liste des réservations d'entrée
listeEntrees = [];

// Liste des réservations de sortie
listeSorties = [];

// Message à afficher pour l'information du statut de la requête
message = '';


/**
 * Démarreur de l'application
 */
start() {
    console.log( 'Application démarrée ...' );

    // On initialise les listes
    this.initListe();      
    
    console.log("Données récupérées, affichage de l'interface...");
}

/**
 * Initialisation des listes
 * Récupération des données depuis l'API
*/
async initListe() {
    try {
        // Récupération des données depuis l'API
        const response = await fetch(DATA_URL);

        // Vérification de si la requête a réussi
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }

        // Récupération des données
        const data = await response.json();

        // Stockage des données dans les listes
        this.listeEntrees = data.reservationsStart;
        this.listeSorties = data.reservationsEnd;

        // Récupération du message si la clé existe
        if (data.message) {
            this.message.textContent = data.message;
        }

        // Une fois les données récupérées, mise à jour l'UI
        this.renderUI();
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

/**
 * Méthode pour mettre à jour l'état de propreté d'une réservation
 * @param {int} id 
 * @param {boolean} updateData
 */
async patchReservation(id, updateData) {
    console.log("Mise à jour partielle de la réservation :", id, updateData);
    try {

        // Envoi des données à l'API via une requête PATCH
        const response = await fetch(`${DATA_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });

        // Vérification de si la requête a réussi
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }

        // Rcupération des données
        const result = await response.json();
        console.log("Réservation mise à jour partiellement :", result);
        
        this.message = result.message;

        // Effacement du body pour le recharger
        document.body.innerHTML = '';

        // Rafraîchissement de la liste après modification
        await this.initListe();

        // Rechargement de l'interface après 5 secondes pour effacer le message
        setTimeout(() => {
            document.body.innerHTML = '';
            this.message = '';
            this.initListe();
        }, 5000);
    } catch (error) {
        console.error("Erreur lors de la mise à jour partielle :", error);
    }
}

/**
 * Gestionnaire de l'événement 'Check'
 * @param {Event} event 
 */
handlerCheck( event ) {
    console.log( 'Check' );

    // Récupération de l'id de la location
    const id = event.target.dataset.id;

    // Mise à jour de l'état de propreté de la location
    app.patchReservation(id, { isClean: 1 });
}

renderTable(elMain, id, datas) {
        // Création du tableau
        const elTable = document.createElement( 'table' );
        elTable.classList.add( 'table' );
        elTable.classList.add( 'table-bordered' );

        // En-tête du tableau
        const elThead = document.createElement( 'thead' );
        elThead.innerHTML = `
            <tr>
                <th>Date d'entrée</th>
                <th>Date de sortie</th>
                <th>Client</th>
                <th>Emplacement</th>
                <th>Propreté</th>
                <th>Actions</th>
            </tr>
        `;

        // Création du corps du tableau
        const elTbody = document.createElement( 'tbody' );
        elTbody.id = id;

        // Ajout des lignes du tableau
        datas.forEach( data => {
            const elTr = document.createElement( 'tr' );

            let proprete = data.isClean == 1 ? 'Propre' : 'Sale';

            // Formatage des dates
            let dateStart = data.dateStart.date.split('.')[0];
            let dateEnd = data.dateEnd.date.split('.')[0];

            // Remplissage des cellules du tableau
            elTr.innerHTML = `
                <td>${dateStart}</td>
                <td>${dateEnd}</td>
                <td>${data.firstname} <br> ${data.lastname}</td>
                <td>n°${data.location}</td>
                <td>${proprete}</td>
            `;

            // Si la location n'est pas propre, ajout d'un bouton pour le check
            if(data.isClean == 0) {
            const elTd = document.createElement( 'td' );

            const elBtnCheckIn = document.createElement( 'button' );
            elBtnCheckIn.classList.add( 'btn' );
            elBtnCheckIn.classList.add( 'btn-primary' );
            elBtnCheckIn.textContent = 'Check';

            const idIn = data.roomId;
            elBtnCheckIn.dataset.id = idIn;

            // Ajout d'un écouteur d'événement sur le bouton
            elBtnCheckIn.addEventListener( 'click', this.handlerCheck.bind( this) );

            elTd.append( elBtnCheckIn );
            elTr.append( elTd );
        }

        elTbody.append( elTr );
    } );

    elTable.append( elThead, elTbody );
    elMain.append( elTable );
}

/**
 * Rendu de l'interface utilisateur
 */
renderUI() {
    /*
    Template:
        <p>Message</p>

        <header>
            <h1>Camping</h1>
        </header>

        <main>
            <h2>Tableau des entrées</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date d'entrée</th>
                        <th>Date de sortie</th>
                        <th>Client</th>
                        <th>Emplacement</th>
                        <th>Propreté</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="liste-entrees">
                    <!-- Lignes du tableau -->
                </tbody>
            </table>

            <h2>Tableau des sorties</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date d'entrée</th>
                        <th>Date de sortie</th>
                        <th>Client</th>
                        <th>Emplacement</th>
                        <th>Propreté</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="liste-sorties">
                    <!-- Lignes du tableau -->
                </tbody>
            </table>

        </main>
    */

    // Création du header
    const elHeader = document.createElement( 'header' );
    elHeader.classList.add( 'text-center' );
    elHeader.classList.add( 'mb-4' );
    elHeader.classList.add( 'mt-4' );
    elHeader.classList.add( 'border-bottom' );
    elHeader.classList.add( 'border-3' );

    // Création du titre
    const elTitle = document.createElement( 'h1' );
    elTitle.textContent = 'Camping';

    // Ajout du titre dans le header
    elHeader.append( elTitle );

    // Si un message est présent, il est affiché
    if (this.message.length > 0) {
        const elMessage = document.createElement( 'p' );
        elMessage.classList.add( 'alert' );
        elMessage.classList.add( 'alert-info' );
        elMessage.textContent = this.message;
        document.body.append( elMessage );
    }

    // Création du main
    const elMain = document.createElement( 'main' );

    // Création du tableau des entrées
    // Titre
    const elTitleEntrees = document.createElement( 'h2' );
    elTitleEntrees.classList.add( 'mt-4' );
    elTitleEntrees.classList.add( 'mb-4' );
    elTitleEntrees.classList.add( 'text-center' );
    elTitleEntrees.textContent = 'Tableau des entrées';

    elMain.append( elTitleEntrees );

    // Tableau des entrées
    this.renderTable(elMain, 'liste-entrees', this.listeEntrees);

    // Création du tableau des sorties
    // Titre
    const elTitleSorties = document.createElement( 'h2' );
    elTitleSorties.classList.add( 'mt-4' );
    elTitleSorties.classList.add( 'mb-4' );
    elTitleSorties.classList.add( 'text-center' );
    elTitleSorties.textContent = 'Tableau des sorties';

    elMain.append( elTitleSorties );

    // Tableau des sorties
    this.renderTable(elMain, 'liste-sorties', this.listeSorties);

    document.body.append( elHeader, elMain );
}
}

const app = new App();

export default app;