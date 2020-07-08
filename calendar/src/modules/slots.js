import { graphs } from './graphs.js';

export var slotsMap = {};

var stepTimes = {};
var accumSteps = [];
var totalTime = 0;
var numSessions = 0;
var lastBreak = { node: null, time: null };
var lastCont = { node: null, time: null };

// Fill slot using activeTime as a proxy for step times.
function fillSlot1 (graph, order, maxTime, type) {
    let totalTime = 0;
    let steps = [];
    for (var i=order.length-1; i>=0; i--) {
        let nodeData = graph.nodeDatas[order[i]];
        if (!nodeData || !nodeData.type) { continue; }

        if (nodeData.type.includes(type)) {
            if (totalTime + nodeData.activeTime > maxTime) {
                i++;
                break; 
            }
            steps.unshift(nodeData);
            totalTime += nodeData.activeTime;
        }
    }
    return { steps: steps, time: totalTime, remaining: order.slice(0, i)};
}

function isType (graph, node, type) {
    let nodeData = graph.nodeDatas[node];
    if (!nodeData || !nodeData.type || !type) {
        return false;
    }

    return nodeData.type.includes(type);
}

// Fill slot with accurate step times, accounting for edges, minTime, and activeTime.
function fillSlot2 (graph, order, maxTime, type, slotName) {
    let slotTime = 0;
    let steps = [];
    let remaining = order.slice();
    let slotStartTime = Infinity;
    let minSlotStartTime = isType(graph, lastBreak.node, type) ? Math.max(lastBreak.time, totalTime) : totalTime;
    minSlotStartTime = isType(graph, lastCont.node, type) ? Math.max(lastCont.time, minSlotStartTime) : minSlotStartTime;
    let totalActiveTime = 0;
    let longestStep = { node: null, time: 0 }

    // Reset lastBreak/lastCont here?

    // Traverse topological sort in reverse
    for (var i=order.length-1; i>=0; i--) {
        let node = order[i];
        let nodeData = graph.nodeDatas[node];
        if (!nodeData || !nodeData.type) { remaining.splice(i, 1); continue; }

        if (isType(graph, node, type)) {
            let nodeTime = 0;
            let nodeStartTime = 0;
            let shouldBreak = false;
            let shouldContinue = false;

            if (steps.length == 0 && accumSteps.length == 0) {
                // Always use activeTime for the first (last) step
                nodeTime = nodeData.activeTime;
                slotStartTime = minSlotStartTime;
            } else {
                // Add minTime to the time stored in neigboring step for all other steps
                let edges = [];
                let allSteps = steps.concat(accumSteps);
                for (let j=allSteps.length-1; j>=0; j--) {
                    let stepNode = allSteps[j].name;
                    if (graph.adjacent(node).includes(stepNode)) {
                        edges.push(stepNode);
                        nodeTime = graph.getEdgeWeight(node, stepNode) + stepTimes[stepNode];
                        nodeStartTime = nodeTime - nodeData.activeTime;
                    }
                }

                if (edges.length > 1) {
                    console.log(node);
                    console.log(graph.adjacent(node));
                    console.log(edges);
                    console.log(allSteps);
                    console.log(steps);
                    console.log(accumSteps);
                    throw 'Invalid graph: recipe nodes should always have 1 outgoing edge';
                } else if(edges.length < 1) {
                    shouldBreak = true;
                    console.log('edge-break');
                    console.log(graph.adjacent(node));
                    console.log(allSteps);
                }
                
                // Ensure that we don't overlap with previous slot
                nodeStartTime = Math.max(nodeStartTime, minSlotStartTime);
                if (nodeStartTime == minSlotStartTime) {
                    nodeTime = nodeStartTime + nodeData.activeTime;
                }
                // Ensure that the slot ends at the closest node to the finish
                slotStartTime = Math.min(slotStartTime, nodeStartTime);
            }

            totalActiveTime += nodeData.activeTime;
            let newTime = Math.max(totalTime, nodeTime, slotStartTime + totalActiveTime);
            let newSlotTime = newTime - slotStartTime;

            if (newSlotTime > maxTime) {
                if (isType(graph, node, 'step') && isType(graph, node, 'ingredient')) {
                    console.log('time-cont');
                    shouldContinue = true;
                } else {
                    console.log('time-break');
                    shouldBreak = true;
                }
            }

            if (shouldBreak || shouldContinue) {
                console.log(node);
                console.log('new: ' + newTime);
                console.log('node: ' + nodeTime);
                console.log('node start: ' + nodeStartTime);
                console.log('slot: ' + newSlotTime);
                console.log('start: ' + slotStartTime);
                console.log('max: ' + maxTime);
            }

            if (shouldBreak) {
                console.log('break');
                lastBreak.node = node;
                lastBreak.time = nodeTime;
                break;
            }
            if (shouldContinue) {
                console.log('cont');
                lastCont.node = node;
                lastCont.time = nodeTime;
                continue;
            }

            if (nodeData.minTime > longestStep.time) {
                longestStep.node = node;
                longestStep.time = nodeData.minTime;
            }

            totalTime = newTime;
            slotTime = newSlotTime;
            steps.unshift(nodeData);
            stepTimes[node] = nodeTime;
            remaining.splice(i, 1);
        }
    }

    accumSteps = steps.concat(accumSteps);

    return { 
        name: slotName, 
        steps: steps, 
        longestStep: longestStep, 
        time: slotTime, 
        start: slotStartTime, 
        remaining: remaining 
    };
}

