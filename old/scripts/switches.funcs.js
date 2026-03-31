function switchSetScrambleLength() {
    switch (puzzle) {
        case 2:
            scrambleLength = 8;
            scrambleLengthInput.value = 8;
            break;
        case 3:
            scrambleLength = 20;
            scrambleLengthInput.value = 20;
            break;
        case 4:
            scrambleLength = 40;
            scrambleLengthInput.value = 40;
            break;
        case 5:
            scrambleLength = 60;
            scrambleLengthInput.value = 60;
            break;
        case 6:
            scrambleLength = 80;
            scrambleLengthInput.value = 80;
            break;
        case 7:
            scrambleLength = 100;
            scrambleLengthInput.value = 100;
            break;
        case 8:
            scrambleLength = 120;
            scrambleLengthInput.value = 120;
            break;
        case 9:
            scrambleLength = 140;
            scrambleLengthInput.value = 140;
            break;
        case 10:
            scrambleLength = 160;
            scrambleLengthInput.value = 160;
            break;
        case 11:
            scrambleLength = 180;
            scrambleLengthInput.value = 180;
            break;
        case "pyraminx":
            scrambleLength = 9;
            scrambleLengthInput.value = 9;
            break;
        case "megaminx":
            scrambleLength = 60;
            scrambleLengthInput.value = 60;
            break;
    }
}

function switchResetScrambleLength() {
    switch (puzzle) {
        case 1:
            if (scrambleLength < 0) { scrambleLength = 0; }
            scrambleLengthInput.value = scrambleLength;
            break;
        case 2:
            if (scrambleLength < 6) { scrambleLength = 6; }
            scrambleLengthInput.value = scrambleLength;
            break;
        case 3:
            if (scrambleLength < 18) { scrambleLength = 18; }
            scrambleLengthInput.value = scrambleLength;
            break;
        case 4:
            if (scrambleLength < 30) { scrambleLength = 30; }
            scrambleLengthInput.value = scrambleLength;
            break;
        case 5:
            if (scrambleLength < 40) { scrambleLength = 40; }
            scrambleLengthInput.value = scrambleLength;
            break;
        case 6:
            if (scrambleLength < 60) { scrambleLength = 60; }
            scrambleLengthInput.value = scrambleLength;
            break;
        case 7:
            if (scrambleLength < 80) { scrambleLength = 80; }
            scrambleLengthInput.value = scrambleLength;
            break;
        case 8:
            if (scrambleLength < 100) { scrambleLength = 100; }
            scrambleLengthInput.value = scrambleLength;
            break;
        case 9:
            if (scrambleLength < 120) { scrambleLength = 120; }
            scrambleLengthInput.value = scrambleLength;
            break;
        case 10:
            if (scrambleLength < 140) { scrambleLength = 140; }
            scrambleLengthInput.value = scrambleLength;
            break;
        case 11:
            if (scrambleLength < 160) { scrambleLength = 160; }
            scrambleLengthInput.value = scrambleLength;
            break;
        case "megaminx":
            if (scrambleLength < 60) { scrambleLength = 60; }
            scrambleLengthInput.value = scrambleLength;
            break;
        case "pyraminx":
            if (scrambleLength < 7) { scrambleLength = 7 }
            scrambleLengthInput.value = scrambleLength;
            break;
    }
}

function choosePenultimate(isOpposite, site, penultimate, ultimate) {
    if (ultimate === "F" && penultimate === "B" && site === penultimate) {
        return !isOpposite;
    } else if (ultimate === "B" && penultimate === "F" && site === penultimate) {
        return !isOpposite;
    } else if (ultimate === "R" && penultimate === "L" && site === penultimate) {
        return !isOpposite;
    } else if (ultimate === "L" && penultimate === "R" && site === penultimate) {
        return !isOpposite;
    } else if (ultimate === "U" && penultimate === "D" && site === penultimate) {
        return !isOpposite;
    } else if (ultimate === "D" && penultimate === "U" && site === penultimate) {
        return !isOpposite;
    } else if (ultimate === "f" && penultimate === "b" && site === penultimate) {
        return !isOpposite;
    } else if (ultimate === "b" && penultimate === "f" && site === penultimate) {
        return !isOpposite;
    } else if (ultimate === "r" && penultimate === "l" && site === penultimate) {
        return !isOpposite;
    } else if (ultimate === "l" && penultimate === "r" && site === penultimate) {
        return !isOpposite;
    } else if (ultimate === "u" && penultimate === "d" && site === penultimate) {
        return !isOpposite;
    } else if (ultimate === "d" && penultimate === "u" && site === penultimate) {
        return !isOpposite;
    } else { return isOpposite; }
}

function switchGetSide(i) {
    switch (i) {
        case 1:
            return "F";
        case 2:
            return "R";
        case 3:
            return "U";
        case 4:
            return "B";
        case 5:
            return "L";
        case 6:
            return "D";
    }
}