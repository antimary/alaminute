import { graphs } from './graphs.js';

export var slots = {};
slots.getGraphs = function () {
    return graphs;
}

function fillSlot (graph, order, maxTime, type) {
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

function printSlot (slot) {
    let steps = slot.steps;
    console.log("Time: " + slot.time);
    for (let i=0; i<steps.length; i++) {
        let step = steps[i];
        console.log(step.name + " (" + step.activeTime + ") -- " + step.instructions);
    }
}

for (let graphName in graphs) {
    console.log('graphName');
    console.log(graphName);
    let graph = graphs[graphName];
    console.log(graph);

    console.log("order");
    console.log(graph.criticalSort);
    let order = graph.topologicalSort(['start'], undefined, graph.criticalSort);
    console.log(order);

    let slot = fillSlot(graph, order, 25, 'step');
    let remainingSteps = slot.remaining;
    printSlot(slot);
    slot = fillSlot(graph, order, 15, 'ingredient');
    let remainingIngredients = slot.remaining;
    printSlot(slot);

    slot = fillSlot(graph, remainingSteps, 25, 'step');
    printSlot(slot);
    slot = fillSlot(graph, remainingIngredients, 15, 'ingredient');
    printSlot(slot);

    console.log(remainingSteps);
    console.log(remainingIngredients);

    slots[graphName] = {
        graph: graph,
        steps: slot.steps,
        time: slot.time,
    };
}