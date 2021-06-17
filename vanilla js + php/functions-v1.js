$problem = null;

function windowError(window, nwindow, $error){
	if($problem[window].indexOf($error) == -1){
		$problem[window] = $problem[window].concat($error);
	}
	let errorBlock, header;
    if(window == 'loginWindow'/* && dellysmobile*/){
		errorBlock = $('#flex').children('.errorP');
		header = $('#logotext');
    }else{
		header = $("#"+window).children(".window").children(".header");
        errorBlock = $('#' + window).children('.' + nwindow).children('.errorP');
    }
	if(errorBlock.html() == "..."){
		errorBlock.html($errors[localStorage.lang][$error]);
		header.addClass('turnoffmarginbottom');
		errorBlock.addClass('errorP-opened');
	}else{
		errorBlock.addClass("hiddenErrorText");
		setTimeout(() => {
			errorBlock.html($errors[localStorage.lang][$error]);
			errorBlock.removeClass("hiddenErrorText");			
		}, $animationtime/2);
	}
}

function windowErrorOff(window, nwindow, $error){
	let errorBlock, header;
    if(window == 'loginWindow'){
		errorBlock = $('#flex').children('.errorP');
		header = $('#logotext');
    }else{
		header = $("#"+window).children(".window").children(".header");
        errorBlock = $('#' + window).children('.' + nwindow).children('.errorP');
    }
	if($problem[window].length != 0){
		$index = $problem[window].indexOf($error);
		if($index != -1){
			$problem[window].splice($index, 1);
			if(errorBlock.html() == $errors[localStorage.lang][$error]){
				if($problem[window] != 0){
					windowError(window, nwindow, $problem[window][$problem[window].length - 1]);
				}else{
					closeWindowError(window, nwindow);
				}
			}
		}
	}else if(errorBlock.hasClass("errorP-opened")){
		closeWindowError(window, nwindow);
	}
}

function closeWindowError(window, nwindow){
	let errorBlock, header;
    if(window == 'loginWindow'){
		errorBlock = $('#flex').children('.errorP');
		header = $('#logotext');
    }else{
		header = $("#"+window).children(".window").children(".header");
        errorBlock = $('#' + window).children('.' + nwindow).children('.errorP');
    }
	errorBlock.removeClass('errorP-opened');
	setTimeout(() => {
		if($problem[window].length == 0) errorBlock.html("...");		
	}, $animationtime);
	header.removeClass('turnoffmarginbottom');
}

function openWindow(value, window = null, animation = true){
	if(localStorage.lang != 'rus'){
		$(value).children(".close").html(servicePhrases[localStorage.lang]["close"]);
	}
	if(window == null || window == undefined){
		$(value).css("display","grid");
		$(value).css("opacity","1");
		$("#window").css('display', 'grid');
		setTimeout(() => {
			$("#window").css('opacity', 1);			
		}, 15);
	}else{
		$(window).css("opacity", 0);
		if(animation){
			setTimeout(() => {
				$(window).css("display", 'none');
				$(value).css('display', 'grid');
				setTimeout(()=>{ $(value).css("opacity", 1);}, 15);
			}, $animationtime);
		}else{			
			$(window).css("display", 'none');
			$(value).css('display', 'grid');
			$(value).css("opacity", 1);
		}
	}
}

function closeWindow(value, window = null, callback){
	callback = typeof(callback) === 'function' ? callback : ()=>{};
	if(window == null || window == undefined || window == ''){
		$("#window").css('opacity', 0);
		setTimeout(() => {
			callback();
			$('#window').css('display', 'none');
			$(value).css("opacity", 0);
			$(value).css("display", "none");
		}, $animationtime);
	}else{
		$(value).css("opacity", 1);
		setTimeout(() => {
			callback();
			$(value).css("display", 'none');
			$(window).css('display', 'grid');
			setTimeout(()=>{ $(window).css("opacity", 1);}, 15);
		}, $animationtime);
	}
}

function checkSymbols($value){
    if($value.length < 2) { return false; }
    for($i=0, $j=0; $j<$value.length;$i++){
        if($value[$j] == $i && $value[$j] != " "){
            return false;
        }else if($i==9){
            if($value[$j]=="@" || $value[$j]=="?" || $value[$j]=="_" || $value[$j]=="%" || $value[$j]=="№"){
                return false;
            }
            $j++;
            $i=-1;
        }
    }
    return true;
}

