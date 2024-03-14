// add a click event listener to each of the maps for when a time series should be plotted
/*$(document).ready(function() {
	//$('#click').click(function(){
	//map.on('click', function(e){plotMultiTimeSeriesData({'lon':e.latlng.lng, 'lat':e.latlng.lat})})
	map.on('click', function (e) {
        if ($('.overlayList').data('waschecked')=== true) {
            console.log('hideplot');
            hidePlot();

        } else {
            $('#latlong').empty();
        	plotPixelTimeSeries(e)
    	}
	});
	flickerMap.on('click', function (e) {
        if ($('.overlayList').data('waschecked')=== true) {
            console.log('hideplot');
            hidePlot();
        } else {
            $('#latlong').empty();
            plotPixelTimeSeries(e)
        }
	});
	map1.on('click', function (e) {
        if ($('.overlayList').data('waschecked')=== true) {
            console.log('hideplot');
            hidePlot();
        } else {
            $('#latlong').empty();
            plotPixelTimeSeries(e)
        }
	});
	map2.on('click', function (e) {
        if ($('.overlayList').data('waschecked')=== true) {
            console.log('hideplot');
            hidePlot();
        } else {
            $('#latlong').empty();
            plotPixelTimeSeries(e)
        }
	});
	map3.on('click', function (e) {
        if ($('.overlayList').data('waschecked')=== true || $('.leaflet-sbs-range').is(':hover') === true ) {
            console.log('hideplot');
            hidePlot();
        } else {
        	$('#latlong').empty();
            plotPixelTimeSeries(e)
        }
	})
});


function getMaxOfArray(numArray) {
	return Math.max.apply(null, numArray);
}




var nlcdDisplay = {
	11: {
		color: '#476ba1',
		label: 'Open Water'
	},
	12: {
		color: '#d1defa',
		label: 'Perennial Ice/Snow'
	},
	21: {
		color: '#decaca',
		label: 'Developed, Open Space'
	},
	22: {
		color: '#d99482',
		label: 'Developed, Low Intensity'
	},
	23: {
		color: '#ee0000',
		label: 'Developed, Medium Intensity'
	},
	24: {
		color: '#ab0000',
		label: 'Developed High Intensity'
	},
	31: {
		color: '#b3aea3',
		label: 'Barren Land (Rock/Sand/Clay)'
	},
	41: {
		color: '#68ab63',
		label: 'Deciduous Forest'
	},
	42: {
		color: '#1c6330',
		label: 'Evergreen Forest'
	},
	43: {
		color: '#b5ca8f',
		label: 'Mixed Forest'
	},
	51: {
		color: '#a68c30',
		label: 'Dwarf Scrub'
	},
	52: {
		color: '#ccba7d',
		label: 'Shrub/Scrub'
	},
	71: {
		color: '#e3e3c2',
		label: 'Grassland/Herbaceous'
	},
	72: {
		color: '#caca78',
		label: 'Sedge/Herbaceous'
	},
	73: {
		color: '#99c247',
		label: 'Lichens'
	},
	74: {
		color: '#78ae94',
		label: 'Moss'
	},
	81: {
		color: '#dcd93d',
		label: 'Pasture/Hay'
	},
	82: {
		color: '#ab7028',
		label: 'Cultivated Crops'
	},
	90: {
		color: '#bad9eb',
		label: 'Woody Wetlands'
	},
	95: {
		color: '#70a3ba',
		label: 'Emergent Herbaceous Wetlands'
	}
}
*/
// function to fire up the data dir on the server on page load, so the user does not have to wait so long for first load
function wakeData(){
	console.log('waking up data')
	var coords = {lon: -122.83538818359375, lat: 44.006644643819655, dataPath: "/data/maps/WAORCA_biomass/crm/default.vrt"}	
	$.post("./php/request_handler.php",
		coords,
		function(data, status) {}
	)
}

wakeData();
//$( document ).ready(wakeData());



