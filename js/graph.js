
var margin = { top: 30, right: 400, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    tooltip = { width: 100, height: 100, x: 10, y: -30 };

var parseDate = d3.time.format("%Y").parse,
    bisectDate = d3.bisector(function(d) { return d.year; }).left,
    formatValue = d3.format(","),
    dateFormatter = d3.time.format("%Y");

var x = d3.time.scale()
        .range([0, width]);

var y = d3.scale.linear()
        .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(dateFormatter);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.hdi); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data/hdi-bf.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
        d.year = parseDate(d.year);
        d.hdi = +d.hdi;
    });

    data.sort(function(a, b) {
        return a.year - b.year;
    });

    x.domain([data[0].year, data[data.length - 1].year]);
    y.domain([0, 1]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-size","14px")
        .text("L'Indice de développement humain");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("circle")
        .attr("r", 5);

    focus.append("rect")
        .attr("class", "tooltip")
        .attr("width", 380)
        .attr("height", 140)
        .attr("x", 10)
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

    focus.append("text")
        .attr("x", 18)
        .attr("y", -2)
        .text("Year: ");

    focus.append("text")
        .attr("class", "tooltip-year")
        .attr("x", 55)
        .attr("y", -2);

    focus.append("text")
        .attr("x", 18)
        .attr("y", 18)
        .text("IDH: ");

    focus.append("text")
        .attr("class", "tooltip-hdi")
        .attr("x", 50)
        .attr("y", 18);

    focus.append("text")
        .attr("x", 18)
        .attr("y", 38)
        .text("Espérance de la vie à la naissance (ans): ");

    focus.append("text")
        .attr("class", "tooltip-le")
        .attr("x", 275)
        .attr("y", 38);

    focus.append("text")
        .attr("x", 18)
        .attr("y", 58)
        .text("Niveau d’éducation des enfants de 17 ans de plus (ans): ");

    focus.append("text")
        .attr("class", "tooltip-eys")
        .attr("x", 370)
        .attr("y", 58);

    focus.append("text")
        .attr("x", 18)
        .attr("y", 78)
        .text("Années de scolarisation moyenne: ");

    focus.append("text")
        .attr("class", "tooltip-mys")
        .attr("x", 235)
        .attr("y", 78);

    focus.append("text")
        .attr("x", 18)
        .attr("y", 98)
        .text("PIB par habitant (PPA 2017 USD): ");

    focus.append("text")
        .attr("class", "tooltip-gnipc")
        .attr("x", 155)
        .attr("y", 98);

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.year > d1.year - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.year) + "," + y(d.hdi) + ")");
        focus.select(".tooltip-year").text(dateFormatter(d.year));
        focus.select(".tooltip-hdi").text(formatValue(d.hdi));
        focus.select(".tooltip-le").text(formatValue(d.le));
        focus.select(".tooltip-eys").text(formatValue(d.eys));
        focus.select(".tooltip-mys").text(formatValue(d.mys));
        focus.select(".tooltip-gnipc").text(formatValue(d.gnipc));
    }
});
