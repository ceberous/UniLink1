# UniLink1

## Example: Server.js

```
( async ()=> {

  const path = require( "path" );
  const Unilink1 = require( "unilink1" );
    const link = new Unilink1();
    await link.connect();
    link.observeReference( "process-1/client-1/channel-1" );
    link.observeReference( "process-1/client-2/channel-2" , ( snapshot )=> {
        console.log( "inside custom" );
        console.log( snapshot.val() );
    });

    await link.upload( path.join( __dirname , "PikaO2x.png" ) , "process-1/PikaO2x.png" );

})();
```

## Example: Client.js

```
( async ()=> {

    const process = require( "process" );
    const Unilink1 = require( "unilink1" );
    const link = new Unilink1();
    await link.connect();

    await link.updateChildReference( "process-1/client-2/channel-2" , "status" , {
        time_string: link.time_string() ,
        message: "latest status message on channel 2"
    });
    process.exit( 1 );

})();
```