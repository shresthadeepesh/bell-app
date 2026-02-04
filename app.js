// State
let audioContext = null;
let audioBuffer = null;
let motionEnabled = false;
let lastShakeTime = 0;

// Constants
const SHAKE_THRESHOLD = 5;
const SHAKE_COOLDOWN = 200;

// DOM Elements
const bell = document.getElementById('bell');
const bellContainer = document.getElementById('bell-container');
const motionBtn = document.getElementById('enable-motion');
const motionStatus = document.getElementById('motion-status');

// Initialize audio
async function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const response = await fetch('Bell.mp3');
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
        motionStatus.textContent = 'Error loading sound';
    }
}

// Play bell sound
function playBell(fast = false) {
    if (!audioContext || !audioBuffer) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);

    animateBell(fast);
}

// Animate bell and ripples
function animateBell(fast = false) {
    // Reset animations
    bell.classList.remove('ringing');
    bellContainer.classList.remove('ringing', 'ringing-fast');
    void bellContainer.offsetWidth; // Force reflow

    bell.classList.add('ringing');

    if (fast) {
        bellContainer.classList.add('ringing-fast');
        setTimeout(() => bell.classList.remove('ringing'), 150);
        setTimeout(() => bellContainer.classList.remove('ringing-fast'), 1500);
    } else {
        bellContainer.classList.add('ringing');
        setTimeout(() => bell.classList.remove('ringing'), 300);
        setTimeout(() => bellContainer.classList.remove('ringing'), 4000);
    }
}

// Handle device motion
function handleMotion(event) {
    if (!motionEnabled) return;

    const acc = event.accelerationIncludingGravity || event.acceleration;
    if (!acc) return;

    const { x = 0, y = 0, z = 0 } = acc;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const shakeForce = Math.abs(magnitude - 9.8);

    const now = Date.now();
    if (shakeForce > SHAKE_THRESHOLD && (now - lastShakeTime) > SHAKE_COOLDOWN) {
        lastShakeTime = now;
        playBell(true);
    }
}

// Request motion permission (iOS 13+)
async function requestMotionPermission() {
    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
        const permission = await DeviceMotionEvent.requestPermission();
        return permission === 'granted';
    }
    return true;
}

// Enable motion control
async function enableMotion() {
    if (!audioContext) await initAudio();

    motionStatus.textContent = 'Requesting permission...';

    try {
        const granted = await requestMotionPermission();

        if (!granted) {
            motionStatus.textContent = 'Permission denied';
            return;
        }

        window.addEventListener('devicemotion', handleMotion, true);
        motionEnabled = true;
        motionBtn.textContent = 'Motion Active';
        motionBtn.classList.add('active');
        motionStatus.textContent = 'Shake to ring!';
    } catch (error) {
        motionStatus.textContent = 'Error: ' + error.message;
    }
}

// Event listeners
bellContainer.addEventListener('click', async () => {
    if (!audioContext) await initAudio();
    playBell(false);
});

// Prevent image selection and context menu
bell.addEventListener('contextmenu', e => e.preventDefault());
bellContainer.addEventListener('contextmenu', e => e.preventDefault());

motionBtn.addEventListener('click', enableMotion);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!('DeviceMotionEvent' in window)) {
        motionStatus.textContent = 'Motion not supported';
        motionBtn.style.display = 'none';
    }
});
