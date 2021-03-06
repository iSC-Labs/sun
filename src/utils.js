var exports = module.exports;

exports.boolToString = function boolToString(bool) {
  return bool ? 'True' : 'False';
};

var INDEX_DELIMITER = '|';

exports.indicesToKey = function indicesToKey(indices) {
  indices = indices.map(function(index) {
    if (typeof index === 'boolean') {
      index = exports.boolToString(index);
    }
    return index;
  });
  return indices.join(INDEX_DELIMITER);
};

/*
flattenObject({ x: 1, y: 2 }) => { x: 1, y: 2 }
flattenObject([ 1, 2 ])       => { 0: 1, 1: 2 }
flattenObject([ { x: 1, y: 2 }, { p: 3, q: 4 } ]) => {
  '0|x': 1,
  '0|y': 2,
  '1|p': 3,
  '1|q': 4,
}
*/
exports.flattenObject = function _flattenObject(obj) {
  var toReturn = {};

  for (var i in obj) {
    // istanbul ignore if
    if (!obj.hasOwnProperty(i)) continue;

    if (typeof obj[i] === 'object') {
      var flatObject = _flattenObject(obj[i]);
      for (var x in flatObject) {
      // istanbul ignore if
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i +  INDEX_DELIMITER + x] = flatObject[x];
      }
    } else {
      toReturn[i] = obj[i];
    }
  }
  return toReturn;
}

exports.createNestedObject = function createNestedObject(indices, val) {
  var object = {}
  var ref;

  for (var i = 0; i < indices.length; i++) {
    var prevIndex = indices[i-1];
    var index = indices[i];
    ref = ref ? ref[prevIndex] : object;
    ref[index] = {};
  }
  ref[index] = val;
  return object;
}

exports.getPropWithIndices = function getPropWithIndices(object, indices) {
  var ref = object;

  for (var i = 0; i < indices.length; i++) {
    var index = indices[i];
    val = ref[index]
    ref = ref[index];
  }
  return val;
};

exports.serializeTypes = function serializeTypes(object) {
  if (typeof object === 'boolean') {
    object = object ? 'True' : 'False';
  }
  return object;
};

exports.escapeSource = function escapeSource(src) {
  return src
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
};
exports.unescapeSource = function unescapeSource(src) {
  return src
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n');
}

function NotImplementedError(feature) {
  this.name = 'NotImplementedError';
  this.message = "Feature '"+feature+"' is not implemented";
};
NotImplementedError.prototype = Error.prototype
exports.NotImplementedError = NotImplementedError;
