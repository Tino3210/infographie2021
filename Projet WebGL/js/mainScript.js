document.querySelector('button').addEventListener('click', event => {
    let file = document.getElementById('fileUpload').files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (evt) {
            document.getElementById('fileContents').innerHTML = evt.target.result;
        }
        reader.onerror = function (evt) {
            document.getElementById('errorFile').innerHTML = 'error reading file';
        }
    }
});