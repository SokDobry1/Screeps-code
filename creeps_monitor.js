var CARRYER_COUNT = 4
var BUILDER_COUNT = 2
var REPAIRER_COUNT = 1
var EXCAVATOR_COUNT = 2

//var CARRYER_BODY = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
//var BUILDER_BODY = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
//var REPAIRER_BODY = [MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
//var EXCAVATOR_BODY = [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]

// MOVE - 50, WORK - 100, CARRY - 50
var CARRYER_BODY = [WORK,WORK,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY]
var BUILDER_BODY = [WORK,WORK,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY]
var REPAIRER_BODY = [WORK,WORK,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY]
var EXCAVATOR_BODY = [WORK,WORK,WORK,WORK,MOVE,CARRY,CARRY]

var queue = []

var day_X = function(Game){
    queue = []
    for (let i = 0; i < CARRYER_COUNT; i++){
        if (!Game.creeps["carryer"+i]){
            if (queue.find(item => item == "carryer"+i) == undefined){
                var obj = {
                    name: "carryer"+i,
                    body: [MOVE,MOVE,WORK,CARRY,CARRY],
                    memory: {
                        role: "carryer",
                        task: "fill_bag"
                    }
                }
                queue.push(obj);
            }
        }
    }
}

var main = {
    run: function(Game){
        for (let i = 0; i < REPAIRER_COUNT; i++){
            if (!Game.creeps["repairer"+i]){
                if (queue.find(item => item == "repairer"+i) == undefined){
                    var obj = {
                        name: "repairer"+i,
                        body: REPAIRER_BODY,
                        memory: {
                            role: "repairer",
                            task: "fill_bag"
                        }
                    }
                    queue.push(obj);
                }
            }
        }

        for (let i = 0; i < BUILDER_COUNT; i++){
            if (!Game.creeps["builder"+i]){
                if (queue.find(item => item == "builder"+i) == undefined){
                    var obj = {
                        name: "builder"+i,
                        body: BUILDER_BODY,
                        memory: {
                            role: "builder",
                            task: "fill_bag"
                        }
                    }
                    queue.push(obj);
                }
            }
        }

        for (let i = 0; i < EXCAVATOR_COUNT; i++){
            if (!Game.creeps["excavator"+i]){
                if (queue.find(item => item == "excavator"+i) == undefined){
                    let sources = Game.spawns.Spawn1.room.find(FIND_SOURCES)
                    let n = sources.length

                    var obj = {
                        name: "excavator"+i,
                        body: EXCAVATOR_BODY,
                        memory: {
                            role: "excavator",
                            task: "dig",
                            source: sources[i % n].id,
                        }
                    }
                    queue.push(obj);
                }
            }
        }

        var dead_hand = true;        
        for (let i = 0; i < CARRYER_COUNT; i++){
            if (!Game.creeps["carryer"+i]){
                if (queue.find(item => item == "carryer"+i) == undefined){
                    var obj = {
                        name: "carryer"+i,
                        body: CARRYER_BODY,
                        memory: {
                            role: "carryer",
                            task: "fill_bag"
                        }
                    }
                    queue.push(obj);
                }
            } else {dead_hand = false}
        }

        var spawn = Game.spawns.Spawn1

        if (dead_hand) day_X(Game);

        if (queue.length != 0){
            let obj = queue[queue.length-1]
            let stat = spawn.createCreep(obj.body, obj.name, obj.memory);
            if (stat == obj) queue.pop()
        }
    }
}

module.exports = main;