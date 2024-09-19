// Fonction pour étendre ou réduire un projet
function expandProject(projectElement) {
    console.log("Project clicked:", projectElement);
    
    // Trouver tous les projets
    const projects = document.querySelectorAll('.project');
    
    // Fermer tous les autres projets sauf celui cliqué
    projects.forEach(proj => {
        if (proj !== projectElement) {
            proj.classList.remove('active');
        }
    });

    // Activer ou désactiver la classe 'active' sur le projet cliqué
    projectElement.classList.toggle('active');
    console.log("Toggled active class on clicked project.");
}

// Ajouter un gestionnaire d'événement pour les clics en dehors des projets
document.addEventListener('click', function(event) {
    if (!event.target.closest('.project')) {
        const activeProjects = document.querySelectorAll('.project.active');
        activeProjects.forEach(proj => {
            proj.classList.remove('active');
            console.log("Removed active class from project:", proj);
        });
    }
});

// Ajout d'un écouteur pour confirmer l'ajout des événements de clic
document.querySelectorAll('.project').forEach(proj => {
    console.log("Adding click event to project:", proj);
});
