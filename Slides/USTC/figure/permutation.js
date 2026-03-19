const svg1 = d3.select("#canvas1").attr("viewBox", "0 0 150 150").attr("preserveAspectRatio", "xMidYMid meet");
const svg2 = d3.select("#canvas2").attr("viewBox", "0 0 150 150").attr("preserveAspectRatio", "xMidYMid meet");
const atoms1 = [
{cx: 90, cy: 45, color: "rgba(0,47,167)", name: "r1"},
{cx: 125, cy: 75, color: "rgba(187,151,39)", name: "y1"},
{cx: 90, cy: 115, color: "rgba(84,179,69)", name: "g1"},
];
const atoms2 = [
{cx: 90, cy: 45, color: "rgba(0,47,167)", name: "r1"},
{cx: 125, cy: 75, color: "rgba(187,151,39)", name: "y1"},
{cx: 90, cy: 115, color: "rgba(84,179,69)", name: "g1"},
];
let clickedAtoms1 = [];
let clickedAtoms2 = [];



const circles1 = svg1.selectAll("circle")
.data(atoms1)
.enter()
.append("circle")
.attr("cx", d => d.cx)
.attr("cy", d => d.cy)
.attr("r", 20)
.style("fill", d => d.color)
.on("mouseover", function (d, i) {
    d3.select(this)
        .transition()
        .duration(300)
        .attr("r", 30);
})
.on("mouseout", function (d, i) {
    d3.select(this)
        .transition()
        .duration(300)
        .attr("r", 20);
})
.on("click", function (d, i) {
    if (clickedAtoms1.length < 3) {
        clickedAtoms1.push(d); // store the atom object, not the index
        svg1.append("text")
            .attr("x", d.cx) // use d.cx and d.cy, not i.cx and i.cy
            .attr("y", d.cy)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("fill", "white")
            .style("font-size", "20px")
            .text(clickedAtoms1.length);
        updateEquation1();
    }
});

const circles2 = svg2.selectAll("circle")
.data(atoms2)
.enter()
.append("circle")
.attr("cx", d => d.cx)
.attr("cy", d => d.cy)
.attr("r", 20)
.style("fill", d => d.color)
.on("mouseover", function (d, i) {
    d3.select(this)
        .transition()
        .duration(300)
        .attr("r", 30);
})
.on("mouseout", function (d, i) {
    d3.select(this)
        .transition()
        .duration(300)
        .attr("r", 20);
})
.on("click", function (d, i) {
    if (clickedAtoms2.length < 3) {
        clickedAtoms2.push(d);
        svg2.append("text")
            .attr("x", d.cx)
            .attr("y", d.cy)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("fill", "white")
            .style("font-size", "20px")
            .text(clickedAtoms2.length);
        updateEquation2();
    }
});
function updateEquation1() {
for (let i = 0; i < 3; i++) {
    if (i < clickedAtoms1.length) {
        let color = clickedAtoms1[i].color;
        d3.select("#input1" + (i + 1))
            .style("color", color)
            .text("Q" + (i + 1));
        for (let j = 1; j <= 7; j++) {
            d3.select("#gamma1" + (i + 1) + j)
                .style("color", color);
        }
    } else {
        d3.select("#input1" + (i + 1))
            .style("color", "black")
            .text(" ");
    }
}
}

function updateEquation2() {
for (let i = 0; i < 3; i++) {
    if (i < clickedAtoms2.length) {
        console.log("color: ", clickedAtoms2[i]);
        d3.select("#input2" + (i + 1))
            .style("color", clickedAtoms2[i].color)
            .text("Q"+ ( i + 1));
        for (let j=1; j<=7;j++){
        d3.select("#gamma2"+ ( i + 1) +j)
            .style("color",clickedAtoms2[i].color);
        }
    } else {
        d3.select("#input2" + (i + 1))
            .style("color", "black")
            .text(" ");
    }
}
}
d3.select("#clearButton1")
.on("click", function () {
clickedAtoms1 = [];
svg1.selectAll("text").remove();
updateEquation1();
});
d3.select("#clearButton2")
.on("click", function () {
clickedAtoms2 = [];
svg2.selectAll("text").remove();
updateEquation2();
});