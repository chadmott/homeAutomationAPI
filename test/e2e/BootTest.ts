import {API} from '../../app/api'

export class BootTest {
    zcontrol = {
        nodes: [null, null, null, null, null, {
            name: 'testName',
            location: 'testLocation'
        }],
        zwave: {
            setValue: function(){return true; },
            setNodeName: function (nodeid, name) {return true; },
            setNodeLocation: function (nodeid, name) {return true; },
            refreshNodeInfo: function (nodeid, name) {return true; }
        }
    };
    app = new API(this.zcontrol);
}
