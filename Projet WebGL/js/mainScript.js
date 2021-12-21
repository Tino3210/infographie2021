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
      let rayon = 0.5;
      let step = (rayon * 2); // The size of the cell in the grid

      points = [];
      pointsNormales = [];
      pointsIndices = [];

      for (let t = triangles.length - 1; t >= 0; t--) {
        let root_point = triangles[t][0];
        let normale = triangles[t][3];
        
        console.log("Triangle : " + triangles[t]);
        console.log("Normale : " + normale);

        // Calculate the two vectors forming the base axis of the triangle
        // X Axis
        let v1 = []
        v1[0] = triangles[t][1][0] - triangles[t][0][0];
        v1[1] = triangles[t][1][1] - triangles[t][0][1];
        v1[2] = triangles[t][1][2] - triangles[t][0][2];
        v1_size = Math.sqrt(Math.pow(v1[0], 2) + Math.pow(v1[1], 2) + Math.pow(v1[2], 2));
        // Y Axis - Normal
        let v2 = math.cross(v1, normale);
        v2_size = Math.sqrt(Math.pow(v2[0], 2) + Math.pow(v2[1], 2) + Math.pow(v2[2], 2));
        
        // Unitary transformation
        // V1
        v1[0] = (v1[0] / v1_size) * step;
        v1[1] = (v1[1] / v1_size) * step;
        v1[2] = (v1[2] / v1_size) * step;
        // V2
        v2[0] = (v2[0] / v2_size) * step;
        v2[1] = (v2[1] / v2_size) * step;
        v2[2] = (v2[2] / v2_size) * step;
        
        let mX = 100;
        let mY = 100;

        for (let i = 0; i < mX; i++) {
          let v_temp = [];

          if (i % 2 != 0) {
            offset = step;
          } else {
            offset = 0;
          }

          for (let j = (0 + offset); j < mY; j++) {
            v_temp[0] = parseFloat(root_point[0]) + parseFloat(i * v1[0]) + parseFloat(j * v2[0]);
            v_temp[1] = parseFloat(root_point[1]) + parseFloat(i * v1[1]) + parseFloat(j * v2[1]);
            v_temp[2] = parseFloat(root_point[2]) + parseFloat(i * v1[2]) + parseFloat(j * v2[2]);

            // Test if the vector is in the triangle
            if (pointInTriangle(v_temp, triangle[0], triangle[1], triangle[2])) {              
              // Add the points to be drawn
              pointsIndices.push(points.length);
              points.push(v_temp[0]);
              pointsIndices.push(points.length);
              points.push(v_temp[1]);
              pointsIndices.push(points.length);
              points.push(v_temp[2]);
            }
          }
        }
      }
      
      vertexBuffersArray.push(getVertexBufferWithVertices(points));
      normalBuffersArray.push(getVertexBufferWithVertices(pointsNormales));
      indexBuffersArray.push(getIndexBufferWithIndices(pointsIndices));
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

  for (let i = 0; i < objData.indices.length; i += 9) {
    triangle = [];
    normale = [];
    for (let j = 0; j < 3; j++) {
      point = [];
      for (let k = 0; k < 3; k++) {
        point.push(parseFloat(objData.vertices[objData.indices[i + 3 * j + k] - 1]));
      }      
      triangle.push(point);
      normale.push(parseFloat(objData.vertexNormals[i + j]));
    }
    triangle.push(normale);
    triangles.push(triangle);
  }

  /*
  console.log(objData.indices);

  for (let i = 0; i < objData.vertices.length; i += 9) {
    triangle = [];
    normale = [];
    for (let j = 0; j < 3; j++) {
      point = [];
      for (let k = 0; k < 3; k++) {
        point.push(parseFloat(objData.vertices[i + 3 * j + k]));
      }      
      triangle.push(point);
      normale.push(parseFloat(objData.vertexNormals[i + j]));
    }
    triangle.push(normale);
    triangles.push(triangle);
  }
  */

  return triangles;  
}