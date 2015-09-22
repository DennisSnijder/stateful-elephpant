window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    var platforms;
    var player;
    var state;
    var bigStyle = { font: "65px Arial", fill: "#ffffff", align: "center" };
    var normalStyle = { font: "16px monospace", fill: "#ffffff", align: "center" };
    var socket = io();
    var currentPlayers = [];

    function preload() {
        game.load.image('sky', 'assets/sky.png');
        game.load.spritesheet('ground', 'assets/platform.png', 800, 64);
        game.load.spritesheet('elephpant', 'assets/elephpant.png', 130, 80);
    }

    function create() {
        game.stage.smoothed = true;

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;

        var sky = game.add.sprite(0, 0, 'sky');
        sky.fixedToCamera = true;

        platforms = game.add.group();

        platforms.enableBody = true;

        var ground = platforms.create(0, game.world.height - 64, 'ground');
        ground.width = 800;
        ground.height = 64;
        ground.body.immovable = true;

        player = createPlayer();

        socket.on("addPlayer", function(data) {
            currentPlayers.push({
                gamePlayer: createPlayer(),
                info: data
            });

            console.log(currentPlayers);
        });

        state = game.add.text(0, 0, 'idling', bigStyle);

        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        socket.emit('register', 'player');
    }


    function createPlayer() {
        var newPlayer = game.add.sprite(32, game.world.height - 100, 'elephpant');

        game.physics.arcade.enable(newPlayer);

        newPlayer.body.collideWorldBounds = true;
        newPlayer.body.bounce.y = 0;
        newPlayer.body.gravity.y = 300;

        newPlayer.anchor.setTo(.5,.5);

        newPlayer.animations.add('left', [0, 1, 2, 3, 4, 5], 20, true);
        newPlayer.animations.add('right', [0, 1, 2, 3, 4, 5], 20, true);

        return newPlayer;
    }

    function update() {
        game.physics.arcade.collide(player, platforms);

        player.body.velocity.x = 0;
        updatePlayerMovement();


        socket.on('newPlayer', function(data){
            currentPlayers.push(data);
        });


        if (cursors.left.isDown) {

            player.body.velocity.x = -150;
            player.scale.x = 1;

            player.animations.play('left');


            if (player.body.touching.down) {
                state.text = 'running';
            }

        } else if (cursors.right.isDown) {

            player.body.velocity.x = 150;
            player.scale.x = -1;

            player.animations.play('right');

            if (player.body.touching.down) {
                state.text = 'running';
            }
        } else {
            player.animations.stop();
            player.frame = 2;

            if (player.body.touching.down) {
                state.text = 'idling';
            }
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && player.body.touching.down)
        {
            player.body.velocity.y = -350;
            state.text = 'jumping';
        }

        if (cursors.down.isDown && player.body.touching.down) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            player.frame = 6;

            state.text = 'crouching';

            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                var text = game.add.text(player.body.x, player.body.y + 60, 'var_dump($this);', normalStyle);
            }
        }
    }


    function updatePlayerMovement() {
        socket.emit('updateMovement', {
            x : player.body.x,
            y: player.body.y
        });
    }
};