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
     * Méthode pour mettre à jour l'état de propreté d'une réservation
     * @param {int} id 
     * @param {boolean} updateData
     */
    async patchReservation(id, updateData) {
        console.log("Mise à jour partielle de la réservation :", id, updateData);
        try {

            // On envoie les données à l'API via une requête PATCH
            const response = await fetch(`${DATA_URL}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });
    
            // On vérifie si la requête a réussi
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
    
            // On récupère les données
            const result = await response.json();
            console.log("Réservation mise à jour partiellement :", result);
            
            this.message = result.message;

            // On efface le body pour le recharger
            document.body.innerHTML = '';
    
            // Rafraîchir la liste après modification
            await this.initListe();

            // On recharge l'interface après 5 secondes pour effacer le message
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

        // Si un message est présent, on l'affiche
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

        // Tableau
        const elTableEntrees = document.createElement( 'table' );
        elTableEntrees.classList.add( 'table' );
        elTableEntrees.classList.add( 'table-bordered' );

        const elTheadEntrees = document.createElement( 'thead' );

        // En-tête du tableau
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

            // On remplit les cellules du tableau
            elTr.innerHTML = `
                <td>${dateStart}</td>
                <td>${dateEnd}</td>
                <td>${entree.firstname} <br> ${entree.lastname}</td>
                <td>n°${entree.location}</td>
                <td>${proprete}</td>
            `;

            // Si la location n'est pas propre, on ajoute un bouton pour le check
            if(entree.isClean == 0) {
                elTr.innerHTML += `
                    <td>
                        <button id="check-button-in" class="btn btn-primary">Check</button>
                    </td>
                `;

                const elBtnCheckIn = elTr.querySelector( '#check-button-in' );
                const idIn = entree.roomId;
                elBtnCheckIn.dataset.id = idIn;
                // On ajoute un écouteur d'événement sur le bouton
                elBtnCheckIn.addEventListener( 'click', this.handlerCheck.bind( this) );
            }

            elTbodyEntrees.append( elTr );
        } );

        elTableEntrees.append( elTheadEntrees, elTbodyEntrees );
        elMain.append( elTableEntrees );

        // Création du tableau des sorties
        // Titre
        const elTitleSorties = document.createElement( 'h2' );
        elTitleSorties.classList.add( 'mt-4' );
        elTitleSorties.classList.add( 'mb-4' );
        elTitleSorties.classList.add( 'text-center' );
        elTitleSorties.textContent = 'Tableau des sorties';

        elMain.append( elTitleSorties );

        // Tableau
        const elTableSorties = document.createElement( 'table' );
        elTableSorties.classList.add( 'table' );
        elTableSorties.classList.add( 'table-bordered' );

        const elTheadSorties = document.createElement( 'thead' );

        // En-tête du tableau
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

            // On remplit les cellules du tableau
            elTr.innerHTML = `
                <td>${dateStart}</td>
                <td>${dateEnd}</td>
                <td>${sortie.firstname} <br> ${sortie.lastname}</td>
                <td>n°${sortie.location}</td>
                <td>${proprete}</td>
            `;
            
            // Si la location n'est pas propre, on ajoute un bouton pour le check
            if(sortie.isClean == 0) {
                elTr.innerHTML += `
                    <td>
                        <button id="check-button-out" class="btn btn-primary">Check</button>
                    </td>
                `;

                const elBtnCheckOut = elTr.querySelector( '#check-button-out' );
                const idOut = sortie.roomId;
                elBtnCheckOut.dataset.id = idOut;
                // On ajoute un écouteur d'événement sur le bouton
                elBtnCheckOut.addEventListener( 'click', this.handlerCheck.bind( this) );
            }

            elTbodySorties.append( elTr );
        } );

        // On ajoute les éléments au DOM

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

        // On récupère l'id de la location
        const id = event.target.dataset.id;

        // On met à jour l'état de propreté de la location
        app.patchReservation(id, { isClean: 1 });
    }
}

const app = new App();

export default app;