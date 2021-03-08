var clicked = false;
var num = 0;
//randomNumber on click dice 
const randomNumber = function () {
    if (!clicked) {

        var audio = document.getElementById('audio');
        audio.play();

        num = Math.floor((Math.random() * 6) + 1);
        $('#dice').css('background-image', 'url(Images/' + num + '.png)');
        clicked = true;
    }
    if (num != 6 && notFree()) {
        var bad = document.getElementById('bad');
        bad.innerText = "Unfortunatlly you stuck";
        setTimeout(changePlayer, 1000);
        clicked = false;
    }
}
$('#dice').on('click', randomNumber);

// Object for check do not have tablet in board 
var positions = {
    redTablet1: 0, redTablet2: 0, redTablet3: 0, redTablet4: 0,
    blueTablet1: 0, blueTablet2: 0, blueTablet3: 0, blueTablet4: 0,
    greenTablet1: 0, greenTablet2: 0, greenTablet3: 0, greenTablet4: 0,
    yellowTablet1: 0, yellowTablet2: 0, yellowTablet3: 0, yellowTablet4: 0
};
var onboard = {
    redTablet1: 0, redTablet2: 0, redTablet3: 0, redTablet4: 0,
    blueTablet1: 0, blueTablet2: 0, blueTablet3: 0, blueTablet4: 0,
    greenTablet1: 0, greenTablet2: 0, greenTablet3: 0, greenTablet4: 0,
    yellowTablet1: 0, yellowTablet2: 0, yellowTablet3: 0, yellowTablet4: 0
};
function notFree() {
    var text = document.getElementById('player');
    for (var i = 1; i <=4; i++) {
        if (onboard[text.style.color + "Tablet" + i] == 1 || positions[text.style.color + "Tablet" + i]+num>=60) return false;
    }
    return true;
}

var player1 = prompt("Please enter player1 name (red) : ");
var player2 = prompt("Please enter player2 name (blue) : ");
var player3 = prompt("Please enter player3 name (yellow) : ");
var player4 = prompt("Please enter player4 name (green) : ");

$('#player').text(player1);

// change player turns
function changePlayer() {
    if (num != 6){
    var text = document.getElementById('player');
    switch (text.innerText) {
        case player1: text.innerText = player2; text.style.color = "blue"; break;
        case player2: text.innerText = player3; text.style.color = "yellow"; break;
        case player3: text.innerText = player4; text.style.color = "green"; break;
        case player4: text.innerText = player1; text.style.color = "red"; break;
    }
    }
    var bad = document.getElementById('bad');
    bad.innerText = "";
    $('#dice').css('background-image', 'url(Images/dice1.gif)');
}


//Tablet move

var currPos = 0;
var currcolor = "";
var NumOfPaw = "";
var currpawn = "";

function randomMove(Color, paw) {
    var text = document.getElementById('player');
    NumOfPaw = paw;
    currcolor = Color;
    currpawn = currcolor + "Tablet" + NumOfPaw;
    currPos = positions[currpawn];
    if (num + currPos > 60) {
        Stuck();
    }
    else {
        if (clicked) {

            var audioRoll = document.getElementById('audio-roll');
            audioRoll.play();

            var position = currPos;
            if (text.style.color == currcolor) {
                if (onboard[currpawn] === 1 || num === 6) {
                    if (onboard[currpawn] === 0) {
                        var doc = document.getElementById(currpawn);
                        switch (Color) {
                            case "red":
                                doc.style.left = 206 + 'px';
                                doc.style.top = 440 + "px";
                                break;

                            case "yellow":
                                doc.style.left = 272 + 'px';
                                doc.style.top = 44 + "px";
                                break;

                            case "blue":
                                doc.style.left = 437 + 'px';
                                doc.style.top = 275 + "px";
                                break;

                            case "green":
                                doc.style.left = 41 + 'px';
                                doc.style.top = 209 + "px";
                                break;
                        }
                        onboard[currpawn] = 1;
                    }
                    else {
                        switch (Color) {
                            case "red":
                                for (i = currPos; i < position + num; i++) {
                                    stepsRed[i]();
                                }
                                break;

                            case "yellow":
                                for (i = currPos; i < position + num; i++) {
                                    stepsYellow[i]();
                                }
                                break;

                            case "blue":
                                for (i = currPos; i < position + num; i++) {
                                    stepsBlue[i]();
                                }
                                break;

                            case "green":
                                for (i = currPos; i < position + num; i++) {
                                    stepsGreen[i]();
                                }
                                break;
                        }
                        positions[currpawn] = currPos;
                        var victim = HaveHover();
                        if (victim != false) {
                            ResetPawn(victim);
                        }
                        // check for winner
                        if (currPos == 60) { pawnOut[currcolor]++; onboard[currpawn] = 0; positions[currpawn] = 0; document.getElementById(currpawn).style.visibility = "hidden"; };
                        CheckForWinner();
                        changePlayer();
                    }
                    num = 0;
                    clicked = false;
                    $('#dice').css('background-image', 'url(Images/dice1.gif)');

                }
                else Stuck();
            }
        }
    }
}


