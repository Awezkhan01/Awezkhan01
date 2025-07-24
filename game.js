class MobileFighter {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'menu'; // menu, instructions, playing, gameOver
        this.currentRound = 1;
        this.roundTime = 99;
        this.gameTimer = null;
        
        // Game objects
        this.player1 = null;
        this.player2 = null;
        this.particles = [];
        this.hitEffects = [];
        
        // Input handling
        this.keys = {};
        this.touchControls = {};
        
        // Audio
        this.sounds = {};
        
        // Performance optimization
        this.lastFrameTime = 0;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.loadSounds();
        this.showScreen('mainMenu');
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size to match container
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Optimize canvas for mobile
        this.ctx.imageSmoothingEnabled = false;
        this.canvas.style.imageRendering = 'pixelated';
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }
    
    setupEventListeners() {
        // Menu buttons
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('instructionsBtn').addEventListener('click', () => this.showScreen('instructionsScreen'));
        document.getElementById('backBtn').addEventListener('click', () => this.showScreen('mainMenu'));
        document.getElementById('rematchBtn').addEventListener('click', () => this.startGame());
        document.getElementById('menuBtn').addEventListener('click', () => this.showScreen('mainMenu'));
        
        // Touch controls
        this.setupTouchControls();
        
        // Keyboard controls (for testing)
        document.addEventListener('keydown', (e) => this.keys[e.code] = true);
        document.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }
    
    setupTouchControls() {
        const controls = {
            'leftBtn': 'left',
            'rightBtn': 'right',
            'jumpBtn': 'jump',
            'guardBtn': 'guard',
            'lightAttackBtn': 'lightAttack',
            'heavyAttackBtn': 'heavyAttack',
            'specialBtn': 'special'
        };
        
        Object.entries(controls).forEach(([btnId, action]) => {
            const btn = document.getElementById(btnId);
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchControls[action] = true;
                btn.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.touchControls[action] = false;
                btn.style.transform = 'scale(1)';
            });
            
            btn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.touchControls[action] = false;
                btn.style.transform = 'scale(1)';
            });
            
            // Mouse events for desktop testing
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.touchControls[action] = true;
            });
            
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.touchControls[action] = false;
            });
        });
    }
    
    loadSounds() {
        this.sounds = {
            hit: document.getElementById('hitSound'),
            jump: document.getElementById('jumpSound'),
            special: document.getElementById('specialSound')
        };
        
        // Set volume for mobile optimization
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.3;
        });
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(() => {
                // Handle autoplay restrictions
            });
        }
    }
    
    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenName).classList.remove('hidden');
        this.gameState = screenName === 'gameScreen' ? 'playing' : 'menu';
    }
    
    startGame() {
        this.showScreen('gameScreen');
        this.initializeGame();
        this.gameLoop();
    }
    
    initializeGame() {
        this.currentRound = 1;
        this.roundTime = 99;
        this.particles = [];
        this.hitEffects = [];
        
        // Create players
        this.player1 = new Fighter('warrior', 100, this.canvas.height - 150, false);
        this.player2 = new Fighter('ninja', this.canvas.width - 150, this.canvas.height - 150, true);
        
        // Update UI
        document.getElementById('roundInfo').textContent = `ROUND ${this.currentRound}`;
        this.updateHealthBars();
        
        // Start timer
        this.startRoundTimer();
    }
    
    startRoundTimer() {
        if (this.gameTimer) clearInterval(this.gameTimer);
        
        this.gameTimer = setInterval(() => {
            this.roundTime--;
            document.getElementById('timer').textContent = this.roundTime;
            
            if (this.roundTime <= 0) {
                this.endRound('time');
            }
        }, 1000);
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState !== 'playing') return;
        
        // Frame rate limiting for mobile optimization
        if (currentTime - this.lastFrameTime < this.frameInterval) {
            requestAnimationFrame(() => this.gameLoop());
            return;
        }
        
        this.lastFrameTime = currentTime;
        
        this.update();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update players
        this.player1.update(this.getPlayer1Input(), this.player2);
        this.player2.update(this.getPlayer2Input(), this.player1);
        
        // Check collisions
        this.checkCollisions();
        
        // Update particles and effects
        this.updateParticles();
        this.updateHitEffects();
        
        // Check win conditions
        this.checkWinConditions();
        
        // Update UI
        this.updateHealthBars();
    }
    
    getPlayer1Input() {
        return {
            left: this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touchControls.left,
            right: this.keys['ArrowRight'] || this.keys['KeyD'] || this.touchControls.right,
            jump: this.keys['ArrowUp'] || this.keys['KeyW'] || this.touchControls.jump,
            guard: this.keys['KeyS'] || this.touchControls.guard,
            lightAttack: this.keys['KeyJ'] || this.touchControls.lightAttack,
            heavyAttack: this.keys['KeyK'] || this.touchControls.heavyAttack,
            special: this.keys['KeyL'] || this.touchControls.special
        };
    }
    
    getPlayer2Input() {
        // AI for player 2
        const distance = Math.abs(this.player2.x - this.player1.x);
        const input = {
            left: false,
            right: false,
            jump: false,
            guard: false,
            lightAttack: false,
            heavyAttack: false,
            special: false
        };
        
        // Simple AI behavior
        if (distance > 150) {
            input.left = this.player2.x > this.player1.x;
            input.right = this.player2.x < this.player1.x;
        } else if (distance < 80) {
            if (Math.random() < 0.3) input.lightAttack = true;
            if (Math.random() < 0.1) input.heavyAttack = true;
            if (Math.random() < 0.05) input.special = true;
            if (Math.random() < 0.2) input.guard = true;
        }
        
        if (Math.random() < 0.02) input.jump = true;
        
        return input;
    }
    
    checkCollisions() {
        const p1Attacks = this.player1.getAttackBoxes();
        const p2Attacks = this.player2.getAttackBoxes();
        
        // Player 1 attacking Player 2
        p1Attacks.forEach(attack => {
            if (this.isColliding(attack, this.player2.getHitBox()) && !this.player2.isGuarding) {
                this.handleHit(this.player1, this.player2, attack.damage);
            }
        });
        
        // Player 2 attacking Player 1
        p2Attacks.forEach(attack => {
            if (this.isColliding(attack, this.player1.getHitBox()) && !this.player1.isGuarding) {
                this.handleHit(this.player2, this.player1, attack.damage);
            }
        });
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    handleHit(attacker, defender, damage) {
        if (defender.invulnerable) return;
        
        defender.takeDamage(damage);
        defender.knockback(attacker.facingRight ? 1 : -1);
        
        // Create hit effect
        this.createHitEffect(defender.x + defender.width/2, defender.y + defender.height/2);
        
        // Play sound
        this.playSound('hit');
        
        // Screen shake effect
        this.screenShake();
    }
    
    createHitEffect(x, y) {
        this.hitEffects.push({
            x: x,
            y: y,
            scale: 0.5,
            opacity: 1,
            life: 20
        });
        
        // Create particles
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30,
                maxLife: 30,
                color: `hsl(${Math.random() * 60 + 15}, 100%, 60%)`
            });
        }
    }
    
    screenShake() {
        const canvas = this.canvas;
        canvas.style.transform = 'translate(2px, 2px)';
        setTimeout(() => {
            canvas.style.transform = 'translate(-2px, -2px)';
            setTimeout(() => {
                canvas.style.transform = 'translate(0, 0)';
            }, 50);
        }, 50);
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.95;
            particle.vy *= 0.95;
            particle.life--;
            return particle.life > 0;
        });
    }
    
    updateHitEffects() {
        this.hitEffects = this.hitEffects.filter(effect => {
            effect.scale += 0.1;
            effect.opacity -= 0.05;
            effect.life--;
            return effect.life > 0;
        });
    }
    
    checkWinConditions() {
        if (this.player1.health <= 0) {
            this.endRound('player2');
        } else if (this.player2.health <= 0) {
            this.endRound('player1');
        }
    }
    
    endRound(winner) {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        let winnerText = '';
        if (winner === 'player1') {
            winnerText = 'WARRIOR WINS!';
        } else if (winner === 'player2') {
            winnerText = 'NINJA WINS!';
        } else {
            winnerText = 'TIME UP!';
        }
        
        document.getElementById('winnerText').textContent = winnerText;
        
        setTimeout(() => {
            this.showScreen('gameOverScreen');
        }, 2000);
    }
    
    updateHealthBars() {
        const p1HealthPercent = (this.player1.health / this.player1.maxHealth) * 100;
        const p2HealthPercent = (this.player2.health / this.player2.maxHealth) * 100;
        
        document.getElementById('player1Health').style.width = `${p1HealthPercent}%`;
        document.getElementById('player2Health').style.width = `${p2HealthPercent}%`;
        
        // Change color based on health
        const p1Health = document.getElementById('player1Health');
        const p2Health = document.getElementById('player2Health');
        
        if (p1HealthPercent < 25) {
            p1Health.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
        } else if (p1HealthPercent < 50) {
            p1Health.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
        }
        
        if (p2HealthPercent < 25) {
            p2Health.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
        } else if (p2HealthPercent < 50) {
            p2Health.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw players
        this.player1.render(this.ctx);
        this.player2.render(this.ctx);
        
        // Draw particles
        this.renderParticles();
        
        // Draw hit effects
        this.renderHitEffects();
    }
    
    drawBackground() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Sky gradient
        const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#98FB98');
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, width, height * 0.6);
        
        // Ground
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, height * 0.6, width, height * 0.4);
        
        // Platform
        ctx.fillStyle = '#654321';
        ctx.fillRect(0, height - 50, width, 50);
        
        // Background elements
        this.drawBackgroundElements();
    }
    
    drawBackgroundElements() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Mountains
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.6);
        ctx.lineTo(width * 0.3, height * 0.3);
        ctx.lineTo(width * 0.6, height * 0.6);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(width * 0.4, height * 0.6);
        ctx.lineTo(width * 0.7, height * 0.2);
        ctx.lineTo(width, height * 0.6);
        ctx.fill();
        
        // Clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.drawCloud(width * 0.2, height * 0.15, 40);
        this.drawCloud(width * 0.7, height * 0.1, 30);
    }
    
    drawCloud(x, y, size) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.6, y, size * 0.8, 0, Math.PI * 2);
        ctx.arc(x + size * 1.2, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
            this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        });
    }
    
    renderHitEffects() {
        this.hitEffects.forEach(effect => {
            this.ctx.save();
            this.ctx.globalAlpha = effect.opacity;
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, effect.scale * 20, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
}

class Fighter {
    constructor(type, x, y, facingRight = true) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 80;
        this.facingRight = facingRight;
        
        // Stats
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.speed = 3;
        this.jumpPower = 15;
        
        // Physics
        this.vx = 0;
        this.vy = 0;
        this.onGround = true;
        this.gravity = 0.8;
        
        // Combat
        this.isAttacking = false;
        this.isGuarding = false;
        this.invulnerable = false;
        this.attackCooldown = 0;
        this.guardCooldown = 0;
        
        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.currentAnimation = 'idle';
        
        // Special abilities based on type
        this.setupCharacterStats();
    }
    
    setupCharacterStats() {
        if (this.type === 'warrior') {
            this.speed = 2.5;
            this.maxHealth = 120;
            this.health = this.maxHealth;
            this.color = '#FF6B35';
            this.specialCooldown = 0;
        } else if (this.type === 'ninja') {
            this.speed = 4;
            this.jumpPower = 18;
            this.maxHealth = 80;
            this.health = this.maxHealth;
            this.color = '#8B5CF6';
            this.specialCooldown = 0;
        }
    }
    
    update(input, opponent) {
        // Update cooldowns
        if (this.attackCooldown > 0) this.attackCooldown--;
        if (this.guardCooldown > 0) this.guardCooldown--;
        if (this.specialCooldown > 0) this.specialCooldown--;
        if (this.invulnerable && this.invulnerableTimer > 0) {
            this.invulnerableTimer--;
            if (this.invulnerableTimer <= 0) this.invulnerable = false;
        }
        
        // Handle input
        this.handleInput(input, opponent);
        
        // Apply physics
        this.applyPhysics();
        
        // Update animation
        this.updateAnimation();
        
        // Keep in bounds
        this.keepInBounds();
    }
    
    handleInput(input, opponent) {
        // Reset states
        this.isGuarding = false;
        
        // Movement
        if (input.left && !this.isAttacking) {
            this.vx = -this.speed;
            this.facingRight = false;
            this.currentAnimation = 'walk';
        } else if (input.right && !this.isAttacking) {
            this.vx = this.speed;
            this.facingRight = true;
            this.currentAnimation = 'walk';
        } else if (!this.isAttacking) {
            this.vx *= 0.8;
            this.currentAnimation = 'idle';
        }
        
        // Jump
        if (input.jump && this.onGround && !this.isAttacking) {
            this.vy = -this.jumpPower;
            this.onGround = false;
            this.currentAnimation = 'jump';
        }
        
        // Guard
        if (input.guard && this.guardCooldown === 0) {
            this.isGuarding = true;
            this.currentAnimation = 'guard';
            this.vx *= 0.5;
        }
        
        // Attacks
        if (input.lightAttack && this.attackCooldown === 0) {
            this.performLightAttack();
        } else if (input.heavyAttack && this.attackCooldown === 0) {
            this.performHeavyAttack();
        } else if (input.special && this.specialCooldown === 0) {
            this.performSpecialAttack();
        }
    }
    
    performLightAttack() {
        this.isAttacking = true;
        this.attackCooldown = 20;
        this.currentAnimation = 'lightAttack';
        this.vx = 0;
        
        setTimeout(() => {
            this.isAttacking = false;
        }, 300);
    }
    
    performHeavyAttack() {
        this.isAttacking = true;
        this.attackCooldown = 40;
        this.currentAnimation = 'heavyAttack';
        this.vx = 0;
        
        setTimeout(() => {
            this.isAttacking = false;
        }, 500);
    }
    
    performSpecialAttack() {
        this.isAttacking = true;
        this.specialCooldown = 180; // 3 seconds at 60fps
        this.currentAnimation = 'special';
        this.vx = 0;
        
        // Special move effects based on character type
        if (this.type === 'warrior') {
            // Warrior's special: Charge attack
            this.vx = this.facingRight ? 8 : -8;
        } else if (this.type === 'ninja') {
            // Ninja's special: Teleport
            this.invulnerable = true;
            this.invulnerableTimer = 30;
        }
        
        setTimeout(() => {
            this.isAttacking = false;
        }, 800);
    }
    
    applyPhysics() {
        // Apply gravity
        if (!this.onGround) {
            this.vy += this.gravity;
        }
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Ground collision
        const groundY = window.innerHeight - 200; // Account for UI
        if (this.y + this.height >= groundY) {
            this.y = groundY - this.height;
            this.vy = 0;
            this.onGround = true;
        }
    }
    
    updateAnimation() {
        this.animationTimer++;
        if (this.animationTimer >= 10) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }
    }
    
    keepInBounds() {
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > window.innerWidth) {
            this.x = window.innerWidth - this.width;
        }
    }
    
    takeDamage(damage) {
        if (this.invulnerable) return;
        
        this.health -= damage;
        if (this.health < 0) this.health = 0;
        
        // Brief invulnerability
        this.invulnerable = true;
        this.invulnerableTimer = 30;
    }
    
    knockback(direction) {
        this.vx += direction * 5;
    }
    
    getHitBox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    getAttackBoxes() {
        if (!this.isAttacking) return [];
        
        const boxes = [];
        const range = this.currentAnimation === 'heavyAttack' ? 80 : 60;
        const damage = this.currentAnimation === 'heavyAttack' ? 25 : 
                      this.currentAnimation === 'special' ? 35 : 15;
        
        const attackX = this.facingRight ? this.x + this.width : this.x - range;
        
        boxes.push({
            x: attackX,
            y: this.y + 10,
            width: range,
            height: this.height - 20,
            damage: damage
        });
        
        return boxes;
    }
    
    render(ctx) {
        ctx.save();
        
        // Flicker effect when invulnerable
        if (this.invulnerable && Math.floor(this.invulnerableTimer / 5) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }
        
        // Flip sprite if facing left
        if (!this.facingRight) {
            ctx.scale(-1, 1);
            ctx.translate(-this.x * 2 - this.width, 0);
        }
        
        // Draw character based on type and animation
        this.drawCharacter(ctx);
        
        // Draw attack effects
        if (this.isAttacking) {
            this.drawAttackEffect(ctx);
        }
        
        ctx.restore();
    }
    
    drawCharacter(ctx) {
        const x = this.x;
        const y = this.y;
        
        // Character body
        ctx.fillStyle = this.color;
        ctx.fillRect(x + 15, y + 20, 20, 40);
        
        // Head
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(x + 17, y + 5, 16, 20);
        
        // Arms
        ctx.fillStyle = this.color;
        if (this.currentAnimation === 'lightAttack' || this.currentAnimation === 'heavyAttack') {
            ctx.fillRect(x + 35, y + 25, 15, 8); // Extended arm
        } else {
            ctx.fillRect(x + 10, y + 25, 8, 15);
            ctx.fillRect(x + 32, y + 25, 8, 15);
        }
        
        // Legs
        const legOffset = this.currentAnimation === 'walk' ? Math.sin(this.animationFrame) * 2 : 0;
        ctx.fillRect(x + 17, y + 60, 6, 20);
        ctx.fillRect(x + 27, y + 60 + legOffset, 6, 20);
        
        // Character-specific details
        if (this.type === 'warrior') {
            // Warrior helmet
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(x + 15, y + 3, 20, 10);
        } else if (this.type === 'ninja') {
            // Ninja mask
            ctx.fillStyle = '#2D1B69';
            ctx.fillRect(x + 15, y + 8, 20, 8);
        }
    }
    
    drawAttackEffect(ctx) {
        if (!this.isAttacking) return;
        
        const effectX = this.facingRight ? this.x + this.width : this.x - 60;
        const effectY = this.y + 20;
        
        ctx.fillStyle = this.currentAnimation === 'special' ? '#FFD700' : 
                       this.currentAnimation === 'heavyAttack' ? '#FF4444' : '#FFFFFF';
        ctx.globalAlpha = 0.7;
        
        // Draw attack effect
        ctx.beginPath();
        ctx.arc(effectX + 30, effectY + 20, 25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MobileFighter();
});

// Prevent context menu on touch
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);