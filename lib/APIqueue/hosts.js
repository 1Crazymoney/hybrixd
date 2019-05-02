const Client = require('./rest').Client;
const WebSocket = require('ws');
const teletype = require('teletype');

const DEFAULT_TCP_PORT = 23;

const APIhost = {};

function tcpCall (link, host, qpath, args, method, dataCallback, errorCallback) {
  if (typeof args.data !== 'string') { args.data = JSON.stringify(args.data); }

  typeof link.exec === 'function'
    ? link.exec(args.data, /\n/)
      .then(doRestactionAndClose(host, link, dataCallback))
      .catch(errorCallback)
    : errorCallback('link.exec not defined yet.');
}

function doRestactionAndClose (host, link, dataCallback, errorCallback) {
  return function (data) {
    dataCallback(data);
    link.close();
    delete APIhost[host];
  };
}

function httpCall (link, host, qpath, args, method, dataCallback, errorCallback) {
  const args_ = method === 'GET' ? {} : args;
  const methodLowerCase = method.toLowerCase();

  if (args_ && args_.headers && method === 'POST') { // To handle a bug in Node JS which makes the server vulnerable to DDOS
    args_.headers['content-length'] = args_.data
      ? !isNaN(args_.data.length)
        ? args_.data.length
        : 0
      : 0;
  }

  let postresult = link[methodLowerCase](host + qpath, args_, dataCallback);

  postresult.once('error', errorCallback);
}

function webSocketCall (link, host, qpath, args, method, dataCallback, errorCallback) {
  if (link.readyState) {
    link.once('message', dataCallback)
      .once('error', errorCallback)
      .once('open', function () { console.log(' [i] API queue: WebSocket open for ' + host); });
    if (typeof args.data !== 'string') { args.data = JSON.stringify(args.data); }
    link.send(args.data, errorCallback);
  } else {
    errorCallback('link not ready');
  }
}

function getLastRequestTime (host) {
  return APIhost.hasOwnProperty(host)
    ? APIhost[host].lastRequestTime
    : 0;
}

function setLastRequestTime (host, now) {
  if (!APIhost.hasOwnProperty(host)) { APIhost[host] = {}; }
  APIhost[host].lastRequestTime = now;
}

function mkWsLink (host) {
  let link = new WebSocket(host, {});

  return link.on('open', function open () {
    console.log(' [i] API queue: Websocket ' + this.host + ' opened');
  }.bind({host})).on('close', function close () {
    console.log(' [i] API queue: Websocket ' + this.host + ' closed');
    delete (APIhost.host);
  }.bind({host})).on('error', function error (error) {
    console.log(' [i] API queue: Websocket ' + this.host + ' : Error ' + error);
  }.bind({host}));
}

function mkTcpLink (host) {
  const hostSplit = host.substr(6).split(':');
  const hostaddr = hostSplit[0];
  const hostport = hostSplit[1] ? Number(hostSplit[1]) : DEFAULT_TCP_PORT;
  return teletype(hostaddr, hostport);
}

function mkHttpLink (APIrequest) {
  let options = {};
  if (APIrequest.user) { options.user = APIrequest.user; }
  if (APIrequest.pass) { options.password = APIrequest.pass; }

  /*
    TODO possibly to extend options:
    proxy
    connection
    mimetypes
    requestConfig
    rejectUnauthorized
  */

  return new Client(options);
}

function mkLink (APIrequest, host) {
  let link = null;
  if (host.startsWith('ws://') || host.startsWith('wss://')) {
    link = mkWsLink(host);
  } else if (host.startsWith('tcp://')) {
    link = mkTcpLink(host);
  } else if (host.startsWith('http://') || host.startsWith('https://')) {
    link = mkHttpLink(APIrequest);
  } else {
    console.log(' [i] API queue: Unknown protocol for :' + host);
    return null;
  }
  return link;
}

function getLink (host, APIrequest, now) {
  let link = null;
  if (APIhost.hasOwnProperty(host)) {
    return APIhost[host].link;
  } else {
    link = mkLink(APIrequest, host);
  }
  APIhost[host] = {
    link: link,
    lastRequestTime: 0
  };
  setLastRequestTime(host, now); // set the last request time

  return link;
}

function getHostOrNull (APIrequest, now) {
  const host = APIrequest.host;
  return now - getLastRequestTime(host) >= 1000 / APIrequest.throttle // check if  the last call was made suffciently long ago
    ? host
    : null;
}

// using throttle and reqcnt (round robin) for load balancing
function findAvailableHost (APIrequest, now) {
  let host = null;
  if (typeof APIrequest.host === 'string') {
    return getHostOrNull(APIrequest, now);
  } else {
    if (APIrequest.host) {
      const offset = Math.floor(Math.random() * APIrequest.host.length);
      for (let i = 0; i < APIrequest.host.length; ++i) {
        const j = (offset + i) % APIrequest.host.length;
        host = APIrequest.host[j];
        if (now - getLastRequestTime(host) >= 1000 / APIrequest.throttle) { // check if the last call was made suffciently long ago
          return host; // found an available host
        }
      }
    }
    return null;
  }
}

function call (host, APIrequest, now, dataCallback, errorCallback) {
  let link = getLink(host, APIrequest, now);
  if (!link) {
    errorCallback('Failed to created link');
  } else {
    // get the initialized link
    let args = APIrequest.args;
    let method = APIrequest.method;
    let qpath = (typeof args.path === 'undefined' ? '' : args.path);

    try {
      if (host.substr(0, 6) === 'tcp://') {
        tcpCall(link, host, qpath, args, method, dataCallback, errorCallback);
      } else if (host.substr(0, 5) === 'ws://' || host.substr(0, 6) === 'wss://') {
        webSocketCall(link, host, qpath, args, method, dataCallback, errorCallback);
      } else {
        httpCall(link, host, qpath, args, method, dataCallback, errorCallback);
      }
    } catch (e) {
      console.log(' [!] API queue call error for ' + host + ' : ' + e);
    }
  }
}

exports.findAvailableHost = findAvailableHost;
exports.getLink = getLink;
exports.call = call;