// function for stuck

function Stuck() {
    if (onboard[currpawn] == 0||currPos+num>60) {
        if (notFree()||currPos+num>60) {
            var bad = document.getElementById('bad');
            bad.innerText = "Unfortunatlly you stuck";
            clicked = false;
            $('#dice').css('background-image', 'url(Images/dice1.gif)');
            setTimeout(changePlayer, 1000);
        }
    }
}


// check if come to in one plase

var allcolor = ["red", "blue", "green", "yellow"];

function HaveHover() {
    var count = 0;
    var toKill = "";
    for (var i = 0; i < allcolor.length; i++) {
        for (var n = 1; n <= 4; n++) {
            var first = document.getElementById(allcolor[i] + "Tablet" + n);
            var second = document.getElementById(currpawn);
            if (first.style.top == second.style.top && first.style.left == second.style.left && currcolor != allcolor[i] && currPos + num < 60) {
                count++;
                toKill = allcolor[i] + "Tablet" + n;
                return toKill;
            }
        }
    }
    return false;
}

// check for winner and display the winner

var pawnOut = {red:0,blue:0,green:0,yellow:0}

function CheckForWinner() {
    if (pawnOut[currcolor] == 4) {
        var dice = document.getElementById("dice");
        var player = document.getElementById("player");
        dice.innerText = "";
        dice.style.visibility = "hidden";
        player.innerText = "The Winner is the "+ currcolor + " player";
        
        var audio = document.getElementById('audio-winner');
        audio.play();
        
    }
}



//reset tablet if come to in one plase kill the first
function ResetPawn(victim) {
    onboard[victim] = 0;
    positions[victim] = 0;
    var pawnToMove = document.getElementById(victim);
    
    var audio = document.getElementById('audio-kill');
    audio.play();

    switch (victim) {
        case "redTablet1": pawnToMove.style.top = 423 + "px"; pawnToMove.style.left = 58 + "px"; break;
        case "redTablet2": pawnToMove.style.top = 423 + "px"; pawnToMove.style.left = 124 + "px"; break;
        case "redTablet3": pawnToMove.style.top = 358 + "px"; pawnToMove.style.left = 58 + "px"; break;
        case "redTablet4": pawnToMove.style.top = 358 + "px"; pawnToMove.style.left = 124 + "px"; break;
        case "blueTablet1": pawnToMove.style.top = 423 + "px"; pawnToMove.style.left = 355 + "px"; break;
        case "blueTablet2": pawnToMove.style.top = 423 + "px"; pawnToMove.style.left = 421 + "px"; break;
        case "blueTablet3": pawnToMove.style.top = 358 + "px"; pawnToMove.style.left = 355 + "px"; break;
        case "blueTablet4": pawnToMove.style.top = 358 + "px"; pawnToMove.style.left = 421 + "px"; break;
        case "greenTablet1": pawnToMove.style.top = 127 + "px"; pawnToMove.style.left = 58 + "px"; break;
        case "greenTablet2": pawnToMove.style.top = 127 + "px"; pawnToMove.style.left = 124 + "px"; break;
        case "greenTablet3": pawnToMove.style.top = 60 + "px"; pawnToMove.style.left = 58 + "px"; break;
        case "greenTablet4": pawnToMove.style.top = 60 + "px"; pawnToMove.style.left = 124 + "px"; break;
        case "yellowTablet1": pawnToMove.style.top = 127 + "px"; pawnToMove.style.left = 355 + "px"; break;
        case "yellowTablet2": pawnToMove.style.top = 127 + "px"; pawnToMove.style.left = 421 + "px"; break;
        case "yellowTablet3": pawnToMove.style.top = 60 + "px"; pawnToMove.style.left = 355 + "px"; break;
        case "yellowTablet4": pawnToMove.style.top = 60 + "px"; pawnToMove.style.left = 421 + "px"; break;

    }
}

