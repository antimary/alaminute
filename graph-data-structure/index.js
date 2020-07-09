"use strict";
// A graph data structure with depth-first search and topological sort.
function Graph(serialized) {
    // Returned graph instance
    var graph = {
        addNode: addNode,
        removeNode: removeNode,
        nodes: nodes,
        adjacent: adjacent,
        addEdge: addEdge,
        removeEdge: removeEdge,
        setEdgeWeight: setEdgeWeight,
        getEdgeWeight: getEdgeWeight,
        indegree: indegree,
        outdegree: outdegree,
        depthFirstSearch: depthFirstSearch,
        lowestCommonAncestors: lowestCommonAncestors,
        topologicalSort: topologicalSort,
        shortestPath: shortestPath,
        serialize: serialize,
        deserialize: deserialize,
        criticalPath: criticalPath,
        distanceFromPath: distanceFromPath,
    };
    // The adjacency list of the graph.
    // Keys are node ids.
    // Values are adjacent node id arrays.
    var edges = {};
    // The weights of edges.
    // Keys are string encodings of edges.
    // Values are weights (numbers).
    var edgeWeights = {};
    // If a serialized graph was passed into the constructor, deserialize it.
    if (serialized) {
        deserialize(serialized);
    }
    // Adds a node to the graph.
    // If node was already added, this function does nothing.
    // If node was not already added, this function sets up an empty adjacency list.
    function addNode(node) {
        edges[node] = adjacent(node);
        return graph;
    }
    // Removes a node from the graph.
    // Also removes incoming and outgoing edges.
    function removeNode(node) {
        // Remove incoming edges.
        Object.keys(edges).forEach(function (u) {
            edges[u].forEach(function (v) {
                if (v === node) {
                    removeEdge(u, v);
                }
            });
        });
        // Remove outgoing edges (and signal that the node no longer exists).
        delete edges[node];
        return graph;
    }
    // Gets the list of nodes that have been added to the graph.
    function nodes() {
        // TODO: Better implementation with set data structure
        var nodeSet = {};
        Object.keys(edges).forEach(function (u) {
            nodeSet[u] = true;
            edges[u].forEach(function (v) {
                nodeSet[v] = true;
            });
        });
        return Object.keys(nodeSet);
    }
    // Gets the adjacent node list for the given node.
    // Returns an empty array for unknown nodes.
    function adjacent(node) {
        return edges[node] || [];
    }
    // Computes a string encoding of an edge,
    // for use as a key in an object.
    function encodeEdge(u, v) {
        return u + "|" + v;
    }
    // Sets the weight of the given edge.
    function setEdgeWeight(u, v, weight) {
        edgeWeights[encodeEdge(u, v)] = weight;
        return graph;
    }
    // Gets the weight of the given edge.
    // Returns 1 if no weight was previously set.
    function getEdgeWeight(u, v) {
        var weight = edgeWeights[encodeEdge(u, v)];
        return weight === undefined ? 1 : weight;
    }
    // Adds an edge from node u to node v.
    // Implicitly adds the nodes if they were not already added.
    function addEdge(u, v, weight) {
        addNode(u);
        addNode(v);
        adjacent(u).push(v);
        if (weight !== undefined) {
            setEdgeWeight(u, v, weight);
        }
        return graph;
    }
    // Removes the edge from node u to node v.
    // Does not remove the nodes.
    // Does nothing if the edge does not exist.
    function removeEdge(u, v) {
        if (edges[u]) {
            edges[u] = adjacent(u).filter(function (_v) {
                return _v !== v;
            });
        }
        return graph;
    }
    // Computes the indegree for the given node.
    // Not very efficient, costs O(E) where E = number of edges.
    function indegree(node) {
        var degree = 0;
        function check(v) {
            if (v === node) {
                degree++;
            }
        }
        Object.keys(edges).forEach(function (u) {
            edges[u].forEach(check);
        });
        return degree;
    }
    // Computes the outdegree for the given node.
    function outdegree(node) {
        return node in edges ? edges[node].length : 0;
    }
    // Depth First Search algorithm, inspired by
    // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
    // This variant includes an additional option
    // `includeSourceNodes` to specify whether to include or
    // exclude the source nodes from the result (true by default).
    // If `sourceNodes` is not specified, all nodes in the graph
    // are used as source nodes.
    function depthFirstSearch(sourceNodes, includeSourceNodes, prioritySort) {
        if (includeSourceNodes === void 0) { includeSourceNodes = true; }
        if (!sourceNodes) {
            sourceNodes = nodes();
        }
        if (typeof includeSourceNodes !== "boolean") {
            includeSourceNodes = true;
        }
        if (!prioritySort) {
            prioritySort = function (nodes) { return nodes; };
        }

        var visited = {};
        var nodeList = [];
        function DFSVisit(node) {
            if (!visited[node]) {
                visited[node] = true;
                prioritySort(adjacent(node)).forEach(DFSVisit);
                nodeList.push(node);
            }
        }
        if (includeSourceNodes) {
            prioritySort(sourceNodes).forEach(DFSVisit);
        }
        else {
            sourceNodes.forEach(function (node) {
                visited[node] = true;
            });
            sourceNodes.forEach(function (node) {
                prioritySort(adjacent(node)).forEach(DFSVisit);
            });
        }
        return nodeList;
    }

    // Computes the distance (in # of steps) from each node to any node on
    // the given path, traversing the graph starting at root.
    //
    // @param path -- given path
    // @param root -- root of the graph to traverse
    // @return distances --  object mapping node names -> distances
    function distanceFromPath(path, root) {
        var visited = {};
        var distances = {};

        function DistVisit(node, criticalDist) {
            if(!visited[node]) {
                visited[node] = true;

                // Accumulate distance from critical nodes
                if (path.includes(node)) {
                    criticalDist = 0;
                } else {
                    criticalDist++;
                }

                // Traverse depth-first and keep track of min distance among children
                let adj = adjacent(node);
                let minAdjDist = Infinity;
                for (let i=0; i<adj.length; i++) {
                    let adjDist = DistVisit(adj[i], criticalDist);
                    if (adjDist < minAdjDist) {
                        minAdjDist = adjDist;
                    }
                }

                // Update distance if children are closer to path than accum distance
                criticalDist = Math.min(criticalDist, minAdjDist + 1);
                if(!distances.hasOwnProperty(node) || distances[node] > criticalDist) {
                    distances[node] = criticalDist;
                }
            } else {
                // Make sure to return distance when encountering visited node
                criticalDist = distances[node];
            }
            return criticalDist;
        }

        // Initiate DFS from root
        DistVisit(root, 0);

        return distances;
    }

    // Least Common Ancestors
    // Inspired by https://github.com/relaxedws/lca/blob/master/src/LowestCommonAncestor.php code
    // but uses depth search instead of breadth. Also uses some optimizations
    function lowestCommonAncestors(node1, node2) {
        var node1Ancestors = [];
        var lcas = [];
        function CA1Visit(visited, node) {
            if (!visited[node]) {
                visited[node] = true;
                node1Ancestors.push(node);
                if (node == node2) {
                    lcas.push(node);
                    return false; // found - shortcut
                }
                return adjacent(node).every(function (node) {
                    return CA1Visit(visited, node);
                });
            }
            else {
                return true;
            }
        }
        function CA2Visit(visited, node) {
            if (!visited[node]) {
                visited[node] = true;
                if (node1Ancestors.indexOf(node) >= 0) {
                    lcas.push(node);
                }
                else if (lcas.length == 0) {
                    adjacent(node).forEach(function (node) {
                        CA2Visit(visited, node);
                    });
                }
            }
        }
        if (CA1Visit({}, node1)) {
            // No shortcut worked
            CA2Visit({}, node2);
        }
        return lcas;
    }
    // The topological sort algorithm yields a list of visited nodes
    // such that for each visited edge (u, v), u comes before v in the list.
    // Amazingly, this comes from just reversing the result from depth first search.
    // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
    function topologicalSort(sourceNodes, includeSourceNodes, prioritySort) {
        if (includeSourceNodes === void 0) { includeSourceNodes = true; }
        return depthFirstSearch(sourceNodes, includeSourceNodes, prioritySort).reverse();
    }

    function criticalPath() {
        var topList = topologicalSort();
        var incomings = {};
        var lengths = {};

        // Create mapping of nodes to their incoming neighbors
        for (let i=0; i<topList.length; i++) {
            let node = topList[i];
            let adjList = adjacent(node);
            for (let j=0; j<adjList.length; j++) {
                let adj = adjList[j];
                if(incomings.hasOwnProperty(adj)) {
                    incomings[adj].push(node);
                } else {
                    incomings[adj] = [node];
                }
            }
        }

        // Create mapping of nodes to corresponding longest path lengths
        for (let i=0; i<topList.length; i++) {
            let node = topList[i];
            if (incomings.hasOwnProperty(node)) {
                let incomingList = incomings[node];
                let maxLength = 0;
                let maxIncoming = undefined;
                for (let j=0; j<incomingList.length; j++) {
                    let incoming = incomingList[j];
                    let currLength = lengths[incoming] + getEdgeWeight(incoming, node);
                    if (lengths.hasOwnProperty(incoming) && currLength >= maxLength) {
                        maxLength = currLength;
                        maxIncoming = incoming;
                    }
                }

                lengths[node] = maxLength;
            } else {
                lengths[node] = 0;
            }
        }

        // Get node with the longest path
        let longestLength = 0;
        let longestNode = undefined;
        for (let node in lengths) {
            if (lengths[node] > longestLength) {
                longestLength = lengths[node];
                longestNode = node;
            }
        }

        // Trace back along the longest (critical) path
        let longestPath = [];
        while (longestNode !== undefined) {
            longestPath.push(longestNode);
            let maxIncoming = undefined;

            if (incomings.hasOwnProperty(longestNode)) {
                let incomingList = incomings[longestNode];
                let maxLength = 0;
                for (let i=0; i<incomingList.length; i++) {
                    let incoming = incomingList[i];
                    if (lengths[incoming] >= maxLength) {
                        maxLength = lengths[incoming];
                        maxIncoming = incoming;
                    }
                }
            }

            longestNode = maxIncoming;
        }

        return {path: longestPath, weight: longestLength};
    }

    // Dijkstra's Shortest Path Algorithm.
    // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 658
    // Variable and function names correspond to names in the book.
    function shortestPath(source, destination) {
        // Upper bounds for shortest path weights from source.
        var d = {};
        // Predecessors.
        var p = {};
        // Poor man's priority queue, keyed on d.
        var q = {};
        function initializeSingleSource() {
            nodes().forEach(function (node) {
                d[node] = Infinity;
            });
            if (d[source] !== Infinity) {
                throw new Error("Source node is not in the graph");
            }
            if (d[destination] !== Infinity) {
                throw new Error("Destination node is not in the graph");
            }
            d[source] = 0;
        }
        // Adds entries in q for all nodes.
        function initializePriorityQueue() {
            nodes().forEach(function (node) {
                q[node] = true;
            });
        }
        // Returns true if q is empty.
        function priorityQueueEmpty() {
            return Object.keys(q).length === 0;
        }
        // Linear search to extract (find and remove) min from q.
        function extractMin() {
            var min = Infinity;
            var minNode;
            Object.keys(q).forEach(function (node) {
                if (d[node] < min) {
                    min = d[node];
                    minNode = node;
                }
            });
            if (minNode === undefined) {
                // If we reach here, there's a disconnected subgraph, and we're done.
                q = {};
                return null;
            }
            delete q[minNode];
            return minNode;
        }
        function relax(u, v) {
            var w = getEdgeWeight(u, v);
            if (d[v] > d[u] + w) {
                d[v] = d[u] + w;
                p[v] = u;
            }
        }
        function dijkstra() {
            initializeSingleSource();
            initializePriorityQueue();
            while (!priorityQueueEmpty()) {
                var u = extractMin();
                if (u === null)
                    return;
                adjacent(u).forEach(function (v) {
                    relax(u, v);
                });
            }
        }
        // Assembles the shortest path by traversing the
        // predecessor subgraph from destination to source.
        function path() {
            var nodeList = [];
            var weight = 0;
            var node = destination;
            while (p[node]) {
                nodeList.push(node);
                weight += getEdgeWeight(p[node], node);
                node = p[node];
            }
            if (node !== source) {
                throw new Error("No path found");
            }
            nodeList.push(node);
            nodeList.reverse();
            nodeList.weight = weight;
            return nodeList;
        }
        dijkstra();
        return path();
    }
    // Serializes the graph.
    function serialize() {
        var serialized = {
            nodes: nodes().map(function (id) {
                return { id: id };
            }),
            links: []
        };
        serialized.nodes.forEach(function (node) {
            var source = node.id;
            adjacent(source).forEach(function (target) {
                serialized.links.push({
                    source: source,
                    target: target,
                    weight: getEdgeWeight(source, target)
                });
            });
        });
        return serialized;
    }
    // Deserializes the given serialized graph.
    function deserialize(serialized) {
        serialized.nodes.forEach(function (node) {
            addNode(node.id);
        });
        serialized.links.forEach(function (link) {
            addEdge(link.source, link.target, link.weight);
        });
        return graph;
    }
    // The returned graph instance.
    return graph;
}
module.exports = Graph;
