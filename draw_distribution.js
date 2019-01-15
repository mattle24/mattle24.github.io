// Adapted from http://bl.ocks.org/ilanman/10602996

const all_dists = create_dists(5); // create distributions

// Event Listeners

// Draw Distribution on Load
document.addEventListener('DOMContentLoaded', () => {
  for (var i = 0; i < all_dists.length; i ++) {
    chart(i, all_dists[i], "show");
  }
});

window.addEventListener('resize', () => {
  // if there are existing lines then remove them
  document.getElementById('graph').innerHTML = '';
  // let lines = document.querySelectorAll('.line');
  //
  // if (lines.length > 0) {
  //   lines.forEach(l => l.remove());
  // }

  for (var i = 0; i < all_dists.length; i ++) {
    chart(i, all_dists[i], "show");
  }
});

var svg = d3.select("#myHeader")
            .append("svg")
            .attr("id", "graph");

// styling vars
// var margin = {top: 0, right: 0, bottom: 0, left: 0},
//     w = window.innerWidth,
//     h = window.innerHeight * .45;
//
// var x = d3.scale.linear()
//         .domain([0, 900])
//         .range([0, w]);
//
// var y = d3.scale.linear()
//         .domain([0, 1])
//         .range([h, 0]);
//
// var xAxis = d3.svg.axis()
//               .scale(x)
//               .orient("bottom");
//
// var yAxis = d3.svg.axis()
//               .scale(y)
//               .orient("left");
//
// var line = d3.svg.line()
//         .x(function(d) { return x(d[0]); })
//         .y(function(d) { return y(d[1]); });

// Functions

// Create array holding arrays of pdf values for Chi Sq distributions
// with 1-5 df
function create_dists(dfDraw = 5) {

    let chiSqrs = [];
    let new_dist = [];
    for (var df = 1; df <= dfDraw; df ++) {
      new_dist = [];
      new_dist.push( gamma_pdf(df, 1/2, df/2) );
      for (var i = .000001; i < 50; i += 0.02) {
        new_dist.push( gamma_pdf(i, 1/2, df/2) );
      }
      chiSqrs[df - 1] = new_dist;
    }

    // The mapping takes each array of pdfs and return
    // an array of tuples, where each tuple is the index position
    // and a pdf value
    chiSqrs.forEach((element, ind) => {
      chiSqrs[ind] = element.map((d, i) => {
        return [i, d];
      });
    });

    return chiSqrs; // [norm, exp, log, pareto, gamma];
}

function chart(func, data, op){
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        w = window.innerWidth,
        h = window.innerHeight * .45;

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

    // add element and transition in
    var path = svg.append('path')
        .attr('class', 'line')
        .style("stroke","white")
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
