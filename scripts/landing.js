var animatePoints = function () {
    var points = document.getElementsByClassName('point'),
        ions = document.getElementsByClassName('ion');

    var revealPoint = function (i) {
            points[i].style.opacity = 1;
            points[i].style.transform = "scaleX(1) translateY(0)";
            points[i].style.msTransform = "scaleX(1) translateY(0)";
            points[i].style.WebkitTransform = "scaleX(1) translateY(0)";
            ions[i].style.transform = "rotate(0deg)";
            ions[i].style.msTransform = "rotate(0deg)";
            ions[i].style.WebkitTransform = "rotate(0deg)";
    };

    for (var i=0;i<points.length;i++) {
        revealPoint(i);
    }
};
