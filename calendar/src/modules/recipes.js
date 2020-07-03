import Graph from '../../../graph-data-structure';

export var recipes = {};     // Mapping of recipe-id -> graph-data-structure

// *****************************
// Graph creation functions
// *****************************
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
    graph.nodeDatas[nodeName].type = 'ingredient';
}

function addStep (graph, stepName, ...ingredientNames) {
    graph.addNode(stepName);
    for (var ingredientName of ingredientNames) {
        addWeightedEdge(graph, ingredientName, stepName);
    }
    graph.nodeDatas[stepName].type = 'step';
}

function addProduct (graph, stepName, ...ingredientNames) {
    addStep(graph, stepName, ...ingredientNames);
    addWeightedEdge(graph, stepName, 'finish');
    graph.nodeDatas[stepName].type = 'step-product';
}

function addWeightedEdge (graph, a, b) {
    return graph.addEdge(a, b, graph.nodeDatas[a].minTime);
}

function addType (graph, nodeName, type) {
    if (graph.nodeDatas[nodeName].type) {
        graph.nodeDatas[nodeName].type += '-';
    }
    graph.nodeDatas[nodeName].type += type;
}

export function addFinish(graph) {
    graph.nodeDatas['finish'] = createNodeData('finish', 2, 2, 5, 'Serve');
    addType(graph, 'finish', 'step');
}

// ********************************
// Karaage graph
// ********************************
recipes['karaage'] = new Graph();
var graph = recipes['karaage'];
graph.title = 'Chicken Kara-age';
// Path is relative to dist/main.js
graph.img = './assets/merlin_141075300_74569dec-9fc2-4174-931d-019dddef3bb8-articleLarge.jpg';
graph.nodeDatas = {
    'chicken-thaw': createNodeData(
        'chicken-thaw', 2, 8*60, (8+48)*60, 
        'Transfer chicken thigh to fridge and thaw overnight.',
    ),
    'chicken-thigh': createNodeData(
        'chicken-thigh', 5, 5, 2*60,
        '1 lb boneless chicken thigh, with or without skin, cut into 3-4 pieces',
    ),
    'marinade-soy': createNodeData(
        'marinade-soy', 1, 1, Infinity,
        '1.33 T soy sauce',
    ),
    'sake': createNodeData(
        'sake', 1, 1, Infinity,
        '4 T sake',
    ),
    'marinade-ginger': createNodeData(
        'marinade-ginger', 5, 5, 2*60,
        '1.33 T peeled and grated fresh ginger',
    ),
    'marinate-chicken': createNodeData(
        'marinate-chicken', 5, 15, 12*60,
        'Combine chicken, soy sauce, sake, and ginger. Let marinate for at least 10 minutes or overnight.',
    ),
    'cornstarch': createNodeData(
        'cornstarch', 1, 1, Infinity,
        '1 c cornstarch',
    ),
    'coat-chicken': createNodeData(
        'coat-chicken', 5, 5, 2*60,
        'Remove the chicken pieces from the marinade, drain, and coat in the cornstarch.',
    ),
    'vegetable-oil': createNodeData(
        'vegetable-oil', 1, 1, Infinity,
        'Vegetable oil, for deep-frying',
    ),
    'heat-oil': createNodeData(
        'heat-oil', 2, 15, 20,
        'Heat 1 inch of vegetable oil in a saucepan over medium-high heat. \
        Test the oil temperature by putting a little of the cornstarch-and-marinade coating \
        on the end of a wooden chopstick and dipping it into the oil. \
        If the oil starts getting smoky, turn down the heat.',
    ),
    'fry-chicken': createNodeData(
        'fry-chicken', 10, 10, 15,
        'Fry the chicken pieces in the oil, turning once, until a deep golden brown. Drain well on paper towels.',
    ),
    'rice-vinegar': createNodeData(
        'rice-vinegar', 1, 1, Infinity,
        '4 T rice vinegar',
    ),
    'sauce-soy': createNodeData(
        'sauce-soy', 1, 1, Infinity,
        '4 T soy sauce',
    ),
    'green-onion': createNodeData(
        'green-onion', 3, 3, 2*60,
        '4 T finely chopped green onion',
    ),
    'kara-sugar': createNodeData(
        'kara-sugar', 1, 1, Infinity,
        'Pinch sugar',
    ),
    'sesame-oil': createNodeData(
        'sesame-oil', 1, 1, Infinity,
        'Few drops sesame oil',
    ),
    'sauce-ginger': createNodeData(
        'sauce-ginger', 3, 3, 2*60,
        '1.33 T peeled and grated fresh ginger',
    ),
    'sauce': createNodeData(
        'sauce', 5, 5, 10, 
        'To make the green onion sauce, combine all the ingredients in a small frying pan over medium heat \
        and stir until the sugar is dissolved.',
    ),
    'toss': createNodeData(
        'toss', 2, 2, 5,
        'Put the chicken pieces in the pan and toss to coat each piece with the sauce',
    )
};

