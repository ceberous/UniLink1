const path = require( "path" );
const process = require( "process" );
const admin = require( "firebase-admin" );
// https://cloud.google.com/docs/authentication/getting-started#auth-cloud-implicit-nodejs
// https://github.com/googleapis/nodejs-firestore
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./firebase-credentials.json"

// Import Child Classes
const Utils = require( "./Utils.js" );
const Database = require( "./Database.js" );
const Firestore = require( "./Firestore.js" );
const Bucket = require( "./Bucket.js" );

class UniLink1 {

	constructor( options ) {
		options = options || {
			firebase_credentials_path: path.join(  process.cwd() , "firebase-credentials.json" ) ,
			personal: require( path.join( process.env.HOME , ".config" , "personal" , "unilink1.js" ) ) ,
		};
		this.firebase_credentials_path = options.firebase_credentials_path;
		this.personal = options.personal;
		this.firebase_credentials = require( this.firebase_credentials_path );
		this.utils = new Utils();
	}

	login() {
		return new Promise( async function( resolve , reject ) {
			try {
				let options = {
					credential: admin.credential.cert( this.firebase_credentials ),
				};
				if ( this.personal.database_url ) {
					options.databaseURL = this.personal.database_url;
				}
				if ( this.personal.bucket_url ) {
					options.storageBucket = this.personal.bucket_url;
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
					this.database = new Database( admin );
					await this.database.connect();
				}
				if ( this.personal.bucket_url ) {
					this.bucket = new Bucket( admin );
				}
				this.firestore = new Firestore( admin );
				await this.firestore.connect();
				console.log( this.utils.generic.timeString() );
				resolve();
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

};

module.exports = UniLink1;