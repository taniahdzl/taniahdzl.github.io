// script.js
gsap.registerPlugin(ScrollTrigger);

// Efecto Parallax en el scroll
gsap.to("#collage-wrapper", {
  scrollTrigger: {
    trigger: "#collage-hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true, // "Congela" la sección mientras se hace el scroll interno
    anticipatePin: 1
  }
});

// Anima cada elemento de forma individual
document.querySelectorAll(".collage-item").forEach(item => {
  const speed = item.getAttribute('data-speed');
  gsap.to(item, {
    y: (200 * speed), // Mueve cada elemento a diferente velocidad vertical
    x: (50 * speed),  // Mueve cada elemento a diferente velocidad horizontal
    rotation: "+=20",   // Les da una rotación extra suave
    ease: "none",
    scrollTrigger: {
      trigger: "#collage-hero",
      start: "top top",
      end: "bottom top",
      scrub: 1 // Suaviza el movimiento
    }
  });
});

// Animación de bucle para objetos específicos (ej: el vinilo girando)
gsap.to(".vinyl-record", {
  rotation: 360,
  duration: 10,
  ease: "none",
  repeat: -1
});