function timeToMins($value){
    if($value.length==5){
        $result = $value[0] * 600 + $value[1] * 60 + $value[3] * 10 + $value[4] * 1;
        if($result >= 1440){
            $result = $result - Math.floor($result / 1440) * 1440;
        }
        return $result;
    }else{
        alert("Ошибка подсчёта времени");
    }
}

function minsToTime($value){
    $value = $value - Math.floor($value / 1440) * 1440;
    $hours = (Math.floor($value / 60)).toString();
    if($hours.length == 1){
        $hours = 0 + $hours;
    }
    $value = ($value - Math.floor($value / 60) * 60).toString();
    if($value.length == 1){
        $value = 0 + $value;
    }
    $result = $hours + ":" + $value;
    return $result;
}

function checkOnlyNumber($value){
	if($value=="" && $value != 0) return false;
	for($i=0;$i<$value.length;$i++){
		switch($value[$i]){
			case "0": case "1": case "2": case "3": case "4":
			case "5": case "6": case "7": case "8": case "9":
				break;
			default:
				return false;
		}
	}
	return true;
}

function infowindow(text, button, windowval='', exitwindow=windowval){
	$('#infowindow').children('div').children('.header').html(servicePhrases[localStorage.lang]['information']);
	$('#infowindow').children('div').children('#container').html('<p id="justText">' + text + '</p>');
	$('#infowindow').children('div').children('#exitButton').html(servicePhrases[localStorage.lang]['next']);
	switch(button){
		case '':
		case 'S':
		case 'SS':
			$('#infowindow').children('div').children('#exitButton').attr('onclick', 'closeInfoWindow("' + button + '", "' + exitwindow + '")');
			break;
		default:
			if(typeof(button) == 'function'){
				$('#infowindow').children('div').children('#exitButton').unbind('click');
				$('#infowindow').children('div').children('#exitButton').on('click', button);
			}else{
				$('#infowindow').children('div').children('#exitButton').attr('onclick', button);
			}
			break;
	}
	if(windowval != ''){
		$(windowval).css('opacity', 0);
		setTimeout(() => {
			$(windowval).css('display', 'none');
			$('#infowindow').css('display' ,'grid');
			setTimeout(()=>{$('#infowindow').css('opacity', 1)}, 15);
		}, $animationtime);
	}else{
		openWindow("#infowindow");
	}
}

function cleaninfowindow(){
	$('#infowindow').children('div').children('.header').html('');
	$('#infowindow').children('div').children('.container').html('');
	$('#infowindow').children('div').children('.button').html('');
	$('#infowindow').children('div').children('.button').attr('onclick', '');
}//доделать


function indevelop(window = ''){
	infowindow(servicePhrases[localStorage.lang]['indevelop'], 'SS', window);
}

function closeInfoWindow($value, windowvalue=''){
	if(windowvalue == '' || windowvalue == 0){
		$('#window').css('opacity', 0);
		setTimeout(()=>{
			cleaninfowindow();
			$('#window').css('display', 'none');
			$('#infowindow').css('display', 'none');
			$('#infowindow').css('opacity', 0);

		}, $animationtime);
	}else{
		$('#infowindow').css('opacity', 0);
		setTimeout(()=>{
			cleaninfowindow();
			$('#infowindow').css('display', 'none');
			$(windowvalue).css('display', 'grid');
			setTimeout(()=>{$(windowvalue).css('opacity', 1);}, 0);
		}, $animationtime);
	}
	if($value == 'SS') return;
	$.ajax({
		type: "POST",
		data: {"function":"forgetMessage"+$value},
		url: "../ajax/ajaxfunctions.php",
		success: function(result){
			if(result == 'ok'){
				console.log('message has been deleted');
			}else{
				console.log(result);
			}
		},
		error: function(result){
			console.log(result);
		}
	});
}//доделать

function getAddress($1_address, $2_address) {
    if ($2_address == "Москва" || $2_address == "город Москва" ||
        $2_address == "г. Москва" || $2_address == "г Москва") {
        $address =  $2_address;
    } else {
        $address = $1_address + ", " + $2_address;
    }
    return $address;
}

