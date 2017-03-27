function forEach (collection, iterator) {
    for (var i=0;i<collection.length;i++) {
        iterator(collection[i]);
    }
};
