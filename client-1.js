const process = require( "process" );
const path = require( "path" );
const Unilink1 = require( "./main.js" );

( async ()=> {

	const link = new Unilink1();
	await link.connect();

	await link.updateChildReference( "process-1/client-1/channel-1" , "status" , {
		time_string: link.time_string() ,
		time: new Date() ,
		message: "latest status message on channel 1"
	});

	await link.download( "process-1/PikaO2x.png" , path.join( __dirname , "COPY-PikaO2x.png" ) );

	process.exit( 1 );

})();