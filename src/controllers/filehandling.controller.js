const filehandling_service = require('../services/filehandling.service');
const { v4 : uuidv4 } = require('uuid');

exports.UploadFile = async (req, res) => {
    try {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const sampleFile = req.files.file;
        const filename = `${uuidv4()}@${sampleFile.name}`;
        const uploadPath = `./uploads/${filename}`; // mimetype of file
        console.log("uploadPath", uploadPath);

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function (err) {
            if (err)
                console.log(err);
            console.log("File uploaded!");
            res.json({
                message: 'File uploaded successfully',
                data: filename,
                error: null,
            });
        })
    } catch (err) {
        console.log(err);
        res.json({
            message: 'Error uploading file',
            data: null,
            error: err,
        });
    }
}
