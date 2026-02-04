# हाम्रो बज्ने घन्ती (Our Ringing Bell)

An interactive bell web app with motion controls and beautiful ripple animations.

## Features

- **Tap to Ring** - Click or tap the bell to play the sound
- **Shake to Ring** - Enable motion control and shake your phone to ring the bell
- **Ripple Animations** - Beautiful expanding ripple effects when the bell rings
- **Responsive Design** - Works on all screen sizes (desktop, tablet, mobile)
- **Fast Animation Mode** - Shaking triggers faster animations than tapping
- **PWA Ready** - Can be added to home screen on mobile devices

## Demo

Tap the bell or shake your device to hear it ring!

## Tech Stack

- **HTML5** - Semantic markup with SEO meta tags
- **CSS3** - Animations, flexbox, responsive design
- **JavaScript (ES6+)** - Web Audio API, Device Motion API

## File Structure

```
bell-app/
├── index.html      # Main HTML with SEO meta tags
├── styles.css      # Styles and animations
├── app.js          # Application logic
├── Bell.mp3        # Bell sound file
├── Ghanti.png      # Bell image
└── README.md       # This file
```

## Code Overview

### Audio System (`app.js`)

Uses the Web Audio API for sound playback:

```javascript
// Initialize audio context and load sound
audioContext = new (window.AudioContext || window.webkitAudioContext)();
const response = await fetch('Bell.mp3');
const arrayBuffer = await response.arrayBuffer();
audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
```

### Motion Detection (`app.js`)

Detects device shake using the DeviceMotion API:

```javascript
// Calculate shake force from accelerometer data
const { x, y, z } = event.accelerationIncludingGravity;
const magnitude = Math.sqrt(x * x + y * y + z * z);
const shakeForce = Math.abs(magnitude - 9.8); // Subtract gravity

if (shakeForce > SHAKE_THRESHOLD) {
    playBell(true); // Fast animation
}
```

### Ripple Animation (`styles.css`)

CSS keyframe animation for expanding ripples:

```css
@keyframes ripple-expand {
    from {
        transform: scale(1);
        opacity: 1;
    }
    to {
        transform: scale(2.5);
        opacity: 0;
    }
}
```

### Two Animation Speeds

| Mode | Total Duration | Ripple Duration | Trigger |
|------|---------------|-----------------|---------|
| Normal | 4 seconds | 1.3s per ripple | Tap/Click |
| Fast | 1.5 seconds | 0.5s per ripple | Shake |

## Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/bell-app.git
   cd bell-app
   ```

2. Start a local server:
   ```bash
   # Using Python
   python3 -m http.server 8000

   # Or using Node.js
   npx serve
   ```

3. Open `http://localhost:8000` in your browser

> **Note**: Motion controls require HTTPS (except on localhost)

## Deploying to GitHub Pages

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to repository Settings → Pages

3. Select "main" branch and "/ (root)" folder

4. Your site will be live at `https://YOUR_USERNAME.github.io/bell-app/`

## Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome/Edge | ✅ | ✅ |
| Safari | ✅ | ✅ |
| Firefox | ✅ | ✅ |

Motion controls require:
- HTTPS connection
- Device with accelerometer
- User permission (iOS 13+)

## License

MIT License - Feel free to use and modify!
