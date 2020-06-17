import { recipes, computeCriticalSort } from './recipes.js';
import Graph from '../../../graph-data-structure/index.js';

export var graphs = recipes;
createMealGraph(Object.keys(graphs));

function createMealGraph (recipeNames) {
    let mealGraph = new Graph();
    mealGraph.addNode('start');
    mealGraph.addNode('finish');
    mealGraph.nodeDatas = {};
    mealGraph.title = 'Karaage Bento';
    mealGraph.img = './assets/Karaage-Bento-500x400.jpg';

    let mealName = '';
    for (let i=0; i<recipeNames.length; i++) {
        // Accumulate meal name from recipe names
        let recipeName = recipeNames[i];
        if (mealName != '') {
            mealName += '/';
        }
        mealName += recipeName;

        // Add recipe nodes to meal graph (except start / finish)
        let recipeGraph = graphs[recipeName];
        let nodes = recipeGraph.nodes();
        for (let j=0; j<nodes.length; j++) {
            let node = nodes[j];
            if (node != 'start' && node != 'finish') {
                mealGraph.addNode(node);
                mealGraph.nodeDatas[node] = recipeGraph.nodeDatas[node];
            }
        }

        // Add recipe edges to meal graph (connecting back to meal start/finish above)
        for (let j=0; j<nodes.length; j++) {
            let node = nodes[j];
            let adjacent = recipeGraph.adjacent(node);
            for (let k=0; k<adjacent.length; k++) {
                let adjNode = adjacent[k];
                let weight = recipeGraph.getEdgeWeight(node, adjNode);
                mealGraph.addEdge(node, adjNode, weight);
            }
        }
    }

    // Compute critical sort on completed graph
    mealGraph.criticalSort = computeCriticalSort(mealGraph);

    // Add to graphs (key=accum-recipe-name)
    graphs[mealName] = mealGraph;
}