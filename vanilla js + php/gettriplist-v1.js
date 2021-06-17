let tripsCache = []

const gettriplist = (value) => {
    if(value != ''){
        $('#searchWindow').css('display', 'none')
    }
    fetch('https://dellys.ru/ajax/gettriplist-v1.php')
        .then(result => result.json())
        //.then(result => console.log(result))
        .then(result => result.trips)
        .then(arr => {
            $('#additionalstring').html(`${servicePhrases[localStorage.lang]['found']}: ${arr.length}${servicePhrases[localStorage.lang]['count']}.`)
            let html = '<div id="content-window-triplist">'
            arr.forEach(el => {
                html += getHTMLForTrip(el, 0, 1)
            });
            if(!$('#statusstring').hasClass('open')) $('#statusstring').addClass('open')
            $('#content-window').html(html + '</div>')
        })
        .catch(e => {
            systemErrorWindow("unknownError", "#loading", "");
            console.log(e);
        })
}

const getHTMLForTrip = (trip, addr0, addr1) => {
    let html =
        `<div class="minitrip">
            <div class="minitrip-topstring">
                <p class="minitrip-topstring-id">${trip.id}</p>
                <p class="minitrip-topstring-date">${formatdate(trip.date)}</p>
                <p class="minitrip-topstring-car">${cars[trip.car][0]}</p>
            </div>
            <div class="minitrip-addresses">
                <div class="minitrip-addresses-string">
                    <p class="minitrip-addresses-time">${formattime(trip[`time${addr0}`])}</p>
                    <p class="minitrip-addresses-addr">${trip[`address${addr0}`]}</p>
                </div>
                <div class="minitrip-addresses-string">
                    <p class="minitrip-addresses-time">${formattime(trip[`time${addr1}`])}</p>
                    <p class="minitrip-addresses-addr">${trip[`address${addr1}`]}</p>
                </div>
            </div>
            <div class="minitrip-bottomtring">
                <button onclick="openTrip(${trip.id})">${servicePhrases[localStorage.lang]['open']}</button>
            </div>
        </div>`;
    return html;
}

$('#activeTripsbutton').on('click', ()=>{refreshmainpage('active', 'trips')});
$('#historyTripButton').on('click', ()=>{refreshmainpage('history', 'trips')});
$('#searchTripButton').on('click', ()=>{refreshmainpage('', 'trips')});