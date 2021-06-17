import { mysql } from '../../api-scripts/connections'
import {Regions, Headings} from '../../tables'

export default function handler(req, res) {
    let hiddenSQL = " AND `hidden` = 0 ";
    let limit = "LIMIT 34";
    let orderby = `ORDER BY \`date_time\` DESC`;

    const GET = req.query
    const POST = req.body == '' ? {} : JSON.parse(req.body)

    if(POST.adminPassword !== undefined){
        const query = `SELECT id FROM \`admin\` WHERE password ='${POST.adminPassword}'`
        const result = mysql.query(query);// , function (err, result) {
        
        if(result.length !== 0){
            hiddenSQL = ''
            limit = ''
            orderby = 'ORDER BY \`id\` DESC'
        }
    }

    let test = [false, false];

    //Region test
    Regions.map(el => {
        if(el.url === GET.region){
            test[0] = true;
            return;
        }
    }) 
    const region = test[0] ? GET.region : Regions[0].url;

    //Heading test
    Headings.map(el => {
        if(el.url === GET.heading){
            test[1] = true;
            return;
        }
    })
    const heading = test[1] ? GET.heading : Headings[0].url

    const query = `SELECT * FROM \`news\` WHERE region = '${region}' AND heading = '${heading}' ${hiddenSQL} ${orderby} ${limit}`
    //console.log(query)
    const result = mysql.query(query);
    //res.status(200).json({query})
    
    res.status(200).json(result)
}
