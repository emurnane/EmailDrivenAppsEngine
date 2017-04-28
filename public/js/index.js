
$( document ).ready(function() {
  
console.log('Entered Page');
console.log('loading cookie val: ', getCookie('loading'));
console.log(document.cookie.split(';'));


// If loading cookie set,then wait for email fetch complete.

//why do we need this part?
/*
if(getCookie('loading') != ''){
	console.log('cookie loaidng is none')
}
*/

if (getCookie('loading') != '') {
	$('#loadingDiv').show();
	console.log('we will start after loading complete');
	var email = getCookie('email');
  $('#loadingDivEmail').html(email);
	console.log('email: ', email);
	var timer=0;
  //load status
	function startTime() {
		userDataLoaded(email, function (e) {
			console.log('curr load status: ', e);
			//TODO: it is never ending
			// add condition?
			if (e == 0) {
				if (timer == 100){
					alert('please revisit');
					return
				}
				console.log('pending');
      		  	timer =timer+5;
				$('#loadingDivProgress').html(timer+'%');
				
				// change setTimeout to setInterval
				// setTimeout: calls a function(startTime) only once after 2000 millisecs
				// setInterval: calls startTime() every 2000 milliseconds
				var t = window.setTimeout(function(){ startTime(); }, 2000);
				//var t = window.setInterval(function(){ startTime() }, 2000);
			} else if (e == -1) {
				console.log('errpor 11');
        		alert('error 11. Email not in DB. Refresh Page');
			} else if (e == 1) {
				console.log('loaded');
				setCookie('loading', 0, 0);
				setCookie('email', 0, 0);
        		setCookie('email', email, 1);
        		$('#loadingDivMsg').slideUp();
        		$('#existUserDivEmail').html(decodeURIComponent(email));
				$('#existUserDiv').slideDown();
        
			} else {
				console.log('error10')
        		alert('error 10. Unknown. Refresh Page');
			}
		})
	}
	startTime();
}

//else, normal visit
else {

	console.log('normal visit');
	$("#emailDiv").show();

	$("#emailDivPlay").click(function () {
		var email = $('#emailDivEmail').val();
		if (!validateEmail(email)) {
			$('#emailDivEmail').val('invalid email')
			return 0;
		}
		userDataExists(email, function (exists) {
			//email data not exist
			console.log(exists);
			if (!exists) {
				console.log('no data for email');
				$('#emailDiv').slideUp();
				$('#newUserDiv').slideDown();
				$('#newUserDivEmail').val(email);
				$("#newUserDivSubmit").click(function () {
					
					var serial = $('#newUserDivForm').serialize();
					console.log('form serial:', serial);
					var url = "/login?" + serial;
					
					window.location.assign(url);
					//window.location.assign('/spacegame/index_o.html'); //attempt1
				});
				return 0;
			}
			//email data exists
			else {
				console.log('yes data for email');
				$('#emailDiv').slideUp();
				
				//TODO: add encoder to get @ instead of %40
				//fixed
        		$('#existUserDivEmail').html(
						decodeURIComponent(email));
				
        		setCookie('email', email, 1);
				$('#existUserDiv').slideDown();
				
		
				
				return 1;
			}
		});

	});
}

$('#existUserDivStart').click(function(){
  window.location.assign('/spacegame');
})

 
});








/*
 * Helper Functions
 */

//returns 0 or 1; -1 on error
function userDataLoaded(email, callback) {
	//check if user data exists
	var url = "/stats.json?id=getUserLoadingStatus&email=" + email;
	getJson(url, function (err, json) {
		if (err) {
			console.log('errorrr');
			callback(0);
			return 0; //error
		} else {
			if (json == '' || json == 0) {
				console.log(0, json);
				callback(0);
				return 0; //no data
			} else {
				console.log(1, json);
				callback(1);
				return 1; //yes data
			}
		}
	})
};



//returns 0 or 1; -1 on error
function userDataExists(email, callback) {
	//check if user data exists
	
	var url = "/stats.json?id=getUser&email=" + email; 
	getJson(url, function (err, json) {
		if (err) {
			console.log('errorrr');
			callback(0);
			return 0; //error
		} else {
			if (json == '') {
				console.log(0, json);
				callback(0);
				return 0; //no data
			} else {
				//console.log(1, json);
				callback(1);
				return 1; //yes data
			}
		}
	})
};


/*
* Util Functions
*/  


 function getJson(url, callback) {
 	//open url with GET. Convert response to JSON n return it.
 	//callback(err, json)
 	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", url, true);
 	xmlhttp.onreadystatechange = function () {
 		if (xmlhttp.readyState == 0) {}
 		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
 			//success
 			var res = xmlhttp.responseText;
 			var resJson = JSON.parse(res);
 			callback(null, resJson);
		
 		} else if (xmlhttp.readyState == 4) {
 			//fail
 			callback('error loading json ' + url);
 		}
			
 	}
	
 	
 	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
 	xmlhttp.send();
	//var res = xmlhttp.responseText;
	//var resJson = JSON.parse(res);
	//callback(null, resJson);
 };
 
 
 function validateEmail(email) {
 	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
 	if (!emailReg.test(email) || email == '') {
 		return false;
 	} else {
 		return true;
 	}
 }


 //get cookie by name
 function getCookie(cname) {
 	var name = cname + "=";
 	var ca = document.cookie.split(';');
 	for (var i = 0; i < ca.length; i++) {
 		var c = ca[i].trim();
 		if (c.indexOf(name) == 0)
 			return c.substring(name.length, c.length);
 	}
 	return "";
 }

 //setcookie by name
 function setCookie(cname, cvalue, exmins) {
 	//console.log(document.cookie)

 	var d = new Date();
 	d.setTime(d.getTime() + (exmins * 60 * 1000));
 	var expires = "expires=" + d.toGMTString();
 	var domain = "path=/;"
 		//console.log(cname + "=" + cvalue + "; " + domain + expires)
 		document.cookie = cname + "=" + cvalue + "; " + domain + expires;
 }
 
 
 /*
 var popit = true;
 window.onbeforeunload = function() { 
       if(popit == true) {
            popit = false;
            return "Are you sure you want to leave?"; 
       }
 } 
 */