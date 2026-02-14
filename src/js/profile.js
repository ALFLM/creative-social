// This file manages user profile functionalities, such as loading user data and displaying their creations.

document.addEventListener('DOMContentLoaded', () => {
    const userId = getUserIdFromURL();
    loadUserProfile(userId);
});

function getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId');
}

function loadUserProfile(userId) {
    fetch(`/api/users/${userId}`)
        .then(response => response.json())
        .then(data => {
            displayUserProfile(data);
        })
        .catch(error => {
            console.error('Error loading user profile:', error);
        });
}

function displayUserProfile(user) {
    const profileContainer = document.getElementById('profile-container');
    profileContainer.innerHTML = `
        <h1>${user.username}'s Profile</h1>
        <div>
            <h2>Creations:</h2>
            <div id="creations-list"></div>
        </div>
    `;
    loadUserCreations(user.id);
}

function loadUserCreations(userId) {
    fetch(`/api/users/${userId}/creations`)
        .then(response => response.json())
        .then(creations => {
            const creationsList = document.getElementById('creations-list');
            creations.forEach(creation => {
                const creationElement = document.createElement('div');
                creationElement.innerHTML = `
                    <h3>${creation.title}</h3>
                    <canvas id="creation-${creation.id}" width="300" height="300"></canvas>
                `;
                creationsList.appendChild(creationElement);
                drawCreation(creation);
            });
        })
        .catch(error => {
            console.error('Error loading user creations:', error);
        });
}

function drawCreation(creation) {
    const canvas = document.getElementById(`creation-${creation.id}`);
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = creation.imageUrl; // Assuming creations have an imageUrl property
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}