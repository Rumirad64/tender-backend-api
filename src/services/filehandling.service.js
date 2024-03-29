
const sha256File = require('sha256-file');

exports.StoreFile = async (req) => {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/uploads/' + sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err)
            console.log(err);
        res.send('File uploaded!');
    });

    return new Promise(async (resolve, reject) => {
        resolve(sha256File.sync(uploadPath));
    });
}