// function to
var firstPlotClick = true 
function plotPixelTimeSeries(e) {
	console.log(dataSet)
  //console.log(e)
	//if (e.originalEvent.srcElement.className == 'leaflet-sbs-range') {
	//	return
	//} // if clicked on the swipe slider - get out

	if (lastActiveSection == 'multiPointContainer') {
		return
	}


	if ($("#plot").not(":visible")) {
		$("#plot").show();
	}

	// show hide the layer legend
	$("#spinner").toggle("fast", function() {});
  

	var coords = {
		'lon': e.latlng.lng,
		'lat': e.latlng.lat,
		'dataPath': dataSet.dataPath
	}

	console.log(coords)

	// serialize the data in the form     
	$.post("./php/request_handler.php",
		coords,
		function(data, status) {
			$("#spinner").toggle("fast", function() {});
                        console.log(data)
                        console.log(status)
                        try{
			    var data = JSON.parse(data);
                        }catch (error){
                            console.error("error:",error)
                        }
			// defaults to continuous plot characteristics
			var plotType = 'lines' // lines+markers
			var markerSize = '8'
			var pointColor = []
			var pointText = ''
			var hoverInfo = 'x+y'
			var yAxisVis = true
			var tsMax = getMaxOfArray(data.ts)*dataSet.scalar
			var yMin = dataSet.yMin
			var yMax = (tsMax > dataSet.yMax ? tsMax + 100 : dataSet.yMax);

			if (dataSet.dType == "categorical") {
				plotType = 'markers'
				yAxisVis = false
				markerSize = dataSet.markerSize
				pointText = []
				hoverInfo = 'x+text'
				console.log(data.ts)
				data.ts.forEach(function(i) {
					console.log(i)
					pointColor.push(dataSet.plotDisplay[i].color)
					pointText.push(dataSet.plotDisplay[i].label)
				});

				data.ts = Array.from({
					length: data.ts.length
				}, () => 50); // set all the values to 50 so it plots straight down the middle
			} else if(dataSet.dType === "continuous" && dataSet.scalar !== 1){
				for(var i=0; i<data.ts.length;i++){
					data.ts[i] = data.ts[i]*dataSet.scalar
				}
			}

			// set up the trace
      var years = [];
      for (var yr=dataSet.minYear;yr <=dataSet.maxYear;yr++){years.push(yr)}
			var trace1 = {
				x: years, //data.yr
				y: data.ts,
				type: 'scatter',
				mode: plotType,
				line: {
					color: '#498AF3', //'#D62851',
					width: '6'
				},
				marker: {
					color: pointColor,
					size: markerSize
				},
				hoverinfo: hoverInfo,
				hovertext: pointText
			};

			// set up the plot
			var plotlyData = [trace1];
			var layout = {
				showlegend: false,
				paper_bgcolor: 'rgba(255,255,255,0)',
				plot_bgcolor: 'rgba(255,255,255,0)',
				width: 800,
				height: 170,
				margin: {
					l: 45,
					r: 10,
					t: 10,
					b: 30
				},
				xaxis: {
					gridcolor: '#545454',
					title: 'Year',
					titlefont: {
						family: 'Arial, sans-serif',
						size: 12,
						color: 'grey'
					},
				},
				yaxis: {
					//type: 'log',
					//autorange:true,
					visible: yAxisVis,
					range: [yMin, yMax],
					gridcolor: '#545454',
					title: dataSet.yAxisLab,
					titlefont: {
						family: 'Arial, sans-serif',
						size: 12,
						color: 'grey'
					},
				}
			};

			Plotly.newPlot('plot', plotlyData, layout, {
				scrollZoom: true,
				displaylogo: false,
				displayModeBar: false
			});
      if(firstPlotClick === true){
        $("#latlong").append("Lat: "+ Number(Math.round(e.latlng.lat+'e5')+'e-5')+ ", Lon: "+Number(Math.round(e.latlng.lng+'e5')+'e-5'));
        firstPlotClick = false
      }
      
		}
	);
  if(firstPlotClick === false){
    $("#latlong").append("Lat: "+ Number(Math.round(e.latlng.lat+'e5')+'e-5')+ ", Lon: "+Number(Math.round(e.latlng.lng+'e5')+'e-5'));
  }
}