function question(text='', cancel=()=>{}, confirm=()=>{}, whatwindow = ""){
	if(localStorage.lang != 'rus'){
		$('#questionWindow').children('.window').children('.header').html(questionPhrases[localStorage.lang]['header']);
		$('#question-cancel').html(questionPhrases[localStorage.lang]['cancel']);
		$('#question-accept').html(questionPhrases[localStorage.lang]['accept']);
	}
	if(Array.isArray(text)){
		switch(text[0]){
			case 'changeorderstatus':
				let phrase = questionPhrases[localStorage.lang]['changeorderstatus'];
				let htmltext = `<p>${phrase[0]} <span>#${text[1]} ${phrase[1]}</span> <span class="${ordertatuses[text[2]][0]}">${orderstatusesPhrases[localStorage.lang]['name'][text[2]]}</span> ${phrase[2]} <span class="${ordertatuses[text[3]][0]}">${orderstatusesPhrases[localStorage.lang]['name'][text[3]]}</span>?</p>`;
				$('#question-container').html(htmltext);
				$('#question-cancel').unbind('click');
				$('#question-accept').unbind('click');
				$('#question-cancel').on('click', ()=>{closequestion('#orderWindow');});
				$('#question-accept').on('click', ()=>{closequestion('#loading'); changeorderstatus(text[1], text[3])});
				whatwindow = '#orderWindow';
				break;
			default:
		}
	}else{
		$('#question-container').html(text);
		$('#question-cancel').unbind('click');
		$('#question-accept').unbind('click');
		$('#question-cancel').on('click', cancel);
		$('#question-accept').on('click', confirm);
	}
	if(whatwindow == ""){
		openWindow('#questionWindow');
	}else{
		$(whatwindow).css("opacity", "0");
		setTimeout(() => {
			$(whatwindow).css("display", "none");
			$('#questionWindow').css("display", "grid");
			setTimeout(()=>{$('#questionWindow').css("opacity", 1)}, 20);			
		}, $animationtime);
	}
}

function closequestion(window = ""){
	switch(window){
		case '':
			closeWindow('#questionWindow');
			break;
		case '#loading':
			loadingwithWindow("on", "#questionWindow");
			break;
		default:
			$("#questionWindow").css('opacity', 0);
			setTimeout(() => {
				$("#questionWindow").css('display', 'none');
				$(window).css('display', 'grid');
				$(window).css('opacity', 1);
			}, $animationtime);
	}
	setTimeout(() => {
		$('#question-container').html('');
		$('#question-cancel').unbind('click');
		$('#question-accept').unbind('click');
	}, $animationtime);
}
function loadingWindow(value, window = null) {
    switch (value) {
        case "on":
		case true:
			openWindow("#loading", window, false);
            break;
        case "off":
		case false:
        	closeWindow("#loading", window);
            break;
    }
}

function loadingwithWindow(turn, window=null){
	switch(turn){
		case 'on':
			$('#window').css('top', 0);
			$('#window').css('opacity', 1);
			$(window).css('display', 'none');
			$(window).css('opacity', 0);
			$('#loading').css('display', 'grid');
			$('#loading').css('opacity', 1);
			break;
		case 'off':
			if(window==null){
				closeWindow("#loading");
			}else{
				$('#loading').animate({opacity: 0}, $animationtime, function(){
					$('#loading').css('display', 'none');
					$(window).css('display', 'grid');
					$(window).animate({opacity: 1}, $animationtime);
				});
			}
			break;
	}
}

function checkName(value){
    if(value == ""){
    	return false;
    }else{
	    for($i = 0; $i < value.length; $i++){
	        for($j = 0; $j < 10; $j++){
	            if(value[$i]==$j){
					console.log(value[$i], $j);
	                return false;
	            }
	        }
	    }
    }
    return true;
}

function checkNumber(value){
	value = value.toString();
	switch(value.length){
		case 11:
			break;
		case 12:
			if(value[0] == "+"){
				value = value.slice(1, 13);
			}else{
				return [false, null];
			}
			break;
		default:
			return [false, null];
			break;
	}
	if(value[0] == "7"){
		value = "8" + value.slice(1, 12);
	}
	for(let i = 0, j = 0; i < value.length; j++) {
		if(value[i] == j){
			j = -1;
			i++;
		}else if(j == 9){
			return [false, null];
			break;
		}
	}
	return [true, value];
}

