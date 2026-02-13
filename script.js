const wallpaperGrid = document.getElementById('wallpaper-grid');
const loadMoreBtn = document.getElementById('load-more-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const modal = document.getElementById('wallpaper-modal');
const closeModal = document.querySelector('.close-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const downloadBtn = document.getElementById('download-btn');

// Mock Data
const categories = ['nature', 'technology', 'abstract', 'minimalist', 'dark', 'space'];
let currentPage = 1;
let currentCategory = 'all';

// Generate mock wallpapers
const generateWallpapers = (count, page) => {
    const newWallpapers = [];
    for (let i = 0; i < count; i++) {
        const id = (page - 1) * count + i;
        const category = categories[Math.floor(Math.random() * categories.length)];
        // Using Picsum for reliable placeholder images, replacing with specific Unsplash IDs would be better for production
        const width = 600;
        const height = 900;
        newWallpapers.push({
            id: id,
            url: `https://picsum.photos/${width}/${height}?random=${id}`,
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Wallpaper ${id + 1}`,
            category: category,
            author: 'Photographer Name'
        });
    }
    return newWallpapers;
};

// Initial Load
let wallpapers = generateWallpapers(12, 1);

// Render Wallpapers
const renderWallpapers = (items) => {
    // If clearing needed, use wallpaperGrid.innerHTML = '';
    
    items.forEach(wallpaper => {
        const card = document.createElement('div');
        card.classList.add('wallpaper-card');
        card.setAttribute('data-category', wallpaper.category);
        
        card.innerHTML = `
            <img src="${wallpaper.url}" alt="${wallpaper.title}" loading="lazy">
            <div class="card-overlay">
                <div class="card-info">
                    <h4 style="color:white; margin-bottom:0.25rem;">${wallpaper.title}</h4>
                    <span style="color:#ccc; font-size:0.8rem;">${wallpaper.category}</span>
                </div>
                <div class="card-actions">
                    <button onclick="event.stopPropagation(); downloadWallpaper('${wallpaper.url}')"><i class="fa-solid fa-download"></i></button>
                    <button><i class="fa-regular fa-heart"></i></button>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => openModal(wallpaper));
        wallpaperGrid.appendChild(card);
    });
};

/* Filter Functionality */
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        currentCategory = filter;
        
        wallpaperGrid.innerHTML = ''; // Clear grid
        
        if (filter === 'all') {
            renderWallpapers(wallpapers);
        } else {
            const filtered = wallpapers.filter(w => w.category === filter);
            renderWallpapers(filtered);
        }
    });
});

/* Search Functionality */
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = wallpapers.filter(w => w.title.toLowerCase().includes(query) || w.category.toLowerCase().includes(query));
    wallpaperGrid.innerHTML = '';
    renderWallpapers(filtered);
});

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

/* Modal Functionality */
const openModal = (wallpaper) => {
    modal.style.display = 'flex';
    modalImage.src = wallpaper.url;
    modalTitle.textContent = wallpaper.title;
    downloadBtn.href = wallpaper.url;
    document.body.style.overflow = 'hidden'; // Prevent scrolling bg
};

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; 
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

/* Load More */
loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    const newItems = generateWallpapers(8, currentPage);
    wallpapers = [...wallpapers, ...newItems]; // Add to main list
    
    // Filter if needed
    if (currentCategory !== 'all') {
        const filteredNew = newItems.filter(w => w.category === currentCategory);
        renderWallpapers(filteredNew);
    } else {
        renderWallpapers(newItems);
    }
});

/* Download Helper */
function downloadWallpaper(url) {
    // In a real app, this might fetch the blob and download
    // For now, it opens in a new tab or triggers the link download
    window.open(url, '_blank');
}

// Initial Render
renderWallpapers(wallpapers);

// Mobile Nav Toggle (Optional for future)
// ...
