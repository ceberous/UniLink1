const path = require( "path" );
const process = require( "process" );
const admin = require( "firebase-admin" );
const PersonalFilePath = path.join( process.env.HOME , ".config" , "personal" , "unilink1.js" );
const Personal = require( PersonalFilePath );

class UniLink1 {

	constructor( options ) {
		options = options || {
			firebase_credentials_path: path.join(  process.cwd() , "firebase-credentials.json" ) ,
			personal: Personal ,
		};
		this.firebase_credentials_path = options.firebase_credentials_path;
		this.personal = options.personal;
		this.firebase_credentials = require( this.firebase_credentials_path );
		this.observers = [];
	}

	login() {
		return new Promise( async function( resolve , reject ) {
			try {
				//console.log( this.personal );
				let options = {
					credential: admin.credential.cert( this.firebase_credentials ),
				};
				if ( this.personal.database_url ) {
					options.databaseURL = this.personal.database_url;
				}
				if ( this.personal.storage_bucket_url ) {
					options.storageBucket = this.personal.storage_bucket_url;
				}
				console.log( options );
				await admin.initializeApp( options );
				resolve();
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	connect() {
		return new Promise( async function( resolve , reject ) {
			try {
				await this.login();
				if ( this.personal.database_url ) {
					this.db = await admin.database();
				}
				resolve();
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	time_string( time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone ) {
		const now = new Date( new Date().toLocaleString( "en-US" , { timeZone: time_zone } ) );
		const time_zone_abreviation = now.toLocaleTimeString( "en-US" , { timeZone: time_zone , timeZoneName: "short" } ).split( " " )[ 2 ];
		const month_abreviations = [ 'Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec' ];
		const day = ( "0" + now.getDate() ).slice( -2 );
		const month = ( "0" +( now.getMonth() +1 ) ).slice( -2 );
		const month_abreviation = month_abreviations[ now.getMonth() ].toUpperCase();
		const year = now.getFullYear();
		const hours = ( "0" + now.getHours() ).slice( -2 );
		const minutes = ( "0" + now.getMinutes() ).slice( -2 );
		const seconds = ( "0" + now.getSeconds() ).slice( -2 );
		let milliseconds = now.getMilliseconds();
		let padding = "";
		if ( milliseconds < 100 ) { padding += "0"; }
		if ( milliseconds < 10 ) { padding += "0"; }
		milliseconds = padding + milliseconds.toString();
		const date_string = `${ day }${ month_abreviation }${ year }`;
		const time_string = `${ hours }:${ minutes }:${ seconds }.${ milliseconds }`;
		return `${ date_string } @@ ${ time_string } ${ time_zone_abreviation }`;
	}

	addChildToReference( reference , child , object ) {
		return new Promise( async function( resolve , reject ) {
			try {
				let ref = await this.db.ref( reference );
				let child_ref = await ref.child( child );
				await child_ref.set( object );
				resolve();
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	updateChildReference( reference , child , object ) {
		return new Promise( async function( resolve , reject ) {
			try {
				let ref = await this.db.ref( reference );
				let child_ref = await ref.child( child );
				await child_ref.update( object );
				resolve();
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	observeReference( reference , callback , error_callback ) {
		function default_callback( snapshot ) {
			//console.log( `\n/${ reference }/` );
			console.log( snapshot.val() );
		}
		function callback_hook( snapshot ) {
			console.log( `\n/${ reference }/` );
			if ( callback ) { callback( snapshot ); }
			else { default_callback( snapshot ); }
		}
		function default_error_callback( error )  {
			console.log( "The read failed: " + error.code );
		}
		let ref = this.db.ref( reference );
		let observer = ref.on( "value" , callback_hook , error_callback || default_error_callback );
		this.observers.push({
			reference: ref ,
			observer: observer
		});
		console.log( "Observing Reference: " + reference );
	}

	upload( source_file_path , save_name , bucket_name ) {
		return new Promise( async function( resolve , reject ) {
			try {
				if ( !!!this.personal.storage_bucket_url ) { resolve( false ); return; }
				let bucket;
				if ( bucket_name ) { bucket = await admin.storage().bucket( bucket_name ); }
				else { bucket = await admin.storage().bucket(); }
				const result = await bucket.upload( source_file_path , {
					destination: save_name ,
				});
				resolve( result );
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	download( file_name , save_path , bucket_name ) {
		return new Promise( async function( resolve , reject ) {
			try {
				let bucket;
				if ( bucket_name ) { bucket = await admin.storage().bucket( bucket_name ); }
				else { bucket = await admin.storage().bucket(); }
				const result = await bucket.file( file_name ).download({
					destination: save_path
				});
				resolve( result );
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

};

module.exports = UniLink1;