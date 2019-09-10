const process = require( "process" );
const Unilink1 = require( "./main.js" );

( async ()=> {

	const link = new Unilink1();
	await link.connect();

	await link.updateChildReference( "process-1/client-2/channel-2" , "status" , {
		time_string: link.time_string() ,
		message: "latest status message on channel 2"
	});
	process.exit( 1 );

})();