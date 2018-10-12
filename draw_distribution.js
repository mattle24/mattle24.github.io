// Adapted from http://bl.ocks.org/ilanman/10602996

var margin = {top: 0, right: 0, bottom: 0, left: 0},
    w = screen.width,
    h = window.innerHeight * .45;

var n = [];
var e = [];
var l = [];
var p = [];
var g = [];

// my Chi-Squared distributions. names are for DF
var one = [];
var two = [];
var three = [];
var four = [];
var five = [];
var chiSquares = [one, two, three, four, five];

var x = d3.scale.linear()
        .domain([0, 900])
        .range([0, w]);

var y = d3.scale.linear()
        .domain([0, 1])
        .range([h, 0]);

var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");

var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

var line = d3.svg.line()
        .x(function(d) { return x(d[0]); })
        .y(function(d) { return y(d[1]); });

var svg = d3.select("#myHeader")
            .append("svg")
            .attr("id", "graph");

          // .append("g")
          //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Here is where the functions are called
all_dists = create_dists(n,e,l,p,g); // create distributions
for (var i = 0; i < all_dists.length; i ++) {
  chart(i, all_dists[i], "show");
}
// Create array holding arrays of pdf values for distributions
function create_dists(n,e,l,p,g){

    for (var i = .000001; i < 50; i += 0.02) {
        for (var df = 1; df <= chiSquares.length; df ++) {
          chiSquares[df - 1].push( gamma_pdf(df, 1/2, df/2) );
        }
        n.push(gamma_pdf(i, 1/2, 1/2));
        e.push(gamma_pdf(i, 1/2, 1));
        l.push(gamma_pdf(i, 1/2, 3/2));
        p.push(gamma_pdf(i, 1/2, 2));
        g.push(gamma_pdf(i, 1/2, 5/2));
    }

    // The mapping take each array of pdfs and return
    // an array of tuples, where each tuple is the index position
    // and a pdf value
    norm = n.map(function(d,i) {
            return[i,d];
        });
    exp = e.map(function(d,i) {
            return[i,d];
        })
    log = l.map(function(d,i) {
            return[i,d];
        })
    pareto = p.map(function(d,i) {
            return[i,d];
        })
    gamma = g.map(function(d,i) {
            return[i,d];
        })

    return [norm, exp, log, pareto, gamma];
}

function chart(func, data, op){
    // add element and transition in
    var path = svg.append('path')
        .attr('class', 'line')
        .attr('d', line(data[0]))
        .style("stroke","white")
        .on("mouseover", function(d) {
            div.transition()
                .style("opacity", .5);
            div.html(function() {
                switch (func){
                  case 0: return "df = 1"; break;
                  case 1: return "df = 2"; break;
                  case 2: return "df = 3"; break;
                  case 3: return "df = 4"; break;
                  case 4: return "df = 5"; break;
                }
            })
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .style("opacity", 0);
            })
       .transition()
         .duration(9000)
         .attrTween('d', pathTween);

    function pathTween() {
        var interpolate = d3.scale.quantile()
                .domain([0,1])
                .range(d3.range(1, data.length + 1));
        return function(t) {
            return line(data.slice(0, interpolate(t)));
        };
    }
}
