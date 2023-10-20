
let tolerance = 50;
let svg = document.getElementById('mySVG');
let line_ms = document.getElementById('line_ms');
let text_ms = document.getElementById('text_ms');
let text_me = document.getElementById('text_me');
let text_mi = document.getElementById('text_mi');
let text_ma = document.getElementById('text_ma');
let line_mi_me = document.getElementById('line_mi_me');
let line_me_ma = document.getElementById('line_me_ma');


let text1 = document.createElementNS("http://www.w3.org/2000/svg",'text');
let xLabels = ["Angstrom", "nm", "um", "mm", "m"]; // The labels for the x-axis
let xPos = 150; // The starting x position for the labels
let yPos = 575; // The y position for the labels
for (let i = 0; i < xLabels.length; i++) {
    let text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    text.setAttribute('x', xPos);
    text.setAttribute('y', yPos);
    text.setAttribute('font-size', 20);
    text.setAttribute('text-anchor', "middle");
    text.textContent = xLabels[i]; // Set the label text
    svg.appendChild(text); // Append the text element to the SVG
    xPos += 150; // Increase the x position for the next label
}
{
let text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
text.setAttribute('x', xPos);
text.setAttribute('y', yPos-35);
text.setAttribute('font-size', 20);
text.setAttribute('text-anchor', "middle");
text.textContent = "length scale";
svg.appendChild(text); // Append the text element to the SVG
}
let yLabels = ["fs", "ps", "ns" , "μs", "ms", "s", "h"];
xPos = 25; // The starting x position for the labels
yPos = 500; // The y position for the labels
for (let i = 0; i < yLabels.length; i++) {
    let text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    text.setAttribute('x', xPos);
    text.setAttribute('y', yPos);
    text.setAttribute('font-size', 20);
    text.setAttribute('text-anchor', "middle");
    text.textContent = yLabels[i]; // Set the label text
    svg.appendChild(text); // Append the text element to the SVG
    yPos -= 70; // Increase the x position for the next label
}
{
let text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
text.setAttribute('x', xPos+100);
text.setAttribute('y', yPos+35);
text.setAttribute('font-size', 20);
text.setAttribute('text-anchor', "middle");
text.textContent = "time scale";
svg.appendChild(text); // Append the text element to the SVG
}
let labels = ["Quantum Mechanics", "Classical Mechanics (MD)", "Stochastic Dynamics (CGMD)", "Continuum Mechanics"]; // The labels
let labels2 = [["Schrodinger Eq.","DFT"], ["Force Field model","Monte Carlo"], ["Lagevin Eq.", "DPD"], ["Navier Stokes Eq.","Euler Eq."]]; // The labels
let labels3 = [["Emperical","Many-electron wavefunction","Exchange–correlation Functionals"], ["Emperical","Potential Energy Surface"], ["Emperical","Free Energy Surface","Friction Tensor"], ["Emperical","Stress Strain relation","Collusion terms"]]; // The labels
let Figure = ['./figure/electron-removebg.gif','./figure/MD.gif','./figure/CG-removebg.gif','./figure/KH-removebg.gif']; // The labels
let Note = ['source: deepmind.com','source: wikimedia.org','source: lammps.org','source: wikipedia.org']; // The labels

