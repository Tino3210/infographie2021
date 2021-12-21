////////////////////////////////////////////////
////              Model Loader              ////
////////////////////////////////////////////////

/**
 * Creates the buffers that contain the geometry of the model (in OBJ format)
 */
var textureBuffersArray = [];

/**
 * Get the obj raw data from the file and create a mesh and put it in the buffers which will be drawn in the scene
 */
function handleOBJModel(filename, data) {
  console.info(filename + ' has been retrieved from the server');
  var objData = new OBJ.Mesh(data);

  vertexBuffer = getVertexBufferWithVertices(objData.vertices);
  normalsBuffer = getVertexBufferWithVertices(objData.vertexNormals);
  textureBuffer = getVertexBufferWithVertices(objData.textures);
  indexBuffer = getIndexBufferWithIndices(objData.indices);

  vertexBuffersArray = [];
  normalBuffersArray = [];
  indexBuffersArray = [];
  textureBuffersArray = [];
  indicesArray = [];

  vertexBuffersArray.push(vertexBuffer);
  normalBuffersArray.push(normalsBuffer);
  textureBuffersArray.push(textureBuffer);
  indexBuffersArray.push(indexBuffer);
  indicesArray.push(objData.indices);
  
  return objData;
}
