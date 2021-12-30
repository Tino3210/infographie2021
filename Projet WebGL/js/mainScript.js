// Values to access the element of the front page
const inputLoader = document.getElementById('fileUpload');
const labelInput = document.getElementById('fileUploadLabel');
const slider = document.getElementById('spaceDots');
const pValue = document.getElementById('valueSlider');
pValue.textContent = slider.value;

/**
 * Whenever the slider value is changed
 */
slider.addEventListener('input', event => {
  pValue.textContent = slider.value;
  if (triangles.length > 0) {
    rasterization();
  }
});

/**
 * When a file is chosen
 */
inputLoader.addEventListener('change', event => {
  let fileName = event.target.value.split("\\").pop();
  if(fileName != ''){    
    labelInput.textContent = fileName;
  }else{
    labelInput.textContent = "Aucun fichier sélectionné";
  }
});

/**
 * Substract two vectors
 * Used to do calculations like[OB - OA = AB]
 * Form a vector from two vertices
 * @param {*} point1 
 * @param {*} point2 
 * @returns v
 */
function vectorSubstraction(point1, point2) {
  let v = [];
  v[0] = point2[0] - point1[0];
  v[1] = point2[1] - point1[1];
  v[2] = point2[2] - point1[2];
  return v;
}

/**
 * Addition of two vectors
 * @param {*} vector1 
 * @param {*} vector2 
 * @returns 
 */
function vectorAddition(vector1, vector2) {
  let v = [];
  v[0] = vector1[0] + vector2[0];
  v[1] = vector1[1] + vector2[1];
  v[2] = vector1[2] + vector2[2];
  return v;
}

/**
 * Multiply a vector by a factor
 * @param {*} vector
 * @param {*} factor 
 * @returns v
 */
function vectorMultiplication(vector, factor) {
  let v = [];  
  v[0] = vector[0] == 0 ? 0 : vector[0] * factor;
  v[1] = vector[1] == 0 ? 0 : vector[1] * factor;
  v[2] = vector[2] == 0 ? 0 :  vector[2] * factor;
  return v;
}

/**
 * Get the vector's size
 * @param {*} vector
 * @returns size
 */
function vectorSize(vector) {
  return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2));
}

/**
 * Get a vector's unitary vector
 * @param {*} vector 
 * @param {*} vectorSize 
 * @returns u
 */
function unitaryTransformation(vector, vectorSize) {
  let u = [];
  u[0] = (vector[0] / vectorSize);
  u[1] = (vector[1] / vectorSize);
  u[2] = (vector[2] / vectorSize);
  return u;
}

/**
 * cos(theta) = scalar(a * b) / norm(a) * norm(b)
 * @param {*} vector1 
 * @param {*} vector2 
 */
function vectorsAngle(vector1, vector2) {
  sizeVector1 = vectorSize(vector1);
  sizeVector2 = vectorSize(vector2);
  scalarProduct = math.dot(vector1, vector2);
  return Math.acos(scalarProduct / (sizeVector1 * sizeVector2)) * (180 / Math.PI);
}

/**
 * Get the indices of the two vertices of the biggest side of the triangle
 * @param {*} triangle 
 * @returns [rootVertexIndex, nextVertexIndex]
 */
function biggestTriangleSide(triangle) {
  // Vertices' indices to be used;
  rootVertexIndex = null;
  nextVertexIndex = null;

  // Get all the sides by pair of two vertices
  sides = [];
  // Get all the vertices side
  side1 = [0, 1];
  side2 = [1, 2];
  side3 = [0, 2];
  // Add the sides to the list
  sides.push(side1);
  sides.push(side2);
  sides.push(side3);

  // Max value
  max = 0;

  // Get the vertices which form the biggest side of the triangle
  for (let i = 0; i < sides.length; i++) {
    sideSize = vectorSize(vectorSubstraction(triangle[sides[i][0]], triangle[sides[i][1]]));
    if (sideSize > max) {
      max = sideSize;
      rootVertex = sides[i][0];
      nextVertex = sides[i][1];
    }
  }

  return [rootVertex, nextVertex];
}

/**
 * Function which get all the triangles from a given mesh
 * @param {*} objData 
 * @returns triangles
 */
function getAllTriangles(objData) {
  triangles = [];
  let indicesLength = objData.indices.length;
  for (let i = 0; i < indicesLength; i += 3) {
    triangle = [];
    normale = [parseFloat(objData.vertexNormals[objData.indices[i] * 3]), parseFloat(objData.vertexNormals[objData.indices[i] * 3 + 1]), parseFloat(objData.vertexNormals[objData.indices[i] * 3 + 2])];
    
    for (let j = 0; j < 3; j++) {
      point = [];
      point.push(parseFloat(objData.vertices[objData.indices[i + j] * 3]), parseFloat(objData.vertices[objData.indices[i + j] * 3 + 1]), parseFloat(objData.vertices[objData.indices[i + j] * 3 + 2]));
      triangle.push(point);
    }
    triangle.push(normale);
    triangles.push(triangle);
  }
  return triangles;
}

/**
 * Function used to rasterize all the triangle of the mesh
 */
