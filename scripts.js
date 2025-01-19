// script.js
let particleType = 'water';

// Configurar Matter.js
const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;
const engine = Engine.create();
const world = engine.world;

const render = Render.create({
    element: document.getElementById('container'),
    engine: engine,
    options: {
        width: document.getElementById('container').clientWidth,
        height: document.getElementById('container').clientHeight,
        wireframes: false,
    }
});

Render.run(render);
Engine.run(engine);

// Eventos de clic para crear partículas
document.getElementById('container').addEventListener('click', (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    spawnParticle(x, y, particleType);
});

// Crear partículas
function spawnParticle(x, y, type) {
    let particle;
    switch (type) {
        case 'water':
            particle = Bodies.circle(x, y, 5, { label: 'water', render: { fillStyle: 'blue' } });
            break;
        case 'sand':
            particle = Bodies.circle(x, y, 5, { label: 'sand', render: { fillStyle: 'yellow' } });
            break;
        case 'fire':
            particle = Bodies.circle(x, y, 5, { label: 'fire', render: { fillStyle: 'red' } });
            break;
        case 'fuel':
            particle = Bodies.circle(x, y, 5, { label: 'fuel', render: { fillStyle: 'orange' } });
            break;
    }
    World.add(world, particle);
}

// Interacciones entre partículas
Matter.Events.on(engine, 'collisionStart', (event) => {
    const pairs = event.pairs;
    pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        if (bodyA.label === 'water' && bodyB.label === 'fire' || bodyA.label === 'fire' && bodyB.label === 'water') {
            // Apagar el fuego
            Matter.World.remove(world, bodyB);
        } else if (bodyA.label === 'fire' && bodyB.label === 'sand' || bodyA.label === 'sand' && bodyB.label === 'fire') {
            // Convertir arena en vidrio
            bodyA.render.fillStyle = 'green';
            bodyB.render.fillStyle = 'green';
        } else if (bodyA.label === 'water' && bodyB.label === 'lava' || bodyA.label === 'lava' && bodyB.label === 'water') {
            // Convertir lava y agua en roca
            bodyA.render.fillStyle = 'gray';
            bodyB.render.fillStyle = 'gray';
        }
    });
});

// Selección de tipo de partícula
function setParticleType(type) {
    particleType = type;
}

// Herramienta para revolver partículas
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});
World.add(world, mouseConstraint);