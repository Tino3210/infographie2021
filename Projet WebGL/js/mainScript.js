document.querySelector('button').addEventListener('click', event => {
  let file = document.getElementById('fileUpload').files[0];
  console.log(file);
  if (file) {
    let reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function (evt) {
      handleOBJModel(file, evt.target.result);
    };
    reader.onerror = function (evt) {
      document.getElementById('errorFile').innerHTML = 'error reading file';
    };
  }
});
