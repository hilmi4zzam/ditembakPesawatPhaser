var sceneGameOver = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "sceneGameOver" });
  },
  init: function () {},
  preload: function () {
    this.load.setBaseURL("./Assets/");
    // Change these lines:
    this.load.image("BGPlay", "BGPlay.png"); // Was: images/BGPlay.png
    this.load.image("ButtonPlay", "ButtonPlay.png"); // Was: images/ButtonPlay.png
    this.load.audio("snd_gameover", ["music_gameover.mp3", "music_gameover.ogg"]); 
    this.load.audio("snd_touchshooter", ["fx_touch.mp3", "fx_touch.ogg"]); 
  },
  create: function () {
    // Check if gameSettings exists, if not create default values
    if (typeof gameSettings === "undefined") {
      window.gameSettings = {
        isMusicOn: true,
        isSoundOn: true,
        currentMusic: null,
        highScore: 0,
        lastScore: 0,
      };
    }

    if (gameSettings.isMusicOn) {
      gameSettings.currentMusic = this.sound.add("snd_gameover", {
        volume: 0.5,
        loop: true,
      });
      gameSettings.currentMusic.play();
    }

    if (snd_touch == null) {
      snd_touch = this.sound.add("snd_touchshooter");
    }

    this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, "BGPlay");

    let gameOverText = this.add.text(
      X_POSITION.CENTER,
      Y_POSITION.CENTER - 100,
      "Game Over",
      {
        fontFamily: "Verdana, Arial",
        fontSize: "70px",
        fontWeight: "bold",
        color: "#ff0000",
        stroke: "#ffffff",
        strokeThickness: 6,
        align: "center",
      }
    );
    gameOverText.setOrigin(0.5);
    gameOverText.setShadow(2, 2, "#000000", 2, true, true);

    let highScoreText = this.add.text(
      X_POSITION.CENTER,
      Y_POSITION.CENTER - 20,
      "High Score: " + gameSettings.highScore,
      {
        fontFamily: "Verdana, Arial",
        fontSize: "40px",
        fontWeight: "bold",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      }
    );
    highScoreText.setOrigin(0.5);
    highScoreText.setShadow(2, 2, "#000000", 2, true, true);

    let scoreText = this.add.text(
      X_POSITION.CENTER,
      Y_POSITION.CENTER + 50,
      "Score: " + gameSettings.lastScore,
      {
        fontFamily: "Verdana, Arial",
        fontSize: "40px",
        fontWeight: "bold",
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      }
    );
    scoreText.setOrigin(0.5);
    scoreText.setShadow(2, 2, "#000000", 2, true, true);

    var buttonPlay = this.add.image(
      X_POSITION.CENTER,
      Y_POSITION.CENTER + 150,
      "ButtonPlay"
    );
    buttonPlay.setInteractive();

    // Handle hover effects using global handlers (same as sceneMenu)
    this.input.on(
      "gameobjectover",
      function (pointer, gameObject) {
        gameObject.setTint(0x999999);
      },
      this
    );
    
    this.input.on(
      "gameobjectout",
      function (pointer, gameObject) {
        gameObject.setTint(0xffffff);
      },
      this
    );
    
    // Handle button click
    this.input.on(
      "gameobjectup",
      function (pointer, gameObject) {
        gameObject.setTint(0xffffff);
        
        if (gameObject === buttonPlay) {
          if (gameSettings.isSoundOn) {
            snd_touch.play();
          }
          
          if (gameSettings.currentMusic) {
            gameSettings.currentMusic.stop();
            gameSettings.currentMusic = null;
          }
          
          this.scene.start("sceneMenu");
        }
      },
      this
    );

  },
  update: function () {},
});