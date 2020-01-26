const Dev = require('./../models/Dev');

const parseStringArray = require('./../config/parseStringArray');


module.exports = {

    async index(request, response) {
        // geting results from a range of km
        // filtering by stack
        let { latitude, longitude, techs } = request.query;

        let techsArray = parseStringArray(techs);

        let devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coodinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        });

        //console.log(techsArray);

        return response.json({ devs });

    }

};