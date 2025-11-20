document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryGrid = document.querySelector('.gallery-grid');
  const paginationContainer = document.querySelector('.pagination-container');
  
  let currentFilter = 'all';
  let currentPage = 1;
  const itemsPerPage = 24;
  let allItems = [];
  let filteredItems = [];
  
  // Initialize gallery items data
  function initGalleryData() {
    const items = document.querySelectorAll('.gallery-item');
    allItems = Array.from(items).map((item, index) => ({
      element: item,
      category: item.getAttribute('data-category'),
      imageSrc: item.querySelector('img').src,
      imageAlt: item.querySelector('img').alt,
      index: index
    }));
    filteredItems = [...allItems];
  }
  
  // Filter gallery items
  function filterGallery(filterValue) {
    currentFilter = filterValue;
    currentPage = 1;
    
    if (filterValue === 'all') {
      filteredItems = [...allItems];
    } else {
      filteredItems = allItems.filter(item => item.category === filterValue);
    }
    
    renderGallery();
    renderPagination();
  }
  
  // Render gallery for current page
  function renderGallery() {
    galleryGrid.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = filteredItems.slice(startIndex, endIndex);
    
    itemsToShow.forEach((item, index) => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      galleryItem.setAttribute('data-category', item.category);
      galleryItem.setAttribute('data-index', startIndex + index);
      
      galleryItem.innerHTML = `
        <img src="${item.imageSrc}" alt="${item.imageAlt}" class="img-fluid" />
        <div class="gallery-overlay">
          <div class="overlay-content">
            <button class="view-btn" data-index="${startIndex + index}">
              <i class="fas fa-expand"></i>
            </button>
          </div>
        </div>
      `;
      
      galleryGrid.appendChild(galleryItem);
    });
    
    // Attach click events to view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const index = parseInt(this.getAttribute('data-index'));
        openLightbox(index);
      });
    });
  }
  
  // Render pagination
  function renderPagination() {
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    
    if (totalPages <= 1) {
      paginationContainer.style.display = 'none';
      return;
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn' + (currentPage === 1 ? ' disabled' : '');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderGallery();
        renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    paginationContainer.appendChild(prevBtn);
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      const firstBtn = createPageButton(1);
      paginationContainer.appendChild(firstBtn);
      if (startPage > 2) {
        const dots = document.createElement('span');
        dots.className = 'pagination-dots';
        dots.textContent = '...';
        paginationContainer.appendChild(dots);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = createPageButton(i);
      paginationContainer.appendChild(pageBtn);
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const dots = document.createElement('span');
        dots.className = 'pagination-dots';
        dots.textContent = '...';
        paginationContainer.appendChild(dots);
      }
      const lastBtn = createPageButton(totalPages);
      paginationContainer.appendChild(lastBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn' + (currentPage === totalPages ? ' disabled' : '');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderGallery();
        renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    paginationContainer.appendChild(nextBtn);
    
    // Results info
    const resultsInfo = document.createElement('div');
    resultsInfo.className = 'results-info';
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredItems.length);
    resultsInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredItems.length} images`;
    paginationContainer.appendChild(resultsInfo);
  }
  
  function createPageButton(pageNum) {
    const btn = document.createElement('button');
    btn.className = 'pagination-btn page-number' + (pageNum === currentPage ? ' active' : '');
    btn.textContent = pageNum;
    btn.addEventListener('click', () => {
      currentPage = pageNum;
      renderGallery();
      renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return btn;
  }
  
  // Lightbox functionality
  let lightboxOpen = false;
  let currentLightboxIndex = 0;
  
  function openLightbox(index) {
    currentLightboxIndex = index;
    lightboxOpen = true;
    
    // Create lightbox if it doesn't exist
    let lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'gallery-lightbox';
      lightbox.className = 'gallery-lightbox';
      lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
        <button class="lightbox-prev" aria-label="Previous">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="lightbox-next" aria-label="Next">
          <i class="fas fa-chevron-right"></i>
        </button>
        <div class="lightbox-content">
          <img src="" alt="" class="lightbox-image" />
          <div class="lightbox-caption"></div>
          <div class="lightbox-counter"></div>
        </div>
      `;
      document.body.appendChild(lightbox);
      
      // Event listeners
      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
      lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }
    
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      lightboxOpen = false;
      document.body.style.overflow = '';
    }
  }
  
  function updateLightboxImage() {
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) return;
    
    const item = filteredItems[currentLightboxIndex];
    const img = lightbox.querySelector('.lightbox-image');
    const caption = lightbox.querySelector('.lightbox-caption');
    const counter = lightbox.querySelector('.lightbox-counter');
    
    img.src = item.imageSrc;
    img.alt = item.imageAlt;
    caption.textContent = item.imageAlt;
    counter.textContent = `${currentLightboxIndex + 1} / ${filteredItems.length}`;
    
    // Update button states
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    if (currentLightboxIndex === 0) {
      prevBtn.style.opacity = '0.3';
      prevBtn.style.cursor = 'not-allowed';
    } else {
      prevBtn.style.opacity = '1';
      prevBtn.style.cursor = 'pointer';
    }
    
    if (currentLightboxIndex === filteredItems.length - 1) {
      nextBtn.style.opacity = '0.3';
      nextBtn.style.cursor = 'not-allowed';
    } else {
      nextBtn.style.opacity = '1';
      nextBtn.style.cursor = 'pointer';
    }
  }
  
  function showPrevImage() {
    if (currentLightboxIndex > 0) {
      currentLightboxIndex--;
      updateLightboxImage();
    }
  }
  
  function showNextImage() {
    if (currentLightboxIndex < filteredItems.length - 1) {
      currentLightboxIndex++;
      updateLightboxImage();
    }
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightboxOpen) return;
    
    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrevImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  });
  
  // Filter button events
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      filterGallery(filterValue);
    });
  });
  
  // Initialize
  initGalleryData();
  renderGallery();
  renderPagination();
});