import { graphs } from './graphs.js';

export var slots = {};

var stepTimes = {};
var accumSteps = [];

slots.getGraphs = function () {
    return graphs;
}

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

// Fill slot with accurate step times, accounting for edges, minTime, and activeTime.
function fillSlot2 (graph, order, maxTime, type) {
    let totalTime = 0;
    let steps = [];
    let remaining = order.slice();

    // Traverse topological sort in reverse
    for (var i=order.length-1; i>=0; i--) {
        let node = order[i];
        let nodeData = graph.nodeDatas[node];
        if (!nodeData || !nodeData.type) { continue; }

        if (!type || nodeData.type.includes(type)) {
            let nodeTime = 0;
            if (steps.length == 0) {
                // Always use activeTime for the first (last) step
                nodeTime = nodeData.activeTime;
            } else {
                // Add minTime to the time stored in neigboring step for all other steps
                let edges = [];
                let allSteps = steps.concat(accumSteps);
                for (let j=allSteps.length-1; j>=0; j--) {
                    let stepNode = allSteps[j].name;
                    if (graph.adjacent(node).includes(stepNode)) {
                        edges.push(stepNode);
                        nodeTime = graph.getEdgeWeight(node, stepNode) + stepTimes[stepNode];
                    }
                }

                if (edges.length != 1) {
                    console.log(node);
                    console.log(graph.adjacent(node));
                    console.log(edges);
                    throw 'Invalid graph: recipe nodes should always have 1 outgoing edge';
                }
                
                //nodeTime = edgeTime;
            }

            let newTime = Math.max(totalTime, nodeTime);
            if (newTime > maxTime) {
                i++;
                break;
            }
            totalTime = newTime;
            steps.unshift(nodeData);
            stepTimes[node] = nodeTime;
            remaining.splice(i, 1);
        }
    }

    accumSteps = steps.concat(accumSteps);

    return { steps: steps, time: totalTime, remaining: remaining };
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

    console.log('graphName');
    console.log(graphName);
    let graph = graphs[graphName];

    let order = graph.topologicalSort(['start'], undefined, graph.criticalSort);
    console.log("order");
    console.log(order);

    let slot = fillSlot(graph, order, 25, 'step');
    let remaining = slot.remaining;
    printSlot(slot);
    slot = fillSlot(graph, remaining, 15);
    remaining = slot.remaining;
    printSlot(slot);

    slot = fillSlot(graph, remaining, 25, 'step');
    printSlot(slot);
    slot = fillSlot(graph, remaining, 15);
    printSlot(slot);

    console.log('remaining');
    console.log(remaining);

    slots[graphName] = {
        graph: graph,
        steps: slot.steps,
        time: slot.time,
    };
}