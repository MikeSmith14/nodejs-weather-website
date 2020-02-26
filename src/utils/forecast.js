//Required NPM Modules
const request = require('request')

/*  forecast function. Takes a specified latitude and longitude and pass them to
    the DarkSky API to load the complete weather forecast for those coordinates.
    Using only specific data, it will return the weather summary, current 
    temperature and chance of rain.
*/
const forecast = (latitude, longitude, callback) =>{
    const url = 'https://api.darksky.net/forecast/555b90b848b48fc6b6c50e8c4eb01430/' + encodeURIComponent(latitude) + ','+  encodeURIComponent(longitude)

    request({ url, json: true}, (error, {body}) =>{
        if(error){
            callback('Unable to connect to weather service!', undefined)
        } else if(body.error){
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degress out. There is a ' + body.currently.precipProbability + '% chance of rain.')
        }
    })
}

module.exports = forecast