const openTrip = (id) => {
    loadingWindow(true)
    const data = new FormData()
    data.append('id', id)
    fetch('https://dellys.ru/ajax/gettrip-v1.php', {
        method: 'POST',
        body: data
    }).then(res => res.json())
    /*.then(res => {
        console.log(res.trip.man)
        return res
    })*/
    .then(res => {
        if(res.status != "ok"){
            systemErrorWindow("unknownError", "#loading", "");
        }
        return res.trip
    })
    .then(trip => {
        //Добавляем id в название окна
        $($('#tripWindow').find('.header')[0]).append(
            `<span> #${trip.id}</span>`
        )
        //Приступаем к заполнению главной сетки
        html = `
            <p class="${tripstatuses[trip.status][0]}" id="trip-status">${tripStatusesPhrases[localStorage.lang]['name'][trip.status]}</p>
            <p id="trip-date">${formatdate(trip.date, false, false, true)}</p>
            <p id="trip-car">${cars[trip.car][0]}</p>
            <div id="trip-addresses">`
        //Добавляем адреса
        for(let i = 0; i < $maxPointsCT; i++){
            if(trip[`address${i}`] == null){
                break;
            }
            html += `
                <div class="trip-address">
                    ${/*<div class="line"><div class="point"></div></div> Убраны линии слева (широковаты получаются)*/''}
                    <p class="time">${formattime(trip[`time${i}`])}</p>
                    <p class="address">${trip[`address${i}`]}</p>
                </div>`
        }
        //Добавляем комментарий
        html += `
            </div>
            <p id="trip-comment">${trip["comment"]}</p>`
        //Инфоблок о человеке
        if(trip.man != undefined){
            html += `
                <div id="trip-manblock">
                    <p id="trip-man-header">${servicePhrases[localStorage.lang]['driver']}</p>
                    <div id="trip-manblock-grid">
                        <div id="trip-manblock-img"></div>
                        <p id="trip-manblock-name">${trip.man.name}</p>
                        <div id="trip-manblock-rating">${getrating(trip.man.rating)}</div>
                    ${trip.iam == 'guest' ?
                        `<p id="trip-manblock-information">${tripPhrases['forGuest']}</p></div>`:
                        `<p id="trip-manblock-phone">${servicePhrases[localStorage.lang]['phonenumber']}:<br>${getFormatedNumber(trip.man.phone)}</p></div>
                        ${getcontacts(JSON.parse(trip.man.contacts) ,"trip-manblock-phone")}`}
                </div>`
        }
        //Кнопочки
        html += `<div id="trip-buttons">${getButtonsInTrip(trip.status, trip.iam)}</div>`
        //Выводим
        $("#trip-grid").html(html)
        loadingWindow(false, '#tripWindow')
    })
}

const getButtonsInTrip = (status, iam) => {
    status = tripstatuses[status]
    if(status[1][iam] == undefined) return ''
    html = status[1][iam].map(el => {
        return `<button class="${tripstatuses[el][0]}">${tripStatusesPhrases[localStorage.lang]['button'][el]}</button>`
    }).join('')
    return html
}

const cleanTrip = () => {
    $("#trip-grid").html('')
    $($('#tripWindow').find('.header')[0]).children('span')[0].remove()
}

const closeTrip = () => {
    closeWindow('#tripWindow', null, cleanTrip)
}