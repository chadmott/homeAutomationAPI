/*
 * API for home device control 
 *
 * runs on raspberry PI
 * 
 * uses express for the API and ZWave prototol 
 * 
 * requires OpenZwave to be installed on host
 * 
 * 
 */

// node modules
import * as express from 'express';
import * as helmet from 'helmet';
import * as https from 'https';
import * as fs from 'fs';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as _ from 'lodash';

// app modules
import { Config } from './config';
import { Utils } from './utils';
import { Auth } from './auth';

let config = new Config();
let utils = new Utils();

export class API {
    constructor(public zcontrol) {
        zcontrol = zcontrol;
    }
    app = express();
    apiRoutes = express.Router();
    server;
    startServer() {
        //  this.app.use(helmet());
        this.app.use(morgan('dev'));
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.get('/health', function (req, res) {
            res.status(200).send('service running');
        });

        //   let auth = new Auth(this.apiRoutes);

        // beyond here are restricted routes
        this.apiRoutes.get('/heal', (req, res) => {
            res.type('json');
            this.zcontrol.zwave.healNetwork();
            res.json({
                status: 'ok'
            });
        });
        this.apiRoutes.get('/devices', (req, res) => {
            res.type('json');
            res.json({
                status: 'ok',
                // devices: _.find(_.compact(this.zcontrol.nodes), function (o: any) { return parseInt(o.nodeid,10) < 1; })
                devices: _.compact(this.zcontrol.nodes)
            });
        });
        this.apiRoutes.get('/devices/:id?', (req, res) => {
            res.type('json');
            res.json(this.zcontrol.nodes[req.params.id]);
        });
        this.apiRoutes.post('/devices/:id?', (req, res) => {
            res.type('json');
            let name: string = req.body.name || null;
            let location: string = req.body.location || null;
            let nodeid: number = parseInt(req.params.id, 10);

            if (name && name.length > 0) {
                this.zcontrol.zwave.setNodeName(nodeid, name);
                this.zcontrol.zwave.refreshNodeInfo(nodeid);
            }
            if (location && location.length > 0) {
                this.zcontrol.zwave.setNodeLocation(nodeid, location);
                this.zcontrol.zwave.refreshNodeInfo(nodeid);
            }

            res.json({
                nodeid: nodeid,
                name: name,
                location: location
            });
        });
        // this is for faders

        this.apiRoutes.post('/devices/:id/:command', (req, res) => {
            res.type('json'); // set content-type
            let nodeid: number = parseInt(req.params.id, 10);
            let level: number = utils.levelBound(parseInt(req.body.level, 10));
            let command: string = req.params.command;
            let status = 'ok';

            if (command === 'on') {
                this.zcontrol.zwave.setValue(nodeid, 38, 1, 0, 99);
            } else if (command === 'off') {
                this.zcontrol.zwave.setValue(nodeid, 38, 1, 0, 0);
            } else if (command === 'fade') {
                this.zcontrol.zwave.setValue(nodeid, 38, 1, 0, level);
            } else {
                command = 'noop';
                status = 'fail';
            }
            let response = {
                status: status,
                command: command,
                nodeid: nodeid,
                level: level
            };
            res.json(response);

        });

        // instantiate our API and use the routes
        this.app.use('/api', this.apiRoutes);
        this.server = this.app.listen(config.port);
        return this.app;
    }
}
