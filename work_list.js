var ALLOWED_FILL_CONSTRUCTIONS_CARRYER = ["spawn", "extension"]
var ALLOWED_FILL_CONSTRUCTIONS_REPAIRER = ["tower"]
var DISALLOWED_REPAIR_CONSTRUCTIONS = ["constructedWall", "rampart"]

var fill_bag = function(creep){
    const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                       i.store[RESOURCE_ENERGY] >= creep.carryCapacity  });      
    
    if (container != undefined){
        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(container)
        } else {
            creep.memory.task = "none"
        }
    } else {
        var sources = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: s => s.energy})        
        if (creep.carry.energy < creep.carryCapacity && sources){
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
             creep.moveTo(sources);
            }
        }else{
            creep.memory.task = "none";
        }
    }
}



var work = {
    carryer: {
        fill_bag: fill_bag,

        fill: function(creep){
            var struct = creep.memory.target

            if (!struct) struct = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => ALLOWED_FILL_CONSTRUCTIONS_CARRYER.find(f => f == s.structureType) &&
                    s.energy < s.energyCapacity})

            if (struct){
                if (creep.transfer(struct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(struct)
            } else {
                creep.memory.task = "none"
            }
        },

        charge_controller: function(creep){
            var controller = creep.room.controller
            creep.upgradeController(controller)
            creep.moveTo(controller);
        },

        pickup: function(creep){
            var resource = creep.memory.target

            if (!resource) resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

            if (resource && creep.carry.energy < creep.carryCapacity){
                if (creep.pickup(resource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(resource)
            } else {
                creep.memory.task = "none"
            }
        }
    },

    repairer: {
        fill_bag: fill_bag,

        repair: function(creep){
            var struct = creep.memory.target
            if (!struct) struct = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                                    {filter: s => s.hits < s.hitsMax &&
                                    !DISALLOWED_REPAIR_CONSTRUCTIONS.find(f => f == s.structureType)});
            
            if (struct){
                if (creep.repair(struct) == ERR_NOT_IN_RANGE)
                    creep.moveTo(struct);
            } else {
                creep.memory.task = "none"
            }
        },

        repair_wall: function(creep){
            var struct = creep.memory.target
            if (!struct) struct = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                                    {filter: s => s.hits < 50000 &&
                                    DISALLOWED_REPAIR_CONSTRUCTIONS.find(f => f == s.structureType)});      
            if (struct){
                if (creep.repair(struct) == ERR_NOT_IN_RANGE){
                    creep.moveTo(struct);
                }
            } else {
                creep.memory.task = "none"
            }
        },

        fill: function(creep){
            var struct = creep.memory.target

            if (!struct) struct = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => ALLOWED_FILL_CONSTRUCTIONS_REPAIRER.find(f => f == s.structureType) &&
                    s.energy < s.energyCapacity})

            if (struct){
                if (creep.transfer(struct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(struct)
            } else {
                creep.memory.task = "none"
            }
        },

        wait: function(creep){
            creep.moveTo(Game.flags.BuilderBase);
            creep.memory.task = "none"
        }
    },

    builder: {
        fill_bag: fill_bag,

        build: function(creep){
            var site = creep.memory.target
            if (!site) site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            
            if (site){
                if (creep.build(site) == ERR_NOT_IN_RANGE)
                    creep.moveTo(site);
            }
            else{
                creep.memory.task = "none"
            }
        },

        wait: function(creep){
            creep.moveTo(Game.flags.BuilderBase);
            creep.memory.task = "none"
        }
    },

    excavator: {
        dig: function(creep){
            var sources = Game.getObjectById(creep.memory.source)  
            if (creep.carry.energy < creep.carryCapacity){
                if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources);
                }
            } else{
                creep.memory.task = "none";
            }
        },

        transport: function(creep){
            const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                               i.store[RESOURCE_ENERGY] < i.storeCapacity  });

            if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(container)
            } else {
                creep.memory.task = "none"
            }
        }
    },

    updater: {
        fill_bag: function(creep){
            const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (i) => i.structureType == STRUCTURE_STORAGE});      
            
            if (storage != undefined){
                if (storage.store[RESOURCE_ENERGY] > 0){
                    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(storage)
                    } else {
                        creep.memory.task = "none"
                    }
                }
            }
        },

        charge_controller: function(creep){
            var controller = creep.room.controller
            creep.upgradeController(controller)
            creep.moveTo(controller);
        },
    }
}

module.exports = work;