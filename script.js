// Pet definitions with unique traits and requirements
const PETS = {
    cat: {
        name: 'Cat',
        description: 'Independent and graceful. Needs less attention but regular feeding.',
        baseStats: { hunger: 90, cleanliness: 95, happiness: 85 },
        difficultyLevel: 1,
        unlockRequirement: 0,
    },
    dog: {
        name: 'Dog',
        description: 'Loyal and energetic. Needs frequent play and attention.',
        baseStats: { hunger: 80, cleanliness: 75, happiness: 95 },
        difficultyLevel: 2,
        unlockRequirement: 0,
    },
    rabbit: {
        name: 'Rabbit',
        description: 'Gentle and quiet. Needs regular feeding and cleaning.',
        baseStats: { hunger: 85, cleanliness: 90, happiness: 80 },
        difficultyLevel: 2,
        unlockRequirement: 100,
    },
    dragon: {
        name: 'Dragon',
        description: 'Magical and challenging. High maintenance but very rewarding.',
        baseStats: { hunger: 70, cleanliness: 70, happiness: 70 },
        difficultyLevel: 4,
        unlockRequirement: 300,
    },
    unicorn: {
        name: 'Unicorn',
        description: 'Majestic and rare. Requires special care and attention.',
        baseStats: { hunger: 75, cleanliness: 95, happiness: 90 },
        difficultyLevel: 3,
        unlockRequirement: 200,
    }
};

// Achievement definitions
const ACHIEVEMENTS = {
    firstPet: {
        id: 'firstPet',
        name: 'Pet Parent',
        description: 'Adopt your first pet',
        points: 50,
    },
    perfectCare: {
        id: 'perfectCare',
        name: 'Perfect Caretaker',
        description: 'Maintain all stats above 90% for 24 hours',
        points: 100,
    },
    masterCaretaker: {
        id: 'masterCaretaker',
        name: 'Master Caretaker',
        description: 'Unlock all pets',
        points: 200,
    },
};

// State management
let selectedPet = null;
let petState = null;
let userProgress = JSON.parse(localStorage.getItem('petProgress')) || {
    points: 0,
    unlockedPets: ['cat', 'dog'],
    achievements: [],
    lastActivity: null,
};

document.addEventListener("DOMContentLoaded", () => {
    loadSavedState();
    renderAchievements();
    renderPetSelection();
    updatePointsDisplay();
});

function loadSavedState() {
    const savedPet = localStorage.getItem('selectedPet');
    const savedState = localStorage.getItem('petState');

    if (savedPet && savedState) {
        selectedPet = savedPet;
        petState = JSON.parse(savedState);
        renderActivePet();
    }
}

function saveState() {
    localStorage.setItem('petProgress', JSON.stringify(userProgress));
    if (selectedPet && petState) {
        localStorage.setItem('selectedPet', selectedPet);
        localStorage.setItem('petState', JSON.stringify(petState));
    }
}

function renderAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = '';
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
        const div = document.createElement('div');
        div.className = 'achievement';
        const icon = userProgress.achievements.includes(achievement.id) ? '🏆' : '🔒';
        div.textContent = `${icon} ${achievement.name}: ${achievement.description}`;
        achievementsList.appendChild(div);
    });
}

function renderPetSelection() {
    const petSelection = document.getElementById('pet-selection');
    petSelection.innerHTML = '';

    Object.entries(PETS).forEach(([petType, pet]) => {
        const petDiv = document.createElement('div');
        petDiv.className = `pet ${userProgress.unlockedPets.includes(petType) ? '' : 'locked'}`;
        petDiv.innerHTML = `
            <h3>${pet.name}</h3>
            <p>${pet.description}</p>
            <p>Difficulty: ${'⭐'.repeat(pet.difficultyLevel)}</p>
        `;
        petDiv.onclick = () => selectPet(petType);
        petSelection.appendChild(petDiv);
    });
}

