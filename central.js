var noble = require('noble');
var serviceUUID = "000000010000100080002f97f3b2dcd5";

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
	noble.startScanning();
    } else {
	noble.stopScanning();
    }
});

noble.on('discover', function(peripheral) {
    //console.log('peripheral discovered');
    //console.log('id: ' + peripheral.id);
    //console.log('services: ');
    //console.log(peripheral.advertisement.serviceUuids);

    if(peripheral.advertisement.serviceUuids[0] != serviceUUID){
	//console.log('this is not ');
	return;
    }

    var serviceData = peripheral.advertisement.serviceData;
    if (serviceData && serviceData.length) {
	console.log('\there is my service data:');
	for (var i in serviceData) {
	    console.log('\t\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));   
	}
    }

    /*
    peripheral.connect(function(err) {
      if (err) {
        console.error('
*/

    peripheral.connect(function(error){
	if (!error) {
	    console.log('connection success!');

	    peripheral.discoverServices([serviceUUID], function(err, services) {
		console.log(services);
		services.forEach(function(service) {
		    console.log('found services:', service.uuid);
		    service.discoverCharacteristics([], function(err, characteristics) {
			characteristics.find(function(c) {
			    return c.uuid == '000000100000100080002f97f3b2dcd5';
			}).read(function(err, data) {
			    console.log('readed to 000000100000100080002f97f3b2dcd5');
			    console.log(data);
			    console.log(data.toString());
			});
			//characteristics.forEach(function(characteristic) {
			  //  console.log('found characteristic:', characteristic.uuid);
			    //characteristic.read(function(err, data) {
			//	console.log(data);
			//	console.log('read data:', data);
			  //  });
			//});
		    });
		});
	    });
	} else {
	    console.error(error);
	}
    });
});
