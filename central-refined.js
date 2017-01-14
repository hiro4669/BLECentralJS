var noble = require('noble');

var SERVICE_UUID = '000000010000100080002f97f3b2dcd5';
var CHARACTERISTIC_UUID = '000000100000100080002f97f3b2dcd5';

noble.on('stateChange', onStateChange);
noble.on('discover', onDiscoverPeripheral);

function onStateChange(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
}

function onDiscoverPeripheral(peripheral) {
  console.log('discovered peripheral:', peripheral.advertisement.serviceUuids[0]);
  if (peripheral.advertisement.serviceUuids[0] == SERVICE_UUID) {
    console.log('found target peripheral');
    connect(peripheral);
  }
}

function connect(peripheral) {
  console.log('connecting...');

  peripheral.connect(function(error) {
    if (error == null) {
      console.log('connected');
      console.log('discovering services');
      peripheral.discoverServices([SERVICE_UUID], onDiscoverServices);
    } else {
      console.log('connection error');
      var time = 3;
      console.log('reconnect after ' + time + ' second');
      setTimeout(connect, time * 1000, peripheral);
    }
  });
}

function onDiscoverServices(error, services) {
  if (error != null) {
    console.log('discovering services error');
    return;
  }

  console.log('discovered services:', services);

  var service = null;
  for (var i = 0; i < services.length; i++) {
    if (services[i].uuid == SERVICE_UUID) {
      service = services[i];
    }
  }
  if (service != null) {
    console.log('detected service:', service.uuid);
    service.discoverCharacteristics([CHARACTERISTIC_UUID], onDiscoverCharacteristics);
  } else {
    console.log('service is null');
  }
}

function onDiscoverCharacteristics(error, characteristics) {
  if (error != null) {
    console.log('discovering characteristics error');
    return;
  }

  console.log('discovered characteristics:', characteristics);

  var characteristic = null;
  for (var i = 0; i < characteristics.length; i++) {
    if (characteristics[i].uuid == CHARACTERISTIC_UUID) {
      characteristic = characteristics[i];
    }
  }
  if (characteristic != null) {
    console.log('detected characteristic:', characteristic.uuid);
    characteristic.read(onRead);
  } else {
    console.log('characteristic is null');
  }
}

function onRead(error, data) {
  if (error != null) {
    console.log('reading error');
    return;
  }

  console.log('readed');
  console.log(data.toString());
}
