
const ProductModel = require('../models/products') ;
const _= require("lodash")
const Joi = require('joi');
const { Schema } = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config')

const createProduct = function(req,res,next) {
    
    // if (__.isNaN(_.get(req,"body.price"))) {
    //     return res.status(422).send({err:"price should be number"})
    // } 
    // const schema = Joi.object().keys({
    //     price: Joi.number().required(),
    //     title : join.string().min(15).required()
    //   });
    //   const {error} = Schema.validated(req.body);
    //   return res.send(_.get(error,"details",[]));
    const product = new ProductModel(req.body);
    // product.title = req.body.title;
    // product.image = req.body.image;
    product.save(function(err,data){
        if (err) {
            return res.status(422).send(err)
        } 
        return res.send(data)
    })
    
    //return res.send({sucess:true,body:req.body,product:product})
}


const getProducts = function(req,res,next) {
    ProductModel.find({},function(err,data){
       // return res.send("I am from products controller123")
       return res.send(data)
    })
    
}
const getProduct = function(req,res,next) {
    //res.send(req.params)
    const id = req?.params?.id;
    ProductModel.findById(id,function(err,data){
       // return res.send("I am from products controller123")
       return res.send(data)
    })
    
}

const updateProduct = function(req,res,next) {
    const id = _.get(req,"params.id",null) 
    const body = _.get(req,"body",{})
    ProductModel.findByIdAndUpdate(id,body,function (err,data) {
        if (err) {
            return res.status(404).send(err)
        }
        return res.send(data)
    })
} 

const deleteProduct = function(req,res,next) {
    const id = _.get(req,"params.id",null) 
    const authorization = req.headers.authorization;
    if(!authorization) {
        return res.send({success:false, message: "You are not Authorized"})
    }
    const token = authorization.split("Bearer")
    const decoded = jwt.verify(token[1], config.JWT_SECRET)
    if(decoded.role != "administrator"){
        return res.send({success: false, message: "You are not Authorized"})
    }
    return res.send({ success: true, decoded: decoded})
    ProductModel.findByIdAndDelete(id,function (err,data) {
        if (err) {
            return res.status(404).send(err)
        }
        return res.send(data)
    })
}

module.exports = {getProducts,getProduct,createProduct,updateProduct,deleteProduct}