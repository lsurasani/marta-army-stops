const express = require('express')
const request = require('request')
const app = express()
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Your server is up and running on port ${port}`))

app.get('/express_backend', (req, res) => {
    request.get({url: "http://barracks.martaarmy.org/ajax/get-next-departures.php?stopid=901212"}, function(err, response, body) {
        if (!err) {
            res.send({ body: JSON.parse(body) })
        }
    })
})




