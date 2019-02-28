const express = require('express')
const favicon = require('express-favicon');
const path = require('path');
const request = require('request')
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 5000

app.use(favicon(__dirname + '/client/build/favicon.ico'));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Your server is up and running on port ${port}`))

app.post('/express_backend', (req, res) => {
    const stopID = req.body.stop
    request.get({url: `http://barracks.martaarmy.org/ajax/get-next-departures.php?stopid=${stopID}`}, function(err, response, body) {
        if (!err) {
            res.send({ body: JSON.parse(body) })
        }
    })
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});





