class Bucket {

	constructor( admin ) { this.admin = admin; }

	upload( source_file_path , save_name , bucket_name ) {
		return new Promise( async function( resolve , reject ) {
			try {
				let bucket;
				if ( bucket_name ) { bucket = await this.admin.storage().bucket( bucket_name ); }
				else { bucket = await this.admin.storage().bucket(); }
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
				if ( bucket_name ) { bucket = await this.admin.storage().bucket( bucket_name ); }
				else { bucket = await this.admin.storage().bucket(); }
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
module.exports = Bucket;