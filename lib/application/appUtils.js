module.exports.calculateGameID = function () {
    var currentDate = new Date();
    return "game_" + currentDate.getTime().toString();
}
