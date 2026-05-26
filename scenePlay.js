var scenePlay = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "scenePlay" });
  },
  init: function () {
    // Get the current hero from the global variable
    this.selectedHero = currentHero;
  },
  preload: function () {
    this.load.setBaseURL("./Assets/");
    // Change these lines:
    this.load.image("BG1", "BG1.png");           // Was: images/BG1.png
    this.load.image("BG2", "BG2.png");           // Was: images/BG2.png
    this.load.image("BG3", "BG3.png");           // Was: images/BG3.png
    this.load.image("GroundTransisi", "Transisi.png"); // Was: images/Transisi.png
    this.load.image("Pesawat1", "Pesawat1.png");       // Was: images/Pesawat1.png
    this.load.image("Pesawat2", "Pesawat2.png");       // Was: images/Pesawat2.png
    this.load.image("Peluru", "Peluru.png");         // Was: images/Peluru.png
    this.load.spritesheet("EfekLedakan", "EfekLedakan.png", { // Was: images/EfekLedakan.png
      frameWidth: 192,
      frameHeight: 192,
    });
    this.load.image("cloud", "cloud.png");           // Was: images/cloud.png
    this.load.image("Musuh1", "Musuh1.png");         // Was: images/Musuh1.png
    this.load.image("Musuh2", "Musuh2.png");         // Was: images/Musuh2.png
    this.load.image("Musuh3", "Musuh3.png");         // Was: images/Musuh3.png
    this.load.image("MusuhBos", "MusuhBos.png");     // Was: images/MusuhBos.png
    this.load.audio("snd_shoot", ["fx_shoot.mp3", "fx_shoot.ogg"]);
    this.load.audio("snd_explode", ["fx_explode.mp3", "fx_explode.ogg"]);
    this.load.audio("snd_play", "music_play.mp3"); 
  },
  create: function () {
    // Initialize high score system if it doesn't exist
    if (typeof gameSettings === 'undefined') {
      window.gameSettings = {
        isMusicOn: true,
        isSoundOn: true,
        currentMusic: null,
        highScore: 0
      };
    } else if (typeof gameSettings.highScore === 'undefined') {
      gameSettings.highScore = 0;
    }
    
    // Set gameOver flag to false at start
    this.gameOver = false;
    
    // Stop any existing music when entering play scene
    if (gameSettings.currentMusic) {
      gameSettings.currentMusic.stop();
      gameSettings.currentMusic = null;
    }
    
    // Create new game music
    gameSettings.currentMusic = this.sound.add('snd_play', {
      volume: 0.5,
      loop: true
    });
    
    // Play the game music if enabled
    if (gameSettings.isMusicOn) {
      gameSettings.currentMusic.play();
    }
    
    // Initialize sound effects
    this.shootSound = this.sound.add('snd_shoot');
    this.explosionSound = this.sound.add('snd_explode');

    // Create the explosion animation once at scene creation
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('EfekLedakan', { 
        start: 0, 
        end: 6 
      }),
      frameRate: 15,
      repeat: 0,
      hideOnComplete: true
    });
    
    this.lastBgIndex = Phaser.Math.Between(1, 3);
    this.bgBottomSize = { width: 768, height: 1664 };
    this.arrBgBottom = [];
    this.createBGBottom = function (xPos, yPos) {
      let bgBottom = this.add.image(xPos, yPos, "BG" + this.lastBgIndex);
      bgBottom.setData("kecepatan", 3);
      bgBottom.setDepth(1);
      bgBottom.flipX = Phaser.Math.Between(0, 1);
      this.arrBgBottom.push(bgBottom);
      let newBgIndex = Phaser.Math.Between(1, 3);
      if (newBgIndex !== this.lastBgIndex) {
        let bgBottomAddition = this.add.image(
          xPos,
          yPos - this.bgBottomSize.height / 2,
          "GroundTransisi"
        );
        bgBottomAddition.setData("kecepatan", 3);
        bgBottomAddition.setData("tambahan", true);
        bgBottomAddition.setDepth(2);
        bgBottomAddition.flipX = Phaser.Math.Between(0, 1);
        this.arrBgBottom.push(bgBottomAddition);
      }
      this.lastBgIndex = newBgIndex;
    };

    this.addBGBottom = function () {
      if (this.arrBgBottom.length > 0) {
        let lastBG = this.arrBgBottom[this.arrBgBottom.length - 1];
        if (lastBG.getData("tambahan")) {
          lastBG = this.arrBgBottom[this.arrBgBottom.length - 2];
        }
        this.createBGBottom(
          game.canvas.width / 2,
          lastBG.y - this.bgBottomSize.height
        );
      } else {
        this.createBGBottom(
          game.canvas.width / 2,
          game.canvas.height - this.bgBottomSize.height / 2
        );
      }
    };

    this.addBGBottom();
    this.addBGBottom();
    this.addBGBottom();

    this.bgCloudSize = { width: 768, height: 1962 };
    this.arrBgTop = [];
    this.createBgTop = function (xPos, yPos) {
      var bgTop = this.add.image(xPos, yPos, "cloud");
      bgTop.setData("kecepatan", 6);
      bgTop.setDepth(5);
      bgTop.flipX = Phaser.Math.Between(0, 1);
      bgTop.setAlpha(Phaser.Math.Between(4, 7) / 10);
      this.arrBgTop.push(bgTop);
    };
    this.addBgTop = function () {
      if (this.arrBgTop.length > 0) {
        let lastBG = this.arrBgTop[this.arrBgTop.length - 1];
        this.createBgTop(
          game.canvas.width / 2,
          lastBG.y - this.bgCloudSize.height * Phaser.Math.Between(1, 4)
        );
      } else {
        this.createBgTop(game.canvas.width / 2, -this.bgCloudSize.height);
      }
    };
    this.addBgTop();

    this.scoreLabel = this.add.text(
      X_POSITION.CENTER,
      Y_POSITION.TOP + 80,
      "0",
      {
        fontFamily: "Verdana, Arial",
        fontSize: "70px",
        color: "#ffffff",
        stroke: "#5c5c5c",
        strokeThickness: 2,
      }
    );
    this.scoreLabel.setOrigin(0.5);
    this.scoreLabel.setDepth(100);

    this.heroShip = this.add.image(
      X_POSITION.CENTER,
      Y_POSITION.BOTTOM - 200,
      "Pesawat" + (this.selectedHero + 1)
    );
    this.heroShip.setDepth(4);
    this.heroShip.setScale(0.35);
    this.cursorKeyListener = this.input.keyboard.createCursorKeys();

    this.input.on(
      "pointermove",
      function (pointer, currentlyOver) {
        // Only process movement if the game is not over
        if (this.gameOver) return;
        
        let movementX = this.heroShip.x;
        let movementY = this.heroShip.y;

        if (pointer.x > 70 && pointer.x < X_POSITION.RIGHT - 70) {
          movementX = pointer.x;
        } else {
          if (pointer.x <= 70) {
            movementX = 70;
          } else {
            movementX = X_POSITION.RIGHT - 70;
          }
        }

        if (pointer.y > 70 && pointer.y < Y_POSITION.BOTTOM - 70) {
          movementY = pointer.y;
        } else {
          if (pointer.y <= 70) {
            movementY = 70;
          } else {
            movementY = Y_POSITION.BOTTOM - 70;
          }
        }

        let a = this.heroShip.x - movementX;
        let b = this.heroShip.y - movementY;

        let durationToMove = Math.sqrt(a * a + b * b) * 0.8;

        this.tweens.add({
          targets: this.heroShip,
          x: movementX,
          y: movementY,
          duration: durationToMove,
        });
      },
      this
    );

    let pointA = [];
    pointA.push(new Phaser.Math.Vector2(-200, 100));
    pointA.push(new Phaser.Math.Vector2(250, 200));
    pointA.push(new Phaser.Math.Vector2(200, (Y_POSITION.BOTTOM + 200) / 2));
    pointA.push(new Phaser.Math.Vector2(200, Y_POSITION.BOTTOM + 200));

    // Menambahkan beberapa titik posisi untuk membuat pola kanan A
    let pointB = [];
    pointB.push(new Phaser.Math.Vector2(900, 100));
    pointB.push(new Phaser.Math.Vector2(550, 200));
    pointB.push(new Phaser.Math.Vector2(500, (Y_POSITION.BOTTOM + 200) / 2));
    pointB.push(new Phaser.Math.Vector2(500, Y_POSITION.BOTTOM + 200));

    // Menambahkan beberapa titik posisi untuk membuat pola kanan B
    let pointC = [];
    pointC.push(new Phaser.Math.Vector2(900, 100));
    pointC.push(new Phaser.Math.Vector2(550, 200));
    pointC.push(new Phaser.Math.Vector2(400, (Y_POSITION.BOTTOM + 200) / 2));
    pointC.push(new Phaser.Math.Vector2(0, Y_POSITION.BOTTOM + 200));

    // Menambahkan beberapa titik posisi untuk membuat pola kiri B
    let pointD = [];
    pointD.push(new Phaser.Math.Vector2(-200, 100));
    pointD.push(new Phaser.Math.Vector2(550, 200));
    pointD.push(new Phaser.Math.Vector2(650, (Y_POSITION.BOTTOM + 200) / 2));
    pointD.push(new Phaser.Math.Vector2(0, Y_POSITION.BOTTOM + 200));

    // Menampung pola-pola yang sudah ditambahkan ke dalam sebuah array bernama "points"
    var points = [];
    points.push(pointA);
    points.push(pointB);
    points.push(pointC);
    points.push(pointD);

    this.arrEnemies = [];

    var Enemy = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
      initialize: function Enemy(scene, idxPath) {
        Phaser.GameObjects.Image.call(this, scene);
        this.setTexture("Musuh" + Phaser.Math.Between(1, 3));
        this.setDepth(4);
        this.setScale(0.35);
        this.curve = new Phaser.Curves.Spline(points[idxPath]);

        let lastEnemyCreated = this;
        this.path = { t: 0, vec: new Phaser.Math.Vector2() };
        scene.tweens.add({
          targets: this.path,
          t: 1,
          duration: 3000,
          onComplete: function () {
            if (lastEnemyCreated) {
              lastEnemyCreated.setActive(false);
            }
          },
        });
      },
      move: function () {
        this.curve.getPoint(this.path.t, this.path.vec);
        this.x = this.path.vec.x;
        this.y = this.path.vec.y;
      },
    });
    
    // Store enemy spawn event to be able to stop it on game over
    this.enemySpawnEvent = this.time.addEvent({
      delay: 250,
      callback: function () {
        if (this.arrEnemies.length < 3 && !this.gameOver) {
          this.arrEnemies.push(
            this.children.add(
              new Enemy(this, Phaser.Math.Between(0, points.length - 1))
            )
          );
        }
      },
      callbackScope: this,
      loop: true,
    });

    var Bullet = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
      initialize: function Bullet(scene, x, y) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, "Peluru");
        this.setDepth(3);
        this.setPosition(x, y);
        this.setScale(0.5);
        this.speed = Phaser.Math.GetSpeed(20000, 1);
      },

      move: function () {
        this.y -= this.speed;
        if (this.y < -50) {
          this.setActive(false);
        }
      },
    });

    this.arrBullets = [];

    // Store bullet firing event to be able to stop it on game over
    this.bulletFireEvent = this.time.addEvent({
      delay: 250,
      callback: function () {
        if (!this.gameOver) {
          let bullet = this.children.add(
            new Bullet(this, this.heroShip.x, this.heroShip.y - 30)
          );
          this.arrBullets.push(bullet);
          
          // Play shooting sound if sound is enabled
          if (gameSettings.isSoundOn) {
            this.shootSound.play();
          }
        }
      },
      callbackScope: this,
      loop: true,
    });

    this.scoreValue = 0;

    this.impactExplosion = function(x, y) {
      // Create explosion sprite at the point of impact
      let explosion = this.add.sprite(x, y, 'EfekLedakan');
      explosion.setDepth(10);
      
      explosion.setScale(0.5); 
      
      explosion.setOrigin(0.5, 0.5);
      
      explosion.play('explode');
      
      // Play explosion sound if sound is enabled
      if (gameSettings.isSoundOn) {
        this.explosionSound.play();
      }
      
      explosion.on('animationcomplete', function() {
        explosion.destroy();
      });
    };
    
    // Add game over function
    this.handleGameOver = function() {
      if (this.gameOver) return; // Only process once
      
      this.gameOver = true;
      
      // Stop event timers
      this.enemySpawnEvent.remove();
      this.bulletFireEvent.remove();
      
      // Create explosion at player position
      this.impactExplosion(this.heroShip.x, this.heroShip.y);
      
      // Hide player ship
      this.heroShip.setVisible(false);
      
      // Update high score if needed
      if (this.scoreValue > gameSettings.highScore) {
        gameSettings.highScore = this.scoreValue;
      }
      
      // Store current score for game over screen
      gameSettings.lastScore = this.scoreValue;
      
      // Wait a moment before transitioning to game over scene
      this.time.delayedCall(1500, function() {
        // Stop music
        if (gameSettings.currentMusic) {
          gameSettings.currentMusic.stop();
          gameSettings.currentMusic = null;
        }
        
        // Switch to game over scene
        this.scene.start("sceneGameOver");
      }, [], this);
    };
  },
  update: function () {
    // Don't update if game is over
    if (this.gameOver) return;
    
    for (let i = 0; i < this.arrBgBottom.length; i++) {
      this.arrBgBottom[i].y += this.arrBgBottom[i].getData("kecepatan");
      if (
        this.arrBgBottom[i].y >
        game.canvas.height + this.bgBottomSize.height / 2
      ) {
        this.addBGBottom();
        this.arrBgBottom[i].destroy();
        this.arrBgBottom.splice(i, 1);
        break;
      }
    }

    for (let i = 0; i < this.arrBgTop.length; i++) {
      this.arrBgTop[i].y += this.arrBgTop[i].getData("kecepatan");
      if (
        this.arrBgTop[i].y >
        game.canvas.height + this.bgCloudSize.height / 2
      ) {
        this.arrBgTop[i].destroy();
        this.arrBgTop.splice(i, 1);
        this.addBgTop();
        break;
      }
    }

    if (this.cursorKeyListener.left.isDown && this.heroShip.x > 70) {
      this.heroShip.x -= 7;
    }
    if (
      this.cursorKeyListener.right.isDown &&
      this.heroShip.x < X_POSITION.RIGHT - 70
    ) {
      this.heroShip.x += 7;
    }
    if (this.cursorKeyListener.up.isDown && this.heroShip.y > 70) {
      this.heroShip.y -= 7;
    }
    if (
      this.cursorKeyListener.down.isDown &&
      this.heroShip.y < Y_POSITION.BOTTOM - 70
    ) {
      this.heroShip.y += 7;
    }

    for (let i = 0; i < this.arrEnemies.length; i++) {
      this.arrEnemies[i].move();
      
      // Check for collision between player and enemies
      if (Phaser.Geom.Intersects.RectangleToRectangle(
          this.heroShip.getBounds(),
          this.arrEnemies[i].getBounds()
      )) {
        this.handleGameOver();
        return; // Exit early since game is over
      }
    }

    for (let i = 0; i < this.arrEnemies.length; i++) {
      if (!this.arrEnemies[i].active) {
        this.arrEnemies[i].destroy();
        this.arrEnemies.splice(i, 1);
        break;
      }
    }

    for (let i = 0; i < this.arrBullets.length; i++) {
      this.arrBullets[i].move();
    }

    for (let i = 0; i < this.arrBullets.length; i++) {
      if (!this.arrBullets[i].active) {
        this.arrBullets[i].destroy();
        this.arrBullets.splice(i, 1);
        break;
      }
    }

    for (let i = 0; i < this.arrEnemies.length; i++) {
      for (let j = 0; j < this.arrBullets.length; j++) {
        if (
          this.arrEnemies[i]
            .getBounds()
            .contains(this.arrBullets[j].x, this.arrBullets[j].y)
        ) {
          this.arrEnemies[i].setActive(false);
          this.arrBullets[j].setActive(false);
          this.scoreValue++;
          this.scoreLabel.setText(this.scoreValue);

          // Create explosion at the enemy position for better visual effect
          this.impactExplosion(this.arrEnemies[i].x, this.arrEnemies[i].y);
          break;
        }
      }
    }
  },
});