export var slotUtils = {
    getSpace (prevSlot, nextSlot) {
        let prevTime = prevSlot.start;
        let nextTime = nextSlot.start + nextSlot.time;
        return prevTime - nextTime;
    },

    isThaw (slot) {
        return slot.longestStep.node.includes('thaw');
    },

    getNumThaws (slots) {
        let numThaws = 0;
        for (let i=0; i<slots.slots.length; i++) {
            let currSlot = slots.slots[i];
            if (this.isThaw(currSlot)) {
                numThaws++;
            }
        }
        return numThaws;
    },

    getSlotTime (slots) {
        let slotTime = 0;
        for (let i=0; i<slots.slots.length; i++) {
            let currSlot = slots.slots[i];
            slotTime += currSlot.time;
        }
        return slotTime;
    },

    copySlotsObj(slotsObj) {
        return {
            graphName: slotsObj.graphName,
            graph: slotsObj.graph,
            slots: slotsObj.slots,
            numSessions: slotsObj.numSessions,
            totalTime: slotsObj.totalTime,
        };
    },
}

function fillSlot (graph, order, maxTime, type, slotName) {
    return fillSlot2(graph, order, maxTime, type, slotName);
}

function printSlot (slot) {
    let steps = slot.steps;
    console.log("Time: " + slot.time);
    for (let i=0; i<steps.length; i++) {
        let step = steps[i];
        console.log(step.name + " (" + step.activeTime + ") -- " + step.instructions);
    }
}

let stepSlotNames = ['Á la Minute', 'Prep'];
let stepNameIndex = 0;
let ingredientSlotNames = ['Mise'];
let ingredientNameIndex = 0;

function incrementNameIndex() {
    stepNameIndex = Math.min(stepNameIndex + 1, stepSlotNames.length - 1);
    ingredientNameIndex = Math.min(ingredientNameIndex + 1, ingredientSlotNames.length - 1);
}

for (let graphName in graphs) {
    stepTimes = {};
    accumSteps = [];
    totalTime = 0;
    numSessions = 0;
    stepNameIndex = 0;
    ingredientNameIndex = 0;

    console.log('graphName');
    console.log(graphName);
    let graph = graphs[graphName];

    let order = graph.topologicalSort(['start'], undefined, graph.criticalSort);
    console.log("order");
    console.log(order);
    let prevLength = 0;
    let slot;
    let slots = [];

    while (order.length > 0 && order.length != prevLength) {
        prevLength = order.length;

        slot = fillSlot(graph, order, 25, 'step', stepSlotNames[stepNameIndex]);
        order = slot.remaining;
        printSlot(slot);
        if (slot.steps.length) {
            slots.unshift(slot);
            numSessions++;  // Increment sessions for each steps slot
        }
        slot = fillSlot(graph, order, 15, 'ingredient', ingredientSlotNames[ingredientNameIndex]);
        order = slot.remaining;
        printSlot(slot);
        if (slot.steps.length) {
            slots.unshift(slot);
        }

        incrementNameIndex();

        console.log('remaining');
        console.log(order);
    }

    slotsMap[graphName] = {
        graphName: graphName,
        graph: graph,
        slots: slots,
        numSessions: numSessions,
        totalTime: totalTime,
    };
}