var monitor = require("creeps_monitor");
var logistics = require("logistics");
//console.log("1")

module.exports.loop = function () {
    monitor.run(Game);
    logistics.run(Game);

    var structs = Game.structures
    for (let i in structs){
        if (structs[i].structureType == "tower"){
            var tower = structs[i]
            var enemy = tower.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
            if (enemy != undefined){
                tower.attack(enemy)
            }else {
                var DISALLOWED_REPAIR_CONSTRUCTIONS = ["constructedWall", "rampart"]
                let broken_struct = tower.pos.findClosestByPath(FIND_STRUCTURES, 
                    {filter: s => s.hits < s.hitsMax &&
                    !DISALLOWED_REPAIR_CONSTRUCTIONS.find(f => f == s.structureType)});
                tower.repair(broken_struct)
            }
        }
    }
}