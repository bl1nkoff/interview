$whereami = {
	'#createorderscroll' : 0
}
$problem = {
	"createOrder" : new Array()
}

let refreshmainpage = (value, type) => {
    $('#content-window').html(`<p class="symbol loading loadingBlue">${servicePhrases[localStorage.lang]['loading']}</p>`);
    setlistatmainpage(value, type);
}
let setlistatmainpage = (value = true, type = 'orders') => {
    if(value != true) { localStorage.listtype = value; }
	switch(localStorage.listtype){
        case '':
            value = 'search';
		case 'active': case 'history':
			if(type == 'orders'){
            	getorderlist(localStorage.listtype);
				if(dellysmobile){
					let prevbut = $('footer').children('.active');
					prevbut.removeClass('active');
					prevbut.prop('disabled', false);
					$('#footer-' + value).addClass('active');
					$('#footer-' + value).prop('disabled', true);
				}
			}else{
				gettriplist(localStorage.listtype)
			}
			$('#windowname').html(listtypes[localStorage.lang][type][localStorage.listtype]);
			$('#additionalstring').html(servicePhrases[localStorage.lang]['loading']);
            if(dellysmobile && $('#sidemenu').css('display') == 'flex') closesidemenu()
			break;
		default:
			localStorage.listtype = "";
			setlistatmainpage();
			break;
	}
}