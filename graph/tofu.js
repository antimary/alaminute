var tofuElements =
[
    // ingredients (nodes)
    { data: { 
        id: 'extra-firm-tofu',
        type: 'ingredient',
        name: 'Extra-Firm Tofu',
        duration: 4*7*24*60,    // 4 weeks
        amount: 16,
        unit: 'oz',
        resource: 'fridge',
        recipe: 'tofu',
    } },
    { data: { 
        id: 'kosher-salt',
        type: 'ingredient',
        name: 'Kosher Salt',
        details: 'Diamond Crystal Brand',
        duration: -1,
        amount: 1,
        unit: 'pinch',
        resource: 'pantry',
        recipe: 'tofu',
    } },
    { data: { 
        id: 'desired-seasoning',
        type: 'ingredient',
        name: 'Desired Seasoning',
        details: 'curry powder, chili powder, tamari, tandoori spice, etc.',
        duration: -1,
        amount: 1,
        unit: 'tsp',
        resource: 'pantry',
        recipe: 'tofu',
    } },
    
    // steps (nodes)
    { data: { 
        id: 'drain-tofu', 
        type: 'step',
        name: 'Drain Tofu',
        text: 'Wrap your extra firm tofu in an absorbent towel. Set something heavy on top - like a cast iron skillet - to press out extra moisture for 5 minutes.',
        duration: 10,
        active: 5,
        resource: ['counter'],
        recipe: 'tofu',
        order: 4,
    } },
    { data: { 
        id: 'prep-tofu', 
        type: 'step',
        name: 'Prep Tofu',
        text: 'Unwrap tofu and cut into small cubes (see photo), then add to a medium mixing bowl and season with a pinch of salt and desired seasoning, which will vary depending on your dish.',
        details: 'I was adding mine to a curry, so I added curry powder. If adding to a BBQ dish, try a BBQ seasoning blend. Or if adding to a Thai dish, try a Thai curry powder. If you want it to remain neutral in flavor and just crisp up, simply season with salt and skip the extra seasoning.',
        duration: 5,
        resource: ['cutting-board', 'medium-bowl'],
        recipe: 'tofu',
        order: 5,
    } },
    { data: { 
        id: 'preheat-oven', 
        type: 'step',
        name: 'Preheat Oven',
        text: 'Preheat oven to 375 degrees F (190 C)',
        duration: 5,
        active: 1,
        parallel: true,
        resource: ['toaster-oven'],
        recipe: 'tofu',
        order: 6,
    } },
    { data: { 
        id: 'saute-tofu', 
        type: 'step',
        name: 'Saute Tofu',
        text: 'Heat a large oven-safe metal or cast iron skillet over medium heat. Once hot, add the oil and the seasoned tofu. Sauté for 5 minutes, shaking/flipping occasionally to cook on all sides, until tofu has a slight crust on each side and has begun to brown.',
        duration: 10,
        active: 3,
        resource: ['cast-iron-skillet', 'burner'],
        recipe: 'tofu',
        order: 7,
    } },
    { data: { 
        id: 'bake-tofu', 
        type: 'step',
        name: 'Bake Tofu',
        text: 'Transfer skillet to oven to bake for about 15 minutes, or until the tofu is firm to the touch and has begun to dry out and crisp up.',
        details: 'The longer it bakes, the firmer it gets. I found the 15-minute mark to be about right.',
        duration: 15,
        active: 1,
        resource: ['cast-iron-skillet', 'toaster-oven'],
        recipe: 'tofu',
        order: 8,
    } },
    { data: { 
        id: 'serve-tofu', 
        type: 'step',
        name: 'Serve Tofu',
        text: 'Now you have crispy tofu to add to virtually any dish you\'d like!',
        details: 'While the tofu is crispy and slightly seasoned, it does still benefit from a sauce, such as Peanut Sauce, my Almond Butter Glaze, a Curry Sauce, or my Garlic Dill Sauce. Best when fresh, but can be stored in the refrigerator up to 3 days. Reheat in a 375 degree F (190 C) oven until very hot.',
        duration: 2,
        resource: ['cast-iron-skillet'],
        recipe: 'tofu',
        order: 9,
    } },    

    // edges
    { data: {
        id: 'tofu-drain',
        source: 'extra-firm-tofu',
        target: 'drain-tofu',
        min: 0,
        max: 60,
        recipe: 'tofu',
    } },
    { data: {
        id: 'drain-prep',
        source: 'drain-tofu',
        target: 'prep-tofu',
        min: 0,
        max: 60,
        recipe: 'tofu',
    } },
    { data: {
        id: 'salt-prep',
        source: 'kosher-salt',
        target: 'prep-tofu',
        min: 0,
        max: -1,
        recipe: 'tofu',
    } },
    { data: {
        id: 'seasoning-prep',
        source: 'desired-seasoning',
        target: 'prep-tofu',
        min: 0,
        max: -1,
        recipe: 'tofu',
    } },
    { data: {
        id: 'prep-saute',
        source: 'prep-tofu',
        target: 'saute-tofu',
        min: 0,
        max: 60,
        recipe: 'tofu',
    } },
    { data: {
        id: 'preheat-saute',
        source: 'preheat-oven',
        target: 'bake-tofu',
        weight: 1,
        min: 0,
        max: 60,
        recipe: 'tofu',
    } },
    { data: {
        id: 'saute-bake',
        source: 'saute-tofu',
        target: 'bake-tofu',
        weight: 1,
        min: 0,
        max: 1,
        recipe: 'tofu',
    } },
    { data: {
        id: 'bake-serve',
        source: 'bake-tofu',
        target: 'serve-tofu',
        weight: 1,
        min: 0,
        max: 30,
        recipe: 'tofu',
    } },
];

var styleObj2 = 
[ 
    { selector: 'node',
    style: {
        'text-wrap': 'wrap',
        label: 'data(name)',
        width: 100,
        height: 100,
        //'background-image': 'https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX31572236.jpg',
        //'background-image-crossorigin': 'use-credentials',
    } }, 
    { selector: 'edge',
    style: {
        'curve-style': 'bezier',
        'target-arrow-color': 'gray',
        'target-arrow-shape': 'triangle'
    } },
    { selector: '[weight > 0]',
    style: {
        'line-color': 'red',
        'target-arrow-color': 'red'
    } },
    { selector: '[type = "ingredient"]',
    style: {
        width: 50,
        height: 50,
    } },
];

// var tofucy = cytoscape({
//     container: document.getElementById('tofucy'),
//     elements: tofuElements,
//     style: styleObj2,
// });

var tofucy = cytoscape({
    container: document.getElementById('tofucy'),
    elements: tofuElements,
    style: styleObj2,
});