// move tablets

var step = 33;
var stepsRed = [];
var stepsYellow = [];
var stepsBlue =[];
var stepsGreen =[];
function pushSteps(value, steps, count) {
    for (i = 0; i < count; i++) steps.push(value);
}

//red tablet path
pushSteps(stepUp, stepsRed,5);
pushSteps(stepLeft, stepsRed,6);
pushSteps(stepUp, stepsRed,2);
pushSteps(stepRight, stepsRed,6);
pushSteps(stepUp, stepsRed,6);
pushSteps(stepRight, stepsRed,2);
pushSteps(stepDown, stepsRed,6);
pushSteps(stepRight, stepsRed,6);
pushSteps(stepDown, stepsRed,2);
pushSteps(stepLeft, stepsRed,6);
pushSteps(stepDown, stepsRed,6);
pushSteps(stepLeft, stepsRed,1);
pushSteps(stepUp, stepsRed,6);

//Yellow tablet path
pushSteps(stepDown,stepsYellow,5);
pushSteps(stepRight, stepsYellow,6);
pushSteps(stepDown, stepsYellow,2);
pushSteps(stepLeft, stepsYellow,6);
pushSteps(stepDown, stepsYellow,6);
pushSteps(stepLeft, stepsYellow,2);
pushSteps(stepUp, stepsYellow,6);
pushSteps(stepLeft, stepsYellow,6);
pushSteps(stepUp, stepsYellow,2);
pushSteps(stepRight, stepsYellow,6);
pushSteps(stepUp, stepsYellow,6);
pushSteps(stepRight, stepsYellow,1);
pushSteps(stepDown, stepsYellow,6);

//Blue tablet path
pushSteps(stepLeft, stepsBlue,5);
pushSteps(stepDown, stepsBlue,6);
pushSteps(stepLeft, stepsBlue,2);
pushSteps(stepUp, stepsBlue,6);
pushSteps(stepLeft, stepsBlue,6);
pushSteps(stepUp, stepsBlue,2);
pushSteps(stepRight, stepsBlue,6);
pushSteps(stepUp, stepsBlue,6);
pushSteps(stepRight, stepsBlue,2);
pushSteps(stepDown, stepsBlue,6);
pushSteps(stepRight, stepsBlue,6);
pushSteps(stepDown, stepsBlue,1);
pushSteps(stepLeft, stepsBlue,6);

//Green tablet path
pushSteps(stepRight, stepsGreen,5);
pushSteps(stepUp, stepsGreen,6);
pushSteps(stepRight, stepsGreen,2);
pushSteps(stepDown, stepsGreen,6);
pushSteps(stepRight, stepsGreen,6);
pushSteps(stepDown, stepsGreen,2);
pushSteps(stepLeft, stepsGreen,6);
pushSteps(stepDown, stepsGreen,6);
pushSteps(stepLeft, stepsGreen,2);
pushSteps(stepUp, stepsGreen,6);
pushSteps(stepLeft, stepsGreen,6);
pushSteps(stepUp, stepsGreen,1);
pushSteps(stepRight, stepsGreen,6);

function stepDown() {
    var doc = document.getElementById(currcolor + "Tablet" + NumOfPaw);
    var curr = Number(doc.style.top.replace(/[a-z]/g, ''));
    doc.style.top = (curr+step)+'px';
    currPos++;
}
function stepUp() {
    var doc = document.getElementById(currpawn);
    var curr = Number(doc.style.top.replace(/[a-z]/g, ''));
    doc.style.top = (curr - step) + 'px';
    currPos++;
}
function stepLeft() {
    var doc = document.getElementById(currpawn);
    var curr = Number(doc.style.left.replace(/[a-z]/g, ''));
    doc.style.left = (curr - step) + 'px';
    currPos++;
}
function stepRight() {
    var doc = document.getElementById(currpawn);
    var curr = Number(doc.style.left.replace(/[a-z]/g, ''));
    doc.style.left = (curr + step) + 'px';
    currPos++;
}