function rasterization() { 
  points = [];
  pointsNormales = [];
  pointsIndices = [];
  vertexBuffersArray.splice(1, 1);
  normalBuffersArray.splice(1, 1);
  indexBuffersArray.splice(1, 1);

  let step = slider.value; // The size of the cell's radius in the grid
  for (let t = triangles.length - 1; t >= 0; t--) {
    // Give the two vertices which forms the longest side of the triangle
    axisXVertices = biggestTriangleSide(triangles[t]);
    axisYVertices = 3 - (axisXVertices[0] + axisXVertices[1]);

    // Get the first point of the triangle
    //let root_point = triangles[t][0];
    let root_point = triangles[t][axisXVertices[0]];

    // Get the triangle normale
    let normale = triangles[t][3];
    
    // Calculate the two vectors forming the base axis of the triangle
    // X Axis
    //let v1 = vectorSubstraction(triangles[t][0], triangles[t][1]);
    let v1 = vectorSubstraction(triangles[t][axisXVertices[0]], triangles[t][axisXVertices[1]]);
    let v1_size_max = vectorSize(v1);
    // Y Axis - Normal
    let v2 = math.cross(v1, normale);
    // Correct the sens of the v2 vector if it isn't in the good direction
    if (vectorsAngle(v2, vectorSubstraction(triangles[t][axisXVertices[0]], triangles[t][axisYVertices])) > 90) {
      v2 = vectorMultiplication(v2, -1);
    }
    let v2_size_max = vectorSize(v2);

    // Unitary transformation
    // V1
    v1 = unitaryTransformation(v1, v1_size_max);
    // V2
    v2 = unitaryTransformation(v2, v2_size_max);

    // Mult the unitary vector by the step
    v1 = vectorMultiplication(v1, step);
    v2 = vectorMultiplication(v2, step);

    // Size of the unitary vectors
    v1_size_u = vectorSize(v1);
    v2_size_u = vectorSize(v2);

    // Number of iteration for the grid --> Size of the initial vector (Side of the triangle) / Size of vector step
    let mX = v1_size_max / v1_size_u;
    let mY = v2_size_max / v2_size_u;
    
    let offset = 0;
    // Main iteration --> It is here that the points will be generated
    for (let i = 0; i < mX; i++) {
      // Final vector, the point which will be added
      let v_temp = [];

      if (i % 2 == 0) {
        offset = 0;
      } else {
        offset = step;
      }

      // Calculate each point and if it is inside the current triangle, place it in the scene
      for (let j = (0 + offset); j < mY; j++) {
        v_temp[0] = root_point[0] + (i * v1[0] + j * v2[0]);
        v_temp[1] = root_point[1] + (i * v1[1] + j * v2[1]);
        v_temp[2] = root_point[2] + (i * v1[2] + j * v2[2]);
        
        // Test if the vector is in the triangle
        if (pointInTriangle(v_temp, triangle[0], triangle[1], triangle[2])) {
          // Add the point to be drawn
          pointsIndices.push(points.length);
          points.push(v_temp[0], v_temp[1], v_temp[2]);
          // Add the face's normale
          pointsNormales.push(normale);
        }

        /*
        ----- Mathématiques données par Mr. Gobron qui ont été testée. Seulement, le résultat est moins bon qu'avec la grille faite ci-dessus. -----
        ----- Les calculs sont disponibles dans le dossier <justificatif> -----
        d = step;
        a = (Math.sqrt(3) * d) / 2;
        
        c1 = vectorAddition(root_point, vectorAddition(vectorMultiplication(v1, d + 3 * d * i), vectorMultiplication(v2, a + 2 * a * j)));
        c2 = vectorAddition(root_point, vectorAddition(vectorMultiplication(v1, 2.5 * d + 3 * d * i), vectorMultiplication(v2, 2 * a + 2 * a * j)));
        
        // Test if the vector is in the triangle
        if (pointInTriangle(c1, triangle[0], triangle[1], triangle[2])) {
          // Add the point to be drawn
          pointsIndices.push(points.length);
          points.push(c1[0], c1[1], c1[2]);
          // Add the face's normale
          pointsNormales.push(normale);
        }
        // Test if the vector is in the triangle
        if (pointInTriangle(c2, triangle[0], triangle[1], triangle[2])) {
          // Add the point to be drawn
          pointsIndices.push(points.length);
          points.push(c2[0], c2[1], c2[2]);
          // Add the face's normale
          pointsNormales.push(normale);
        }
        */
      }
    }
  }

  // Push the values in the buffers so the scene can draw them
  vertexBuffersArray.push(getVertexBufferWithVertices(points));
  normalBuffersArray.push(getVertexBufferWithVertices(pointsNormales));
  indexBuffersArray.push(getIndexBufferWithIndices(pointsIndices));
}

/**
 * Click event on the "Appliquer les transformations" button
 */
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

      // Call asynchronous process
      callProcess();
    };
    // If there's an error, show it in a specific div 'errorFIle'
    reader.onerror = function (evt) {
      document.getElementById('errorFile').innerHTML = 'error reading file';
    };
  }
});

/**
 * The process needed to be asynchrone
 * @returns Promise
 */
const process = () => {
  return new Promise(resolve => {    
    rasterization();
    resolve('resolved');
  });
}

/**
 * The asynchrone call
 */
const callProcess = async() =>{
  let dateStart = Date.now();
  let intervalChrono = setInterval(() => {
    let dateChono = (Date.now() - dateStart);
    if(dateChono <= 1){
      document.getElementById("timeProcess").textContent = dateChono + ' seconde';
    } else {
      document.getElementById("timeProcess").textContent = dateChono + ' secondes';
    }
  }, 1000);
  const result = await process();
  if(result == 'resolved'){
    clearInterval(intervalChrono);
  }
};