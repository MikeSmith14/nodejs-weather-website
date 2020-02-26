//Core modules
const path = require('path')
//NPM modules
const express = require('express')
const hbs = require('hbs')
//Required Code Files
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//Creating express
const app = express()

//Setting up Heroku port 
const port = process.env.PORT || 3000

//Defining paths for Express
const publicDir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Set express to use public folder
app.use(express.static(publicDir))

//Setting up handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Serving up home hbs
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Michael Smith'
    })
})

//Serving up about hbs
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Michael Smith'
    })
})

//Serving up help hbs
app.get('/help', (req, res) => {
    res.render('help', {
        message: 'How can I help you today?',
        title: 'Help',
        name: 'Michael Smith'
    })
})

//Weather
app.get('/weather', (req,res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) =>{
        if(error) {
            return res.send({ error })
        }
        forecast(latitude,longitude, (error, forecastData) => {
            if(error){
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })

    })
    
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    })
})

//Setting up Help 404 errors
app.get('/help/*', (req, res) =>{
    res.render('404errors', {
        error: 'Help article not found',
        name: 'Michael Smith',
        title: '404'
    })
})

//Setting up 404 errors
app.get('*', (req, res) => {
    res.render('404errors', {
        error: 'Page not found.',
        name: 'Michael Smith',
        title: '404'
    })
})

//Starting server
app.listen(port , () =>{
    console.log('Server is running on port ' + port)
})