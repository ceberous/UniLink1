class GenericUtils {
	constructor() {}
	timeString( time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone ) {
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
		const time_string = `${ hours }:${ minutes }:${ seconds }`;
		return `${ date_string } @@ ${ time_string } ${ time_zone_abreviation }`;
	}
};

class Utils {
	constructor() {
		this.generic = new GenericUtils();
	}
};
module.exports = Utils;