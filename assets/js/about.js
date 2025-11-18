// About AHIMS Stats Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const speed = 200; // Animation duration in ms
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-count');
    const count = +counter.innerText;
    const increment = target / speed;
    
    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(animateCounters, 1);
    } else {
      counter.innerText = target;
    }
  });
}

// Run counters when section is in view
const aboutSection = document.querySelector('.about-ahims-section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

if (aboutSection) {
  observer.observe(aboutSection);
}

// Enhanced Anthem Audio Player Functionality
document.addEventListener('DOMContentLoaded', function() {
  const audioPlayer = document.getElementById('anthemAudio');
  if (!audioPlayer) return;

  const playBtn = document.getElementById('playAnthem');
  const progressBar = document.getElementById('progressBar');
  const volumeBtn = document.getElementById('volumeBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  
  let isPlaying = false;
  
  // Initialize player if elements exist
  if (playBtn && progressBar && volumeBtn && volumeSlider && currentTimeEl && durationEl) {
    // Play/Pause functionality
    playBtn.addEventListener('click', function() {
      if (isPlaying) {
        audioPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.setAttribute('aria-label', 'Play anthem');
      } else {
        audioPlayer.play()
          .then(() => {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playBtn.setAttribute('aria-label', 'Pause anthem');
            isPlaying = true;
          })
          .catch(error => {
            console.error('Audio playback failed:', error);
          });
      }
    });
    
    // Update progress bar
    audioPlayer.addEventListener('timeupdate', function() {
      const currentTime = audioPlayer.currentTime;
      const duration = audioPlayer.duration;
      
      // Avoid NaN if duration isn't available yet
      if (!isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Update time display
        currentTimeEl.textContent = formatTime(currentTime);
        durationEl.textContent = formatTime(duration);
      }
    });
    
    // Click on progress bar to seek
    progressBar.parentElement.addEventListener('click', function(e) {
      const width = this.clientWidth;
      const clickX = e.offsetX;
      const duration = audioPlayer.duration;
      
      if (!isNaN(duration)) {
        audioPlayer.currentTime = (clickX / width) * duration;
      }
    });
    
    // Volume control
    volumeBtn.addEventListener('click', function() {
      audioPlayer.muted = !audioPlayer.muted;
      if (audioPlayer.muted) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        volumeBtn.setAttribute('aria-label', 'Unmute anthem');
        volumeSlider.value = 0;
      } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volumeBtn.setAttribute('aria-label', 'Mute anthem');
        volumeSlider.value = audioPlayer.volume;
      }
    });
    
    volumeSlider.addEventListener('input', function() {
      audioPlayer.volume = this.value;
      audioPlayer.muted = this.value === '0';
      volumeBtn.innerHTML = this.value === '0' ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
      volumeBtn.setAttribute('aria-label', this.value === '0' ? 'Unmute anthem' : 'Mute anthem');
    });
    
    // Format time (seconds to mm:ss)
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    // When audio ends
    audioPlayer.addEventListener('ended', function() {
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
      playBtn.setAttribute('aria-label', 'Play anthem');
      isPlaying = false;
      progressBar.style.width = '0%';
      currentTimeEl.textContent = '0:00';
    });
    
    // Handle potential audio loading errors
    audioPlayer.addEventListener('error', function() {
      console.error('Error loading audio file');
      playBtn.disabled = true;
      playBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
      playBtn.setAttribute('aria-label', 'Error loading anthem');
    });
    
    // Initialize volume
    audioPlayer.volume = volumeSlider.value;
  }
});