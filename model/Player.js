var Player = function(startX, startY) {
    var x = startX,
        y = startY,
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

    return {
        getX: getX,
        setX: setX,
        getY: getY,
        setY: setY,
        getBulletDirection: getBulletDirection,
        setBulletDirection: setBulletDirection,
        id: id
    }
};

exports.Player = Player;