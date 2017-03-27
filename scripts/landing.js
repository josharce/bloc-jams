var pointsArray = document.getElementsByClassName('point'),
    ionsArray = document.getElementsByClassName('ion');

var animatePoints = function (points, ions) {
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

window.onload = function () {
    if (window.innerHeight > 950) {
        animatePoints(pointsArray, ionsArray);
    }
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    window.addEventListener('scroll', function (event) {
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
            animatePoints(pointsArray, ionsArray);
        }
    });
}
