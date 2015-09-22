window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    game.disableVisibilityChange = true;

    var platforms;
    var player;
    var state;
    var bigStyle = { font: "65px Arial", fill: "#ffffff", align: "center" };
    var normalStyle = { font: "16px monospace", fill: "#ffffff", align: "center" };
    var enemies;
    var socket;

    RemotePlayer = function (index, game, player, startX, startY) {
        var x = startX;
        var y = startY;
        this.game = game;

        this.id = index.toString();
        this.player = this.game.add.sprite(32, this.game.world.height - 100, 'elephpant');
        this.alive = true;
        this.lastPosition = { x: x, y: y };

        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.bounce.y = 0;
        this.player.body.gravity.y = 300;

        this.player.anchor.setTo(.5,.5);

        this.player.animations.add('left', [0, 1, 2, 3, 4, 5], 20, true);
        this.player.animations.add('right', [0, 1, 2, 3, 4, 5], 20, true);
    };


    RemotePlayer.prototype.update = function() {
        //todo add animations here
        this.lastPosition.x = this.player.x;
        this.lastPosition.y = this.player.y;
    };

    function preload() {
        game.stage.disableVisibilityChange = true;
        game.load.image('sky', 'assets/sky.png');
        game.load.spritesheet('ground', 'assets/platform.png', 800, 64);
        game.load.spritesheet('elephpant', 'assets/elephpant.png', 130, 80);
    }

    function create() {
        socket = io.connect();

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

        enemies = [];

        player = game.add.sprite(32, game.world.height - 100, 'elephpant');

        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
        player.body.bounce.y = 0;
        player.body.gravity.y = 300;

        player.anchor.setTo(.5,.5);

        player.animations.add('left', [0, 1, 2, 3, 4, 5], 20, true);
        player.animations.add('right', [0, 1, 2, 3, 4, 5], 20, true);

        state = game.add.text(0, 0, 'idling', bigStyle);

        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        setEventHandlers();
    }

    var setEventHandlers = function() {
        // Socket connection successful
        socket.on("connect", onSocketConnected);
        // Socket disconnection
        socket.on("disconnect", onSocketDisconnect);
        // New player message received
        socket.on("new player", onNewPlayer);
        // Player move message received
        socket.on("move player", onMovePlayer);
        // Player removed message received
        socket.on("remove player", onRemovePlayer);
    };

    function onSocketConnected() {
        console.log("Connected to socket server");
        socket.emit("new player", {x: player.x, y:player.y});
    }

    function onSocketDisconnect() {
        console.log("Disconnected from socket server");
    }

    function onNewPlayer(data) {
        console.log("New player connected: "+data.id);
        enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y));
    }

    function onMovePlayer(data) {

        var movePlayer = playerById(data.id);
        if (!movePlayer) {
            console.log("Player not found: "+data.id);
            return;
        }
        movePlayer.player.x = data.x;
        movePlayer.player.y = data.y;
    }


    function onRemovePlayer(data) {
        var removePlayer = playerById(data.id);
        if (!removePlayer) {
            console.log("Player not found: "+data.id);
            return;
        }
        removePlayer.player.kill();
        enemies.splice(enemies.indexOf(removePlayer), 1);
    }


    function update() {

        for (var i = 0; i < enemies.length; i++)
        {
            if (enemies[i].alive)
            {
                enemies[i].update();
                game.physics.arcade.collide(enemies[i].player, platforms);
            }
        }

        game.physics.arcade.collide(player, platforms);
        player.body.velocity.x = 0;

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
        socket.emit("move player", {x: player.x, y:player.y});
    }

    function playerById(id) {
        var i;
        for (i = 0; i < enemies.length; i++) {
            if (enemies[i].id == id)
                return enemies[i];
        }
        return false;
    }
};