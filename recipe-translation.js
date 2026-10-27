/* PantryPal: translate third-party recipe cards without changing their source links. */
(()=>{'use strict';
const cacheKey='pantrypal_recipe_translation_zh_v2';
let cache={};try{cache=JSON.parse(localStorage.getItem(cacheKey)||'{}')}catch{}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let chain=Promise.resolve();
async function request(text){
 const key=text.trim();if(!key)return '';
 if(cache[key])return cache[key];
 const url='https://api.mymemory.translated.net/get?q='+encodeURIComponent(key.slice(0,450))+'&langpair=en%7Czh-CN';
 const response=await fetch(url);if(!response.ok)throw Error('Translation HTTP '+response.status);
 const payload=await response.json();
 if(Number(payload.responseStatus)!==200||!payload.responseData?.translatedText)throw Error('Translation unavailable');
 const result=payload.responseData.translatedText;
 if(!result||/MYMEMORY WARNING|QUOTA EXCEEDED/i.test(result))throw Error('Translation quota exceeded');
 cache[key]=result;try{localStorage.setItem(cacheKey,JSON.stringify(cache))}catch{}
 await delay(120);return result;
}
function translate(text){const task=chain.then(()=>request(text));chain=task.catch(()=>{});return task}
function batches(text,max=390){const output=[];let remaining=text.trim();while(remaining.length&&output.length<14){let end=Math.min(max,remaining.length);if(end<remaining.length){let n=Math.max(remaining.lastIndexOf('. ',end),remaining.lastIndexOf('。',end),remaining.lastIndexOf('\n',end));if(n>140)end=n+1}output.push(remaining.slice(0,end));remaining=remaining.slice(end).trim()}return output}
const original=new WeakMap();
async function processCard(card){
 if(card.dataset.zhSetup)return;card.dataset.zhSetup='1';
 const title=card.querySelector('h3'),info=[...card.querySelectorAll('.muted')].find(x=>x.textContent.startsWith('Ingredients:'));
 if(!title)return;
 const enTitle=title.textContent;original.set(title,enTitle);
 const english=document.createElement('div');english.className='muted';english.textContent='英文原名：'+enTitle;title.after(english);
 const details=card.querySelector('details');
 if(details){
  const button=document.createElement('button');button.className='btn';button.type='button';button.textContent='翻译做法为中文';
  const result=document.createElement('p');result.className='steps';result.hidden=true;
  button.addEventListener('click',async()=>{
   button.disabled=true;button.textContent='正在翻译…';result.hidden=false;
   try{const text=details.querySelector('.steps')?.textContent||'';const parts=batches(text,390);const texts=[];for(const part of parts)texts.push(await translate(part));result.textContent=texts.join(' ');button.textContent='中文翻译完成'}
   catch(e){result.textContent='翻译服务暂不可用，可继续阅读下方英文原文。';button.textContent='重试翻译';button.disabled=false}
  });details.insertBefore(button,details.querySelector('.steps'));details.insertBefore(result,details.querySelector('.steps'));
 }
 try{title.textContent=await translate(enTitle);if(info){const source=info.textContent.replace(/^Ingredients:\s*/, '');info.textContent='食材：'+await translate(source)}}catch(e){const note=document.createElement('small');note.className='muted';note.textContent='暂时无法翻译，已保留英文原文';card.querySelector('.info')?.append(note)}
}
let processing=false;
async function scan(){if(processing)return;processing=true;try{
 const cards=[...document.querySelectorAll('#recipes article.recipe')].filter(c=>c.querySelector('.tag')?.textContent.includes('线上菜谱')&&!c.dataset.zhSetup).slice(0,15);
 for(const card of cards)await processCard(card);
}finally{processing=false}}
const grid=document.getElementById('recipes');if(grid){const observer=new MutationObserver(()=>{queueMicrotask(scan)});observer.observe(grid,{childList:true});scan()}
})();