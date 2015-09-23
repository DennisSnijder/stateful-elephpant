var Player = function(startX, startY, name) {
    var x = startX,
        y = startY,
        playerName = name,
        bulletDirection,
        animation,
        id;

    var getX = function() {
        return x;
    };

    var setX = function(newX) {
        x = newX;
    };

    var getY = function() {
        return y;
    };

    var setY = function(newY) {
        y = newY;
    };

    var getBulletDirection = function() {
        return bulletDirection;
    };

    var setBulletDirection = function(direction) {
        bulletDirection = direction;
    };

    var getName = function() {
        return playerName;
    };

    var setName = function(name) {
        playerName = name;
    };

    var getAnimation = function() {
        return animation;
    };

    var setAnimation = function(newAnim) {
        animation = newAnim;
    };

    return {
        getX: getX,
        setX: setX,
        getY: getY,
        setY: setY,
        getBulletDirection: getBulletDirection,
        setBulletDirection: setBulletDirection,
        getName: getName,
        setName: setName,
        getAnimation: getAnimation,
        setAnimation: setAnimation,
        id: id
    }
};

exports.Player = Player;