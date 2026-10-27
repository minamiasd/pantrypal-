async function translateToChinese(text) {
 const endpoint = 'https://api.mymemory.translated.net/get';
 const url = endpoint + '?q=' + encodeURIComponent(text.slice(0,400)) + '&langpair=en%7Czh-CN';
 const result = await fetch(url).then(r => r.json());
 return result.responseData?.translatedText || text;
}
