// Pet definitions with unique traits and requirements
const PETS = {
    cat: {
        name: 'Cat',
        description: 'Independent and graceful. Needs less attention but regular feeding.',
        baseStats: { hunger: 90, cleanliness: 95, happiness: 85, energy: 70 },
        difficultyLevel: 1,
        unlockRequirement: 0,
    },
    dog: {
        name: 'Dog',
        description: 'Loyal and energetic. Needs frequent play and attention.',
        baseStats: { hunger: 80, cleanliness: 75, happiness: 95, energy: 90 },
        difficultyLevel: 2,
        unlockRequirement: 0,
    },
    rabbit: {
        name: 'Rabbit',
        description: 'Gentle and quiet. Needs regular feeding and cleaning.',
        baseStats: { hunger: 85, cleanliness: 90, happiness: 80, energy: 75 },
        difficultyLevel: 2,
        unlockRequirement: 100,
    },
    dragon: {
        name: 'Dragon',
        description: 'Magical and challenging. High maintenance but very rewarding.',
        baseStats: { hunger: 70, cleanliness: 70, happiness: 70, energy: 85 },
        difficultyLevel: 4,
        unlockRequirement: 300,
    },
    unicorn: {
        name: 'Unicorn',
        description: 'Majestic and rare. Requires special care and attention.',
        baseStats: { hunger: 75, cleanliness: 95, happiness: 90, energy: 80 },
        difficultyLevel: 3,
        unlockRequirement: 200,
    },
    horse: {
        name: 'Horse',
        description: 'Majestic and strong. Needs regular exercise and grooming.',
        baseStats: { hunger: 80, cleanliness: 85, happiness: 90, energy: 95 },
        difficultyLevel: 3,
        unlockRequirement: 150,
    },
    phoenix: {
        name: 'Phoenix',
        description: 'Mythical fire bird. Requires special care and rises from its own ashes.',
        baseStats: { hunger: 60, cleanliness: 80, happiness: 85, energy: 90, flame: 100 },
        difficultyLevel: 5,
        unlockRequirement: 500,
    },
    kraken: {
        name: 'Kraken',
        description: 'Legendary sea monster. Needs a large aquarium and lots of attention.',
        baseStats: { hunger: 50, cleanliness: 70, happiness: 75, energy: 95, hydration: 100 },
        difficultyLevel: 5,
        unlockRequirement: 750,
    },
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
    horseWhisperer: {
        id: 'horseWhisperer',
        name: 'Horse Whisperer',
        description: 'Successfully train your horse',
        points: 100,
    },
    petVeterinarian: {
        id: 'petVeterinarian',
        name: 'Pet Veterinarian',
        description: 'Cure your pet from an illness',
        points: 150,
    },
    legendaryTamer: {
        id: 'legendaryTamer',
        name: 'Legendary Tamer',
        description: 'Raise a mythical creature to level 10',
        points: 500,
    },
    centenarian: {
        id: 'centenarian',
        name: 'Centenarian',
        description: 'Keep a pet alive for 100 days',
        points: 1000,
    },
};

