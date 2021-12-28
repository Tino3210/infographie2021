/**
 * This function checks if a point is on the "same side" of a vector
 * That's means that the vector from the cross product is pointing towards us
 * To know what pointing towards us means, 
 * we compare it to the cross product vector of two vectors of our triangle with a dot product.
 * If the dot product is zero or positiv then it's pointing towards us
 * @param {*} p1 
 * @param {*} p2 
 * @param {*} a 
 * @param {*} b 
 * @returns bool
 */
function sameSide(p1, p2, a, b) {
  ba = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  p1a = [p1[0] - a[0], p1[1] - a[1], p1[2] - a[2]];
  p2a = [p2[0] - a[0], p2[1] - a[1], p2[2] - a[2]];
  cp1 = math.cross(ba, p1a);
  cp2 = math.cross(ba, p2a);
  if (math.dot(cp1, cp2) >= 0) {
    return true;
  }
  return false;
}

/**
 * A function that checks if a point is inside a triangle by checking if it is on the "same side" 
 * of each of the three vectors of the triangle
 * @param {*} p 
 * @param {*} a 
 * @param {*} b 
 * @param {*} c 
 * @returns bool
 */
function pointInTriangle(p, a, b, c) {
  if (sameSide(p, a, b, c) && sameSide(p, b, a, c) && sameSide(p, c, a, b)) {
    return true;
  }
  return false;
}