function checkEmail(value){
	$test = false;
	for (let i = 1; i < value.length - 1; i++) {
		if($test && value[i] == "."){
            return true;
		}
		if(value[i] == "@"){
			$test = true;
			i++;
		}
	}
	return false;
}

function deleteRepeatsInArray(value){
	for($i = 0; $i < value.length; $i++ ){
		for($j = $i+1; $j < value.length; $j++ ){
			if(value[$i] == value[$j]){
				value = value.slice(0, $i).concat(value.slice($i + 1, value.length));
				$j--;
				$i--;
			}
		}
	}
	return value;
}

function getOverlapsInArray(value11, value22){
	value1 = value11; value2 = value22;
	value1 = deleteRepeatsInArray(value1);
	value2 = deleteRepeatsInArray(value2);
	$result = new Array();
	for($i = 0; $i < value1.length; $i++ ){
		for($j = 0; $j < value2.length; $j++ ){
			if(value1[$i] == value2[$j]){
				$result = $result.concat(value1[$i]);
				value1 = value1.slice(0, $i).concat(value1.slice($i + 1, value1.length));
				$i--;
				value2 = value2.slice(0, $j).concat(value2.slice($j + 1, value2.length));
				$j--;
			}
		}
	}
	return $result;
}

function disableObject(object, value){
	if(object.prop("disable") != value){
		object.prop("disable", value);
	}
}

function getFeautreList(valueFeat, valueCar){
	if(!(valueCar != undefined && valueCar >= 0 && valueCar <= cars.length)){
		console.log("Invalide parametrs: features = " + valueFeat + ", car = " + valueCar);
		return new Array();
	}
	let featuresBuffer = new Array();
	let featuresResult = new Array();
	if(valueFeat.length != 0){
		for($a = 0; $a < valueFeat.length; $a++){
			featuresBuffer = new Array();
	    	for($j = 0; $j < features.length; $j++){
	    		for($k = 0; $k < features[$j][2].length; $k++){
	    			if(features[$j][2][$k] == valueFeat[$a]){
	    				featuresBuffer = featuresBuffer.concat($j);
	    				break;
	    			}
	    		}
	    	}
	    	if(featuresBuffer.length == 0){
	    		return new Array();
	    	}else if($a == 0){
	    		featuresResult = featuresBuffer;
	    	}else{
	    		featuresResult = getOverlapsInArray(featuresResult, featuresBuffer);
	    	}
    	}
	}else{
		for($i = 0; $i < features.length; $i++){
			featuresResult[$i] = $i;
		}
	}
	$result = getOverlapsInArray(cars[valueCar][1], featuresResult.concat(valueFeat));//console.log("get getFeautreList(): " + $result);
    return $result;
}

function getFormatedNumber(value){
	value = value.toString();
	if(value.length != 11){
		console.log("Number is so short");
		return value;
	}
	let result = value[0] + "(" + value.substr(1, 3) + ")" + value.substr(4, 3) + "-" + value.substr(7, 2) + "-" + value.substr(9, 2);
	return result;
}

function systemErrorWindow(error, windowValue = "", exitWindow = windowValue, functionV=undefined, buttontext=""){
	if(error == ""){
		error = "unknownError";
	}
	if(exitWindow == 'same'){
		exitWindow = windowValue;
	}
	let infoWindow = $("#infowindow").children('div');
	infoWindow.children(".header").html($systemErrors[localStorage.lang]["header"]);
	infoWindow.children("#container").html("<p id='justText'></p>");
	infoWindow.children("#container").children('#justText').html($systemErrors[localStorage.lang][error]);
	let func = ()=>closeSystemErrorWindow(exitWindow);
	if(typeof(functionV) == "function"){
		if(buttontext == ""){
			buttontext = servicePhrases[localStorage.lang]['retry'];
		}
		infoWindow.children("#exitButton").html(buttontext);
		func = functionV;
	}else if(exitWindow != ''){
		infoWindow.children("#exitButton").html($systemErrors[localStorage.lang]['goBack']);
	}else{
		infoWindow.children("#exitButton").html(servicePhrases[localStorage.lang]['close']);
	}
	infoWindow.children("#exitButton").unbind();
	infoWindow.children("#exitButton").on('click', func);
	
	if(windowValue == ""){
		openWindow("#infowindow");
	}else{
		$(windowValue).css('opacity', 0);
		setTimeout(()=>{
			$(windowValue).css("display", "none");
			$("#infowindow").css("display", "grid");
			setTimeout(() => {$("#infowindow").css('opacity', 1)}, 15);
		}, $animationtime);
	}
}

