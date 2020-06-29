import { graphs } from './graphs.js';

export var slotsMap = {};

var stepTimes = {};
var accumSteps = [];
var totalTime = 0;
var lastBreak = { node: null, time: null };

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
function fillSlot2 (graph, order, maxTime, type) {
    let slotTime = 0;
    let steps = [];
    let remaining = order.slice();
    let slotStartTime = Infinity;
    let minSlotStartTime = isType(graph, lastBreak.node, type) ? Math.max(lastBreak.time, totalTime) : totalTime;
    let totalActiveTime = 0;

    // Traverse topological sort in reverse
    for (var i=order.length-1; i>=0; i--) {
        let node = order[i];
        let nodeData = graph.nodeDatas[node];
        if (!nodeData || !nodeData.type) { remaining.splice(i, 1); continue; }

        if (isType(graph, node, type)) {
            let nodeTime = 0;
            let nodeStartTime = 0;
            let shouldBreak = false;

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
                shouldBreak = true;
                console.log('time-break');
            }

            if (shouldBreak) {
                console.log('break');
                console.log(node);
                console.log('new: ' + newTime);
                console.log('node: ' + nodeTime);
                console.log('node start: ' + nodeStartTime);
                console.log('slot: ' + newSlotTime);
                console.log('start: ' + slotStartTime);
                console.log('max: ' + maxTime);

                lastBreak.node = node;
                lastBreak.time = nodeTime;
                i++;
                break;
            }

            totalTime = newTime;
            slotTime = newSlotTime;
            steps.unshift(nodeData);
            stepTimes[node] = nodeTime;
            remaining.splice(i, 1);
        }
    }

    accumSteps = steps.concat(accumSteps);

    return { steps: steps, time: slotTime, start: slotStartTime, remaining: remaining };
}

export function getSpace(prevSlot, nextSlot) {
    let prevTime = prevSlot.start;
    let nextTime = nextSlot.start + nextSlot.time;
    return prevTime - nextTime;
}

function fillSlot (graph, order, maxTime, type) {
    return fillSlot2(graph, order, maxTime, type);
}

function printSlot (slot) {
    let steps = slot.steps;
    console.log("Time: " + slot.time);
    for (let i=0; i<steps.length; i++) {
        let step = steps[i];
        console.log(step.name + " (" + step.activeTime + ") -- " + step.instructions);
    }
}

for (let graphName in graphs) {
    stepTimes = {};
    accumSteps = [];
    totalTime = 0;

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

        slot = fillSlot(graph, order, 25, 'step');
        order = slot.remaining;
        printSlot(slot);
        if (slot.steps.length) {
            slots.unshift(slot);
        }
        slot = fillSlot(graph, order, 15, 'ingredient');
        order = slot.remaining;
        printSlot(slot);
        if (slot.steps.length) {
            slots.unshift(slot);
        }

        console.log('remaining');
        console.log(order);
    }

    slotsMap[graphName] = {
        graphName: graphName,
        graph: graph,
        slots: slots,
    };
}