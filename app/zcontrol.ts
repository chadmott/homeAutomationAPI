
import * as OpenZwave from 'openzwave-shared';
import {Config} from './config';

let config = new Config();

export class Zcontrol {
    zwave = new OpenZwave({
        ConsoleOutput: true,
        Logging: true,
        SaveConfiguration: true,
        DriverMaxAttempts: 5,
      //  PollInterval: 500,
        SuppressValueRefresh: false,
    });
    nodes = [];
    constructor() {
        //this.zwave.healNetwork(1);
        this.zwave.on('connected', (homeid) => {
            console.log('=================== CONNECTED! ====================');
        });

        this.zwave.on('notification', function (nodeid, notif, help) {
            console.log('node%d: notification(%d): %s', nodeid, notif, help);
        });
        this.zwave.on('driver ready', function (homeid) {
            console.log('=================== DRIVER READY! ====================');
            console.log('scanning homeid=0x%s...', homeid.toString(16));
        });
        this.zwave.on('scan complete', function () {
            console.log('scan complete, hit ^C to finish.');
        });
        this.zwave.on('driver failed', function () {
            console.log('failed to start driver');
            process.exit();
        });
        this.zwave.on('node added', (nodeid) => {
            console.log('=================== NODE ' + nodeid + ' ADDED! ====================');
            this.nodes[nodeid] = {
                nodeid: nodeid,
                manufacturer: '',
                manufacturerid: '',
                product: '',
                producttype: '',
                productid: '',
                type: '',
                name: '',
                loc: '',
                classes: {},
                ready: false,
            };
        });
        this.zwave.on('node ready', (nodeid, nodeinfo) => {
            this.nodes[nodeid]['manufacturer'] = nodeinfo.manufacturer;
            this.nodes[nodeid]['manufacturerid'] = nodeinfo.manufacturerid;
            this.nodes[nodeid]['product'] = nodeinfo.product;
            this.nodes[nodeid]['producttype'] = nodeinfo.producttype;
            this.nodes[nodeid]['productid'] = nodeinfo.productid;
            this.nodes[nodeid]['type'] = nodeinfo.type;
            this.nodes[nodeid]['name'] = nodeinfo.name;
            this.nodes[nodeid]['loc'] = nodeinfo.loc;
            this.nodes[nodeid]['ready'] = true;
            console.log('node%d: %s, %s', nodeid,
                nodeinfo.manufacturer ? nodeinfo.manufacturer
                    : 'id=' + nodeinfo.manufacturerid,
                nodeinfo.product ? nodeinfo.product
                    : 'product=' + nodeinfo.productid +
                    ', type=' + nodeinfo.producttype);
            console.log('node%d: name="%s", type="%s", location="%s"', nodeid,
                nodeinfo.name,
                nodeinfo.type,
                nodeinfo.loc);
            for (var comclass of this.nodes[nodeid]['classes']) {

                if (comclass === 37 || comclass === 38) {
                    this.zwave.enablePoll(nodeid, comclass);
                } // COMMAND_CLASS_SWITCH_BINARY

                var values = this.nodes[nodeid]['classes'][comclass];
                console.log('node%d: class %d', nodeid, comclass);
                for (var idx in values)
                    console.log('node%d:   %s=%s', nodeid, values[idx]['label'], values[idx]['value']);
            }

        });

        this.zwave.connect(config.zwavepath);
    }

}








