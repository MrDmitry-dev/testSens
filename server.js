const express = require('express')
const fetch = require('node-fetch')
const app = express()
const port = 3000

app.use(express.static('public'));

app.get('/getCoordinates', async(req, res) => {

    const api_url = 'https://waadsu.com/api/russia.geo.json'
    const fetch_res = await fetch(api_url)
    const json = await fetch_res.json()
    const coordinates = json.features[0].geometry.coordinates
    res.json(coordinates)

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})