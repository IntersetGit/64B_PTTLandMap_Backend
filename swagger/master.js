const Joi = require("@hapi/joi");
/**
 * File name for request and response model should be same as router file.
 * Define request model with there order in router js file.
 * For example first api in user router is create user so we define createUser schema with key 0.
 */
module.exports = {
    1: {
        body: {  
            id:Joi.string(),   
        },

        model: "viewGetNameTitle 1 ", // Name of the model
        group: "master",
        description: "",
    },
    5: {
        body: {  
            search:Joi.string(), 
        },

        model: "searchmasLayers ", // Name of the model
        group: "master",
        description: "ค้นหา mas_layers_group",
    },
    6: {
        body: {  
            group_name:Joi.string(), 
            order_by:Joi.number(), 
            isuse:Joi.number(), 
        },

        model: "addgetMasLayers ", // Name of the model
        group: "master",
        description: "เพิ่ม mas_layers_group",
       
    },
    7: {
        body: {  
            id:Joi.string(), 
            roles_id:Joi.string(),
            user_id:Joi.string(),
            group_name:Joi.string(),
            order_by:Joi.number(),
            isuse:Joi.number(),
        },

        model: "editmasLayers ", // Name of the model
        group: "master",
        description: "แก้ไข mas_layers_group",
    },
    8: {
        body: {  
            id:Joi.string(),     
        },

        model: "deletemasLayers ", // Name of the model
        group: "master",
        description: "ลบ mas_layers_group",
    },
    9: {
        body: {  
            id:Joi.string(),     
        },

        model: "getmasLayersbyid ", // Name of the model
        group: "master",
        description: "ค้นหา mas_layers_group ด้วย id",
    },
    10: {
        body: {  
            search:Joi.string(), 
        },

        model: "searchdatLayers ", // Name of the model
        group: "master",
        description: "ค้นหา datLayers",
    },
    11: {
        body: {  
            group_layer_id:Joi.string(), 
            layer_name:Joi.string(),
            wms:Joi.string(),
            url:Joi.string(),
            wms_url:Joi.string(),
            type_server:Joi.string(),
            date:Joi.date(),
        },

        model: "adddatLayers ", // Name of the model
        group: "master",
        description: "เพิ่ม datLayers",
    },
    12: {
        body: {  
            id:Joi.string(), 
            roles_id:Joi.string(),
            user_id:Joi.string(),
            layer_name:Joi.string(),
            wms:Joi.string(),
            url:Joi.string(),
            wms_url:Joi.string(),
            type_server:Joi.string(),
        },

        model: "editdatLayers ", // Name of the model
        group: "master",
        description: "แก้ไข datLayers",
    },
    13: {
        body: {  
            id:Joi.string(), 
            roles_id:Joi.string(),
        },

        model: "deletedatLayers ", // Name of the model
        group: "master",
        description: "ลบ datLayers",
    },
    15: {
        body: {  
            search:Joi.string(),
        },

        model: "searchmasLayersShape ", // Name of the model
        group: "master",
        description: "ค้นหา masLayersShape",
    },
    16: {
        body: {  
            id:Joi.string(),
            value:Joi.string(),
        },

        model: "getmasLayersShapebyid ", // Name of the model
        group: "master",
        description: "ดึงข้อมูล masLayersShape ด้วย id",
    },
    17: {
        body: {  
            name_layer:Joi.string(), 
            table_name:Joi.string(),
            type:Joi.string(),
            group_layer_id:Joi.string(),
            url:Joi.string(),
            wms_name:Joi.string(),
            type_server:Joi.string(),
            date:Joi.date(),
            option_layerte:Joi.string(),
            symbol_point:Joi.string(),
            type_geo:Joi.string(),

        },

        model: "addandeditmasLayersShape ", // Name of the model
        group: "master",
        description: "แก้ไขเเละเพิ่ม masLayersShape",
    },
    18: {
        body: {  
            id:Joi.string(),
        },

        model: "deletemasLayersShape ", // Name of the model
        group: "master",
        description: "ลบข้อมูล masLayersShape ",
    },
    19: {
        body: {  
            search:Joi.string(), 
            order:Joi.string(),
            sort:Joi.string(),

        },

        model: "searchmasStatusProject ", // Name of the model
        group: "master",
        description: "ค้นหา masStatusProject",
    },
    20: {
        body: {  
            id:Joi.string(), 
        },

        model: "getmasStatusProjectbyid ", // Name of the model
        group: "master",
        description: "ดึงข้อมูล masStatusProject ด้วย id",
    },
    21: {
        body: {  
            status_code:Joi.number(), 
            name:Joi.string(),
            status_color:Joi.string(),
            isuse:Joi.string(),
        },

        model: "addandeditmasStatusProject ", // Name of the model
        group: "master",
        description: "เพิ่มและแก้ไข masStatusProject",
    },
    22: {
        body: {  
            id:Joi.string(), 
            roles_id:Joi.string(),
           
        },

        model: "daletemasStatusProject ", // Name of the model
        group: "master",
        description: "ลบ masStatusProject",
    },
    23: {
        body: {  
            startdate:Joi.date(), 
            enddate:Joi.date(),
           
        },

        model: "getdateWms ", // Name of the model
        group: "master",
        description: "ค้นหา Wms",
    },
};