// https://firebase.google.com/docs/firestore/manage-data/add-data

class Firestore {

	constructor( admin ) {
		this.admin = admin;
		this.observers = [];
	}

	async connect() {
		this.db = await this.admin.firestore();
	}

	getAllDocuments( collection ) {
		return new Promise( async function( resolve , reject ) {
			try {
				const reference = this.db.collection( collection );
				const snapshot = await reference.get();
				let documents = [];
				snapshot.forEach( doc => {
					documents.push({
						id: doc.id ,
						data: doc.data()
					});
				});
				resolve( documents );
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return false; }
		}.bind( this ) );
	}

	queryCollectionForDocuments( collection , a , test , b ) {
		return new Promise( async function( resolve , reject ) {
			try {
				const reference = this.db.collection( collection );
				const snapshot = await reference.where( a , test , b ).get();
				let documents = [];
				if ( snapshot.empty ) { resolve( documents ); return; }
				snapshot.forEach( doc => {
					documents.push({
						id: doc.id ,
						data: doc.data()
					});
				});
				resolve( documents );
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return false; }
		}.bind( this ) );
	}


	add( collection , adding_object ) {
		return new Promise( async function( resolve , reject ) {
			try {
				const reference = this.db.collection( collection ).doc();
				if ( !reference ) { resolve( false ); return false; }
				const result = await reference.set( adding_object );
				resolve( result );
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return false; }
		}.bind( this ) );
	}

	set( collection , document , adding_object ) {
		return new Promise( async function( resolve , reject ) {
			try {
				let reference;
				if ( !document ) {
					reference = this.db.collection( collection ).doc();
				}
				else {
					reference = this.db.collection( collection ).doc( document );
				}
				const result = await reference.set( adding_object );
				resolve( result );
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return false; }
		}.bind( this ) );
	}

	// https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
	update( collection , document , update_object ) {
		return new Promise( async function( resolve , reject ) {
			try {
				const reference = this.db.collection( collection ).doc( document );
				const result = await reference.update( update_object );
				resolve( result );
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	// https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
	arrayUnion( collection , document , array_key , new_value ) {
		return new Promise( async function( resolve , reject ) {
			try {
				const reference = this.db.collection( collection ).doc( document );
				const result = await reference.update({
					array_key: this.admin.firestore.FieldValue.arrayUnion( new_value )
				});
				resolve( result );
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	arrayRemove( collection , document , array_key , new_value ) {
		return new Promise( async function( resolve , reject ) {
			try {
				const reference = this.db.collection( collection ).doc( document );
				const result = await reference.update({
					array_key: this.admin.firestore.FieldValue.arrayRemove( new_value )
				});
				resolve( result );
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	increment( collection , document , key , increment_amount ) {
		return new Promise( async function( resolve , reject ) {
			try {
				const reference = this.db.collection( collection ).doc( document );
				const result = await reference.update({
					array_key: this.admin.firestore.FieldValue.increment( increment_amount )
				});
				resolve( result );
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	// deleteCollection( collection , document ) {
	// 	return new Promise( async function( resolve , reject ) {
	// 		try {
	// 			const reference = this.db.collection( collection );
	// 			await reference.delete();
	// 			resolve();
	// 			return;
	// 		}
	// 		catch( error ) { console.log( error ); reject( error ); return; }
	// 	}.bind( this ) );
	// }

	deleteDocument( collection , document ) {
		return new Promise( async function( resolve , reject ) {
			try {
				await this.db.collection( collection ).doc( document ).delete();
				resolve();
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	deleteAllDcoumentsInCollection( collection ) {
		return new Promise( async function( resolve , reject ) {
			try {
				const reference = this.db.collection( collection );
				const query = await reference.orderBy( "__name__" );
				const snapshot = await query.get();
				let batch = this.db.batch();
				snapshot.docs.forEach( doc => {
					batch.delete( doc.ref );
				});
				await batch.commit();
				resolve();
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	deleteDocumentKey( collection , document , key ) {
		return new Promise( async function( resolve , reject ) {
			try {
				const reference = this.db.collection( collection ).doc( document );
				const result = await reference.update({
					key: this.admin.firestore.FieldValue.delete()
				});
				resolve( result );
				return;
			}
			catch( error ) { console.log( error ); reject( error ); return; }
		}.bind( this ) );
	}

	observeDocument( collection , document , callback , error_callback ) {
		function default_callback( snapshot ) {
			//console.log( `\n/${ reference }/` );
			console.log( snapshot.data() );
		}
		function default_error_callback( error )  {
			console.log( "The read failed: " + error.code );
		}
		callback = callback || default_callback;
		error_callback = error_callback || default_error_callback;
		const reference = this.db.collection( collection ).doc( document );
		const observer = reference.onSnapshot( callback , error_callback );
		this.observers.push({
			reference: reference ,
			observer: observer
		});
	}

};
module.exports = Firestore;