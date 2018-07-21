//twitter model
var twit = require('twit');
var config = require('../models/config.js');
var T = new twit(config);

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var geocoder = require('geocoder'); // geocoder library

// our db model
var Secretes = require("../models/model.js");


// simple route to render am HTML form that can POST data to our server
// NOTE that this is not a standard API route, and is really just for testing
router.get('/cryout', function(req,res){
  res.render('cryout.html')
})

router.get('/eoskanvmfhwprxmrhksflwk', function(req,res){
  res.render('eoskanvmfhwprxmrhksflwk.html')
})

router.get('/about', function(req,res){
  res.render('about.html')
})


// simple route to render an HTML page that pulls data from our server and displays it on a page
// NOTE that this is not a standard API route, and is really for testing
router.get('/forest', function(req,res){
  res.render('forest.html')
})

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {

  res.render('cryout.html')
});

// /**
//  * POST '/api/create'
//  * Receives a POST request of the new secretes, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Secretes
//  * @return {Object} JSON
//  */

router.post('/cryout', function(req, res){

    // console.log(req.body);

    // pull out the information from the req.body
    var title = req.body.title;
    var secrete = req.body.secrete;

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var secreteObj = {
      title: title,
      secrete: secrete
    };

    // create a new secretes model instance, passing in the object
    var secretes = new Secretes(secreteObj);

    // now, save that secretes instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save
    secretes.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving secretes'};
        return res.json(error);
      }

      console.log('saved a new secrete!');
      // console.log(data);

      // now return the json data of the new secretes
      var jsonData = {
        status: 'OK',
        secretes: data
      }

      var tweetSecrete = data.secrete.substr(0, 110);
      console.log(tweetSecrete);
      // Post a tweet
      T.post('statuses/update', { status: tweetSecrete +'..'+'.'+'\n' +'http://localhost:3000/sori/'+ data._id}, function(err, data, response) {
      })

      //return res.json(jsonData);
      return res.redirect('/forest')

    })
});

// /**
//  * GET '/api/get/:id'
//  * Receives a GET request specifying the secretes to get
//  * @param  {String} req.params.id - The secretesId
//  * @return {Object} JSON
//  */

router.get('/api/get/:id', function(req, res){

  var requestedId = req.params.id;

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Secretes.findById(requestedId, function(err,data){

    // if err or no user found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that secretes'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the secretes
    var jsonData = {
      status: 'OK',
      secretes: data
    }

    return res.json(jsonData);

  })
})

// /**
//  * GET '/api/get'
//  * Receives a GET request to get all secretes details
//  * @return {Object} JSON
//  */

router.get('/api/get', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Secretes.find(function(err, data){
    // if err or no secretes found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find secretes'};
      return res.json(error);
    }

    // otherwise, respond with the data

    var jsonData = {
      status: 'OK',
      secretes: data
    }

    res.json(jsonData);

  })

})

// /**
//  * GET '/api/search'
//  * Receives a GET request to search an secretes
//  * @return {Object} JSON
//  */
router.get('/search', function(req,res){

  // first use req.query to pull out the search query
  var searchTerm = req.query.name;
  console.log("we are searching for " + searchTerm);

  // let's find that animal
  Secretes.find({name: searchTerm}, function(err,data){
    // if err, respond with error
    if(err){
      var error = {status:'ERROR', message: 'Something went wrong'};
      return res.json(error);
    }

    //if no secretes, respond with no secretes message
    if(data==null || data.length==0){
      var message = {status:'NO RESULTS', message: 'We couldn\'t find any results'};
      return res.json(message);
    }

    // otherwise, respond with the data

    var jsonData = {
      status: 'OK',
      secretes: data
    }

    res.json(jsonData);
  })

})


/**
 * GET '/api/blowaway/:id' delete
 * Receives a GET request specifying the secretes to delete
 * @param  {String} req.params.id - The secretesId
 * @return {Object} JSON
 */

router.get('/blowaway/:id', function(req, res){

  var requestedId = req.params.id;

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Secretes.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that secretes to blowaway'};
      return res.json(error);
    }

    // otherwise, respond back with success
    return res.redirect('/forest');

  })

})


module.exports = router;


// examples of a GET route using an HTML template
router.get('/sori/:id', function(req,res){

  var requestedId = req.params.id;

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Secretes.findById(requestedId, function(err,data){
    // if err or no user found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that secretes'};
       return res.json(error);
    }

    // otherwise preprate data of the secretes
    var templateData = data;

    return res.render('sori.html', templateData);

  })
})