function selectPet(petType) {
    if (!userProgress.unlockedPets.includes(petType)) {
        showNotification(`Need ${PETS[petType].unlockRequirement} points to unlock!`);
        return;
    }

    selectedPet = petType;
    petState = { ...PETS[petType].baseStats };
    userProgress.achievements.length === 0 && awardAchievement('firstPet');
    saveState();
    renderActivePet();
}

function renderActivePet() {
    document.getElementById('active-pet-card').style.display = 'block';
    document.getElementById('active-pet-name').textContent = PETS[selectedPet].name;
    
    const petVisualization = document.getElementById('pet-visualization');
    petVisualization.innerHTML = `<i class="fas fa-${getPetIcon(selectedPet)}"></i>`;
    
    renderStatusBars();
    renderActionButtons();
    updateLastActivity();

    // Animate pet appearance
    gsap.from(petVisualization, {duration: 0.5, scale: 0, ease: "back.out(1.7)"});
}

function getPetIcon(petType) {
    const icons = {
        cat: 'cat',
        dog: 'dog',
        rabbit: 'carrot',
        dragon: 'dragon',
        unicorn: 'horse'
    };
    return icons[petType] || 'paw';
}

function renderStatusBars() {
    const statusBars = document.getElementById('status-bars');
    statusBars.innerHTML = '';

    for (const stat in petState) {
        const div = document.createElement('div');
        div.className = 'status-bar';
        div.innerHTML = `
            <span>${stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
            <div class="status-bar-fill" style="width: ${petState[stat]}%; background-color: ${getStatusColor(petState[stat])};"></div>
            <span>${Math.round(petState[stat])}%</span>
        `;
        statusBars.appendChild(div);
    }
}

function getStatusColor(value) {
    if (value > 66) return 'green';
    if (value > 33) return 'yellow';
    return 'red';
}

function renderActionButtons() {
    const actionButtons = document.getElementById('action-buttons');
    actionButtons.innerHTML = '';

    const feedButton = createButton('<i class="fas fa-utensils"></i> Feed', () => updateStat('hunger', 10));
    const cleanButton = createButton('<i class="fas fa-shower"></i> Clean', () => updateStat('cleanliness', 10));
    const playButton = createButton('<i class="fas fa-futbol"></i> Play', () => updateStat('happiness', 10));

    actionButtons.appendChild(feedButton);
    actionButtons.appendChild(cleanButton);
    actionButtons.appendChild(playButton);
}

function createButton(html, onClick) {
    const button = document.createElement('button');
    button.className = 'button';
    button.innerHTML = html;
    button.onclick = onClick;
    return button;
}

function updateStat(stat, amount) {
    const oldValue = petState[stat];
    petState[stat] = Math.min(petState[stat] + amount, 100);
    userProgress.points += 10;
    updatePointsDisplay();
    saveState();
    renderStatusBars();
    showNotification(`${PETS[selectedPet].name}'s ${stat} increased!`);
    updateLastActivity();

    // Animate status bar change
    gsap.from(`#status-bars .status-bar:nth-child(${Object.keys(petState).indexOf(stat) + 1}) .status-bar-fill`, {
        width: `${oldValue}%`,
        duration: 0.5,
        ease: "power2.out"
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    gsap.to(notification, {opacity: 1, duration: 0.3, yoyo: true, repeat: 1, repeatDelay: 2});
}

function updateLastActivity() {
    userProgress.lastActivity = new Date().toLocaleString();
    document.getElementById('last-activity').textContent = `Last activity: ${userProgress.lastActivity}`;
    saveState();
}

function awardAchievement(achievementId) {
    if (!userProgress.achievements.includes(achievementId)) {
        userProgress.achievements.push(achievementId);
        userProgress.points += ACHIEVEMENTS[achievementId].points;
        updatePointsDisplay();
        saveState();
        renderAchievements();
        showNotification(`Achievement Unlocked: ${ACHIEVEMENTS[achievementId].name}`);
    }
}

function updatePointsDisplay() {
    document.getElementById('points').textContent = userProgress.points;
}
