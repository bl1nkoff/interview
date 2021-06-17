import React, {useState} from 'react'
import FakeVerticalAd from './ads/fakevertical'
import {Headings, Regions} from './../tables'
import Head from 'next/head'
import Loader from './loader'

export default function CreateNew(){
    const [title, setTitle] = useState('');
    const [img, setImg] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [text, setText] = useState('');
    const [source, setSource] = useState('');
    const [region, setRegion] = useState(Regions[0].url);
    const [heading, setHeading] = useState(Headings[0].url);
    const [adminPassword, setAdminPassword] = useState('');
    const [serverAnswer, setServerAnswer] = useState('');

    const handleSubmit = event => event.preventDefault()

    const cleanForm = () => {
        setTitle('');
        setImg('');
        setDescription('');
        setTime('');
        setDate('');
        setText('');
        setSource('');
        setRegion(Regions[0].url);
        setHeading(Regions[0].url);
    }

    async function sendData(){
        const data = {
            'title': title,
            'img': img,
            'description': description,
            'date': date,
            'time': time,
            'text' : text,
            'adminPassword': adminPassword,
            'region': region,
            'heading': heading,
            'source': source
        }
        const url = '../api/create';
        setServerAnswer(<Loader/>)
        fetch(url,
        {
            method: "POST",
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(function(data){
            if(data.status === 'ok'){
                console.log(data)
                setServerAnswer(
                    <>
                    <h1>Опубликованно</h1>
                    <p>Текст для ВК: </p>
                    <p>{title}<br/>{description}<br/><br/>{data.url}</p>
                    </>
                )
            }else if(data.status === 'adminError'){
                setServerAnswer(<h1 color="red">Админ пароль не подошёл</h1>)
            }else{
                console.log(data)
                setServerAnswer(<h1 color="red">Произошла несосветная хуйня: {JSON.stringify(data)}</h1>)
            }
         })
        .catch(e=>{
            console.log(e)
            setServerAnswer(<h1>Произошла несосветная хуйня</h1>)
        })
    }

    function pasteTag(value){
        let html;
        switch(value){
            case 'h2': case 'h3': case 'p': case 'strong': case 'i':
                html = [`<${value}>`, `</${value}>`];
                break;
            case 'img':
                html = [`<img alt="" src="`, `"/>`];
                break;
            case 'a':
                html = [`<a src="">`, `<a>`];
                break;
            case 'imgdis':
                html = [`<div class="article-imgdis">\t
                    <img alt="" src="`, `"/>\t
                    <i></i></div>`];
                break;
            case 'ol': case 'ul':
                html=[`<p class="article-list-before"></p>\n<${value}>\n\t<li></li>\n\t<li></li>\n\t<li></li>\n</${value}>`,``]
                break;
            case 'quote':
                html= ['<div class="article-quote"><i>', '</i><p></p></div>']
                break;
            default:
                console.log('pasteTag', value);
                html = ['',''];
                return;
        }
        let area = document.getElementById('create-form-text');
        let prevtext = area.value;
        let coors = [area.selectionStart, area.selectionEnd];
        let result = prevtext.substring(0, coors[0]) + html[0] + prevtext.substring(coors[0], coors[1]) + html[1] + prevtext.substring(coors[1], prevtext.length);
        setText(result);
    }

    return(
        <form onSubmit={handleSubmit}>
            <Head>
                <title>Создание новости</title>
            </Head>
            <div id="form-header">
                <h1>Админ панель. Публикация статьи</h1>
                <button id="create-form-clean"
                    onClick={cleanForm}>Очистить</button>
            </div>
            <div id="form-firstoption" className="creation-option">
                <input
                    value={title}
                    onInput={e=>setTitle(e.target.value)}
                    id='create-form-title'
                    placeholder="Название"/>
                <input
                    value={img}
                    id='create-form-title'
                    placeholder="Картинка (url)"
                    onInput={e=>setImg(e.target.value)}/>
                <input id='create-form-source' placeholder="Источник"
                    value={source}
                    onInput={e=>setSource(e.target.value)}/>
                <input id='create-form-time' type="time"
                    onInput={e=>setTime(e.target.value)}/>
                <input id='create-form-date' type="date"
                    onInput={e=>setDate(e.target.value)}/>
                <select id='create-form-region'
                    value={region}
                    onChange={e=>setRegion(e.target.value)}>
                    {
                        Regions.map(el=>{
                            return <option value={el.url}>{el.name}</option>
                        })
                    }
                </select>
                <select id='create-form-heading'
                    value={heading}
                    onChange={e=>setHeading(e.target.value)}>
                    {
                        Headings.map(el=>{
                            return <option value={el.url}>{el.name}</option>
                        })
                    }
                </select>
            </div>
            <div className="creation-option">
                <p>Описание</p>
                <textarea id='create-form-description'
                    value={description}
                    onInput={e=>setDescription(e.target.value)}/>
            </div>
            <div className="creation-option">
                <p>Текст</p>
                <div id="create-form-buttons">
                    <button id="create-form-h2" onClick={()=>pasteTag('h2')}>Заголовок 2</button>
                    <button id="create-form-h3" onClick={()=>pasteTag('h3')}>Заголовок 3</button>
                    <div className="create-form-space"/>
                    <button id="create-form-p" onClick={()=>pasteTag('p')}>Абзац</button>
                    <button id="create-form-a" onClick={()=>pasteTag('a')}>Ссылка</button>
                    <button id="create-form-a" onClick={()=>pasteTag('quote')}>Цитата</button>
                    <button id="create-form-strong" onClick={()=>pasteTag('strong')}>Жирный</button>
                    <button id="create-form-i" onClick={()=>pasteTag('i')}>Курсив</button>
                    <div className="create-form-space"/>
                    <button id="create-form-img" onClick={()=>pasteTag('img')}>Картинка</button>
                    <button id="create-form-imgdis" onClick={()=>pasteTag('imgdis')}>Картинка с опис.</button>
                    <div className="create-form-space"/>
                    {/*<button id="create-form-ul" onClick={()=>pasteTag('ul')}>Нумер. спис.</button>*/}
                    <button id="create-form-ol" onClick={()=>pasteTag('ol')}>Список</button>
                    <div className="create-form-space"/>
                    <button id="create-form-cleanText" onClick={()=>setText('')}>Сбросить</button>
                </div>
                <textarea id='create-form-text'
                    value={text}
                    onInput={e=>setText(e.target.value)}/>
            </div>
            <div className="creation-option">
                <p>Предпросмотр</p>
                <div id='create-preview'>
                    <article>
                        <h1>{title}</h1>
                        <div className="article-meta">{time} {date}</div>
                        <p className="desription">{description}</p>
                        <img alt="" src={img}/>
                        <div id="article-html" dangerouslySetInnerHTML={{__html: text}}/>
                    </article>
                    <FakeVerticalAd/>
                </div>
            </div>
            <div className="creation-option">
                <p>Итог</p>
                {serverAnswer}
            </div>
            <div id="form-lastoption">
                <input
                    id='create-form-password'
                    placeholder="Админ пароль"
                    value={adminPassword}
                    onChange={e=>setAdminPassword(e.target.value)}/>
                <button id="creation-send" onClick={sendData}>Отправить</button>
            </div>
        </form>
    )
}