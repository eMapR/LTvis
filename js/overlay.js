/**
 * Created by PeterClary on 8/16/2018.
 */

// this opens the map guide overlay
$("#guide").click(function () {
    document.getElementById("mapGuide").style.display = "block";
})
// this open the credits overlay
$("#credits").click(function () {
    document.getElementById("mapCredits").style.display = "block";
})
// this area below allows you close the overlay
function off() {
    document.getElementById("mapGuide").style.display = "none";
}

$(document).click(function on() {
    $("#mapCreditsExit").click(function () {
        document.getElementById("mapCredits").style.display = "none";
    })
});

// Here is the accordion stuff
document.addEventListener("DOMContentLoaded", function(event) {

    var acc = document.getElementsByClassName("accordion");
    var panel = document.getElementsByClassName('panel');

    for (var i = 0; i < acc.length; i++) {
        acc[i].onclick = function() {
            var setClasses = !this.classList.contains('active');
            setClass(acc, 'active', 'remove');
            setClass(panel, 'show', 'remove');

            if (setClasses) {
                this.classList.toggle("active");
                this.nextElementSibling.classList.toggle("show");
            }
        }
    }
    function setClass(els, className, fnName) {
        for (var i = 0; i < els.length; i++) {
            els[i].classList[fnName](className);
        }
    }
});

//this is how we populate the accordion
for (var x in creds) {
	mainUlId = Math.random().toString(36).substring(7);	
	document.getElementById("creditContainer").innerHTML += "<p class='accordion'>" + x + "</p><div  class='panel'><ul id='" + mainUlId + "'></ul></div>";
    if (x != 'Base Layers') {
        for (var i in creds[x]) {
            document.getElementById(mainUlId).innerHTML += "<li style='color:black'>" + i + ": " + creds[x][i] + "</li>";
        }
    } else {
        for (var i in creds[x]) {
			subUlId = Math.random().toString(36).substring(7);	
            document.getElementById(mainUlId).innerHTML += "<li>"+ i +"<ul id='" + subUlId + "'></ul></li>";
            for (var l in creds[x][i]) {
                document.getElementById(subUlId).innerHTML += "<li>" + l + ": " + creds[x][i][l] + "</li>";
            }
        }
    }
}
//end

