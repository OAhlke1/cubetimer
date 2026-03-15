function onLoadFunc() {
    if (!hideAllowSavingOverlay) { document.querySelector('.cookies-overlay').classList.remove('disNone'); }
    if (allowSaving) {
        allowSavingCheckBox.checked = true;
    } else { allowSavingCheckBox.checked = false; }
    setTurns();
    setCanvas();
    setPuzzleSelects();
    writeAvgTypeConts();
    setDrawOptions();
    if (localStorage.times) {
        getSavedElements();
        getWorstTime();
        chooseTimeTypeToDraw("all");
    } else { setTimeAndScrambleObject(); }
    writeTimes();
    showHideHowToStart();
}

function showHideHowToStart() {
    if (window.innerWidth > 800) { startBtn.classList.add('disNone'); }
}

function setCanvas() {
    timeGraph.setAttribute('width', scramblerParent.offsetWidth);
    timeGraph.setAttribute('height', 0.75 * scramblerParent.offsetWidth);
    ctx = timeGraph.getContext('2d');
}

function getWorstTime() {
    let indexWorst = 0;
    let list = times[puzzle]["timesList"];
    for (let i = 0; i < list.length; i++) {
        let time = list[i]["time"];
        if (time > worstTime) { worstTime = time; }
    }
}

function chooseTimeTypeToDraw(avgType) {
    let points = getPoints(avgType);
    ctx.clearRect(0, 0, timeGraph.offsetWidth, timeGraph.offsetHeight);
    if (times[puzzle]["timesList"].length <= 30) { setDots(points, avgType); }
    drawTimes(points, avgType);
}

function setDrawOptions() {
    for (avgType of avgTypes) {
        chooseAvgType.innerHTML += `
            <option value="${avgType}" ${avgType === "all" ? "selected" : ""}>
                ${avgType === "all" ? "all times" : "average of " + avgType}
            </option>
        `;
    }
}

function drawTimes(points, avgType) {
    let fillColor = getLineColor(avgType);
    for (let i = 0; i < points.length - 1; i++) {
        ctx.strokeStyle = fillColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
        ctx.stroke();
    }
}

function getLineColor(avgType) {
    switch (avgType) {
        case "all":
            return "blue";
        case 5:
            return "green";
        case 12:
            return "orange";
        case 20:
            return "magenta";
        case 50:
            return "grey";
    }
}

