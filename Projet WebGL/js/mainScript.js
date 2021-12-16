// Click event on the "Appliquer les transformations" button
document.getElementById('loadOBJ').addEventListener('click', event => {
  // Get the file name
  let file = document.getElementById('fileUpload').files[0];
  // If the file exist then the function reads it
  if (file) {
    let reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function (evt) {
      // Use the handleOBJModel to draw and get specific data
      triangles = getAllTriangles(handleOBJModel(file, evt.target.result));

      // Rasterization

    };
    // If there's an error, show it in a specific div 'errorFIle'
    reader.onerror = function (evt) {
      document.getElementById('errorFile').innerHTML = 'error reading file';
    };
  }
});

/**
 * Function which get all the triangles from a given mesh
 */
function getAllTriangles(objData) {
  triangles = [];

  for (let i = 0; i < objData.vertices.length; i += 9) {
    triangle = [];
    for (let j = 0; j < 3; j++) {
      point = [];
      for (let k = 0; k < 3; k++) { 
        point.push(objData.vertices[i + 3*j + k]);
      }
      triangle.push(point);
    }
    triangles.push(triangle);
  }

  return triangles;  
}