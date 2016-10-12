import * as jwt from 'jsonwebtoken';

import {Config} from './config';

export class Auth {
   constructor(public routes) {
        routes.post('/authenticate', function (req: any, res: any) {
            let config = new Config();
            // find the user
            let user: string = req.body.name;
            let pass: string = req.body.pass;

            if (user != 'harduser') {
                res.json({ success: false, message: 'Authentication failed. No User' });
            } else {
                // check if password matches
                if (pass != 'hardpass') {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token
                    let token = jwt.sign(user, config.secret, {
                        //expiresIn: 1400
                    });
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
        routes.use(function (req, res, next) {
            let config = new Config();
            // check header or url parameters or post parameters for token
            let token = req.body.token || req.query.token || req.headers['x-access-token'];

            // decode token
            if (token) {
                // verifies secret and checks exp
                jwt.verify(token, config.secret, function (err: any, decoded: any) {
                    if (err) {
                        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
                    } else {
                        // if everything is good, save to request for use in other routes
                      //  req.decoded = decoded;
                        next();
                    }
                });

            } else {
                // if there is no token
                // return an error
                return res.status(403).send({
                    success: false,
                    message: 'No token provided.'
                });
            }
        });
         routes.get('/authenticated', function(req, res){
           res.status(200).json({ success: true, message: 'Authenticated' });
        });
    }
}