function setDots(points, avgType) {
    let fillColor = getLineColor(avgType);
    for (let i = 0; i < points.length; i++) {
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
}

function getPoints(avgType) {
    let points = [], averages = [];
    let list = times[puzzle]["timesList"];
    let gW = timeGraph.offsetWidth;
    let gH = timeGraph.offsetHeight;
    if (avgType === "all") {
        getWorstTime();
        for (let i = 1; i <= times[puzzle]["timesList"].length; i++) {
            points.push({
                x: i === 1 ? 0.05 * gW : 0.95 * gW * (i - 1) / (list.length - 1),
                y: gH * (1 - 0.8 * list[i - 1]["time"] / worstTime)
                // y: gH * (0.8 * list[i - 1]["time"] / worstTime)
            });
        }
    } else {
        averages = getAveragesForDrawing(avgType);
        for (let i = 0; i < averages.length; i++) {
            points.push({
                x: i === 1 ? 0.05 * gW : 0.95 * gW * (i - 1) / (averages.length - 1),
                y: gH * (1 - 0.8 * averages[i - 1] / Math.max(...averages))
                // y: gH * (0.8 * averages[i - 1] / Math.max(...averages))
            });
        }
    }
    return points;
}

function getAveragesForDrawing(avgType) {
    let averages = [], sum = 0;
    for (let i = 0; i < times[puzzle]["timesList"].length - avgType; i++) {
        for (let j = 0; j < avgType; j++) { sum += times[puzzle]["timesList"][i + j]["time"]; }
        averages.push(sum / avgType);
        sum = 0;
    }
    return averages;
}

function checkAllowFunc(permission) {
    allowSaving = permission;
    allowSavingCheckBox.checked = allowSaving;
    savePermissions();
    if (allowSaving) {
        allowSavingFunc();
    } else { permitSavingFunc(); }
}

function savePermissions() {
    localStorage.setItem('allowSaving', allowSaving);
    localStorage.setItem('hideAllowSavingOverlay', true);
}

function allowSavingFunc() {
    localStorage.setItem('allowSaving', true);
    hideOverlays();
}

function permitSavingFunc() {
    clearLocalStorage();
    hideOverlays();
}

function setTurns() {
    for (let puzzleType of puzzleTypes) {
        turns[puzzleType] = [];
        let side = "";
        if (typeof puzzleType === "string") {
            setNonCubicalTurns(puzzleType);
        } else { setCubicalTurns(puzzleType); }
    }
}

function setNonCubicalTurns(puzzle) {
    switch (puzzle) {
        case "pyraminx":
            turns[puzzle] = [["L", "L'", "l", "l'"], ["B", "B'", "b", "b'"], ["R", "R'", "r", "r'"], ["U", "U'", "u", "u'"]];
            break;
        case "megaminx":
            turns[puzzle] = [["R++", "R--"], ["D++", "D--"], ["U", "U'"]];
            break;
    }
}

function setCubicalTurns(puzzle) {
    let puffer = [];
    for (let j = 1; j < 7; j++) {
        for (let k = 0; k < (puzzle - (puzzle % 2)) / 2; k++) {
            side = switchGetSide(j);
            puffer.push(`${k === 0 ? '' : k + 1}` + side + "");
            puffer.push(`${k === 0 ? '' : k + 1}` + side + "2");
            puffer.push(`${k === 0 ? '' : k + 1}` + side + "'");
        }
        turns[puzzle].push(puffer);
        puffer = [];
    }
}

function setPuzzleSelects() {
    for (puzzleType of puzzleTypes) {
        puzzleSelector.innerHTML += `
            <option value="${puzzleType}" ${puzzleType === 3 ? "selected" : ""} style="${puzzleType === 1 ? 'background-color: red;' : ''}">
                ${typeof puzzleType === "string" ? puzzleType.charAt(0).toUpperCase() + puzzleType.slice(1, puzzleType.length) : puzzleType + "x" + puzzleType + "x" + puzzleType}
            </option>
        `;
    }
}

function setTimeAndScrambleObject() {
    for (let puzzleType of puzzleTypes) {
        times[`${puzzleType}`] = {
            timesList: [],
            bestAvgIndices: {}
        };
        setBestIndices(puzzleType);
        scrambles[`${puzzleType}`] = [];
        bestAverages[`${puzzleType}`] = {};
    }
    setBestAvgsToTimesObject();
}

function setBestIndices(puzzleType) {
    for (avgType of avgTypes) { times[puzzleType]["bestAvgIndices"][avgType] = 0; }
}

function writeAvgTypeConts() {
    for (avgType of avgTypes) {
        averagesCont.innerHTML += `
            <div class="of-${avgType} flex-c">
                <div class="mean flex">
                    <p>current mean of ${avgType}:</p>
                    <p class="time"></p>
                </div>
                <div class="total flex">
                    <p>current average of ${avgType}:</p>
                    <p class="time"></p>
                </div>
                <div class="best flex">
                    <p>best average of ${avgType}:</p>
                    <p class="time" onclick="markBestAverage(${avgType})"></p>
                </div>
            </div>
        `;
    }
    averagesCont.innerHTML += ``;
    setEvents();
    generateScramble();
}

function getSavedElements() {
    times = JSON.parse(localStorage.getItem('times'));
    scrambles = JSON.parse(localStorage.getItem('scrambles'));
    bestAverages = JSON.parse(localStorage.getItem('bestAverages'));
    for (avgType of avgTypes) { if (avgType != "all" && times[puzzle]["timesList"].length >= avgType) { calcBestAverage(avgType); } }
    writeTimes();
}

function setBestAvgsToTimesObject() {
    for (p of puzzleTypes) {
        for (avgType of avgTypes) { bestAverages[`${p}`][avgType] = 0; }
    }
}

function setEvents() {
    if (window.innerWidth > 800) {
        if (!mobileView) {
            body.addEventListener('click', hideTimeSpecs);
            body.addEventListener('keyup', startStopTimer);
        } else if (mobileView) { body.addEventListener('touchend', startStopTimerMobile); }

    }
}

function hideTimeSpecs(event) {
    let timeSpecsOn = document.querySelector('.time-cont .time-specs.on');
    if (timeSpecsOn && timeSpecsOn !== event.target.closest('.time-specs')) {
        timeSpecsOn.classList.add('off');
        timeSpecsOn.classList.remove('on');
    }
}

function startStopTimer(event) {
    if (event.key === ' ' && !overlayShown) {
        hideScramble();
        timerRuns = !timerRuns;
        if (timerRuns) {
            timer.innerHTML = "0.00";
            timerIntervalCode = setInterval(runningTimer, 10);
        } else { onTimerStop(); }
    } else if (event.key === "Escape") { hideOverlays(); }
}

function startStopTimerMobile(event) {
    showHideStartAndStopBtn();
    if (!overlayShown) {
        hideScramble();
        timerRuns = !timerRuns;
        if (timerRuns) {
            timer.innerHTML = "0.00";
            timerIntervalCode = setInterval(runningTimer, 10);
        } else { onTimerStop(); }
    } else if (event.key === "Escape") { hideOverlays(); }
}

function showHideStartAndStopBtn() {
    if(stopBtn.classList.contains('disNone')) {
        stopBtn.classList.remove('disNone');
        startBtn.innerHTML = "Stop";
    } else if(!stopBtn.classList.contains('disNone')) {
        stopBtn.classList.add('disNone');
        startBtn.innerHTML = "Start";
    }
}

function showClearingOverlayOfPuzzle() {
    clearOverlayOfPuzzle.querySelector('h1').innerHTML = typeof puzzle === "string" ? `Do you really want to delete your ${puzzle.slice(0, 1).toUpperCase() + puzzle.slice(1, puzzle.length)} times?` : `Do you really want to delete your ${puzzle}x${puzzle} times?`;
    overlayShown = !overlayShown;
    clearOverlayOfPuzzle.classList.remove('disNone');
}

function showClearingAllOverlay() {
    clearOverlay.querySelector('h1').innerHTML = `Do you really want to delete all your times?`;
    overlayShown = !overlayShown;
    clearingAllOverlayShown = !clearingAllOverlayShown;
    clearAllOverlay.classList.remove('disNone');
}

function hideOverlays() {
    overlays.forEach((overlay) => {
        overlay.classList.add('disNone');
    })
    overlayShown = false;
}

function runningTimer() {
    milliseconds += 10;
    timer.innerHTML = `${(milliseconds / 1000).toFixed(2)}`;
}

function onTimerStop() {
    clearInterval(timerIntervalCode);
    pushValues();
    writeTimes();
    milliseconds = 0;
    if (times[puzzle]["timesList"].length > 1) { markMinMax(); }
    chooseTimeTypeToDraw("all");;
    generateScramble();
}

function pushValues() {
    if (!scrambles[puzzle]) { scrambles[puzzle] = []; }
    scrambles[puzzle].push(scramble);
    times[puzzle]["timesList"].push({
        time: milliseconds,
        penalty: "0",
        dnf: 0
    });
}

function calcAverages() {
    if (times[puzzle]["timesList"].length >= 1) {
        for (avgType of avgTypes) { if (times[puzzle]["timesList"].length >= avgType) { writeAvgs(avgType); } }
    }
    if (allowSaving) { saveTimes(); }
}

function getAvg(list, avgType) {
    let sum = 0;
    let dnfCount = 0;
    let average;
    for (let i = 0; i < list.length; i++) {
        let time = list[i];
        if (times[puzzle]["timesList"][i]["dnf"] == 1) {
            sum += 0;
            dnfCount++;
            if (dnfCount >= 2) { return "DNF"; }
        } else { sum += time; }
    }
    average = (sum / list.length / 1000).toFixed(2);
    return average;
}

function calcBestAverage(avgType) {
    let bestAvg = 0;
    let startIndex = times[puzzle]["bestAvgIndices"][avgType];
    for (let i = 0; i < avgType; i++) { bestAvg += times[puzzle]["timesList"][startIndex + i]["time"]; }
    bestAvg /= avgType;
    document.querySelector(`.averages .of-${avgType} .best .time`).innerHTML = (bestAvg / 1000).toFixed(2);
    bestAvg = 0;
}

function recalcBestAverages() {
    let bestAverage = 0;
    let allTimesLength = times[puzzle]["timesList"].length;
    for (avgType of avgTypes) {
        if (avgType != "all") {
            if (allTimesLength >= avgType) {
                for (let i = 0; i < allTimesLength - avgType; i++) {
                    let timeTotal = 0;
                    for (let j = i; j < i + avgType; j++) { timeTotal += times[puzzle]["timesList"][j]["time"]; }
                    if (bestAverage === 0) {
                        bestAverage = timeTotal / avgType;
                    } else if (bestAverage > timeTotal / avgType) {
                        bestAverage = timeTotal / avgType;
                        bestAverages[avgType] = i;
                        times[puzzle]["bestAvgIndices"][avgType] = i;
                    }
                }
                document.querySelector(`.averages .of-${avgType} .best .time`).innerHTML = (bestAverage / 1000).toFixed(2);
            } else { document.querySelector(`.averages .of-${avgType} .best .time`).innerHTML = ""; }
        }
    }
}

function getMeanAvg(list) {
    let sum = 0;
    let dnfCount = 0;
    let min = Math.min(...list);
    let max = Math.max(...list);
    for (let i = 0; i < list.length; i++) {
        let time = list[i];
        if (times[puzzle]["timesList"][i]["dnf"]) {
            dnfCount++;
            if (dnfCount >= 2) { return "DNF"; }
            continue;
        } else if (time === min || time === max) {
            sum += 0;
        } else { sum += time; }
    }
    return (sum / (list.length - 2) / 1000).toFixed(2);
}

function getTimeList(avgType) {
    let list = [];
    let listLength = times[puzzle]["timesList"].length;
    for (let i = 0; i < avgType; i++) { list.push(times[puzzle]["timesList"][listLength - avgType + i]["time"]); }
    return list;
}

function writeAvgs(avgType) {
    document.querySelector(`.averages .of-${avgType} .mean .time`).innerHTML = `${getMeanAvg(getTimeList(avgType))}`;
    document.querySelector(`.averages .of-${avgType} .total .time`).innerHTML = `${getAvg(getTimeList(avgType), avgType)}`;
    document.querySelector(`.averages .of-all .mean .time`).innerHTML = `${getMeanAvg(getTimeList(times[puzzle]["timesList"].length))}`;
    document.querySelector(`.averages .of-all .total .time`).innerHTML = `${getAvg(getTimeList(times[puzzle]["timesList"].length), avgType)}`;
    resetAvgValues();
}

function resetAvgValues() {
    lastFive = [];
    togetherMeanFive = 0;
    togetherFive = 0;
}

function saveTimes() {
    localStorage.setItem('times', JSON.stringify(times));
    saveScrambles();
}

function saveScrambles() {
    localStorage.setItem('scrambles', JSON.stringify(scrambles));
    saveBestAverages();
}

function saveBestAverages() {
    localStorage.setItem('bestAverages', JSON.stringify(bestAverages));
}

function clearTimesOfPuzzle() {
    hideOverlays();
    times[puzzle]["timesList"] = [];
    localStorage.setItem('times', JSON.stringify(times));
    removeDisplayedTimes();
    writeTimes();
    ctx.clearRect(0, 0, timeGraph.offsetWidth, timeGraph.offsetHeight);
}

function resetTimes() {
    timer.innerHTML = "0.00"
    hideOverlays();
    clearLocalStorage();
    setTimeAndScrambleObject();
    removeDisplayedTimes();
    setNoTimeYetText();
    ctx.clearRect(0, 0, timeGraph.offsetWidth, timeGraph.offsetHeight);
    scrambleOfTimeDoc.innerHTML = "";
}

function removeDisplayedTimes() {
    timesList.innerHTML = '';
    for (avgType of avgTypes) {
        if (document.querySelector(`.averages .of-${avgType} .mean .time`)) {
            document.querySelector(`.averages .of-${avgType} .mean .time`).innerHTML = '';
            document.querySelector(`.averages .of-${avgType} .total .time`).innerHTML = '';
        }
    }
}

function showDeleteTimeOverlay(elem) {
    timeToDelete = elem;
    overlayShown = !overlayShown;
    deleteTimeOverlay.classList.remove('disNone');
}

function removeTime() {
    let recombinedObject = recombineTimes();
    times[puzzle]["timesList"] = [...recombinedObject["times"]];
    scrambles[puzzle] = [...recombinedObject["scrambles"]];
    hideOverlays()
    hideScrambleOfTime();
    recalcBestAverages();
    writeTimes();
    chooseTimeTypeToDraw("all");
}

function recombineTimes() {
    let timeIndex = +timeToDelete.closest('.time-cont').getAttribute('data-timeindex');
    let timePuffer = [];
    let scramblePuffer = [];
    for (let i = 0; i < times[puzzle]["timesList"].length; i++) {
        if (i != timeIndex) {
            timePuffer.push(times[puzzle]["timesList"][i]);
            scramblePuffer.push(scrambles[puzzle][i]);
        }
    }
    return { times: timePuffer, scrambles: scramblePuffer };
}

function writeTimes() {
    timesList.innerHTML = '';
    if (times[puzzle]["timesList"].length) {
        for (let i = 0; i < times[puzzle]["timesList"].length; i++) { timesList.innerHTML += getTimeHTML(i); }
    } else { setNoTimeYetText(); }
    if (times[puzzle]["timesList"].length > 1) { markMinMax(); }
    calcAverages();
}

function getTimeHTML(i) {
    return `
        <div class="time-cont flex" data-timeindex="${i}">
            <p>${i + 1}: ${times[puzzle]["timesList"][i]["dnf"] ? "DNF" : (times[puzzle]["timesList"][i]["time"] / 1000).toFixed(2)}${times[puzzle]["timesList"][i]["penalty"] == 1 ? "+" : ""}</p>
            <div class="time-specs off">
                <p onclick="showHideTimeSpecs(this)">specs</p>
                <div class="spec-elements flex">
                    <p onclick="showScrambleOfTime(this)">S</p>
                    <p onclick="plusTwo(${i})">+2</p>
                    <p onclick="setDnf(${i})">DNF</p>
                    <p class="delete-time" onclick="showDeleteTimeOverlay(this)">X</p>
                </div>
            </div>
        </div>
    `;
}

function showHideTimeSpecs(elem) {
    let timeSpecs = elem.closest('.time-specs');
    if (document.querySelector('.times .all-times .time-cont .time-specs.on') && document.querySelector('.times .all-times .time-cont .time-specs.on') !== timeSpecs) {
        document.querySelector('.times .all-times .time-cont .time-specs.on').classList.add('off');
        document.querySelector('.times .all-times .time-cont .time-specs.on').classList.remove('on');
    }
    if (timeSpecs.classList.contains('on')) {
        timeSpecs.classList.remove('on');
        timeSpecs.classList.add('off');
    } else {
        timeSpecs.classList.add('on');
        timeSpecs.classList.remove('off');
    }
}

function setNoTimeYetText() {
    timesList.innerHTML = `<p class="no-times">No ${puzzle / 1 ? puzzle.toString() + "x" + puzzle.toString() : puzzleType.charAt(0).toUpperCase() + puzzleType.slice(1, puzzleType.length)} times yet</p>`;
}

function markMinMax() {
    removeGreenRed();
    if (times[puzzle]["timesList"].length < 2) { return; }
    justTheTimes = [];
    for (let timeObj of times[puzzle]["timesList"]) { justTheTimes.push(timeObj["time"]); }
    min = Math.min(...justTheTimes);
    max = Math.max(...justTheTimes);
    for (let i = 0; i < times[puzzle]["timesList"].length; i++) {
        if (times[puzzle]["timesList"][i]["time"] === min) {
            document.querySelector(`[data-timeindex="${i}"]`).classList.add('green-font');
            break;
        }
    }
    for (let i = 0; i < times[puzzle]["timesList"].length; i++) {
        if (times[puzzle]["timesList"][i]["time"] === max) {
            document.querySelector(`[data-timeindex="${i}"]`).classList.add('red-font');
            break;
        }
    }
}

function removeGreenRed() {
    if (document.querySelector('.green-font')) { document.querySelector('.green-font').classList.remove('green-font'); }
    if (document.querySelector('.red-font')) { document.querySelector('.red-font').classList.remove('red-font'); }
}

function generateScramble() {
    let index;
    let indexInner = 0;
    let lastIndex;
    let scrambleTurns = [];
    scramble = "";
    if (puzzle === 1) {
        scrambleDoc.innerHTML = OneByOneScrambleText;
        showHideForOneByOne();
        return;
    } else {
        for (let i = 0; i < scrambleLength; i++) {
            index = Math.floor((puzzle === 2 ? 3 : turns[puzzle].length) * Math.random());
            if (index === lastIndex) {
                i--;
            } else if (scrambleTurns.length > 1 && penultimateIsOppositeSide(turns[puzzle][index][indexInner], scrambleTurns[scrambleTurns.length - 1], scrambleTurns[scrambleTurns.length - 2])) {
                i--;
            } else {
                lastIndex = index;
                if (typeof puzzle === "string") {
                    if (puzzle === "pyraminx") {
                        indexInner = Math.floor(4 * Math.random());
                    } else if (puzzle === "megaminx") { indexInner = Math.floor(2 * Math.random()); }
                } else {
                    indexInner = Math.floor(3 * (puzzle - (puzzle % 2)) / 2 * Math.random());
                }
                scrambleTurns.push(turns[puzzle][index][indexInner]);
                scramble += turns[puzzle][index][indexInner] + " ";
            }
        }
    }
    scrambleDoc.innerHTML = setScrambleArr();
    if (puzzle === 1) { return; }
    showScramble();
}

function showHideForOneByOne() {
    forOneByOneShown = !forOneByOneShown;
    if (puzzle != 1) {
        twistyPlayer.classList.remove('disNone');
        // showHidecopyRight(true);
    } else if (forOneByOneShown) {
        twistyPlayer.classList.add('disNone');
        forOneByOne.classList.remove('disNone');
        // showHidecopyRight(false);
    }
}

function showHidecopyRight(bool) {
    copyrightShown = bool;
    if (copyrightShown) {
        copyrightDoc.classList.remove('disNone');
    } else { copyrightDoc.classList.add('disNone'); }
}

function setScrambleArr() {
    let scrambleArray = scramble.split(" ");
    let scrambleText = "";
    for (let i = 0; i < scrambleArray.length; i++) {
        scrambleText += `<p class="scramble-button orange-font" onclick="reshowScramble(${i})">${scrambleArray[i]}</p> `
    }
    return scrambleText;
}

function reshowScramble(index) {
    if (!timerRuns && puzzle != 1) {
        let scrambleText = "";
        let pElems = scrambleDoc.querySelectorAll('p');
        for (let i = 0; i <= index; i++) { scrambleText += pElems[i].innerHTML + " "; }
        scrambleText = scrambleText.slice(0, scrambleText.length - 1);
        twistyPlayer.setAttribute('alg', scrambleText);
        highlightTurns(index);
        // showHidecopyRight(true);
    }
}

function highlightTurns(index) {
    let pElems = scrambleDoc.querySelectorAll('p');
    pElems.forEach((elem) => { elem.classList.remove('orange-font'); });
    for (let i = 0; i < index + 1; i++) { pElems[i].classList.add('orange-font'); }
}

function markTurnsInScramble(index) {
    scramblePs = scrambleDoc.querySelectorAll('p');
    unmarkTurnsInScramble();
    for (let i = 0; i <= index; i++) { scramblePs[i].classList.add('orange-font'); }
}

function unmarkTurnsInScramble() {
    document.querySelectorAll('.orange-font').forEach((elem) => { elem.classList.remove('orange-font'); });
}

function penultimateIsOppositeSide(site, ultimate, penultimate) {
    let isOpposite = false;
    let siteIndex = site.match(/[a-zA-Z]/).index - 1;
    let penultimateIndex = penultimate.match(/[a-zA-Z]/).index - 1;
    let ultimateIndex = ultimate.match(/[a-zA-Z]/).index - 1;
    site = site[siteIndex < 0 ? 0 : siteIndex];
    penultimate = penultimate[penultimateIndex < 0 ? 0 : penultimateIndex];
    ultimate = ultimate[ultimateIndex < 0 ? 0 : ultimateIndex];
    return choosePenultimate(isOpposite, site, penultimate, ultimate)
}

function showScramble() {
    scrambleDoc.classList.remove('beige-font');
    reshowScramble(scrambleDoc.querySelectorAll('p').length - 1);
    if (puzzle < 8 || typeof puzzle === "string") {
        if (puzzle === 1) {
            forOneByOne.classList.remove('disNone');
            twistyPlayer.classList.add('disNone');
            // showHidecopyRight(false);
        } else {
            forOneByOne.classList.add('disNone');
            twistyPlayer.classList.remove('disNone');
            // showHidecopyRight(true);
            twistyPlayer.setAttribute("puzzle", (typeof puzzle != "string") ? `${puzzle}x${puzzle}x${puzzle}` : puzzle);
        }
    } else {
        if (puzzle === 1) {
            forOneByOne.classList.add('disNone');
            // showHidecopyRight(false);
        } else { twistyPlayer.classList.add('disNone'); }
    }
}

function hideScramble() {
    scrambleDoc.classList.add('beige-font');
}

function showScrambleOfTime(elem) {
    scrambleOfTimeDoc.innerHTML = "<p>" + scrambles[puzzle][+elem.closest('.time-cont').getAttribute('data-timeindex')] + "</p>";
}

function hideScrambleOfTime() {
    scrambleOfTimeDoc.innerHTML = "";
}

function resetScrambleLength() {
    scrambleLength = +scrambleLengthInput.value;
    switchResetScrambleLength();
    generateScramble();
}

function selectPuzzle() {
    setPuzzleSelectStats();
    deleteAveragePrints();
    chooseTimeTypeToDraw("all");
    for (avgType of avgTypes) { if (avgType != "all" && times[puzzle]["timesList"].length >= avgType) { calcBestAverage(avgType); } }
    writeTimes();
    generateScramble();
}

function setPuzzleSelectStats() {
    puzzle = +puzzleSelector.value ? +puzzleSelector.value : puzzleSelector.value;
    scrambleOfTimeDoc.innerHTML = "";
    clearButton.innerHTML = typeof puzzle === "string" ? `clear ${puzzle.charAt(0).toUpperCase() + puzzle.slice(1, puzzle.length)} times` : `clear ${puzzle}x${puzzle} times`;
    timesHeadline.innerHTML = `${typeof puzzle === "string" ? puzzle.charAt(0).toUpperCase() + puzzle.slice(1, puzzle.length) : puzzle + "x" + puzzle} times:`;
    timer.innerHTML = "0.00";
}

function deleteAveragePrints() {
    for (avgType of avgTypes) {
        document.querySelector(`.averages .of-${avgType} .mean .time`).innerHTML = "";
        document.querySelector(`.averages .of-${avgType} .total .time`).innerHTML = "";
        document.querySelector(`.averages .of-${avgType} .best .time`).innerHTML = "";
    }
}

function plusTwo(index) {
    times[puzzle]["timesList"][index]["penalty"] = times[puzzle]["timesList"][index]["penalty"] == 0 ? 1 : 0;
    if (times[puzzle]["timesList"][index]["penalty"] == 1) {
        times[puzzle]["timesList"][index]["time"] += 2000;
    } else { times[puzzle]["timesList"][index]["time"] -= 2000; }
    timesList.querySelectorAll('.time-cont')[index].querySelector('p:first-child').innerHTML = `${index + 1}: ${times[puzzle]["timesList"][index]["time"] / 1000}` + `${times[puzzle]["timesList"][index]["penalty"] == 0 ? "" : "+"}`;
    markMinMax();
    calcAverages();
    chooseTimeTypeToDraw("all");
}

function setDnf(index) {
    times[puzzle]["timesList"][index]["dnf"] = times[puzzle]["timesList"][index]["dnf"] == 0 ? 1 : 0;
    timesList.querySelectorAll('.time-cont')[index].querySelector('p:first-child').innerHTML = `${index + 1}: ${times[puzzle]["timesList"][index]["dnf"] ? "DNF" : (times[puzzle]["timesList"][index]["time"] / 1000).toFixed(2)}`;
    calcAverages();
}

function clearLocalStorage() {
    localStorage.removeItem('scrambles');
    localStorage.removeItem('times');
    localStorage.removeItem('bestAverages');
}

function markBestAverage(avgType) {
    removeMarkedBest();
    let timeConts = document.querySelectorAll('.time-cont');
    let nodesLength = timeConts.length;
    let startIndex = times[puzzle]["bestAvgIndices"][avgType];
    let allScramblesText = "";
    timeConts[startIndex].classList.add('bottom');
    timeConts[startIndex + avgType - 1].classList.add('top');
    for (let i = 0; i < avgType; i++) {
        timeConts[startIndex + i].classList.add("best-marked");
        allScramblesText += `<p>${startIndex + i + 1}: ${scrambles[puzzle][i]}</p>`;
    }
    scrambleOfTimeDoc.innerHTML = allScramblesText;
}

function removeMarkedBest() {
    document.querySelectorAll('.time-cont').forEach((elem) => {
        elem.classList.remove('best');
        elem.classList.remove('bottom');
        elem.classList.remove('top');
    })
    scrambleOfTimeDoc.innerHTML = "";
}