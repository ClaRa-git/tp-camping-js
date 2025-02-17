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

        this.initListe();      
        
        console.log("Données récupérées, affichage de l'interface...");
    }

    /**
     * Initialisation des listes
     * Récupération des données depuis l'API
    */
    async initListe() {
        try {
            // On récupère les données depuis l'API
            const response = await fetch(DATA_URL);
    
            // On vérifie si la requête a réussi
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }

            // On récupère les données
            const data = await response.json();

            // On stocke les données dans les listes
            this.listeEntrees = data.reservationsStart;
            this.listeSorties = data.reservationsEnd;

            // On récupère le message si la clé existe
            if (data.message) {
                this.message.textContent = data.message;
            }
    
            // Une fois les données récupérées, on met à jour l'UI
            this.renderUI();
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    }

    /**
     * Rendu de l'interface utilisateur
     */
    renderUI() {
        /*
        Template:

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

        const elHeader = document.createElement( 'header' );
        elHeader.classList.add( 'text-center' );
        elHeader.classList.add( 'mb-4' );
        elHeader.classList.add( 'mt-4' );
        elHeader.classList.add( 'border-bottom' );
        elHeader.classList.add( 'border-3' );

        const elTitle = document.createElement( 'h1' );
        elTitle.textContent = 'Camping';

        elHeader.append( elTitle );

        // Si un message est présent, on l'affiche
        if (this.message.length > 0) {
            const elMessage = document.createElement( 'p' );
            elMessage.classList.add( 'alert' );
            elMessage.classList.add( 'alert-info' );
            elMessage.textContent = this.message;
            document.body.append( elMessage );
        }

        const elMain = document.createElement( 'main' );

        const elTitleEntrees = document.createElement( 'h2' );
        elTitleEntrees.classList.add( 'mt-4' );
        elTitleEntrees.classList.add( 'mb-4' );
        elTitleEntrees.classList.add( 'text-center' );
        elTitleEntrees.textContent = 'Tableau des entrées';

        elMain.append( elTitleEntrees );

        const elTableEntrees = document.createElement( 'table' );
        elTableEntrees.classList.add( 'table' );
        elTableEntrees.classList.add( 'table-bordered' );

        const elTheadEntrees = document.createElement( 'thead' );

        elTheadEntrees.innerHTML = `
            <tr>
                <th>Date d'entrée</th>
                <th>Date de sortie</th>
                <th>Client</th>
                <th>Emplacement</th>
                <th>Propreté</th>
                <th>Actions</th>
            </tr>
        `;

        const elTbodyEntrees = document.createElement( 'tbody' );
        elTbodyEntrees.id = 'liste-entrees';

        // On ajoute les lignes du tableau
        this.listeEntrees.forEach( entree => {
            const elTr = document.createElement( 'tr' );

            let proprete = entree.isClean == 1 ? 'propre' : 'sale';
            let dateStart = entree.dateStart.date.split('.')[0];
            let dateEnd = entree.dateEnd.date.split('.')[0];

            elTr.innerHTML = `
                <td>${dateStart}</td>
                <td>${dateEnd}</td>
                <td>${entree.firstname} <br> ${entree.lastname}</td>
                <td>n°${entree.location}</td>
                <td>${proprete}</td>
            `;

            if(entree.isClean == 0) {
                elTr.innerHTML += `
                    <td>
                        <button id="check-button-in" class="btn btn-primary">Check</button>
                    </td>
                `;

                const elBtnCheckIn = elTr.querySelector( '#check-button-in' );
                const idIn = entree.roomId;
                elBtnCheckIn.dataset.id = idIn;
                elBtnCheckIn.addEventListener( 'click', this.handlerCheck.bind( this) );
            }

            elTbodyEntrees.append( elTr );
        } );

        elTableEntrees.append( elTheadEntrees, elTbodyEntrees );
        elMain.append( elTableEntrees );


        const elTitleSorties = document.createElement( 'h2' );
        elTitleSorties.classList.add( 'mt-4' );
        elTitleSorties.classList.add( 'mb-4' );
        elTitleSorties.classList.add( 'text-center' );
        elTitleSorties.textContent = 'Tableau des sorties';

        elMain.append( elTitleSorties );

        const elTableSorties = document.createElement( 'table' );
        elTableSorties.classList.add( 'table' );
        elTableSorties.classList.add( 'table-bordered' );

        const elTheadSorties = document.createElement( 'thead' );

        elTheadSorties.innerHTML = `
            <tr>
                <th>Date d'entrée</th>
                <th>Date de sortie</th>
                <th>Client</th>
                <th>Emplacement</th>
                <th>Propreté</th>
                <th>Actions</th>
            </tr>
        `;

        const elTbodySorties = document.createElement( 'tbody' );
        elTbodySorties.id = 'liste-sorties';

        // On ajoute les lignes du tableau
        this.listeSorties.forEach( sortie => {
            const elTr = document.createElement( 'tr' );

            let proprete = sortie.isClean == 1 ? 'propre' : 'sale';
            let dateStart = sortie.dateStart.date.split('.')[0];
            let dateEnd = sortie.dateEnd.date.split('.')[0];

            elTr.innerHTML = `
                <td>${dateStart}</td>
                <td>${dateEnd}</td>
                <td>${sortie.firstname} <br> ${sortie.lastname}</td>
                <td>n°${sortie.location}</td>
                <td>${proprete}</td>
            `;
            
            if(sortie.isClean == 0) {
                elTr.innerHTML += `
                    <td>
                        <button id="check-button-out" class="btn btn-primary">Check</button>
                    </td>
                `;

                const elBtnCheckOut = elTr.querySelector( '#check-button-out' );
                const idOut = sortie.roomId;
                elBtnCheckOut.dataset.id = idOut;
                elBtnCheckOut.addEventListener( 'click', this.handlerCheck.bind( this) );
            }

            elTbodySorties.append( elTr );
        } );

        elTableSorties.append( elTheadSorties, elTbodySorties );
        elMain.append( elTableSorties );

        document.body.append( elHeader, elMain );
    }

    /**
     * Gestionnaire de l'événement 'Check'
     * @param {Event} event 
     */
    handlerCheck( event ) {
        console.log( 'Check' );
    }
}

const app = new App();

export default app;