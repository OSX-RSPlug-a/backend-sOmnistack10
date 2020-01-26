const { Router } = require('express');

const DevController = require('./../controllers/DevController');
const SearchController = require('./../controllers/SearchController');


const routes = Router();


routes.get('/devs', DevController.index )

routes.post('/devs', DevController.store);

routes.post('/search', SearchController.index);

routes.put('/devs/:id', DevController.update);

routes.delete('/devs/:id', DevController.delete);


module.exports = routes;
