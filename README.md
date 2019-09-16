# UniLink1

## Example: Server.js

```
( async ()=> {

	const process = require( "process" );
	const path = require( "path" );
	const Unilink1 = require( "unilink1" );

	const link = new Unilink1();
	await link.connect();

	await link.database.updateChildReference( "process-1/client-1/channel-1" , "status" , {
		time_string: link.utils.generic.timeString() ,
		time: new Date() ,
		message: "latest status message on channel 1"
	});

	await link.bucket.upload( path.join( __dirname , "PikaO2x.png" ) , "PikaO2x.png" );

	await link.firestore.add( "test-collection-1" , {
		something: "blah blah" ,
		else: "1246" ,
	});

	await link.firestore.set( "test-collection-1" , "PikaO" , {
		activated: false ,
		yesterday: true
	});

	const docs = await link.firestore.getAllDocuments( "test-collection-1" );
	console.log( docs );

	const query_docs = await link.firestore.queryCollectionForDocuments( "test-collection-1" , "activated" , "==" , true );
	console.log( query_docs );

	await link.firestore.deleteAllDcoumentsInCollection( "test-collection-1" );

	process.exit( 1 );

})();
```

## Example: Client.js

```
( async ()=> {

	const process = require( "process" );
	const path = require( "path" );
	const Unilink1 = require( "unilink1" );

	const link = new Unilink1();
	await link.connect();

	await link.database.updateChildReference( "process-1/client-2/channel-2" , "status" , {
		time_string: link.utils.generic.timeString() ,
		message: "latest status message on channel 2"
	});

	link.firestore.observeDocument( "test-collection-1" , "PikaO" , ( snapshot )=> {
		console.log( "\n/test-collection-1/PikaO/" + " Was Updated" );
		console.log( snapshot.data() );
	});

	await link.bucket.download( "process-1/PikaO2x.png" , path.join( __dirname , "COPY-PikaO2x.png" ) );

	//process.exit( 1 );

})();
```