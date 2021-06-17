let getorderlist = function(value) {
    let ajaxdata = {'value': value};
    if(value != ''){
        $('#searchWindow').css('display', 'none')
    }
    $.ajax({
        url: 'https://dellys.ru/ajax/getorderlist-v1.php',
        type: 'POST',
        data: mobileajax(ajaxdata),
        success: function(result){
            try {
                let json = JSON.parse(result);
                let html = '';
                json.forEach(element => {
                    html += generateminiorederhtmlcode(element);
                });
                if(!dellysmobile){
                    $('#additionalstring').html(`${servicePhrases[localStorage.lang]['found']}: ${json.length}${servicePhrases[localStorage.lang]['count']}.`);
                }
                //html = '';
                if(!$('#statusstring').hasClass('open')) $('#statusstring').addClass('open')
                if(html == ""){
                    $('#content-window').html(`<div id="content-window-emptyorderlist"><p>${servicePhrases[localStorage.lang]['emptyorderlist']}</p><button onclick="refreshmainpage()">${servicePhrases[localStorage.lang]['refresh']}</button></div>`);
                }else{
                    html += `<div id="orderlist-refresh"><button onclick="refreshmainpage()">${servicePhrases[localStorage.lang]['refresh']}</button></div>`;
                    $('#content-window').html(`<div id="content-window-orderlist">${html}</div>`)
                }
            }catch(e){
                systemErrorWindow("unknownError", "", "");
                console.log(result);                
            }
        },
        error: function(result){
			systemErrorWindow("unknownError", "", "");
			console.log(result);
        }
    });
};
function generateminiorederhtmlcode(order){
    let mass = formatmass(order['mass'], '+');
    let result = '<div class="order">';
    let times = new Array();
    if(dellysmobile){
        times[0] = servicePhrases[localStorage.lang]['fromtime'] + ': <span>' + minsToTime(order['time11']) + '</span>';
        times[1] = servicePhrases[localStorage.lang]['totime'] + ': ' + minsToTime(order['time12']);
        times[2] = servicePhrases[localStorage.lang]['fromtime'] + ': <span>' + minsToTime(order['time21']) + '</span>';
        times[3] = servicePhrases[localStorage.lang]['totime'] + ': ' + minsToTime(order['time22']);
    }else{
        times[0] = '<span>' + minsToTime(order['time11']) + ' - ' + minsToTime(order['time12']) + '</span>';
        times[1] = servicePhrases[localStorage.lang]['departure'];
        times[2] = '<span>' + minsToTime(order['time21']) + ' - ' + minsToTime(order['time22']) + '</span>';
        times[3] = servicePhrases[localStorage.lang]['arrival'];
    }
	result += '<div class="miniordertoprow"><p class="miniorderdate">' + formatdate(order['date'])[0] + '</p>'; //date
    result += '<p class="miniordermass">' + mass[0] + ' ' + servicePhrases[localStorage.lang][mass[1]] + '</p>'; // mass
    result += '<p class="miniordermoney">' + getformatedint(order['money']) + ' ₽</p></div>'; //money
    result += '<div class="miniordermiddlerow"><div class="miniorderadress"><p class="miniordercity">' + servicePhrases[localStorage.lang]['from'] + ' <big>' + order['city1'] + '</big></p>'; //city1
	result += '<p class="miniorderstreet">' + order['street1'] + '</p></div>';
    result += '<div class="miniordertime"><p>' + times[0] + '</p><p>' + times[1] + '</p></div></div>';
    result += '<div class="miniordermiddlerow"><div class="miniorderadress"><p class="miniordercity">' + servicePhrases[localStorage.lang]['to'] + ' <big>' + order['city2'] + '</big></p>'; //city2
	result += '<p class="miniorderstreet">' + order['street2'] + '</p></div>';
    result += '<div class="miniordertime"><p>' + times[2] + '</p><p>' + times[3] + '</p></div></div>';
	result += '<dic class="miniorderbottomrow"><div class="miniordericons">' + geticonhtmlcode(order['icon1']) + geticonhtmlcode(order['icon2']) + geticonhtmlcode(order['icon3']) + '</div>';
	result += '<button class="miniorderopenbutton" onclick="getorder(' + order['id'] + ')">' + servicePhrases[localStorage.lang]['open'] + '</button></div>';
	return result;
}

$('#activeoredersbutton').on('click', ()=>{refreshmainpage('active')});
$('#historybutton').on('click', ()=>{refreshmainpage('history')});
$('#searchworkbutton').on('click', ()=>{refreshmainpage('')});