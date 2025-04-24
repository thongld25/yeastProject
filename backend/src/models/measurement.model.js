'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Measurement';
const COLLECTION_NAME = 'measurements';

// Declare the Schema of the Mongo model
var measurementSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    experimentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Experiment',
        required:true
    },
    images:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Image'
    }], 
    time:{
        type:Date,
        default:Date.now
    },
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, measurementSchema);