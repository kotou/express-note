var express = require('express');
var router = express.Router();
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: '7e5bda72418c51bf3765',
    clientSecret: '97177aca4f7ec20252b5c5658eefc8cb51ec5a65',
    callbackURL: "http://katoumegumi.xyz/auth/github/callback"
},
function (accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));

router.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
})

router.get('/github',
    passport.authenticate('github'));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        req.session.user = {
            id: req.user.id,
            username: req.user.displayName || req.user.username,
            avatar: req.user._json.avatar_url,
            provider: req.user.provider
        };
        res.redirect('/');
    });

module.exports = router;