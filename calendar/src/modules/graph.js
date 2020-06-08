import Graph from '../../../graph-data-structure';

export var graph = new Graph ();

function createNodeData (name, activeTime, minTime, maxTime, instructions) {
    return {
        name: name,
        activeTime: activeTime,
        minTime: minTime,
        maxTime: maxTime,
        instructions: instructions,
    }
}

function addIngredient (graph, nodeName) {
    graph.addNode(nodeName);
    graph.addEdge('start', nodeName, 0);
}

function addStep (graph, stepName, ...ingredientNames) {
    graph.addNode(stepName);
    for (var ingredientName of ingredientNames) {
        addWeightedEdge(graph, ingredientName, stepName);
    }
}

function addProduct (graph, stepName, ...ingredientNames) {
    addStep(graph, stepName, ...ingredientNames);
    addWeightedEdge(graph, stepName, 'finish');
}

function addWeightedEdge (graph, a, b) {
    return graph.addEdge(a, b, nodeDatas[a].minTime);
}

var nodeDatas = {
    'chicken-thaw': createNodeData(
        'chicken-thaw', 2, 8*60, (8+48)*60, 
        'Transfer chicken thigh to fridge and thaw overnight.',
    ),
    'chicken-thigh': createNodeData(
        'chicken-thigh', 5, 5, 2*60,
        '1 lb boneless chicken thigh, with or without skin, cut into 3-4 pieces',
    ),
    'soy-sauce': createNodeData(
        'soy-sauce', 1, 1, Infinity,
        '1.33 T soy sauce',
    ),
    'sake': createNodeData(
        'sake', 1, 1, Infinity,
        '4 T sake',
    ),
    'ginger': createNodeData(
        'ginger', 5, 5, 2*60,
        '1.33 T peeled and grated fresh ginger',
    ),
    'marinate-chicken': createNodeData(
        'marinate-chicken', 5, 15, 12*60,
        'Combine chicken, soy sauce, sake, and ginger. Let marinate for at least 10 minutes or overnight.',
    ),
};

graph.addNode('start');
graph.addNode ('finish');

addIngredient(graph, 'chicken-thaw');
addStep(graph, 'chicken-thigh', 'chicken-thaw');

addIngredient (graph, 'soy-sauce');
addIngredient (graph, 'sake');
addIngredient (graph, 'ginger');
addProduct (graph, 'marinate-chicken', 'chicken-thigh', 'soy-sauce', 'sake', 'ginger');

// graph.addNode('chicken-karaage', {
//     'steps' : [
//         {'node' : 'marinated-chicken-for-karaage'},
//         {'step' : 'drain marinate, coat in cornstarch'},
//         {'step' : 'heat-oil, fry chicken, turn, drain on paper towels'},
//     ],
// });

console.log (graph.shortestPath('start', 'finish'));
console.log (graph.criticalPath());