// Task definitions
const TASKS = {
    feed: {
        name: 'Feed',
        icon: 'fa-utensils',
        affects: ['hunger'],
        difficulty: 1,
    },
    clean: {
        name: 'Clean',
        icon: 'fa-shower',
        affects: ['cleanliness'],
        difficulty: 1,
    },
    play: {
        name: 'Play',
        icon: 'fa-futbol',
        affects: ['happiness', 'energy'],
        difficulty: 2,
    },
    exercise: {
        name: 'Exercise',
        icon: 'fa-running',
        affects: ['happiness', 'energy'],
        difficulty: 2,
    },
    groom: {
        name: 'Groom',
        icon: 'fa-brush',
        affects: ['cleanliness', 'happiness'],
        difficulty: 1,
    },
    train: {
        name: 'Train',
        icon: 'fa-dumbbell',
        affects: ['happiness', 'energy'],
        difficulty: 3,
    },
    veterinaryCheck: {
        name: 'Vet Check',
        icon: 'fa-stethoscope',
        affects: ['health'],
        difficulty: 4,
    },
    meditation: {
        name: 'Meditation',
        icon: 'fa-om',
        affects: ['happiness', 'energy'],
        difficulty: 3,
    },
    adventure: {
        name: 'Adventure',
        icon: 'fa-mountain',
        affects: ['happiness', 'energy', 'experience'],
        difficulty: 4,
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
    daysSinceAdoption: 0,
};

// Add pet personalities
const PET_PERSONALITIES = {
    playful: {
        traits: ['energetic', 'fun-loving', 'social'],
        moodEmojis: ['😊', '😄', '🤪'],
        phrases: [
            "Let's play!",
            "That was fun!",
            "Can we do that again?"
        ]
    },
    shy: {
        traits: ['quiet', 'gentle', 'careful'],
        moodEmojis: ['🥺', '😊', '😌'],
        phrases: [
            "Hello...",
            "That was nice",
            "Thank you for being gentle"
        ]
    },
    // Add more personalities...
};

// Add mini-games
const MINI_GAMES = {
    catchBall: {
        name: "Catch the Ball",
        description: "Help your pet catch falling balls!",
        reward: 50
    },
    findTreat: {
        name: "Find the Treat",
        description: "Guide your pet to hidden treats!",
        reward: 30
    }
    // Add more mini-games...
};

document.addEventListener("DOMContentLoaded", () => {
    loadSavedState();
    renderAchievements();
    renderPetSelection();
    updatePointsDisplay();
    showWelcomeMessage();
    showTutorial();
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
    petState = { 
        ...PETS[petType].baseStats,
        health: 100,
        experience: 0,
        level: 1,
        daysSinceAdoption: 0,
    };
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
        unicorn: 'horse',
        horse: 'horse'
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

    Object.entries(TASKS).forEach(([taskKey, task]) => {
        const button = createButton(`<i class="fas ${task.icon}"></i> ${task.name}`, () => performTask(taskKey));
        actionButtons.appendChild(button);
    });
}

function createButton(html, onClick) {
    const button = document.createElement('button');
    button.className = 'button';
    button.innerHTML = html;
    button.onclick = onClick;
    return button;
}

function performTask(taskKey) {
    const task = TASKS[taskKey];
    const successChance = Math.random() > (task.difficulty * 0.1);
    
    if (successChance) {
        task.affects.forEach(stat => {
            updateStat(stat, 10 + Math.floor(Math.random() * 10));
        });
        
        // Add personality-based responses
        const personality = PET_PERSONALITIES[PETS[selectedPet].personality];
        const phrase = personality.phrases[Math.floor(Math.random() * personality.phrases.length)];
        showPetSpeech(phrase);
        
        // Chance to trigger mini-game
        if (Math.random() < 0.2) {
            triggerMiniGame();
        }
    } else {
        showPetSpeech("Maybe we can try something else?");
    }
    
    updatePetMood();
    checkAchievements();
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

    checkUnlockablePets();
    checkPerfectCare();
    checkPetHealth();
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
    simulateTimePassage();
    randomEvent();
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
    const pointsElement = document.getElementById('points');
    gsap.to(pointsElement, {
        textContent: userProgress.points,
        duration: 1,
        ease: "power1.out",
        snap: { textContent: 1 },
        onUpdate: function() {
            pointsElement.textContent = Math.round(pointsElement.textContent);
        }
    });
}

function checkUnlockablePets() {
    Object.entries(PETS).forEach(([petType, pet]) => {
        if (!userProgress.unlockedPets.includes(petType) && userProgress.points >= pet.unlockRequirement) {
            userProgress.unlockedPets.push(petType);
            showNotification(`New pet unlocked: ${pet.name}!`);
            renderPetSelection();
        }
    });
    if (userProgress.unlockedPets.length === Object.keys(PETS).length) {
        awardAchievement('masterCaretaker');
    }
}

function checkPerfectCare() {
    if (Object.values(petState).every(value => value > 90)) {
        setTimeout(() => {
            if (Object.values(petState).every(value => value > 90)) {
                awardAchievement('perfectCare');
            }
        }, 24 * 60 * 60 * 1000); // 24 hours
    }
}

function checkLevelUp() {
    const experienceNeeded = petState.level * 150; // Increase experience needed
    if (petState.experience >= experienceNeeded) {
        petState.level++;
        petState.experience -= experienceNeeded;
        showNotification(`${PETS[selectedPet].name} leveled up to level ${petState.level}!`);
        
        // Increase stats slightly on level up
        Object.keys(petState).forEach(stat => {
            if (typeof petState[stat] === 'number' && stat !== 'level' && stat !== 'experience') {
                petState[stat] = Math.min(petState[stat] + 5, 100);
            }
        });
        
        renderStatusBars();
    }
}

function checkAchievements() {
    if (selectedPet === 'horse' && petState.level >= 5) {
        awardAchievement('horseWhisperer');
    }
    if (petState.health === 100 && petState.health < 50) {
        awardAchievement('petVeterinarian');
    }
    if (['phoenix', 'kraken'].includes(selectedPet) && petState.level >= 10) {
        awardAchievement('legendaryTamer');
    }
    if (petState.daysSinceAdoption >= 100) {
        awardAchievement('centenarian');
    }
}

function randomEvent() {
    const events = [
        { name: 'Illness', chance: 0.05, effect: () => { petState.health -= 20; } },
        { name: 'Growth Spurt', chance: 0.1, effect: () => { petState.experience += 50; } },
        { name: 'Energy Boost', chance: 0.15, effect: () => { petState.energy = 100; } },
        { name: 'Magical Surge', chance: 0.05, effect: () => { petState.experience += 100; } },
        { name: 'Mysterious Illness', chance: 0.03, effect: () => { petState.health -= 30; } },
    ];

    events.forEach(event => {
        if (Math.random() < event.chance) {
            event.effect();
            showNotification(`${PETS[selectedPet].name} experienced a ${event.name}!`);
            renderStatusBars();
        }
    });
}

function simulateTimePassage() {
    petState.daysSinceAdoption++;
    userProgress.daysSinceAdoption++;
    
    // Decrease stats over time
    Object.keys(petState).forEach(stat => {
        if (typeof petState[stat] === 'number' && stat !== 'level' && stat !== 'experience' && stat !== 'daysSinceAdoption') {
            petState[stat] = Math.max(petState[stat] - 2, 0);
        }
    });
    
    renderStatusBars();
    checkAchievements();
    saveState();
}

function checkPetHealth() {
    if (petState.health <= 0) {
        showNotification(`${PETS[selectedPet].name} has fallen ill and needs immediate care!`);
        // Disable all buttons except for 'Vet Check'
        document.querySelectorAll('.button').forEach(button => {
            button.disabled = button.textContent.trim() !== 'Vet Check';
        });
    }
}

// Add welcome message function
function showWelcomeMessage() {
    const welcomeDiv = document.getElementById('welcome-message');
    const timeOfDay = new Date().getHours();
    let greeting = '';
    
    if (timeOfDay < 12) greeting = 'Good morning';
    else if (timeOfDay < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    
    welcomeDiv.innerHTML = `
        <h2>${greeting}, Pet Parent!</h2>
        <p>Ready to create some wonderful memories with your virtual pet?</p>
    `;
}

// Add tutorial function
function showTutorial() {
    if (!localStorage.getItem('tutorialShown')) {
        const tutorial = document.getElementById('tutorial-overlay');
        tutorial.classList.remove('hidden');
        tutorial.innerHTML = `
            <div class="tutorial-content">
                <h2>Welcome to Virtual Pet Companion!</h2>
                <p>Let's learn how to take care of your new friend:</p>
                <ol>
                    <li>Choose a pet that matches your style</li>
                    <li>Keep them happy by playing and feeding them</li>
                    <li>Earn achievements and unlock new pets!</li>
                </ol>
                <button class="button" onclick="closeTutorial()">Got it!</button>
            </div>
        `;
        localStorage.setItem('tutorialShown', 'true');
    }
}

function closeTutorial() {
    document.getElementById('tutorial-overlay').classList.add('hidden');
}

// Modify pet interaction
function updatePetMood() {
    const moodElement = document.getElementById('pet-mood');
    const averageStats = Object.values(petState).reduce((a, b) => a + b, 0) / Object.keys(petState).length;
    
    let mood;
    if (averageStats > 80) mood = '😊';
    else if (averageStats > 60) mood = '😐';
    else if (averageStats > 40) mood = '😕';
    else mood = '😢';
    
    moodElement.textContent = mood;
}

function showPetSpeech(message) {
    const speechBubble = document.getElementById('pet-speech-bubble');
    speechBubble.textContent = message;
    speechBubble.classList.remove('hidden');
    
    setTimeout(() => {
        speechBubble.classList.add('hidden');
    }, 3000);
}

// Add mini-game function
function triggerMiniGame() {
    const miniGames = document.getElementById('mini-games');
    const game = Object.values(MINI_GAMES)[Math.floor(Math.random() * Object.values(MINI_GAMES).length)];
    
    miniGames.classList.remove('hidden');
    miniGames.innerHTML = `
        <h3>${game.name}</h3>
        <p>${game.description}</p>
        <button class="button" onclick="playMiniGame('${game.name}')">Play!</button>
    `;
}

function playMiniGame(gameName) {
    // Implement mini-game logic here
    // For now, just give rewards
    userProgress.points += MINI_GAMES[gameName].reward;
    updatePointsDisplay();
    showNotification(`You earned ${MINI_GAMES[gameName].reward} points!`);
    document.getElementById('mini-games').classList.add('hidden');
}
