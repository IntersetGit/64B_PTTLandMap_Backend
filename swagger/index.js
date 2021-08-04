const swagger = require("swagger-generator-express");
const config = require("../config/index");

const options = {
    title: config.PROJECT_NAME,
    version: config.VERSION,
    host: config.HOST_SWAGGER,
    basePath: "/",
    schemes: ["http", "https"],
    securityDefinitions: {
        Bearer: {
            description:
                "Example value:- Bearer ",
            type: "apiKey",
            name: "Authorization",
            in: "header",
        },
    },
    security: [{ Bearer: [] }],
    defaultSecurity: "Bearer",
};

/**
 * serveSwagger must be called after defining your router.
 * @param app Express object
 * @param endPoint Swagger path on which swagger UI display
 * @param options Swagget Options.
 * @param path.routePath path to folder in which routes files defined.
 * @param path.requestModelPath Optional parameter which is path to folder in which requestModel defined, if not given request params will not display on swagger documentation.
 * @param path.responseModelPath Optional parameter which is path to folder in which responseModel defined, if not given response objects will not display on swagger documentation.
 */

module.exports = {
    options,
    swagger
};

