import {API} from './api';
import {Zcontrol} from './zcontrol';

export class Boot {
    zcontrol = new Zcontrol();
    app = new API(this.zcontrol);
}

let boot = new Boot();

boot.app.startServer();