let positions = [[180, 480], [360, 360], [540, 240], [720, 120]]; // The positions for the labels
for (let i = 0; i < labels.length; i++) {
    let text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    text.setAttribute('x', positions[i][0]);
    text.setAttribute('y', positions[i][1]);
    text.setAttribute('font-size', 20);
    text.setAttribute('text-anchor', "middle");
    text.setAttribute('width',10)
    text.textContent = labels[i]; // Set the label text
    svg.appendChild(text); // Append the text element to the SVG

    let bbox = text.getBBox(); // Get the bounding box after the text is rendered
    let text2 = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    text2.setAttribute('x', positions[i][0]+50);
    text2.setAttribute('y', positions[i][1]-5);
    text2.setAttribute('font-size', 20);
    text2.setAttribute('text-anchor', "middle");
    for (let j = 0 ;j <labels2[i].length; j++){
        let tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        tspan.textContent = labels2[i][j];
        tspan.setAttribute('x', text2.getAttribute("x"));
        tspan.setAttribute('dy', -25); // Move the second line down
        tspan.setAttribute('text-anchor', "middle");
        text2.appendChild(tspan);
    }
    text2.setAttribute('visibility','hidden')
    svg.appendChild(text2); // Append the text element to the SVG

    let text3 = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    text3.setAttribute('x', 250);
    text3.setAttribute('y', 80);
    text3.setAttribute('font-size', 20);
    text3.setAttribute('text-anchor', "middle");
    text3.setAttribute('visibility','hidden')
    for (let j = 0 ;j <labels3[i].length; j++){
        let tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        tspan.textContent = labels3[i][j];
        tspan.setAttribute('x', text3.getAttribute("x"));
        tspan.setAttribute('dy', 25); // Move the second line down
        tspan.setAttribute('text-anchor', "middle");
        text3.appendChild(tspan);
    }
    let tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
    tspan.setAttribute('x', text3.getAttribute("x"));
    tspan.textContent = "...";
    tspan.setAttribute('text-anchor', "middle");
    tspan.setAttribute('dy', 25); // Move the second line down
    text3.appendChild(tspan);
    svg.appendChild(text3);

    let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttribute('x', text.getAttribute('x')-140);
    rect.setAttribute('y', text.getAttribute('y')-20);
    rect.setAttribute('id', 'rect1');
    rect.setAttribute('fill', 'rgba(142,207,201,0.5)');
    rect.setAttribute('width', 280); // 20 is padding
    rect.setAttribute('height', 30); // 20 is padding
    svg.insertBefore(rect, text);

    let rect2 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect2.setAttribute('x', text2.getAttribute('x')-100);
    rect2.setAttribute('y', text2.getAttribute('y')-80);
    rect2.setAttribute('id', 'rect2');
    rect2.setAttribute('fill', "rgba(250,127,111,0.5)");
    rect2.setAttribute('width', 200); // 20 is padding
    rect2.setAttribute('height', 60); // 20 is padding
    rect2.setAttribute('text-anchor', "middle");
    rect2.setAttribute('visibility','hidden')
    svg.insertBefore(rect2, text2);

    let rect3 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect3.setAttribute('x', text3.getAttribute('x')-200);
    rect3.setAttribute('y', text3.getAttribute('y'));
    rect3.setAttribute('id', 'rect3');
    rect3.setAttribute('fill', "rgba(153,153,153,0.5)");
    rect3.setAttribute('width', 400); // 20 is padding
    rect3.setAttribute('height', 100); // 20 is padding
    rect3.setAttribute('text-anchor', "middle");
    rect3.setAttribute('visibility','hidden')
    svg.insertBefore(rect3, text3);


    let img = document.createElementNS("http://www.w3.org/2000/svg", 'image');
    img.setAttributeNS(null, 'height', '250');
    img.setAttributeNS(null, 'width', '250');
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', Figure[i]);
    img.setAttributeNS(null, 'x', '600');
    img.setAttributeNS(null, 'y', '250');
    img.setAttribute('text-anchor', "middle");
    svg.appendChild(img);
    let note = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    note.setAttributeNS(null, 'x', '725');
    note.setAttributeNS(null, 'y', '500');
    note.setAttributeNS(null, 'font-size', '16');
    note.setAttribute('text-anchor', "middle");
    note.textContent = Note[i];
    svg.appendChild(note);

    note.setAttribute('visibility','hidden')
    img.setAttribute('visibility','hidden')
    text.addEventListener('mouseover', function() {
        text2.style.visibility = 'visible';
        rect2.style.visibility = 'visible';
        text3.style.visibility = 'visible';
        rect3.style.visibility = 'visible';
        note.style.visibility = 'visible';
        img.style.visibility = 'visible';
        line_ms.style.visibility = 'hidden';
        text_ms.style.visibility = 'hidden';
        text_ma.style.visibility = 'hidden';
        text_me.style.visibility = 'hidden';
        text_mi.style.visibility = 'hidden';
        line_mi_me.style.visibility = 'hidden';
        line_me_ma.style.visibility = 'hidden';
    });

    text.addEventListener('mouseout', function() {
        text2.style.visibility = 'hidden';
        rect2.style.visibility = 'hidden';
        text3.style.visibility = 'hidden';
        rect3.style.visibility = 'hidden';
        note.style.visibility = 'hidden';
        img.style.visibility = 'hidden';
        line_ms.style.visibility = 'visible';
        text_ms.style.visibility = 'visible';
        text_ma.style.visibility = 'visible';
        text_me.style.visibility = 'visible';
        text_mi.style.visibility = 'visible';
        line_mi_me.style.visibility = 'visible';
        line_me_ma.style.visibility = 'visible';
    });
    
}


// Get bounding box of the text
// bbox = text1.getBBox();
// Get the SVG element's position
//let svgRect = svg.getBoundingClientRect();
//let rectX = bbox.x;
// rectY = bbox.y;
//rect.setAttribute('x', text1.getAttribute('x'));
//rect.setAttribute('y', text1.getAttribute('y'));
//.setAttribute('width', bbox.width + 20); // 20 is padding
//rect.setAttribute('height', bbox.height + 20); // 20 is padding
//console.log(text1.getAttribute('x'), rect.getAttribute('y'), rect.getAttribute('width'), rect.getAttribute('height'));
// Insert the rectangle before the text
//.appendChild(text1);
//svg.appendChild(rect);

//document.getElementById('rect1').addEventListener('mouseover', function() {
///    text2.style.visibility = 'visible';
//});

//document.getElementById('rect1').addEventListener('mouseout', function() {
//    text2.style.visibility = 'hidden';
//});