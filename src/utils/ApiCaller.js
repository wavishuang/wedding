import Connector from './Connector';

let connector;
export default class ApiCaller {
  static connector() {
    !connector && (connector = new Connector());
    return connector;
  }
}