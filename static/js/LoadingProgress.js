// used to indicate it's good to start loading
g_loadingFinished = false;

// g_actionCounter & g_expectedActions are global variables from Scene.js
currentPercent = 0; // current Percent displayed
targetPercent = 0;
// reference to the paragraph that indicates percentage
loadingProgressElement = document.getElementById("percentage");

// ensure the g_expectedActions is up-to-date
previousExpectedActions = 0;
expectedActionsLocked = false;
expectedActionsTimer = null;

incrementPercent = window.setInterval(function() {
	// only call updatePercent if g_expectedActions stays the same in 500ms
	if (!expectedActionsLocked) {
		if (previousExpectedActions != g_expectedActions) {
			previousExpectedActions = g_expectedActions;
			expectedActionsTimer = Date.now();
		} else {
			if (expectedActionsTimer != null && (Date.now() - expectedActionsTimer >= 500)) {
				expectedActionsLocked = true;
			}
		}
	} else {
		// update target percentage
		targetPercent = Math.floor((g_actionCounter / g_expectedActions) * 100);
		
		// loading speed perception and faster counting in case previously cached
		if (targetPercent > 90) {
			stepsNeeded = 2;
		} else if (targetPercent > 60) {
			stepsNeeded = 5;
		} else {
			stepsNeeded = 10;
		}
		
		// calculate increment step
		step = (targetPercent - currentPercent) / stepsNeeded;
		if (step < 1) {
			step = 1;
		}
		currentPercent += step;
		if (currentPercent >= targetPercent) {
			currentPercent = targetPercent;
		}
		loadingProgressElement.innerHTML = Math.round(currentPercent) + "%";
		
		// stop Interval call at 100%
		if (targetPercent == Math.round(currentPercent) && targetPercent == 100) {
			g_loadingFinished = true;
			clearInterval(incrementPercent);
		}
	}
}, 10);