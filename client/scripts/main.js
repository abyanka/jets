import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';

document.addEventListener('DOMContentLoaded', () => {
  // make hover effects work on touch devices
  oHoverable.init();

  // remove the 300ms tap delay on mobile browsers
  attachFastClick(document.body);

  // YOUR CODE HERE!



var styles = {
    'text':{
        'font-family':'Metric, sans-serif'
    },
    'rect' :{
        'stroke-width':'1',
        'stroke':'#ccc'
    },
    '.label':{ 
        'text-anchor':'end' 
    },
    '.title':{ 
        'font-size':'21' 
    },
    '.subtitle':{ 
        'font-size':'14' 
    },
    '.source':{ 
    'font-size':'12' 
    },
    '.circles':{ 
        'fill-opacity':'0.4',
        'stroke-width':'1'
    },
    '.axis path, .axis line':{
        'fill':'none',
        'stroke': '#777',
        'shape-rendering': 'crispEdges'
    },
    '.axis text':{
        'font-family':'Metric,sans-serif',
        'font-size':'11'
    },
    '#y-axis text':{
        'text-anchor':'end'
    }

}    
    
    

//Configuration
var dataLocation = 'jetscatter.csv';
var title='Spending on jet perks by S&P500 comapanies';
var subtitle='$&#39;000, in 2014';
var source='Source: Securities and Exchanges Commission';
var colours=['#4479b8','#ea9942','#454545','#87b700','#a765a6','#8f7666','#aa0016'];
var circleSize= 2;

//general layout information
var margin = {
    top:80,
    left:50,
    bottom:50,
    right:30
};
var padding = 30;
var width=600;
var height = 600;
var plotWidth = width - (margin.left + margin.right);
var plotHeight = height - (margin.top + margin.bottom);


//date formatter, matching the format of the incoming csv...
var dateFormat = d3.time.format('%Y'); //in the example case the data is per years



function drawChart(error, data) {
    //convert your csv data into an array of arrays
    var coords = new Array();

    data.forEach(function(d)   {
        coords.push([d.x,d.y,d.name]);
    });

    //setup x and y arrays to find range
    var x = new Array();
    var y = new Array();

        data.forEach(function(d)   {
        x.push(d.x);
        y.push(d.y);
    });    

    //establish data range

    var x =x.sort(sortFunction);
    var xRange = [x[0],x[x.length-1]];

    var y =y.sort(sortFunction);
    var yRange = [0,y[y.length-1]];

    //set up the scale we will use for plotting our scatter plot
    var xScale = d3.scale.linear()
        .domain(xRange)
        .range([0, width-(margin.left+margin.right)]);

    var yScale = d3.scale.linear()
    .domain(yRange)
    .range([height-(margin.top+margin.bottom),0]);
 

    
    //define axes based on the scale
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');
    
    //set up document structure
    var svg = d3.select('div#scatter')
        .append('svg')
            .attr({
                'width': width,
                'height': height
            });
    
    //title
    svg.append('text')
        .attr('y',20)
        .attr('class','title')
        .text(title);
    
     svg.append('text')
        .attr('y',40)
        .attr('class','subtitle')
        .text(subtitle);
    
    svg.append('text')
        .attr({
            'y':function(){
                return height-5;
            },
            'class':'source'
        })
        .text(source);

    //axes

    var axes = svg.append('g')
            .attr({ 
                'class':'axes',
                'id':'axes',
                'transform':'translate(0,' + margin.top + ')' 
            });

    axes.append('g')
        .attr({
            'id': 'x-axis',
            'class': 'x axis',
            'transform': 'translate('+margin.left+','+plotHeight+')'
        })
        .call(xAxis);


    axes.append('g')
        .attr({
            'class': 'y axis',
            'id': 'y-axis',
            'transform': 'translate('+margin.left+',0)'
        })
        .call(yAxis)    

    var plot = svg.append('g')
            .attr({ 
                'id':'plot',
                transform:'translate(' + margin.left + ',' + margin.top + ')' 
            });

    var circles = plot.selectAll('circle')
        .data(coords)
        .enter()
        .append('circle')
            .attr({
                'class':'circles',
                'cx': function(d) { return xScale(d[0]) },
                'cy': function(d) { return yScale(d[1]) },
                'r': circleSize,
                'id': function(d) { return d[2] },
                'fill': colours[0]
            });
  
    //apply the styles as attributes
    d3.selectAll('*').attr('style','');
    Object.keys(styles).forEach(function(selector){
        d3.selectAll(selector)
            .attr(styles[selector]);
    });
    
    //sort function
    function sortFunction(a,b)    {
        return a-b;   
    }
    
    function daydiff(a,b)   {
        return Math.round((b-a)/(1000 * 60 * 60 * 24));   
    }
}  

d3.csv(dataLocation, drawChart);


});
