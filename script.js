let movies;

document.addEventListener("DOMContentLoaded", function () {
    // Fonction pour créer un carrousel à partir de l'API
    function createCarousel(apiUrl, containerId, leftButtonId, rightButtonId) {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                movies = data.results;
                const container = document.getElementById(containerId);
                const leftButton = document.getElementById(leftButtonId);
                const rightButton = document.getElementById(rightButtonId);
                let currentImageIndex = 0;
                const visibleImagesCount = 4;

                container.style.width = (250 * movies.length) + "px";

                 // Créer dynamiquement les éléments du carrousel à partir des données de l'API
                movies.forEach((movie, index) => {
                    const movieContainer = document.createElement("div");
                    movieContainer.className = "movie-container";

                // Créer une image
                    const movieImage = document.createElement("img");
                    movieImage.src = movie.image_url;
                    movieImage.className = "photo";

                    // Ajouter un gestionnaire d'événements pour ouvrir la fenêtre modale
                    movieImage.addEventListener("click", function () {
                        openModal(movie);
                    });

                    // Créer le titre du film
                    const movieTitle = document.createElement("div");
                    movieTitle.className = "title";
                    movieTitle.textContent = movie.title;

                    // Ajouter l'image et le titre au conteneur du film
                    movieContainer.appendChild(movieImage);
                    movieContainer.appendChild(movieTitle);

                    // Ajouter le conteneur du film au carrousel
                    container.appendChild(movieContainer);
                });

                // Défilement carrousel vers la gauche
                leftButton.onclick = function () {
                    if (currentImageIndex > 0) {
                        currentImageIndex--;
                        container.style.transform = `translate(-${currentImageIndex * 250}px)`;
                        container.style.transition = "all 0.5s ease";
                    }
                };

                // Défilement carrousel vers la droite
                rightButton.onclick = function () {
                    if (currentImageIndex < movies.length - visibleImagesCount) {
                        currentImageIndex++;
                        container.style.transform = `translate(-${currentImageIndex * 250}px)`;
                        container.style.transition = "all 0.5s ease";
                    }
                };

            })
            .catch(error => console.error("Une erreur s'est produite lors de la récupération des données de l'API.", error));
    }

    // Appel fonction pour chaque URLs
    createCarousel("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7", "container", "l", "r");
    createCarousel("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7&genre=comedy", "container2", "l2", "r2");
    createCarousel("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7&genre=horror", "container3", "l3", "r3");
    createCarousel("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7&genre=family", "container4", "l4", "r4");

    // Fonction pour récupérer les données du meilleur film
    function getBestMovie() {
        $.ajax({
            url: "http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&limit=1",
            method: "GET",
            dataType: "json",
            success: function(data) {
                var bestMovie = data.results[0]; // Récupérer le meilleur film

                if (bestMovie) {
                    var bestMovieTitle = bestMovie.title; // Récupérer le titre du meilleur film
                    var bestMovieImage = bestMovie.image_url; // Récupérer l'URL de l'image (poster)
                    var apiUrl = bestMovie.url; // Récupérer l'URL spécifique du film

                    // Mettre à jour les éléments HTML avec les données du meilleur film
                    $("#best-movie-title").text(bestMovieTitle);
                    $("#best-movie-poster").attr("src", bestMovieImage);

                    // Appeler la fonction pour obtenir la longue description du meilleur film en utilisant l'URL spécifique
                    getLongDescription(apiUrl);
                } else {
                    console.log("Aucun film trouvé.");
                }
            },
            error: function(error) {
                console.error("Erreur lors de la récupération des données de l'API.", error);
            }
        });
    }

    // Fonction pour récupérer la longue description du film
    function getLongDescription(apiUrl) {
        $.ajax({
            url: apiUrl,
            method: "GET",
            dataType: "json",
            success: function(data) {
                var longDescription = data.long_description; // Récupérer la longue description du film

                if (longDescription) {
                    // Mettre à jour la balise "best-movie-summary" avec la longue description
                    $("#best-movie-summary").text(longDescription);
                } else {
                    console.log("Aucune description trouvée.");
                }
            },
            error: function(error) {
                console.error("Erreur lors de la récupération de la longue description du film.", error);
            }
        });
    }

    // Appeler la fonction pour obtenir les données du meilleur film
    getBestMovie();

    // Fonction qui ouvre la fenetre modale avec les informations des films
    function openModal(movie) {
        const modal = document.getElementById("movie-modal");
        const modalTitle = document.getElementById("modal-title");
        const modalYear = document.getElementById("modal-year");
        const modalScore = document.getElementById("modal-score");
        const modalDirectors = document.getElementById("modal-directors");
        const modalActors = document.getElementById("modal-actors");
        const modalWriters = document.getElementById("modal-writers");
        const modalGenres = document.getElementById("modal-genres");
        const modalSummary = document.getElementById("modal-summary");

        // Effectuez une requête AJAX vers l'URL du film
        fetch(movie.url)
            .then(response => response.json())
            .then(data => {
                // Mettez à jour les éléments de la fenêtre modale avec les informations du film
                modalTitle.textContent = data.title;
                modalYear.textContent = `Année de sortie : ${data.year}`;
                modalScore.textContent = `Score IMDb : ${data.imdb_score}`;
                modalDirectors.textContent = `Réalisateur(s) : ${data.directors.join(", ")}`;
                modalActors.textContent = `Acteur(s) : ${data.actors.join(", ")}`;
                modalWriters.textContent = `Scénariste(s) : ${data.writers.join(", ")}`;
                modalGenres.textContent = `Genres : ${data.genres.join(", ")}`;
                modalSummary.textContent = `Résumé : ${data.long_description}`; // Mettez à jour le résumé du film

                modal.style.display = "block";
            })
            .catch(error => console.error("Une erreur s'est produite lors de la récupération des informations détaillées du film.", error));
    }

    // Fonction qui ferme la fenetre modale
    function closeModal() {
        const modal = document.getElementById("movie-modal");
        modal.style.display = "none";
    }

    const closeBtn = document.getElementById("close-modal");
        closeBtn.addEventListener("click", closeModal);

});
