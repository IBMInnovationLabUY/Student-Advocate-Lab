module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `jugador` ORDER BY id ASC";

        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: 'Lista de Jugadores'
                ,players: result
            });
        });
    },
};