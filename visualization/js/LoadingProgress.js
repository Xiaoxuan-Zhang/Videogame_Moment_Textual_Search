// g_actionCounter & g_expectedActions are global variables from Scene.js
let percent = 0; // current percent displayed
let newPercent = 0;
// reference to the paragraph that indicates percentage
let textElement = document.getElementById("percentage");

function updatePercent() {
    newPercent = ((g_actionCounter/g_expectedActions) * 100).toFixed(0);

    console.log("checking status");
    if(newPercent == percent) {
        // after incrementing wait 3 seconds before checking status again
        if(newPercent != 100) {
            setTimeout(updatePercent, 3000);
        }
    }
    else {
        // something new is loaded so increment numbers smoothly
        console.log("newPercent: " + newPercent);
        let incrementPercent = window.setInterval(function() {
            percent += 1;
            console.log("incremented: " + percent);
            textElement.innerHTML = percent + "%";

            if(percent == newPercent) {
                clearInterval(incrementPercent);
                console.log("interval cleared");
                setTimeout(updatePercent, 3000);
            }
        }, 50);
    }
}

updatePercent();