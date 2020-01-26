const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const http = require('http');
const sentry = require('raven');

const routes = require("./routers/routes")

const app = express();
const server = http.Server(app);
const port = 3333;


app.use(cors());
app.use(express.json())
app.use(routes)


app.listen(port, (err) => {
    if (err) {
      console.log('Errors happens')
    } else {
      console.log(`Enabled and web serv list on port ${port}!`)
      console.log('The system running on http://localhost:3333')
    }
});


new Promise((_, reject) => reject(new Error('woops'))).
  catch(error => new Promise((resolve, reject) => {
    sentry.captureMessage(error.message, function(error) {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  }));


mongoose.connect('mongodb://URUSER:URKEYPASSW@cluster0-shard-00-00-vgvxr.gcp.mongodb.net:27017,cluster0-shard-00-01-vgvxr.gcp.mongodb.net:27017,cluster0-shard-00-02-vgvxr.gcp.mongodb.net:27017/URDB?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use((req, res, next) => {
  next(console.error(404));
});


module.exports = server
