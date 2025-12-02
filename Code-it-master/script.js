// script.js

// Function to set the theme based on the stored preference
function applyTheme(theme) {
    const body = document.body;
    // 1. Apply theme class
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        // Update button text to offer the opposite
        document.getElementById('theme-toggle-text').textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        document.getElementById('theme-toggle-text').textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
    // 2. Also control the backdrop class on the body to dim the screen when the modal is active
    if (document.getElementById('video-embed-area').classList.contains('active')) {
        body.classList.add('video-backdrop', 'active');
    } else {
        body.classList.remove('video-backdrop', 'active');
    }
}

// Function to toggle between Light and Dark mode
function toggleTheme() {
    let currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
}

// Function to close the video player
function closeVideo() {
    const embedContainer = document.getElementById('video-embed-area');
    embedContainer.innerHTML = ''; // Clear content
    embedContainer.classList.remove('active'); // Hide the pop-up
    document.body.classList.remove('video-backdrop', 'active'); // Remove backdrop
}

// Function to handle video embedding
function embedVideo(videoId, languageName) {
    const embedContainer = document.getElementById('video-embed-area');
    const embedId = 'embedded-' + videoId;
    
    // Check if the same video is already open, if so, close it (toggle off)
    if (embedContainer.classList.contains('active') && embedContainer.querySelector('iframe')?.id === embedId) {
        closeVideo();
        return;
    }

    // Embed the new video content
    const embedHTML = `
        <div class="video-header">
            <h4>${languageName} Tutorial (Embedded)</h4>
            <button class="close-video-btn" onclick="closeVideo();">
                Close
            </button>
        </div>
        <iframe id="${embedId}" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
    
    embedContainer.innerHTML = embedHTML;
    embedContainer.classList.add('active'); // Show the pop-up
    document.body.classList.add('video-backdrop', 'active'); // Apply backdrop
}

// Event listener for the theme toggle button and initial load
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load the saved theme on page load
    const savedTheme = localStorage.getItem('theme') || 'light'; 
    applyTheme(savedTheme);

    // 2. Attach event listener to the theme toggle button
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleTheme);
    }
    
    // 3. Attach event listeners to all 'View on Site' buttons
    document.querySelectorAll('.view-on-site-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const videoId = event.currentTarget.getAttribute('data-video-id');
            const languageName = event.currentTarget.getAttribute('data-lang-name');
            if (videoId && languageName) {
                embedVideo(videoId, languageName);
            }
        });
    });

    // 4. Close video when clicking outside the pop-up
    document.body.addEventListener('click', function(event) {
        const backdropActive = document.body.classList.contains('video-backdrop', 'active');
        const embedContainer = document.getElementById('video-embed-area');

        // Check if the click occurred on the backdrop (outside the video container)
        // Check if the target is the body, and the backdrop is active, and the click target is not the video container or a descendant of it
        if (backdropActive && event.target.tagName === 'BODY' && event.target.classList.contains('video-backdrop')) {
            // Since we use the body for the backdrop effect, this condition is tricky.
            // A safer check is to see if the click target is NOT the container and NOT a button that opens the container.
            if (!embedContainer.contains(event.target) && !event.target.closest('.view-on-site-btn')) {
                closeVideo();
            }
        }
    });
    
    // Finalizing the backdrop to cover the screen only when active
    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `
        .video-backdrop.active {
            overflow: hidden; /* Prevent scrolling the underlying page */
        }
        .video-backdrop.active::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1040;
        }
    `;
    document.head.appendChild(styleSheet);
});