graph.addNode('start');
graph.addNode('finish');

addIngredient(graph, 'chicken-thaw');
addStep(graph, 'chicken-thigh', 'chicken-thaw');

addIngredient(graph, 'marinade-soy');
addIngredient(graph, 'sake');
addIngredient(graph, 'marinade-ginger');
addStep(graph, 'marinate-chicken', 'chicken-thigh', 'marinade-soy', 'sake', 'marinade-ginger');

addIngredient(graph, 'cornstarch');
addStep(graph, 'coat-chicken', 'marinate-chicken', 'cornstarch');

addIngredient(graph, 'vegetable-oil');
addStep(graph, 'heat-oil', 'vegetable-oil');
addType(graph, 'heat-oil', 'ingredient');
addStep(graph, 'fry-chicken', 'coat-chicken', 'heat-oil');

addIngredient(graph, 'rice-vinegar');
addIngredient(graph, 'sauce-soy');
addIngredient(graph, 'green-onion');
addIngredient(graph, 'kara-sugar');
addIngredient(graph, 'sesame-oil');
addIngredient(graph, 'sauce-ginger');
addStep(graph, 'sauce', 'rice-vinegar', 'sauce-soy', 'green-onion', 'kara-sugar', 'sesame-oil', 'sauce-ginger');
addProduct(graph, 'toss', 'fry-chicken', 'sauce');


// ********************************
// Rice with Peas graph
// ********************************
recipes['rice-peas'] = new Graph();
graph = recipes['rice-peas'];
graph.title = 'Rice with Peas';
graph.img = './assets/rice-peas.jpeg';
graph.nodeDatas = {
    'frz-peas': createNodeData(
        'frz-peas', 1, 1, 2*60,
        '8 T frozen green peas',
    ),
    'rice': createNodeData(
        'rice', 1, 1, Infinity,
        '1 c white rice',
    ),
    'set-rice': createNodeData(
        'set-rice', 5, 50, 24*60,
        'Rinse rice until water runs clear (~3x), fill rice cooker to appropriate level and set timer',
    ),
    'cook-peas': createNodeData(
        'cook-peas', 5, 5, 15,
        'Put the peas in a small bowl with a pinch of salt and enough water to cover. Cover with plastic wrap, and microwave on high for 1 minute',
    ),
    'mix-rice': createNodeData(
        'mix-rice', 2, 2, 10,
        'Mix into the rice with a spoon or rice paddle, taking care not to crush the peas.',
    ),
};

graph.addNode('start');
graph.addNode('finish');

addIngredient(graph, 'frz-peas');
addIngredient(graph, 'rice');
addStep(graph, 'set-rice', 'rice');
addType(graph, 'set-rice', 'ingredient');
addStep(graph, 'cook-peas', 'frz-peas');
addProduct(graph, 'mix-rice', 'set-rice', 'cook-peas');


// ********************************
// Spinach with Sesame graph
// ********************************
recipes['spin-ses'] = new Graph();
graph = recipes['spin-ses'];
graph.title = 'Blanched Spinach with Sesame Sauce';
graph.img = './assets/spinach-sesame.jpg';
graph.nodeDatas = {
    'spinach': createNodeData(
        'spinach', 5, 15, 2*60,
        '3 1/2 oz spinach leaves, washed',
    ),
    'tahini': createNodeData(
        'tahini', 1, 1, Infinity,
        '1 T tahini, nerigoma, or traditional sesame sauce',
    ),
    'ses-1': createNodeData(
        'ses-1', 1, 1, Infinity,
        '1 t white sesame seeds, toasted',
    ),
    'spin-sugar': createNodeData(
        'spin-sugar', 1, 1, Infinity,
        '1 t sugar',
    ),
    'spin-soy': createNodeData(
        'spin-soy', 1, 1, Infinity,
        '1/2 T soy sauce',
    ),
    'ses-2': createNodeData(
        'ses-2', 1, 1, Infinity,
        '1/2 t white sesame seeds, toasted, for sprinkling',
    ),
    'boil-pot': createNodeData(
        'boil-pot', 2, 20, 2*60,
        'Bring a pot of salted water to a boil'
    ),
    'cook-spin': createNodeData(
        'cook-spin', 5, 5, 2*60,
        'Boil the spinach for 1 minute. Drain, then fill the pan with cold water, repeating until the spinach is cooled. Squeeze out as much water as possible from the cooked spinach, then form it into a log shape. Cut the spinach into even pieces.',
    ),
    'mix-spin': createNodeData(
        'mix-spin', 5, 5, 2*60,
        'In a small bowl, mix together the tahini, 1/2 t of toasted white sesame seeds, sugar, and soy sauce, pressing down to grind up the sesame seeds and sugar slightly. Add the spinach and mix well.'
    ),
    'serve-spin': createNodeData(
        'serve-spin', 2, 2, 2*60,
        'Pack into your bento box and sprinkle with sesame seeds.'
    )
};