function closeSystemErrorWindow(value = ""){
	if(value == ""){
		closeInfoWindow('SS');
	}else{
		$("#infowindow").animate({opacity: "0"}, 150, function(){
			cleaninfowindow();
			$("#infowindow").css("display", "none");
			$(value).css("display", "grid");
			$(value).animate({opacity: "1"}, 150);
		});
	}
}

function stringToArray(value){
	let result = value.split(" ");
	for(let i = 0; i < result.length; i++){
		result[i] = parseFloat(result[i]);
	}
	return result;
}

function geticonhtmlcode(value){
  if(value < features.length && value >= 0 && value != ''){
    let result = '<div class="' + features[value][1] + '"></div>';
    return result;
  }else{
    return "";
  }
}

function calcCommission(value, invert = false){
  let result = Math.floor(value/10000 * commission)*100;
  if(invert == true) return result;
  result = value - result;
  return result;
}
function getformatedint(value){
	value = String(value);
	let negative = false;
	if(value[0] == '-'){
		negative = true;
		value = value.substr(1, value.length)
	}
	for(let i = value.length - 3; i > 0; i=i-3){
		value = value.substr(0, i) + '.' + value.substr(i, value.length);
	}
	if(negative){
		value = '-' + value;
	}
	return value;
}
function buttoninreval(value, time){
	intervals[value]['time'] = time;
	$(value).prop('disabled', true);
	$(value).children('.time').html(intervals[value]['time']);
	resizewindow(intervals[value]['window']);
	intervals[value]['interval'] = setInterval(()=>{
		if(--intervals[value]['time'] == 0){
			$(value).prop('disabled', false);
			clearInterval(intervals[value]['interval']);
	resizewindow(intervals[value]['window']);
		}
		$(value).children('.time').html(intervals[value]['time']);
	}, 1000);
}
function resizewindow(value){
	if($(value).children('div').hasClass('withHorizontalScroll')){
		let scroll = '#' + $(value).children('div').children('.horizontalScroll').attr('id');
		$(scroll).css('max-height', $('#n' + $whereami[scroll] + postfixes[scroll]).innerHeight());
	}else{
		console.log('write code about me');
	}
}
function changeSlide(scroll, where, withoutanimation = false){
	let slide = $(scroll).children('div').children("#n" + where + postfixes[scroll]);
	$whereami[scroll] = where;
	if(withoutanimation){
		$(scroll).css('transition-duration', 'unset');
		$(scroll).children('div').css('transition-duration', 'unset');
	}
    $(scroll).css('max-height', slide.innerHeight());
	$(scroll).children('div').css('transform', 'translate3d(' + where*$(scroll).innerWidth()*(-1) + 'px,0,0)');
	if(withoutanimation){
		setTimeout(()=>{
			$(scroll).css('transition-duration', '');
			$(scroll).children('div').css('transition-duration', '');
		}, 0);
	}
}
function formatdate(value, withday = false, withtime = false, withmonth = false){
	let result = Array();
	value = new Date(value.replace('T', ' '));
	let date = value.getDate();
	if(isNaN(date)) return '--.--.----'
	if(date.toString().length == 1) date = '0' + date;
	let month = value.getMonth() + 1;
	if(month.toString().length == 1) month = '0' + month;
	if(withmonth){
		result[0] = date + ' ' + months[localStorage.lang][parseInt(month)] + ' ' + value.getFullYear();
	}else{
		result[0] = date + '.' + month + '.' + value.getFullYear();
	}
	if(withday == 'string'){
		let day = daysoftheweek[localStorage.lang][value.getDay()];
		result[1] = day;
	}else if(withday == 'number'){
		let day = value.getDay()
		result[1] = day;	
	}
	if(withtime){
		let hours = value.getHours();
		if(hours.toString().length == 1) hours = '0' + hours;
		let mins = value.getMinutes();
		if(mins.toString().length == 1) mins = '0' + mins;
		result[2] = `${hours}:${mins}`;
	}
	return result;
}
function formatmass (value, plus = ''){
	if(value != 0 && value != ''){
		if(value < 1000){
			return [value, 'kg'+plus];
		}else{
			value = (value/1000).toFixed(1);
			if(value == parseInt(value)){value = parseInt(value);}
			return [value,'t'+plus];
		}
	}else{
		return [];
	}
}
function checkdadataaddress(value, rude = false){
	let addressA = new Array();
	if(value.city == value.region){
		addressA[0] = '';
		if(value.area != null){
			addressA[2] = value.area_type + '. ' + value.area;
		}else{
			addressA[2] = '';
		}
	}else if(value.area != null){
		addressA[0] = value.region_type + '. ' + value.region + ', ' + value.area_type + '. ' + value.area;
		addressA[2] = '';
	}else{
		addressA[0] = value.region_type + '. ' + value.region;
		addressA[2] = '';
	}
	if(value.settlement != null){
		addressA[1] = value.settlement_type + '. ' + value.settlement;
		if(addressA[0] == '' && value.city != null){
			addressA[0] = value.city;
		}
	}else if(value.city != null){
		addressA[1] = value.city_with_type;
	}else{
		if(!rude) return false		
		addressA[1] = null
	}
	if(value.street != null){
		if(addressA[2] != '') addressA[2] += ', ';
		addressA[2] += value.street_type + '. ' + value.street;
	}
	if(value.house == null){
		if(!rude) return false		
		addressA[3] = null
	}else{
		addressA[3] = value.house_type + '. ' + value.house;
		if(value.block!=null){
			addressA[3] += ', ' + value.block_type + '. ' + value.block;
		}
	}
	return addressA;
}

