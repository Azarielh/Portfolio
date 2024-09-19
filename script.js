// ________________________Set Variables_________________________
let hexa_pos_x;
let hexa_pos_y;
let speed_x; // horizontal speed
let speed_y; // vertical speed
let colorOffset = 0; // Manage color_switch for hexagone
let particles = []; // memorize particles

function setup() {
    let canvas = createCanvas(windowWidth, getHeaderHeight());
    canvas.position(0, 0);
    canvas.style('z-index', '2'); //Place the animation behind the header content
    canvas.style('position', 'absolute');

    hexa_pos_x = width / 2;
    hexa_pos_y = height / 2;

    speed_x = 1; // horizontal speed
    speed_y = 1; // vertical speed
}

function draw() {
    clear();

    // Calculer la couleur dynamique
    let r = (sin(colorOffset) * 127 + 128);
    let g = (cos(colorOffset) * 127 + 128);
    let b = (sin(colorOffset) * cos(colorOffset) * 127 + 128);
    colorOffset += 0.09; // Modifie cette valeur pour ajuster la vitesse du changement de couleur

    // Add Particles
    add_particles(hexa_pos_x, hexa_pos_y, 20, r, g, b);

    // Update Particles
    update_particles();

    // Dessiner l'hexagone
    draw_hexa(hexa_pos_x, hexa_pos_y, 20, r, g, b); // Taille de l'hexagone (rayon)

    // Mettre à jour la position de l'hexagone
    hexa_pos_x += speed_x;
    hexa_pos_y += speed_y;

    // Vérifier les collisions avec les bords et inverser la vélocité (rebond)
    if (hexa_pos_x + 20 > width || hexa_pos_x - 20 < 0) {
        speed_x *= -1;
    }
    if (hexa_pos_y + 20 > height || hexa_pos_y - 20 < 0) {
        speed_y *= -1;
    }
}

function draw_hexa(x, y, radius, r, g, b) {
    const angle = TWO_PI / 6; // 360° divisé par 6 pour un hexagone
    
    noFill();
    strokeWeight(3.5);
    stroke(r, g, b, 100);

    beginShape();
    for (let i = 0; i < 6; i++) {
        let xOffset = radius * cos(angle * i);
        let yOffset = radius * sin(angle * i);
        vertex(x + xOffset, y + yOffset);
    }
    endShape(CLOSE);
}

function add_particles(x, y, radius, r, g, b) {
    // Calculer la direction en fonction de la vélocité
    let direction = atan2(speed_y, speed_x); // Angle de la direction du mouvement
    const angle = TWO_PI / 6; // 360° divisé par 6 pour un hexagone

    // Trouver le point du bord de l'hexagone à l'opposé de la direction du mouvement
    let oppositeIndex = getOppositeVertexIndex(direction); // Index du sommet opposé

    // Générer les particules le long des segments arrière
    for (let i = 0; i < 8; i++) {
        // Sélectionner un point aléatoire le long des deux segments partant de l'angle opposé
        let t = random(0, 1); // Valeur entre 0 et 1 pour interpoler le long du segment

        // Points des deux sommets adjacents à l'angle opposé
        let x1 = radius * cos(angle * oppositeIndex);
        let y1 = radius * sin(angle * oppositeIndex);
        let x2 = radius * cos(angle * ((oppositeIndex + 1) % 6)); // Segment du prochain sommet
        let y2 = radius * sin(angle * ((oppositeIndex + 1) % 6));

        // Interpolation le long du segment
        let xOffset = lerp(x1, x2, t);
        let yOffset = lerp(y1, y2, t);

        particles.push({
            x: x + xOffset,
            y: y + yOffset,
            r: r,
            g: g,
            b: b,
            life: 200, // Particles lifespawn
            size: random(2, 4) // Particles size
        });
    }
}

function getOppositeVertexIndex(direction) {
    // Calcule l'index du sommet opposé à la direction
    let segmentAngle = TWO_PI / 6;
    let adjustedDirection = (direction + PI) % TWO_PI; // Trouver l'angle opposé
    return floor(adjustedDirection / segmentAngle); // Trouver le sommet correspondant
}

function update_particles() {
    noStroke(); // No border
    particles.forEach((particle, index) => {
        fill(particle.r, particle.g, particle.b, particle.life);
        ellipse(particle.x, particle.y, particle.size);

        // Move particles
        particle.x += random(-2, 2);
        particle.y += random(-2, 2);

        // diminish particles life
        particle.life -= 5;

        // Clear Dead particle
        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });
}

function windowResized() {
    resizeCanvas(windowWidth, getHeaderHeight()); // Redimensionne le canvas si la fenêtre change de taille
}

function getHeaderHeight() {
    // Obtient la hauteur du header
    let header = document.querySelector('header');
    return header ? header.offsetHeight : 200; // Valeur par défaut si le header n'est pas trouvé
}

document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
})

document.querySelectorAll('.project').forEach(function(project) {
    let img = project.querySelector('.project-image');
    let comingSoon = project.querySelector('.coming-soon');
    
    img.addEventListener('error', function() {
        // Si l'image ne se charge pas, on affiche le texte "À venir"
        img.style.display = 'none';
        comingSoon.style.display = 'block';
    });

    // Si l'image se charge correctement, on cache le texte
    img.addEventListener('load', function() {
        img.style.display = 'block';
        comingSoon.style.display = 'none';
    });

    // Si l'image est manquante, déclencher l'événement 'error'
    if (!img.complete || img.naturalWidth === 0) {
        img.dispatchEvent(new Event('error'));
    }
});

