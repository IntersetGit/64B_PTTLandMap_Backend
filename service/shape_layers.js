const models = require('../models');
const { sequelizeString } = require('../util');
const uuid = require('uuid');

exports.addShapeLayersService = async (model, transaction) => {
    const id = model.id ?? uuid.v4()
    let _model = {
        id,
        name_layer: model.name_layer ?? "test"
    }

    if (model.type === "Point") _model.type = model.type = "shape file"
    else _model.type = model.type
    if (model.table_name) _model.table_name = model.table_name
    if (model.group_layer_id) _model.group_layer_id = model.group_layer_id
    if (model.color_layer) _model.color_layer = model.color_layer
    if (model.type_geo === "Polygon") _model.type_geo = model.type_geo
    else if (model.type_geo === "Point") _model.type_geo = model.type_geo
    else _model.type_geo = model.type_geo
    if (model.url) _model.url = model.url
    if (model.wms_name) _model.wms_name = model.wms_name
    if (model.type_server) _model.type_server = model.type_server
    if (model.date) _model.date = model.date
    if (model.option_layer) _model.option_layer = model.option_layer
    if (model.symbol_point) _model.symbol_point = model.symbol_point
    if (model.table_name_arr)  _model.table_name_arr = model.table_name_arr

    await models.mas_layers_shape.create(_model, { transaction })
    return id
}




exports.getDataShapService = async () => {
    let sql = `
    SELECT mlg.id
  ,mlg.group_name 
  ,mlg.order_by
  ,mlg.isuse
  ,(SELECT json_agg(json_build_object('id',mls.id
						  ,'name_layer',mls.name_layer
						  ,'table_name',mls.table_name
						  ,'color_layer',mls.color_layer
						  ,'type',mls.type
							,'option_layer', mls.option_layer
							,'symbol_point', mls.symbol_point
							,'type_geo', mls.type_geo
							,'url', url
							,'wms_name', wms_name
                            ,'type', type
							,'type_server', type_server
							,'option_layer', option_layer
                            ,'order_by', mls.order_by
                            ,'config_typoint',mls.config_typoint))
  FROM master_lookup.mas_layers_shape  mls 
  WHERE mls.group_layer_id = mlg.id) AS children
	FROM master_lookup.mas_layer_groups mlg
	WHERE mlg.isuse = 1
	ORDER BY mlg.order_by
	
    `
    const _res = await sequelizeString(sql)

    return _res
}



exports.addkmlLayersService = async (model, transaction) => {
    console.log(model);


    const id = model.id ?? uuid.v4()
    let _model = {
        id,
        name_layer: model.name_layer ?? "test",
        table_name: model.table_name,
        type: model.type
    }

    if (model.group_layer_id) _model.group_layer_id = model.group_layer_id
    if (model.color_layer) _model.color_layer = model.color_layer

    await models.mas_layers_shape.create(_model, { transaction })
    return id
}


exports.getAlldataShapeKmlKmz = () => {

}


//** ทดสอบ convert Geo to  kml **//


// var test = require('tap').test,
//     fs = require('fs'),
//     glob = require('glob'),
//     fuzzer = require('fuzzer'),
//     path = require('path'),
//     {tokml} = require('tokml');

    
   

// test('tokml', function(t) {

//     function geq(t, name, options) {
//         var expected = tokml(file(name + '.geojson'), options);
//         if (process.env.UPDATE) {
//             fs.writeFileSync(path.join(__dirname, '/data/', name + '.kml'), expected);
//         }
//         t.equal(expected, output(name + '.kml'), name);
//     }
    
//     // function testColor(t, inputColor, inputOpacity, expected) {
//     //     var featureCollection = file('linestring.geojson');
//     //     var props = featureCollection.features[0].properties;
//     //     if (inputColor !== null) props['stroke'] = inputColor;
//     //     if (inputOpacity !== null) props['stroke-opacity'] = inputOpacity;
        
//     //     var kml = tokml(featureCollection, { simplestyle: true });
        
//     //     if (inputColor) {
//     //         var colorValue = kml.substr(kml.indexOf('<color>') + 7, 8);
            
//     //         t.equal(colorValue, expected, 
//     //             'color ' + (inputColor || '<undefined>') + ' with opacity ' + (inputOpacity || '<undefined>'));
//     //     } else {
//     //         t.equal(kml.indexOf('<color>'), -1, 'color ' +  inputColor + ' results in empty string');
//     //     }
//     // }

//     t.test('geometry', function(tt) {
//         geq(tt, 'polygon');
//         geq(tt, 'linestring');
//         geq(tt, 'multilinestring');
//         geq(tt, 'multipoint');
//         geq(tt, 'multipolygon');
//         geq(tt, 'geometrycollection');
//         geq(tt, 'geometrycollection_nogeometries');
//         tt.end();
//     });

