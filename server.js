const Unilink1 = require( "./main.js" );

( async ()=> {

	const link = new Unilink1();
	await link.connect();
	link.observeReference( "process-1/client-1/channel-1" );
	link.observeReference( "process-1/client-2/channel-2" , ( snapshot )=> {
		console.log( "inside custom" );
		console.log( snapshot.val() );
	});

})();