var five = require("johnny-five"),
Leap = require("leapjs"),
board = new five.Board();

var controller = new Leap.Controller();

var servos;

function toDegrees(rad) {
    return rad * (180/Math.PI);
}

controller.on('frame', function(frame) {
    if (frame.hands.length > 0) {
        var hand = frame.hands[0],
        finger = hand.fingers[0],
        wrist = servos[2],
        elbow = servos[1],
        shoulder = servos[0],
        box = frame.interactionBox;

        if (finger) {
            wrist.move(toDegrees(Math.atan2(finger.direction[1], -finger.direction[2])) + 90);
            elbow.move(90 - toDegrees(hand.pitch()));
            var normXPosition = box.normalizePoint(hand.palmPosition)[0];
            shoulder.move(90 - normXPosition * 90);
        } else {
            servos.forEach(function(servo) {
                servo.center();
            });
        }
    }
});
board.on("ready", function() {
    servos = [ 
        new five.Servo("O0"),
        new five.Servo({
            pin:"O1",
            range: [ 0, 135 ]
        }),
        new five.Servo("O2") 
    ];
    servos.forEach(function(servo) {
        servo.center();
    });
    this.repl.inject({servos:servos});
    controller.connect();
});

