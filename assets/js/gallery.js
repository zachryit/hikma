document.addEventListener('DOMContentLoaded', function() {
  // Filter gallery items
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      
      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
  
  // Load more functionality (simplified example)
  const loadMoreBtn = document.querySelector('.load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      // In a real implementation, this would load more items via AJAX
      alert('More gallery items would be loaded here in a full implementation');
    });
  }
  
  // Initialize lightbox
  // Note: The actual lightbox functionality is handled by fslightbox library
});