import { mysql } from '../../api-scripts/connections'

export default function handler(req, res) {
    const json = /*{urls: ['https://gtrk-kostroma.ru/news/kostromskaya-oblast-poluchit-dopolnitelno-1-36-milliarda-rubley/', 'https://gtrk-kostroma.ru/news/kostromskaya-oblast-poluchit-dopolnitelno-1-36-milliarda-rubley1111/']}//*/JSON.parse(req.body)
    const urls = json.urls
    let answer = {status: ''}

    if(urls.length == 0) { res.status(200).json([]); return } // обработать ошибку пустого массива
    
    let query = 'SELECT source FROM news WHERE'

    urls.forEach(el => query += ' source = "' + el + '" OR' );

    query = query.substring(0, query.length - 2)//Переписать сабстринг

    const result = mysql.query(query)
    res.status(200).json(result)   
}