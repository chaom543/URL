let express = require('express')
let mongoose = require('mongoose')
let ShortUrl = require('./models/shortUrl')
const app = express();
const bp = require("body-parser");
const qr = require("qrcode");

mongoose.connect('mongodb://127.0.0.1/urlShortener',{
    useNewUrlParser: true, useUnifiedTopology:true
})
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async(request,response) =>{
let shortUrls = await ShortUrl.find()
 response.render('index',{shortUrls:shortUrls})

})
app.post('/shortUrls',async(request,response) =>{
    await ShortUrl.create({full:request.body.fullUrl })

response.redirect('/')
})

app.get('/:shortUrl', async (request, response) => {
  const shortUrl = await ShortUrl.findOne({ short: request.params.shortUrl })
  if (shortUrl == null) return response.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  response.redirect(shortUrl.full)
})

app.post("/scan", (request, response) => {
    const url = request.body.url;

    if (url.length === 0) response.send("Empty Data!");
    qr.toDataURL(url, (err, src) => {
        if (err) response.send("Error occured");

        response.render("scan", { src });
    });
});
app.listen(process.env.PORT || 5000);