class lvl1 extends Phaser.Scene {
  map;
  player;
  playerStartPoint;
  cursors;
  inPlay = false;

  constructor(config) {
    super("lvl1");
  }
  preload() {
    // images

    // background image
    this.load.image("background", "assets/platform_metroidvania/tiles_and_background_foreground/background.png");
    this.load.image("tiles", "assets/platform_metroidvania/tiles_and_background_foreground/tileset.png");

    // tile data
    this.load.tilemapTiledJSON("forest_map", "assets/forest_level1.json");

    // spritesheet
    // player
    this.load.spritesheet("player", "assets/platform_metroidvania/herochar_sprites/herochar_spritesheet(new).png", {
      frameWidth: 16,
      frameHeight: 16
    })

  }

  create() {
    this.add.image(120, 80, "background").setScrollFactor(0, 0);
    this.map = this.make.tilemap({ key: "forest_map" });
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    let tiles = this.map.addTilesetImage("forest_and_cave_tiles", "tiles");
    this.map.createStaticLayer("midgroundLayer", [tiles], 0, 0)
    let collisionLayer = this.map.createStaticLayer("collisionLayer", [tiles], 0, 0);
    collisionLayer.setCollisionBetween(1, 1000);
    // player 
    this.playerStartPoint = lvl1.FindPoint(this.map, "objectLayer", "player", "playerSpawn");
    this.player = this.physics.add.sprite(this.playerStartPoint.x, this.playerStartPoint.y, "player");
    this.player.jumpCount = 0;
    this.player.body.setSize(10, 15, true);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, collisionLayer)

    // animations
    // idle animation
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", {
        start: 40,
        end: 43
      }),
      frameRate: 12,
      repeat: -1
    });
    // test to see the idle animation
    // this.player.anims.play("idle", true);

    //movement animation
    this.anims.create({
      key: "playerMovement",
      frames: this.anims.generateFrameNumbers("player", {
        start: 8,
        end: 13
      }),
      frameRate: 12,
      repeat: -1
    });
    // test to see the moving animation
    // this.player.anims.play("moving", true);
    // jump animation
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player", {
        start: 56,
        end: 58
      }),
      frameRate: 12,
      repeat: -1
    });

    // controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // camera
    let camera = this.cameras.getCamera("");
    camera.startFollow(this.player);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

    // Start Game
    this.input.on("pointerdown", this.startGame, this);

  }



  update() {
    if (this.inPlay) {
      // movement and anims left and right
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-120);
        if (this.player.body.blocked.down) {
          this.player.anims.play("playerMovement", true);
        } else {
          this.player.anims.play("jump", true);
        }
        this.player.flipX = true
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(120);
        if (this.player.body.blocked.down) {
          this.player.anims.play("playerMovement", true);
        } else {
          this.player.anims.play("jump", true);
        }
        this.player.flipX = false
      } else {
        if (this.player.body.blocked.down) {
          this.player.setVelocityX(0);
          this.player.anims.play("idle", true);
        } else {
          this.player.setVelocityX(0);
          this.player.anims.play("jump", true)
        }

      }
      // jump mechanic
      if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.player.jumpCount < 2) {
        this.player.jumpCount++;
        this.player.setVelocityY(-155);
      } else if (this.player.body.blocked.down) {
        this.player.jumpCount = 0;
      }
    }
  }
  startGame() {
    this.inPlay = true;
  }

  static FindPoint(map, layer, type, name) {
    var loc = map.findObject(layer, function (object) {
      if (object.type === type && object.name === name) {
        return object;
      }
    });
    return loc
  }
  static FindPoints(map, layer, type) {
    var locs = map.filterObjects(layer, function (object) {
      if (object.type === type) {
        return object
      }
    });
    return locs

  }

} 