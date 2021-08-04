const config = require("../config");
const models = require("../models"); //connect db get data model
const passport = require("passport");

const { Strategy, ExtractJwt } = require("passport-jwt");
const messages = require('../messages');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_SECRET;

passport.use(new Strategy(opts, async (jwt_payload, done) => {
  try {
    const user = await models[`users`].findOne({ where: { id: jwt_payload.user_id } });
    if (!user) {
      return done(new Error(messages.errorUserNot), null);
    }

    return done(null, user);
  } catch (error) {
    done(error);
  }
})
);

module.exports.isLogin = passport.authenticate("jwt", { session: false });
