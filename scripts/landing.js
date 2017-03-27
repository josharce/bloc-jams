var pointsArray = document.getElementsByClassName('point'),
    ionsArray = document.getElementsByClassName('ion');

var animatePoints = function (points, ions) {
    var revealPoint = function (points) {
        points.style.opacity = 1;
        points.style.transform = "scaleX(1) translateY(0)";
        points.style.msTransform = "scaleX(1) translateY(0)";
        points.style.WebkitTransform = "scaleX(1) translateY(0)";
    };
    var revealIon = function (ions) {
        ions.style.transform = "rotate(0deg)";
        ions.style.msTransform = "rotate(0deg)";
        ions.style.WebkitTransform = "rotate(0deg)";
    }
    forEach(points, revealPoint);
    forEach(ions, revealIon);
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