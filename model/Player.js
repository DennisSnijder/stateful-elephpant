var Player = function(startX, startY, name) {
    var x = startX,
        y = startY,
        playerName = name,
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

    return {
        getX: getX,
        setX: setX,
        getY: getY,
        setY: setY,
        getBulletDirection: getBulletDirection,
        setBulletDirection: setBulletDirection,
        getName: getName,
        setName: setName,
        id: id
    }
};

exports.Player = Player;