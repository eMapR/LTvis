
// load the datasets into the download modal when the page is ready
$(document).ready(function() {
	$("#dataListDL").append('<h4>WAORCA</h4>')
		for (var i = 0; i < dataSets.WAORCA.length; i++) {
	            var dataInfo = dataSets.WAORCA[i]
		    //console.log(dataInfo)
		    var value1 = dataInfo.id; //NEW
		    var queryString = "?para1=" + value1; //NEW
		    $("#dataListDL").append('<div><input class="w3-check dataListDL" type="checkbox" value="'+dataInfo.id+'"><label style="font-family: calibri, sans-serif; font-size: 13pt;"> '+dataInfo.name+'</label><a href='+dataInfo.metaDataURL+ queryString +', target="_blank","width="+innerWidth+"px, height=750px", "toolbar=0","titlebar=0","menubar=0","scrollbars=yes"><i class="fa fa-question-circle w3-right" style="margin-top:6px; aria-hidden="true"></i></a></div>')
    	}

  	$("#dataListDL").append('<h4>CONUS</h4>')
		for (var i = 0; i < dataSets.CONUS.length; i++) {
    			var dataInfo = dataSets.CONUS[i]
			//console.log(dataInfo)
			var value1 = dataInfo.id; //NEW
			var queryString = "?para1=" + value1; //NEW
			$("#dataListDL").append('<div><input class="w3-check dataListDL" type="checkbox" value="'+dataInfo.id+'"><label style="font-family: calibri, sans-serif; font-size: 13pt;"> '+dataInfo.name+'</label><a href='+dataInfo.metaDataURL+ queryString +', target="_blank","width="+innerWidth+"px, height=750px", "toolbar=0","titlebar=0","menubar=0","scrollbars=yes"><i class="fa fa-question-circle w3-right" style="margin-top:6px; aria-hidden="true"></i></a></div>')
  	}

  	$("#dataListDL").append('<h4>Disturbance</h4>')
		for (var i = 0; i < dataSets.Disturbance.length; i++) {
    			var dataInfo = dataSets.Disturbance[i]
			//console.log(dataInfo)
			var value1 = dataInfo.id; //NEW link to metadata page 
			var queryString = "?para1=" + value1; //NEW link to metadata page 
			$("#dataListDL").append('<div><input class="w3-check dataListDL" type="checkbox" value="'+dataInfo.id+'"><label style="font-family: calibri, sans-serif; font-size: 13pt;"> '+dataInfo.name+'</label><a href='+dataInfo.metaDataURL+ queryString +', target="_blank","width="+innerWidth+"px, height=750px", "toolbar=0","titlebar=0","menubar=0","scrollbars=yes"><i class="fa fa-question-circle w3-right" style="margin-top:6px; aria-hidden="true"></i></a></div>')
  	}

        $("#dataListDL").append('<h4>Bugnet R6</h4>')
                for (var i = 0; i < dataSets.Bugnet.length; i++) {
                        var dataInfo = dataSets.Bugnet[i]
                        console.log(dataInfo)
                        var value1 = dataInfo.id; //NEW link to metadata page 
                        var queryString = "?para1=" + value1; //NEW link to metadata page 
                        $("#dataListDL").append('<div><input class="w3-check dataListDL" type="checkbox" value="'+dataInfo.id+'"><label style="font-family: calibri, sans-serif; font-size: 13pt;"> '+dataInfo.name+'</label><a href='+dataInfo.metaDataURL+ queryString +', target="_blank","width="+innerWidth+"px, height=750px", "toolbar=0","titlebar=0","menubar=0","scrollbars=yes"><i class="fa fa-question-circle w3-right" style="margin-top:6px; aria-hidden="true"></i></a></div>')
        }
});

$(document).ready(function() {
	var ardRows = [];
	for (var i = 0; i <= 21; i++) {
	   $("#ardRow").append('<option value="'+i+'">'+i.toString()+'</option>')
	   //ardRows.push(i);
	}
	var ardCols = [];
	for (var i = 0; i <= 32; i++) {
	   $("#ardCol").append('<option value="'+i+'">'+i.toString()+'</option>')
	   //ardCols.push(i);
	}	
});

$("#dataSubmit").click(function(){
	$("#message").html("")
	var holder = {}
	
	// get the data types selected
	var theseData = []
	$(".dataListDL").each(function(i){
		if($(this).prop("checked")){
			var dataID = $(this).prop("value")
 		//dataSets.forEach(function(obj){
    for (i in dataSets) {
      for (q in dataSets[i]) {
        if(dataID == dataSets[i][q].id){
					  theseData.push(dataID)                      
				  }
        }
    }
		//	});
		}
   console.log(theseData);
	});

	// check to make sure data was selected
	bad = 0
	if(theseData.length == 0){
		$("#message").append("<p>Error: There are no data selected for download. Please select data you want to download.</p>")
		bad += 1
	}

	// get/check the email
	var email = $("#email").val()
	if(email == ''){
		//$("#message").append("<p>Error: There is no email address provided. We will email you a link to retrieve the requested data. Please include a valid email address.</p>")
		bad += 1
	}

  //slices values in list for holder
	cleanList = [];
  hvlist.forEach(function(element) {
    var part = element.slice(5, 11);
    cleanList.push(part)
    });

    // check list for values and get values from list
  if (cleanList.length === 0) {
    $("#message").append("<p>Error: There is no ARD tiles selected. We will crop a section of data defined by ARD tile. Please select an ARD tile by double clicking a tile on the ARD grid.</p>")
    bad += 1
	}
 
	// get the rows and cols
	//var ardCol = $("#ardCol").val()
	//if(ardCol == null){
	//	$("#message").append("<p>Error: There is no ARD column select. We will crop a section of data defined by ARD tile column and row. Please select an ARD tile column.</p>")
	//	bad += 1
//	}

//	var ardRow = $("#ardRow").val()
	//if(ardRow == null){
	//	$("#message").append("<p>Error: There is no ARD row select. We will crop a section of data defined by ARD tile column and row. Please select an ARD tile row.</p>")
		//bad += 1
//}

	if(bad != 0){return};

	// get ard tile id
	//ardCol = ('00'+ardCol.toString()).substring(ardCol.toString().length);
	//ardRow = ('00'+ardRow.toString()).substring(ardRow.toString().length);
//	var polyValue = 'h'+ardCol+'v'+ardRow

	// fill in the holder
	console.log(theseData)
	holder.data = theseData;
	holder.email = email;
	holder.polyPath = "/data/vectors/vis/conus_ard_grid_epsg5070.geojson";
	holder.polyKey = "ARD_tile";
	holder.polyValue = cleanList; //changed from polyValue
	console.log(holder);
	//$("#message").append("<p>Your request is being processed. You'll receive download links in an email from 'eMapR Lab' when processing is complete. Note that we are still working on error handling - if you do not receive an email regarding your request within 24 hours, please contact Peter at clarype@oregonstate.edu</p>")
	//$("#message").append("<p>NOTICE! Your request is being processed and an email with your data link will be sent to the email you provided. If you don't receive an email within 12 hours please email Peter at clarype@oregonstate.edu </p>")
	$("#message").append("<p>NOTICE! Your request is being processed and will be sent to the email provided. </p>")

	// serialize the data in the form     
	$.post("./php/dataRequest.php",
		holder,
		function(message, status) {
			$("#message").append(message);
		}
	);

});