//     t.test('quirks', function(tt) {
//         geq(tt, 'cdata');
//         geq(tt, 'singlefeature');
//         geq(tt, 'singlegeometry');
//         geq(tt, 'unknown');
//         geq(tt, 'nulldata');
//         geq(tt, 'unknowngeom');
//         geq(tt, 'unknowntype');
//         geq(tt, 'notype');
//         geq(tt, 'number_property');
//         geq(tt, 'polygon_norings');
//         geq(tt, 'multipolygon_none');
//         geq(tt, 'multipoint_none');
//         geq(tt, 'multilinestring_none');
//         tt.end();
//     });

//     test('name & description', function(tt) {
//         geq(tt, 'name_desc');
//         geq(tt, 'document_name_desc', {
//             documentName: 'Document Title',
//             documentDescription: 'Document Description'
//         });
//         tt.end();
//     });

//     test('timestamp', function(tt) {
//         geq(tt, 'timestamp', {
//             name: 'name',
//             description: 'description',
//             timestamp: 'moment'
//         });
//         tt.end();
//     });

//     test('simplestyle spec', function(tt) {
//         var options = { simplestyle: true };
        
//         geq(tt, 'simplestyle_optionnotset');
//         geq(tt, 'simplestyle_nostyle', options);
        
//         geq(tt, 'simplestyle_multiple_same', options);
//         geq(tt, 'simplestyle_multiple_different', options);
        
//         geq(tt, 'simplestyle_point', options);
//         geq(tt, 'simplestyle_point_nosymbol', options);
//         geq(tt, 'simplestyle_point_defaults', options);
        
//         geq(tt, 'simplestyle_linestring', options);
//         geq(tt, 'simplestyle_linestring_defaults', options);
//         geq(tt, 'simplestyle_multilinestring', options);
        
//         geq(tt, 'simplestyle_polygon', options);
//         geq(tt, 'simplestyle_polygon_defaults', options);
//         geq(tt, 'simplestyle_multipolygon', options);
//         geq(tt, 'simplestyle_polygon_multiple_same', options);
//         geq(tt, 'simplestyle_polygon_multiple_different', options);
        
//         geq(tt, 'simplestyle_geometrycollection', options);
        
//         tt.end();
//     });
    
//     test('simplestyle hex to kml color conversion', function(tt) {
//        testColor(tt, '#ff5500', 1, 'ff0055ff');
//        testColor(tt, '#0000ff', 1, 'ffff0000');
//        testColor(tt, '#00ff00', 1, 'ff00ff00');
//        testColor(tt, '#000000', 1, 'ff000000');
//        testColor(tt, '#ffffff', 1, 'ffffffff');
       
//        testColor(tt, '#ff5500', 0.5, '7f0055ff');
//        testColor(tt, '#ff5500', 0, '000055ff');
//        testColor(tt, '#ff5500', 0.01, '020055ff');
//        testColor(tt, '#ff5500', 0.02, '050055ff');
//        testColor(tt, '#ff5500', 0.99, 'fc0055ff');
//        testColor(tt, '#ff5500', 1, 'ff0055ff');
       
//        testColor(tt, '#f50', null, 'ff0055ff');
//        testColor(tt, 'f50', null, 'ff0055ff');
       
//        testColor(tt, null, null, 'ff0055ff');
//        testColor(tt, '', null, 'ff0055ff');
       
//        testColor(tt, 'aa', null, 'ff555555');
       
//        // TODO: this still fails
//        //testColor(tt, 'sqdgfd', null, 'ff555555');
//        //testColor(tt, 'ggg', null, 'ff555555');
       
//        tt.end(); 
//     });

//     test('fuzz', function(tt) {
//         fuzzer.seed(0);
//         glob.sync(__dirname + '/data/*.geojson').forEach(function(gj) {
//             var generator = fuzzer.mutate.object(JSON.parse(fs.readFileSync(gj)));
//             for (var i = 0; i < 10; i++) {
//                 var gen = generator();
//                 try {
//                     tokml(gen);
//                 } catch(e) {
//                     tt.fail('failed at fuzzed version of ' + gj + ': ' + JSON.stringify(gen) + 'with ' + e + e.stack);
//                 }
//             }
//         });
//         tt.end();
//     });
// });

// function file(f) {
//     return JSON.parse(fs.readFileSync(__dirname + '/data/' + f));
// }

// function output(f) {
//     return fs.readFileSync(__dirname + '/data/' + f, 'utf8');
// }




