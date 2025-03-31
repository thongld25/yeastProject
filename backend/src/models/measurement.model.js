'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Measurement';
const COLLECTION_NAME = 'measurements';

// Declare the Schema of the Mongo model
var measurementSchema = new mongoose.Schema({
    experimentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Experiment',
        required:true
    },
    images:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Image'
    }]
},{
    timestamps:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, measurementSchema);