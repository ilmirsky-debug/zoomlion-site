function openModal(img) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const caption = document.getElementById("caption");
    modal.style.display = "block";
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    caption.textContent = img.alt;
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
}

window.addEventListener('click', (event) => {
    const modal = document.getElementById("imageModal");
    if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") closeModal();
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 60,
                behavior: 'smooth'
            });
        }
    });
});