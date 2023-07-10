var works = require("work_list");
const { carryer } = require("./work_list");

const BUILDER_TO_CARRYER = true;

const ROLES_WITH_BAG = ["carryer", "builder", "repairer", "updater"]
const ALLOWED_FILL_CONSTRUCTIONS_CARRYER = ["spawn", "extension", "storage"]
const ALLOWED_FILL_CONSTRUCTIONS_REPAIRER = ["tower"]
const DISALLOWED_REPAIR_CONSTRUCTIONS = ["constructedWall", "rampart"]

var resource_keeper = false;


var main = {
    run: function(Game){
        for (let i in Game.creeps){
            var creep = Game.creeps[i]
            var role = creep.memory.role
            if (creep.memory.task == "none"){
                switch(role) {
                    case 'carryer':
                        let unfilled_struct = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: s => ALLOWED_FILL_CONSTRUCTIONS_CARRYER.find(f => f == s.structureType) &&
                                    s.energy < s.energyCapacity})

                        if (unfilled_struct){
                            creep.memory.task = "fill";
                            creep.memory.target = unfilled_struct
                            break;
                        }

                        creep.memory.task = "charge_controller"
                        break;
 
                    case "repairer":

                        let _unfilled_struct = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: s => ALLOWED_FILL_CONSTRUCTIONS_REPAIRER.find(f => f == s.structureType) &&
                                    s.energy < s.energyCapacity})

                        if (_unfilled_struct){
                            creep.memory.task = "fill";
                            creep.memory.target = _unfilled_struct
                            break;
                        }


                        let broken_struct = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                                    {filter: s => s.hits < s.hitsMax &&
                                    !DISALLOWED_REPAIR_CONSTRUCTIONS.find(f => f == s.structureType)});
                        if (broken_struct){
                            creep.memory.task = "repair"
                            creep.memory.target = broken_struct
                            break;
                        }


                        let broken_wall = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                                    {filter: s => s.hits < 50000 &&
                                    DISALLOWED_REPAIR_CONSTRUCTIONS.find(f => f == s.structureType)});
                        if (broken_wall){
                            creep.memory.task = "repair_wall"
                            creep.memory.target = broken_wall
                            break;
                        }

                        creep.memory.task = "wait"
                        break;

                    
                    case 'builder':
                        let site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                            
                        if (site){
                            creep.memory.task = "build";
                            creep.memory.target = site
                            break;
                        }

                        if (BUILDER_TO_CARRYER){
                            creep.memory.role = "carryer"
                            creep.memory.task = "fill_bag"
                        } else {
                            creep.memory.task = "wait"
                        }
                        break;

                    case 'excavator':                           
                        creep.memory.task = "transport"
                        break;

                    case 'updater':                           
                        creep.memory.task = "charge_controller"
                        break;
                }
            }
                

            if (creep.carry.energy == 0 && ROLES_WITH_BAG.find(s => role)){
                var dropped_resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (role == "carryer" && dropped_resource != undefined){
                    if (dropped_resource.amount >= 100){
                        creep.memory.task = "pickup"
                        creep.memory.target = dropped_resource
                    }
                }else{
                    creep.memory.task = "fill_bag";
                }
            }

            if (creep.carry.energy == 0 && role == "excavator") 
                creep.memory.task = "dig";
            
                if (role) {
                works[role][creep.memory.task](creep);
                creep.memory.target = undefined
            }

        }
            
    }
}

module.exports = main;