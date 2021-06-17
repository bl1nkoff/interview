import { mysql } from '../../api-scripts/connections'

export default function handler(req, res) {
    let answer = {status: ''}

    const POST = JSON.parse(req.body)

    const show = JSON.parse('[' + POST.show + ']')
    const hide = JSON.parse('[' + POST.hide + ']')

    const showCount = show.length
    const hideCount = hide.length

    if((showCount === 0 && hideCount === 0) || POST.adminPassword === undefined){
        answer.status = 'empty'
        res.status(200).json(answer)
        return
    }

    const adminQuery = `SELECT name FROM admin WHERE password = '${POST.adminPassword}'`
    const adminResult = mysql.query(adminQuery)
    if(adminResult.length === 0){
        answer.status = 'adminError'
        res.status(200).json(answer)
        return
    }

    let showQuery = ''
    if(showCount !== 0){
        for (let i = 0; i <  showCount - 1; i++) { 
            showQuery += `id = ${show[i]} OR `
        }
        showQuery += `id = ${show[showCount - 1]}`
        
        const query = "UPDATE news SET hidden = 0 WHERE " + showQuery
        mysql.query(query)
    }

    let hideQuery = '';
    if(hideCount !== 0){
        for (let i = 0; i <  hideCount - 1; i++) { 
            hideQuery += `id = ${show[i]} OR `
        }
        hideQuery += `id = ${hide[hideCount - 1]}`
        
        const query = "UPDATE news SET hidden = 1 WHERE " + hideQuery
        mysql.query(query)
    }

    answer.status = 'ok'
    res.status(200).json(answer)
}