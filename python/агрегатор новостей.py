#Отрывок

# -----------------
for val in rowLinks:
	#print(val)
	#print('href' in val)
	try:	
		href = val['href']
		if(href[:6] == '/news/'):
			links.append(src + href)
	except:
		1#print('--- битая ссылка')
	#if('href' in val):

links = list(set(links))
print('Уникальные ссылки: ',len(links))

print('Итого найдено новостных ссылок: ',len(links))

postBody = json.dumps({"urls": links}, separators=(',', ':'))
result = requests.post('http://localhost:3000/api/getunique', postBody)
result = result.json()

for el in result:
	links.remove(el['source'])

print('Итого новых ссылок: ', len(links))

# -----------------

#Конец отрывка
