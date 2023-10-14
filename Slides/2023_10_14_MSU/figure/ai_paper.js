document.addEventListener("DOMContentLoaded", function() {
    // 1. 定义数据
    var data = {
        name: "Ai4Science",
        children: [
            {
                name: "DL4QM",
                children: [
                    { name: "Author1 et al." }
                ]
            },
            {
                name: "DL4MD",
                children: [
                    { name: "Author2 et al." }
                ]
            }
        ]
    };

    // 2. 设置SVG和尺寸
    var width = 400;  // 修改为SVG的宽度
    var height = 400; // 修改为SVG的高度
    var svg = d3.select("#paper") // 使用正确的选择器
        .attr("width", width)
        .attr("height", height);

    // 3. 定义布局
    var treeLayout = d3.tree().size([height - 200, width]); // 修改为横向布局
    var root = d3.hierarchy(data);
    treeLayout(root);

    // 4. 绘制链接
    var links = svg.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal() // 修改为横向链接
            .x(d => d.y) // 交换x和y的坐标
            .y(d => d.x));

    // 5. 绘制节点
    var nodes = svg.selectAll(".node")
        .data(root.descendants())
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 10)
        .attr("cx", d => d.y) // 交换x和y的坐标
        .attr("cy", d => d.x);

    // 6. 添加标签
    svg.selectAll(".label")
        .data(root.descendants())
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => d.y + 15) // 根据需要调整标签的位置
        .attr("y", d => d.x)
        .text(d => d.data.name);




// 交互性：节点点击展开或折叠
nodes.on('click', function(event, d) {
    if (d.children) { // 如果节点有子节点
        d._children = d.children;
        d.children = null;
    } else { // 如果节点没有子节点
        d.children = d._children;
        d._children = null;
    }
    update(); // 更新视图
});
// 交互性：工具提示
nodes.append("title")
    .text(d => d.data.name);

function update() {
    // 重新计算布局
    treeLayout(root);

    // 更新链接
    svg.selectAll(".link")
        .data(root.links())
        .transition()
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    // 更新节点
    svg.selectAll(".node")
        .data(root.descendants())
        .transition()
        .attr("cx", d => d.y)
        .attr("cy", d => d.x);

    // 更新标签
    svg.selectAll(".label")
        .data(root.descendants())
        .transition()
        .attr("x", d => d.y + 15)
        .attr("y", d => d.x);
}
});
