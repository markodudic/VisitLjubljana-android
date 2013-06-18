function init_gps() {
	console.log("init gps");
	
    //WGS84
	  Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    //GK
    Proj4js.defs["EPSG:31469"] = "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs";
    source = new Proj4js.Proj('EPSG:4326');	//WGS84
    dest = new Proj4js.Proj('EPSG:31469');	//GK

    //timeout pomeni kolk casa caka na novo pozicijo, enableHighAccuracy ali naj uporabi gps ali samo wifi
    var options = { timeout: 10000, enableHighAccuracy: true };
    navigator.geolocation.getCurrentPosition(onSuccess_gps, onError_gps);
    watchID = navigator.geolocation.watchPosition(onSuccess_gps, onError_gps, options);
}

function onError_gps(error) {
	console.log("error");
}

function onSuccess_gps(position) {
	if (position==undefined) return;
	console.log("work gps="+position.coords.longitude+":"+position.coords.latitude);
	
    var p = new Proj4js.Point(position.coords.longitude, position.coords.latitude); 
    Proj4js.transform(source, dest, p);  
    
	//gremo crez vse elemente na pregledu, ki imajo kooridinate
    if ((Math.abs(p.x - pOld.x) > minDistance) || (Math.abs(p.y - pOld.y) > minDistance)) {
    	   $('input[name^="ztl_cord_"]').each(function( index ) {
        	   pOld = p;
    		   var geo_stuff = $(this).val().split("#");
		       var px=p.x-correctionX;
		       var py=p.y-correctionY;
		       if (geo_stuff[1] != "0" || geo_stuff[2] != "0") {
		    	   $("div#ztl_distance_value_"+geo_stuff[0]).html(lineDistance(px, py, geo_stuff[1], geo_stuff[2])+" km");
		       }
    	   }); 
    }
}

function lineDistance( p1x, p1y, p2x, p2y ) {
       var xs = p2x - p1x;
       xs = xs * xs;
       var ys = p2y - p1y;
       ys = ys * ys;
       //return Math.round( (Math.floor(Math.sqrt( xs + ys )/1000)) * 10 ) / 10;
       var num = Math.sqrt( xs + ys )/1000;
       //num = Math.round(num*Math.pow(10,1))/Math.pow(10,1);
       if (num > 1)
               return num.toFixed(1);
       else
               return num.toFixed(3);
}