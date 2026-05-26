var currentHero = 0;

var scenePilihHero = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "scenePilihHero" });
    // Add this property to the scene
    this.currentHero = currentHero;
  },
  init: function () {},
  preload: function () {
    this.load.setBaseURL("./Assets/");
    // Change these lines:
    this.load.image("BGPilihPesawat", "BGPilihPesawat.png"); // Was: images/BGPilihPesawat.png
    this.load.image("ButtonMenu", "ButtonMenu.png");     // Was: images/ButtonMenu.png
    this.load.image("ButtonNext", "ButtonNext.png");     // Was: images/ButtonNext.png
    this.load.image("ButtonPrev", "ButtonPrev.png");     // Was: images/ButtonPrev.png
    this.load.image("Pesawat1", "Pesawat1.png");         // Was: images/Pesawat1.png
    this.load.image("Pesawat2", "Pesawat2.png");         // Was: images/Pesawat2.png
    this.load.audio("snd_touchshooter", ["fx_touch.mp3", "fx_touch.ogg"]); 
  },
  create: function () {
     if (snd_touch == null){
      snd_touch = this.sound.add('snd_touchshooter');
    }
    this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, "BGPilihPesawat");
    var buttonMenu = this.add.image(50, 50, "ButtonMenu");
    var buttonNext = this.add.image(
      X_POSITION.CENTER + 250,
      Y_POSITION.CENTER,
      "ButtonNext"
    );
    var buttonPrevious = this.add.image(
      X_POSITION.CENTER - 250,
      Y_POSITION.CENTER,
      "ButtonPrev"
    );
    var heroShip = this.add.image(
      X_POSITION.CENTER,
      Y_POSITION.CENTER,
      "Pesawat" + (this.currentHero + 1)
    );

    buttonMenu.setInteractive();
    buttonNext.setInteractive();
    buttonPrevious.setInteractive();
    heroShip.setInteractive();

    this.input.on(
      "gameobjectover",
      function (pointer, gameObject) {
        if (gameObject == buttonMenu) {
          buttonMenu.setTint(0x999999);
        }
        if (gameObject == buttonNext) {
          buttonNext.setTint(0x999999);
        }
        if (gameObject == buttonPrevious) {
          buttonPrevious.setTint(0x999999);
        }
        if (gameObject == heroShip) {
          heroShip.setTint(0x999999);
        }
      },
      this
    );

    this.input.on(
      "gameobjectdown",
      function (pointer, gameObject) {
        if (gameObject == buttonMenu) {
          buttonMenu.setTint(0x999999);
        }
        if (gameObject == buttonNext) {
          buttonNext.setTint(0x999999);
        }
        if (gameObject == buttonPrevious) {
          buttonPrevious.setTint(0x999999);
        }
        if (gameObject == heroShip) {
          heroShip.setTint(0x999999);
        }
      },
      this
    );

    this.input.on(
      "gameobjectout",
      function (pointer, gameObject) {
        if (gameObject == buttonMenu) {
          buttonMenu.setTint(0xffffff);
        }
        if (gameObject == buttonNext) {
          buttonNext.setTint(0xffffff);
        }
        if (gameObject == buttonPrevious) {
          buttonPrevious.setTint(0xffffff);
        }
        if (gameObject == heroShip) {
          heroShip.setTint(0xffffff);
        }
      },
      this
    );

    this.input.on(
      "gameobjectup",
      function (pointer, gameObject) {
        if (gameObject == buttonMenu) {
          buttonMenu.setTint(0xffffff);
           snd_touch.play()
          this.scene.start("sceneMenu");
        }
        if (gameObject == buttonNext) {
          buttonNext.setTint(0xffffff);
           snd_touch.play()
          this.currentHero++;
          if (this.currentHero >= 2) {
            this.currentHero = 0;
          }
          currentHero = this.currentHero;
          heroShip.setTexture("Pesawat" + (this.currentHero + 1));
        }
        if (gameObject == buttonPrevious) {
          buttonPrevious.setTint(0xffffff);
           snd_touch.play()
          this.currentHero--;
          if (this.currentHero < 0) {
            this.currentHero = 1;
          }
          currentHero = this.currentHero;
          heroShip.setTexture("Pesawat" + (this.currentHero + 1));
        }
        if (gameObject == heroShip) {
          heroShip.setTint(0xffffff);
           snd_touch.play()
          this.scene.start("scenePlay");
        }
      },
      this
    );
  },
  update: function () {},
});