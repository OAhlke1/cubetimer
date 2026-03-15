function switchScrambleLength() {
    switch (puzzle) {
        case 2:
            return 8;
        case 3:
            return 20;
        case 4:
            return 40;
        case 5:
            return 60;
        case 6:
            return 80;
        case 7:
            return 100;
        case 8:
            return 120;
        case 9:
            return 140;
        case 10:
            return 160;
        case 11:
            return 180;
        case "pyraminx":
            return 9;
        case "megaminx":
            return 60;
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