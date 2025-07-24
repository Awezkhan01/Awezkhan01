# 🥊 Mobile Fighter Arena

A fast-paced 2D fighting game optimized for mobile devices, inspired by classic arcade fighters.

## 🎮 Game Features

### 🥋 Two Unique Characters
- **Warrior**: Heavy-hitting fighter with high health and armor-piercing attacks
  - High health (120 HP)
  - Moderate speed
  - Special: Charging dash attack
  - Strong defensive capabilities

- **Ninja**: Fast and agile fighter with quick strikes and evasion
  - Lower health (80 HP) 
  - High speed and jump height
  - Special: Temporary invulnerability teleport
  - Quick combo attacks

### 📱 Mobile-Optimized Controls
- **Movement**: Left/Right arrow buttons + Jump
- **Combat**: Light Attack, Heavy Attack, Guard
- **Special**: Character-specific special moves with cooldowns
- Touch-responsive buttons with visual feedback
- Optimized for thumb controls on mobile screens

### 🎨 Visual Features
- Colorful gradient backgrounds with mountains and clouds
- Smooth character animations and sprite flipping
- Particle effects on successful hits
- Screen shake effects for impact feedback
- Health bars that change color based on remaining health
- Hit effects with golden impact circles

### 🎵 Audio & Effects
- Hit sound effects
- Jump sound effects  
- Special move sound effects
- Optimized volume levels for mobile

### ⚔️ Combat System
- Light attacks (15 damage, fast)
- Heavy attacks (25 damage, slower)
- Special moves (35 damage, long cooldown)
- Guard system to block incoming attacks
- Knockback effects on successful hits
- Invulnerability frames after taking damage

### 🏆 Game Modes
- Round-based combat with 99-second timer
- Win conditions: Defeat opponent or time runs out
- Rematch and menu options
- AI opponent with adaptive behavior

## 🚀 How to Play

### Running the Game

1. **Using Python Server** (Recommended):
   ```bash
   python server.py
   ```
   Then open `http://localhost:8000` in your mobile browser

2. **Direct File Access**:
   Open `index.html` in any modern web browser

### Controls

#### Touch Controls (Mobile)
- **←/→**: Move left/right
- **↑**: Jump
- **🛡️**: Guard/Block
- **👊**: Light Attack
- **💥**: Heavy Attack  
- **⚡**: Special Move

#### Keyboard Controls (Desktop Testing)
- **A/D or Arrow Keys**: Move left/right
- **W or Up Arrow**: Jump
- **S**: Guard
- **J**: Light Attack
- **K**: Heavy Attack
- **L**: Special Move

### Combat Tips
- Use light attacks for quick combos
- Heavy attacks deal more damage but are slower
- Guard to block incoming attacks
- Special moves are powerful but have long cooldowns
- Jump to avoid ground attacks
- Each character has unique strengths - learn their playstyles!

## 🛠️ Technical Features

### Performance Optimizations
- 60 FPS frame rate limiting
- Efficient canvas rendering
- Optimized particle systems
- Mobile-specific CSS optimizations
- Reduced memory allocations in game loop

### Mobile Compatibility
- Responsive design for all screen sizes
- Touch event handling with preventDefault
- Disabled zoom and text selection
- Optimized for portrait and landscape modes
- Hardware acceleration support

### Browser Support
- Modern mobile browsers (iOS Safari, Chrome, Firefox)
- Desktop browsers for testing
- HTML5 Canvas with 2D context
- Web Audio API for sound effects

## 📁 Project Structure

```
mobile-fighter/
├── index.html          # Main HTML file with game structure
├── styles.css          # CSS styles and mobile optimizations
├── game.js            # Complete game logic and classes
├── server.py          # Python development server
└── README.md          # This documentation
```

## 🎯 Game Architecture

### Main Classes
- **MobileFighter**: Main game controller and state management
- **Fighter**: Character class with physics, combat, and AI

### Key Systems
- **Input System**: Touch and keyboard input handling
- **Physics System**: Gravity, collision detection, movement
- **Combat System**: Attack boxes, damage calculation, effects
- **Rendering System**: Canvas drawing, animations, particles
- **Audio System**: Sound effect management
- **UI System**: Health bars, timer, menus

## 🔧 Customization

The game is designed to be easily customizable:

- **Characters**: Modify `setupCharacterStats()` to add new fighters
- **Moves**: Add new attacks in the `Fighter` class methods
- **Visuals**: Update `drawBackground()` and character rendering
- **Sounds**: Replace audio files or add new sound effects
- **Controls**: Modify touch control layout in CSS and JavaScript

## 🌟 Future Enhancements

Potential additions for expanded gameplay:
- Multiple stages/backgrounds
- Power-up items
- Combo system with special inputs
- Tournament mode
- Local multiplayer
- Character selection screen
- Unlockable characters
- Achievement system

## 📱 Testing on Mobile

1. Run the Python server: `python server.py`
2. Find your computer's IP address
3. On your mobile device, navigate to `http://[YOUR-IP]:8000`
4. Add to home screen for full-screen experience
5. Test in both portrait and landscape orientations

## 🎮 Enjoy the Fight!

Experience classic arcade fighting action optimized for modern mobile devices. Master both characters, learn their unique abilities, and dominate the arena!

---

*Built with HTML5 Canvas, optimized for mobile performance, and inspired by classic fighting games.*
