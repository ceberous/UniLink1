class Database {

	constructor( admin ) {
		this.admin = admin;
	}

	async connect() {
		this.db = await this.admin.database();
		console.log( "created" );
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
module.exports = Database;