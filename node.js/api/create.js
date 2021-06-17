import { mysql } from '../../api-scripts/connections'
import CyrillicToTranslit from 'cyrillic-to-translit-js'
import {Regions, Headings} from '../../tables'

export default function handler(req, res) {
    const json = JSON.parse(req.body)
    let answer = {status: ''}

    if(!typeof(json.title) || json.title === ''){
        answer.status = 'titleProblem';
    }else if(!typeof(json.description) || json.description === ''){
        answer.status = 'descriptionProblem';
    }else if(!typeof(json.text) || json.text === ''){
        answer.status = 'textProblem';
    }

    if(answer.status !== ''){
        res.status(200).json(answer)
        return
    }

    let date_time;    
    if((new Date(json.date + ' ' + json.time)).toString() === 'Invalid Date'){
        const date = new Date();
        date_time = `${date.getFullYear}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }else{
        //answer['date_time'] = json.date + ' ' + json.time
        //const date = new Date();
        //answer['date_time1'] = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        date_time = json.date + ' ' + json.time;
    }

    let ourAuthor = undefined;
    if(json.adminPassword !== undefined){
        const query = `SELECT name FROM \`admin\` WHERE password ='${json.adminPassword}'`
        const result = mysql.query(query);        
        if(result.length !== 0) ourAuthor = result[0].name;
    }

    if(ourAuthor === undefined){
        answer.status = 'adminError'
        res.status(200).json(answer)
        return
    }

    // ----- Region test

    let test = [false, false];

    Regions.map(el => {
        if(el.url === json.region){
            test[0] = true;
            return;
        }
    }) 
    const region = test[0] ? json.region : Regions[0].url;

    // ----- Heading test
    Headings.map(el => {
        if(el.url === json.heading){
            test[1] = true;
            return
        }
    })
    const heading = test[1] ? json.heading : Headings[0].url

    // ----- Fake views
    const [min, max] = [300, 700]
    const fakeViews = parseInt(Math.random() * (max - min)) + min

    // ----- Url Translate
    const urlTitle = CyrillicToTranslit().transform(json.title, '_').toLowerCase()
    
    // ----- Занесение в БД
    const query = `INSERT INTO news
        (\`title\`, \`description\`, \`text\`, \`date_time\`, \`img\`, \`fake_views\`, \`title-url\`, \`author\`, \`source\`, \`region\`, \`heading\`)
        VALUES ('${json.title}', '${json.description}', '${json.text}', '${date_time}', 
        '${json.img}', ${fakeViews}, '${urlTitle}', '${ourAuthor}', '${json.source}',
        '${region}', '${heading}')`;
    const result = mysql.query(query)

    answer.status = 'ok'
    //res.status(200).json({query})
    res.status(200).json(answer)

    // ----SiteMap

        //if(mysqli_num_rows($result) != 0){
        //         $id = mysqli_fetch_array ($result);// достаём первую строчку
        //         $id = $id['id'];   
        //         $answer['url'] = "https://reportage-news.ru/new/$id/$urlTitle";
        
        //         $sitemap = simplexml_load_file('https://reportage-news.ru/sitemap.xml');
        
        //         $myNewUri = $sitemap->addChild("url");
        //         $myNewUri->addChild("loc", $answer['url']);
        //         $myNewUri->addChild("lastmod", $_POST['date_time']);
        //         $myNewUri->addChild("changefreq", "never");
        //         $myNewUri->addChild("priority", "1.0");
        
        //     $sitemap->asXml("../sitemap.xml");
        //     }else{
        //         $answer['status'] = 'this peace of shit was not found there';
        //         exit;
        //     }
        //     mysqli_close();
        //     $answer['status'] = 'ok';
        //     echo json_encode($answer);    
}