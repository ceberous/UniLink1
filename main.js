const path = require( "path" );
const process = require( "process" );
const admin = require( "firebase-admin" );
const PersonalFilePath = path.join( process.env.HOME , ".config" , "personal" , "unilink1.js" );
const Personal = require( PersonalFilePath );

class UniLink1 {

	constructor(
		firebase_credentials_path = path.join(  process.cwd() , "firebase-credentials.json" ) ,
		database_url = Personal.database_url ,
		personal = Personal || {}
		){
		this.credentials = require( firebase_credentials_path );
		this.database_url = database_url;
		this.personal = personal;
		this.observers = [];
	}

	login() {
		return new Promise( async function( resolve , reject ) {
			try {
				await admin.initializeApp({
					credential: admin.credential.cert( this.credentials ),
					databaseURL: this.database_url
				});
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
				this.db = await admin.database();
				resolve();
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
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

};

module.exports = UniLink1;