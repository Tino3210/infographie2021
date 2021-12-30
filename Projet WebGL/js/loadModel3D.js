////////////////////////////////////////////////
////              Model Loader              ////
////////////////////////////////////////////////

/**
 * Creates the buffers that contain the geometry of the model (in OBJ format)
 */
var textureBuffersArray = [];

/**
 * Get the obj raw data from the file and create a mesh and put it in the buffers which will be drawn in the scene
 * @param {*} filename 
 * @param {*} data 
 * @returns objData - data parsed from the obj file
 */
function handleOBJModel(filename, data) {
  console.info(filename + ' has been retrieved from the server');
  // Get the data from the obj file
  var objData = new OBJ.Mesh(data);
  // Put it into the buffers so they can draw the mesh
  vertexBuffer = getVertexBufferWithVertices(objData.vertices);
  normalsBuffer = getVertexBufferWithVertices(objData.vertexNormals);
  textureBuffer = getVertexBufferWithVertices(objData.textures);
  indexBuffer = getIndexBufferWithIndices(objData.indices);
  // Empty the buffers array
  vertexBuffersArray = [];
  normalBuffersArray = [];
  indexBuffersArray = [];
  textureBuffersArray = [];
  indicesArray = [];
  // Add the buffer to the buffers array
  vertexBuffersArray.push(vertexBuffer);
  normalBuffersArray.push(normalsBuffer);
  textureBuffersArray.push(textureBuffer);
  indexBuffersArray.push(indexBuffer);
  indicesArray.push(objData.indices);
  // Return the data of the obj file so it can be used
  return objData;
}