graph.addNode('start');
graph.addNode('finish');

addIngredient(graph, 'spinach');
addIngredient(graph, 'tahini');
addIngredient(graph, 'ses-1');
addIngredient(graph, 'spin-sugar');
addIngredient(graph, 'spin-soy');
addIngredient(graph, 'ses-2');
addIngredient(graph, 'boil-pot');
addType(graph, 'boil-pot', 'step');
addStep(graph, 'cook-spin', 'boil-pot', 'spinach');
addStep(graph, 'mix-spin', 'cook-spin', 'tahini', 'ses-1', 'spin-sugar', 'spin-soy');
addProduct(graph, 'serve-spin', 'mix-spin', 'ses-2');


// ********************************
// Peppers in Dashi graph
// ********************************
recipes['pepp-dash'] = new Graph();
graph = recipes['pepp-dash'];
graph.title = 'Sweet Peppers Poached in Dashi Stock';
graph.img = './assets/peppers-dashi.jpg';
graph.nodeDatas = {
    'pepp': createNodeData(
        'pepp', 5, 5, 2*60,
        '2 each yellow and red sweet pepper, de-seeded',
    ),
    'dashi': createNodeData(
        'dashi', 2, 2, 2*60,
        '4 c dashi stock or chicken stock',
    ),
    'salt': createNodeData(
        'salt', 1, 1, Infinity,
        'Salt, to taste',
    ),
    'cook-pepp': createNodeData(
        'cook-pepp', 5, 20, 2*60,
        'Cut the sweet peppers into slices or shapes. Place in a small pan, and add enough dashi or chicken stock to cover; add salt to taste. Heat on high until the stock is bubbling, then lower the heat and gently simmer for 4-5 minutes until the pepper pieces are tender.',
    ),
    'serve-pepp': createNodeData(
        'serve-pepp', 5, 5, 2*60,
        "Here I have used pieces cut out with a small rabbit-shaped cookie cutter. The leftover bits of sweet pepper don't go to waste--I just chop them up finely and mix them in with the rice.",
    ),
};

graph.addNode('start');
graph.addNode('finish');

addIngredient(graph, 'pepp');
addIngredient(graph, 'dashi');
addIngredient(graph, 'salt');
addStep(graph, 'cook-pepp', 'pepp', 'dashi', 'salt');
addProduct(graph, 'serve-pepp', 'cook-pepp');

export function computeCriticalSort(graph) {
    // Calculate critical path for recipe graph
    var criticalPathObj = graph.criticalPath();
    var criticalPath = criticalPathObj.path;
    var criticalActiveTime = 0;
    for (let i=0; i<criticalPath.length; i++) {
        let criticalNode = graph.nodeDatas[criticalPath[i]];
        if(criticalNode) {
            criticalActiveTime += criticalNode.activeTime;
        }
    }

    // Calculate distance from each node to the nearest critical node
    var distances = graph.distanceFromPath(criticalPath, 'start');

    // Set a function on the graph to sort nodes in order of increasing critical distance
    var criticalSort = function (nodes) {
        let result = [];
        for (let i=0; i<nodes.length; i++) {
            let dist = distances[nodes[i]];
            let j=0;
            while (j < result.length && distances[result[j]] > dist) {
                j++;
            }
            result.splice(j, 0, nodes[i]);
        }
        return result;
    }
    return criticalSort;
}

// ********************************
// Recipe post-processing
// ********************************
for (let recipeName in recipes) {
    let graph = recipes[recipeName];

    graph.criticalSort = computeCriticalSort(graph);
}