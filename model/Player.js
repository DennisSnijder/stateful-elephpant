var Player = function(startX, startY) {
    var x = startX,
        y = startY,
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
        getAnimation: getAnimation,
        setAnimation: setAnimation,
        id: id
    }
};

exports.Player = Player;