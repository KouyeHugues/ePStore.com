const Application = require('../models/application.model');
const fs = require('fs');
const {
    promisify
} = require('util');
const pipeline = promisify(require('stream').pipeline);

module.exports.uploadScreenshot = (req, res) => {
    try {
        if (req.file.detectedMimeType != "image/jpg" &&
            req.file.detectedMimeType != "image/jpeg" &&
            req.file.detectedMimeType != "image/png")
            throw Error('Invalide file');

        if (req.file.size > 500000) throw Error('max size');
    } catch (error) {
        return res.status(201).json({
            error
        });
    }

    const MIME_TYPES = {
        'image/jpg': 'jpg',
        'image/jpeg': 'jpg',
        'image/png': 'png'
    };

    //     const fileName = (req, file, callback) => {
    //     const name = file.originalname.split(' ').join('_');
    //     const extension = MIME_TYPES[file.mimetype];
    //     callback(null, name + Date.now() + '.' + extension);
    //   }
    const fileName = Date.now() + ".jpg";
    pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../public/upload/${fileName}`
        )
    );

    try {
        Application.findByIdAndUpdate(
            req.body.userId, {
                $set: {
                    screenshot: './upload' + fileName
                }
            }, {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(500).send({
                    message: err
                });
            }
        );
    } catch (err) {
        return res.status(500).send({
            message: err
        });
    }
}