const util = require("../util/index"); //connect db  query string
const messages = require('../messages/index');
const result = require("../middleware/result");
const { GetAllTitleNameService } = require("../service/mas_name_titles");
const { viewGetNameTitleService } = require('../service/views_database/view_name_title')

exports.getNameTitle = async (req, res, next) => {
  try {
    result(res, await GetAllTitleNameService());

  } catch (error) {
    next(error);
  }
}

exports.viewGetNameTitle = async (req, res, next) => {
  try {
    const { id } = req.query

    result(res, await viewGetNameTitleService(id))

  } catch (error) {
    next(error);
  }
}

exports.createMasLayers = async (req,res,next)=>{
  try {
    result(res,"create")
  } catch (error) {
    next(error)
  }
}

exports.updateMasLayers = async (req,res,next)=>{
  try {
    result(res,"update")
  } catch (error) {
    next(error)
  }
}

exports.deleteMasLayers = async (req,res,next)=>{
  try {
    result(res,"update")
  } catch (error) {
    next(error)
  }
}




exports.createDataLayers = async (req,res,next)=>{
  try {
    result(res,"create")
  } catch (error) {
    next(error)
  }
}

exports.updateDataLayers = async (req,res,next)=>{
  try {
    result(res,"update")
  } catch (error) {
    next(error)
  }
}

exports.deleteDataLayers = async (req,res,next)=>{
  try {
    result(res,"delete")
  } catch (error) {
    next(error)
  }
}