function arrayToAddress(value){
	let result = []
	value.forEach(el=>{
		if(el != undefined && el != null && el != '') result.push(el)
	})
	return result.join(', ')
}

let isnumeric = (value) =>{
	value1 = parseFloat(value);
	return value == value1;
}

let mobileajax = (value, newsession = false) =>{
	//до пизды иррационально
	if(dellysmobile){
		value = addMobileajax(value, 'mobile', true)
		value = addMobileajax(value, 'phone', localStorage.phone)
		value = addMobileajax(value, 'email', localStorage.email)
		value = addMobileajax(value, 'password', localStorage.password)
		if(newsession){
			localStorage.session = generate16Number();
		}
		value = addMobileajax(value, 'session', localStorage.session)
	}
	if(testpassword != ''){
		value = addMobileajax(value, 'testpassword', testpassword)
	}
	return value;
}

const addMobileajax = (arr, key, value) =>{
	if(arr instanceof FormData){
		arr.append(key, value)
	}else{
		arr[key] = value
	}
	return arr
}

const generate16Number = (value = 32) => {
	let a, result = '';
	for(let i = 0; i < value; i++){
		a = parseInt(Math.random() * 15);
		switch(a){
			case 10: a = 'a'; break;
			case 11: a = 'b'; break;
			case 12: a = 'c'; break;
			case 13: a = 'd'; break;
			case 14: a = 'e'; break;
			case 15: a = 'f'; break;
		}
		result += a.toString();
	}
	return result;
}

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		let radlat1 = Math.PI * lat1/180;
		let radlat2 = Math.PI * lat2/180;
		let theta = lon1-lon2;
		let radtheta = Math.PI * theta/180;
		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

function formattime(value){
	if(value == null || value == undefined){
		return '--:--'
	}else{
		return value.slice(0, 5)
	}
}
function getrating(value){
	let result = '';
	for(let i = 1; i < 6; i++){
		if(i <= value){
			result += '<img src="images/minis/starBlue-v1.svg"/>';
		}else{
			result += '<img src="images/minis/starGray-v1.svg"/>';
		}
	}
	return result;
}
function getcontacts(contArr, id){
	if(contArr.length == 0) return ''
	let result = `<div id="${id}">`;
	for(let i = 0; i < contArr.length; i++){
		result += `<p>${contacts[contArr[i]][0]}</p>`;
	}
	return result + `</div>`;
}