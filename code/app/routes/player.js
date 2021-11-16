const fs = require('fs');
//PEGAR AQUI 1

module.exports = {
    addPlayerPage: (req, res) => {
        res.render('add-player.ejs', {
            title: 'Welcome to Socka | Add a new player'
            ,message: ''
        });
    },
    addPlayer: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let nombre = req.body.nombre;
        let apellido = req.body.apellido;
        let posicion = req.body.posicion;
        let numero = req.body.numero;
        let usuario = req.body.usuario;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = usuario + '.' + fileExtension;

        let usuarioQuery = "SELECT * FROM `jugador` WHERE usuario = '" + usuario + "'";

        db.query(usuarioQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'usuario already exists';
                res.render('add-player.ejs', {
                    message,
                    title: 'Welcome to Socka | Add a new player'
                });
            } else {
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }

                        //PEGAR AQUI 2
                        let query = "INSERT INTO `jugador` (nombre, apellido, posicion, numero, imagen, usuario) VALUES ('" +
                            nombre + "', '" + apellido + "', '" + posicion + "', '" + numero + "', '" + image_name + "', '" + usuario + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-player.ejs', {
                        message,
                        title: 'Welcome to Socka | Add a new player'
                    });
                }
            }
        });
    },
    editPlayerPage: (req, res) => {
        let playerId = req.params.id;
        let query = "SELECT * FROM `jugador` WHERE id = '" + playerId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-player.ejs', {
                title: 'Edit  Player'
                ,player: result[0]
                ,message: ''
            });
        });
    },
    editPlayer: (req, res) => {
        let playerId = req.params.id;
        let nombre = req.body.nombre;
        let apellido = req.body.apellido;
        let posicion = req.body.posicion;
        let numero = req.body.numero;

        let query = "UPDATE `jugador` SET `nombre` = '" + nombre + "', `apellido` = '" + apellido + "', `posicion` = '" + posicion + "', `numero` = '" + numero + "' WHERE `jugador`.`id` = '" + playerId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletePlayer: (req, res) => {
        let playerId = req.params.id;
        let getImageQuery = 'SELECT imagen from `jugador` WHERE id = "' + playerId + '"';
        let deleteUserQuery = 'DELETE FROM jugador WHERE id = "' + playerId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let imagen = result[0].imagen;

            fs.unlink(`public/assets/img/${imagen}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};