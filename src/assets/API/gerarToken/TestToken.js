var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

// Register the route to get a new token
// In a real world scenario we would authenticate user credentials
// before creating a token, but for simplicity accessing this route
// will generate a new token that is valid for 2 minutes
router.get('/token', function (req, res) {
    var test = req.headers;
    if (test.username === "adm" && test.senha === "adm") {
        var token = jwt.sign({ username: 'adm', senha: "adm" }, 'supersecret', { expiresIn: 120 });
        res.json({
            "Token": token
        });
    } else if (test.username === "NexumWhat" && test.senha === "Nexum@2022") {
        var token = jwt.sign({ username: 'NexumWhat', senha: "Nexum@2022" }, 'supersecret', { expiresIn: 120 });
        res.json({
            "Token": token
        });
    } else {
        res.send("ERRO");
    }
})

// Register a route that requires a valid token to view data

module.exports = router;
// Launch our app on port 3000
// app.listen('3000');