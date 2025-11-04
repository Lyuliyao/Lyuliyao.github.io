function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function generateAnimation(svgID,buttonID,N_mol,scale){
var svg = d3.select("#" + svgID);
var width = +svg.attr("width");
var height = +svg.attr("height");
svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .style("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", 10);

const particleRadius = 20*scale;
const k = 10; // 弹簧常数
const dt = 0.02;
const gamma = 1; // 摩擦系数
const temperature = 100; // 温度
const kB = 1; // 玻尔兹曼常数
const alpha = 100;
const naturalDistance = 1.7 * particleRadius; // 两粒子之间的自然距离
// You can access the scale in a similar way

var time = 0;
const N_atom_per_list = 3;
const N_list = 6;
var N = (N_list*N_atom_per_list+1)*N_mol
function restartSimulation() {
svg.selectAll("*").remove(); // Clear previous SVG elements
svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .style("stroke", "black")
    .style("fill", "none")
    .style("stroke-width", 10);
const numParticles = N;
const numBond = N_atom_per_list*N_list*N_mol
if (N_mol>3){
    var colorScale = d3.scaleSequential(d3.interpolateRainbow)
    .domain([0, N_mol]);
}
else{
    var colorScale = d3.scaleOrdinal()
    .domain([0, N_mol-1])
    .range(["rgba(0,47,167)", "rgba(187,151,39)", "rgba(84,179,69)"]);
}
    
const bondData = Array(numBond).fill().map((_, i) => ({
    l: 0,
    r: 0,
}));
const bond_tmp = Array(N_atom_per_list*N_list).fill().map((_, i) => ({
    l: 0,
    r: 0,
}));
const particlesData = Array(numParticles).fill().map((_, i) => ({
    x: i * (particleRadius * 2 + 10) + particleRadius + 10,
    y: 0.5*height + (Math.random() - 0.5) * 0.4*height,
    vx: 0,
    vy: 0,
    fx: 0,
    fy: 0,
    molecule: Math.floor(i / ((N_list * N_atom_per_list) + 1))
}));
var index = 0
particlesData[0].x = (particleRadius * 2 + 10) + particleRadius + 10;
particlesData[0].y = 0.5*height + (Math.random() - 0.5) * 0.4*height;
for (let i = 0; i < N_list ; i++) {
    for (let j = 0; j < N_atom_per_list ; j++){
        if (j == 0)
        {
            bond_tmp[index].l = 0;
        }
        else{
            bond_tmp[index].l = index ;
        }
        bond_tmp[index].r = index+1;
        particlesData[index+1].x = particlesData[index].x + (Math.random() - 0.5) * 100;
        particlesData[index+1].y = 250 + (Math.random() - 0.5) * 100;
        // console.log("index "+index+" i "+bond_tmp[index].l+"j "+bond_tmp[index].r)
        index = index +1
    }
}
var index_bond =0;
for (let i = 0; i < N_mol ; i++) {
    for (let j = 0; j < N_list*N_atom_per_list ; j++){
        bondData[index_bond].r = bond_tmp[j].r + i*(N_list*N_atom_per_list+1)
        bondData[index_bond].l = bond_tmp[j].l + i*(N_list*N_atom_per_list+1)
        // console.log("bond index "+index_bond+" i "+bondData[index_bond].l+"j "+bondData[index_bond].r)
        index_bond = index_bond +1
    }
}

// Draw bonds (lines) between particles
    
const coarseGrainedMolecules = svg.selectAll(".coarse-grained")
    .data(Array.from({ length: N_mol }).map((_, i) => computeCenterOfMass(i, particlesData)))
    .enter()
    .append("circle")
    .attr("class", "coarse-grained")
    .attr("r", particleRadius * 4)
    .style("fill", (d, i) => colorScale(i))
    .style("stroke", "black")
    .style("stroke-width", 2)
    .style("stroke-dasharray", "5,5")
    .style("opacity", 0.5);
const bonds = svg.selectAll(".bond")
    .data(bondData)
    .enter()
    .append("line")
    .attr("class", "bond")
    .attr("x1", d => particlesData[d.l].x)
    .attr("y1", d => particlesData[d.l].y)
    .attr("x2", d => particlesData[d.r].x)
    .attr("y2", d => particlesData[d.r].y)
    .style("stroke-width", 2);

const particles = svg.selectAll(".particle")
    .data(particlesData)
    .enter()
    .append("circle")
    .attr("class", "particle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", particleRadius/2)
    .style("fill", d => colorScale(d.molecule));



    
function randomForce() {
    return Math.sqrt(2 * gamma * kB * temperature/dt) * (Math.random() - 0.5);
}

function computeCenterOfMass(moleculeIndex, particlesData) {
    let totalX = 0;
    let totalY = 0;
    let count = 0;

    for (let particle of particlesData) {
        if (particle.molecule === moleculeIndex) {
            totalX += particle.x;
            totalY += particle.y;
            count++;
        }
    }

    return {
        x: totalX / count,
        y: totalY / count
    };
}

    async function animate() {
    await sleep(50);
    for (let i = 0; i < numParticles ; i++) {
        const particle1 = particlesData[i];
        particle1.fx = 0;
        particle1.fy = 0;
    }

    for (let i = 0; i < numBond; i++) {
        const particle1 = particlesData[bondData[i].r];
        const particle2 = particlesData[bondData[i].l];
        const delx = particle1.x - particle2.x;
        const dely = particle1.y - particle2.y;
        const rsq = delx*delx + dely*dely
        const r = Math.sqrt(rsq);
        const dr = (r - naturalDistance)
        const rk = k * dr;
        const fbond = -2.0*rk/r;
        particle2.fx -= delx*fbond;
        particle2.fy -= dely*fbond;
        particle1.fx += delx*fbond;
        particle1.fy += dely*fbond;
    }

    for (let i = 0; i < numParticles - 1; i++) {
        for (let j = i+1; j < numParticles ; j++) {
        const particle1 = particlesData[i];
        const particle2 = particlesData[j];
        const delx = particle1.x - particle2.x;
        const dely = particle1.y - particle2.y;
        const rsq = delx*delx + dely*dely
        if (rsq<(naturalDistance)**2){
        const r = Math.sqrt(rsq);
        const dr = (r - naturalDistance)
        const wr = 1.0 - r/(naturalDistance);

        const fpair = alpha*wr;

        const rk = k * dr;

        particle2.fx -= delx*fpair;
        particle2.fy -= dely*fpair;
        particle1.fx += delx*fpair;
        particle1.fy += dely*fpair;
        }
    }
    }
    for (let i = 0; i < numParticles; i++) {
        const particle1 = particlesData[i];
        particle1.fx -= 10*Math.sin(2*Math.PI*particle1.x/width+time);
        particle1.fy -= 10*Math.cos(2*Math.PI*particle1.y/height+time);

        // console.log( Math.sin(2*Math.PI*particle1.x/width +time ))
    }
    for (let i = 0; i < numParticles ; i++) {
    const particle1 = particlesData[i];
    particle1.fx += - gamma * particle1.vx + randomForce();
    particle1.fy += - gamma * particle1.vy + randomForce();
    }
    for (let i = 0; i < numParticles ; i++) {
        const particle1 = particlesData[i];
        particle1.vx += dt*particle1.fx;
        particle1.vy += dt*particle1.fy;

    }

    for (let i = 0; i < numParticles ; i++) {
        const particle1 = particlesData[i];
        particle1.x += dt*particle1.vx;
        particle1.y += dt*particle1.vy;
    }
    time = time+ dt;
    const boundaryBuffer = 2; // half of the stroke-width of the boundary
    for (let i = 0; i < numParticles; i++) {
        const particle = particlesData[i];
        if (particle.x < particleRadius + boundaryBuffer) {
            particle.x = particleRadius + boundaryBuffer + (particleRadius + boundaryBuffer - particle.x);
            particle.vx = -particle.vx;

        }
        if (particle.x > width - particleRadius - boundaryBuffer) {
            particle.x = width - particleRadius - boundaryBuffer - (particle.x - width + particleRadius + boundaryBuffer);
            particle.vx = -particle.vx;
        }
        if (particle.y < particleRadius + boundaryBuffer) {
            particle.y = particleRadius + boundaryBuffer + (particleRadius + boundaryBuffer - particle.y);
            particle.vy = -particle.vy;

        }
        if (particle.y > height - particleRadius - boundaryBuffer) {
            particle.y = height - particleRadius - boundaryBuffer - (particle.y - height + particleRadius + boundaryBuffer);
            particle.vy = -particle.vy;
        }
    }
    
    bonds.attr("x1", d => particlesData[d.l].x)
        .attr("y1", d => particlesData[d.l].y)
        .attr("x2", d => particlesData[d.r].x)
        .attr("y2", d => particlesData[d.r].y);

    particles.attr("cx", d => d.x).attr("cy", d => d.y);



    coarseGrainedMolecules.data(Array.from({ length: N_mol }).map((_, i) => computeCenterOfMass(i, particlesData)))
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);


    requestAnimationFrame(animate);
}
    animate();
}
document.getElementById(buttonID).addEventListener("click", function() {
    if (document.getElementById("WInput")==null){
        restartSimulation();
    }
    else{
        const newMolValue = parseInt(document.getElementById("molInput").value, 10);
        const newW = parseInt(document.getElementById("WInput").value, 10);
        const newH = parseInt(document.getElementById("HInput").value, 10);
    
    
        if (newMolValue > 0) {
            N_mol = newMolValue;
        }
    
        if (newW >= 100) {
            width = newW;
            svg.attr("width", width);
        }
        if (newH >= 100) {
            height = newH;
            svg.attr("height", height);
        }
        N = (N_list * N_atom_per_list + 1) * N_mol;
        numParticles = N;
        restartSimulation();
    }
});


restartSimulation(); // Call this to start the simulation initially
}