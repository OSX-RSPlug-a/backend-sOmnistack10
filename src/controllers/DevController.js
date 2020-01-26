const axios = require('axios');

const Dev = require('./../models/Dev');
const parseStringArray = require('./../config/parseStringArray');
const { findConnections, sendMessage } = require('./../config/websocket');


module.exports = {

    async index(request, response) {

        let devs = await Dev.find();

        return response.json(devs);

    },

    async store(request, response) {

        let { github_username, techs, latidude, longitude } = request.body;
    
        let dev = await Dev.findOne({ github_username })

        if  (!dev) {

            let apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
            let { name = login, avatar_url, bio } = apiResponse.data;
        
            if (!name){
                name = apiResponse.data.login;
            }
        
            let techsArray = parseStringArray(techs);
        
            let location = {
                type: 'Point',
                coordinates: [longitude, latidude],
            };
        
            dev = await Dev.create ({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });
            
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);

        }
        
        //tst - console.log( name, avatar_url, bio, github_username);
    
        return response.json(dev);  
    },

    async update(req, res) {
        
        const { id } = req.params;
        
        let { techs, github_username, ...rest } = req.body;
        
        let dev = await Dev.findOne({ _id: id });
        
        let techsArray;
        
        if (techs) {
            techsArray = parseStringArray(techs);
        }
        
        let name;
        
        let avatar_url;
        
        let bio;
        
        let updatedDev;
        
        if (github_username !== dev.github_username) {
              
            let response = await axios.get(`https://api.github.com/users/${github_username}`,);
        
            name = response.data.name;
            
            avatar_url = response.data.avatar_url;
            
            bio = response.data.bio;
        
            updatedDev = await Dev.updateOne(dev, {
                techs: techs ? techsArray : dev.techs,
                github_username,
                name,
                avatar_url,
                bio,
                ...rest,
            });
        }

        return res.json({
            modified: updatedDev ? updatedDev.nModified : null,
            ok: updatedDev ? updatedDev.ok : null,
        });

    },

    async delete(req, res) {
        
        const { id } = req.params;
    
        let dev = await Dev.findOne({ _id: id });
    
        if (!dev) {
          return res.json({ error: 'Developer does not found.' });
        }
    
        dev.remove();
    
        let devs = await Dev.find();
    
        return res.json(devs);
      },
      
};
