// Import de la feuille de style
import '../assets/css/style.css';

const DATA_URL = 'http://localhost/reservation/api/js';

class App {

    // Liste des réservations d'entrée
    listeEntrees = [];

    // Liste des réservations de sortie
    listeSorties = [];

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
            // On fait le rendu
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

        elTableSorties.append( elTheadSorties, elTbodySorties );
        elMain.append( elTableSorties );

        document.body.append( elHeader, elMain );
    }
}

const app = new App();

export default app;