/*
*  Created by: hwpoison
*  Github: github.com/hwpoison
*/

const TRANSLATOR_SERVER = "http://127.0.0.1:5000/translate/"

// interval to traslate all messages
automatic_translation = null

// User input box
input_box = document.querySelector("[placeholder][maxlength='4000']")

// Input mode (say, do, story)
mode_btn= document.querySelector("[style='background-color: rgba(35, 156, 158, 0.75); border-radius: 8px; display: flex; height: 24px; margin: 8px; max-width: 450px; padding: 24px 16px; transition-duration: 0s; width: 120px;']")

// Submit the input
submit_btn = document.querySelector("[aria-label='Submit']")

// All adventure content box
all_msj = document.querySelector("[style='display: flex; margin-top: 2%;']")


// change mode do, say, story
function changeInputMode(mode){
	const actual = mode_btn.textContent
	if(actual === null){
		console.log('[x] Mode button not found!')
		return false
	}
	if(mode === 'say'){
		if(actual == 'do'){
			mode_btn.click()
		}else if(actual=='story'){
			mode_btn.click()
			mode_btn.click()
		}
	}else if(mode === 'do'){
		if(actual=='say'){
			mode_btn.click()
			mode_btn.click()
		}else if(actual=='story'){
			mode_btn.click()
		}

	}else if(mode === 'story'){
		if(actual=='do'){
			mode_btn.click()
			mode_btn.click()
		}else if(actual == 'say'){
			mode_btn.click()
		}
	}
	return true
}

function writeInput(content){
	input_box.value = content
}

function sendInput(content){
	input_box.value = content
	submit_btn.click()
}

async function translate_text(input, from='es', to='en'){
	const url = TRANSLATOR_SERVER + encodeURIComponent(input) +'?from='+from + '&to=' + to
	return fetch(url).then(res=>res.json()).then(data=>{
		return data.translation
	})
}

async function translate_input(){
	const out = await translate_text(input_box.value, from='es', to='en')
	input_box.value = out
}

async function translate_element(element){
	const text = element.innerText
	try{
		const out = await translate_text(text, from='en', to='es')
		//console.log("[+] Translating:", text, "\n   to:", out, )
		element.innerText = out
		element.setAttribute('translated', 'true')
	}catch(e){
		console.log("[x] Error translating")
	}
}

function translateAll(){
	function iterate(el){
		if(el.hasChildNodes()){
			for(let i=0; i<el.childNodes.length; i++){
				if(el.childNodes[i].hasChildNodes()){
					iterate(el.childNodes[i])
				}else{
					if(el.getAttribute('translated') === null){
						translate_element(el)
					}
				}
			}
		}
	}
	// iterate over all elements and translate them
	iterate(all_msj)
	
	// Possibly the last element is being generated (writing animation) so the 
	//'translated' attribute is removed so that it is translated in the next iteration.
	const count = all_msj.childNodes[0].childElementCount
	const last_item = all_msj.childNodes[0].childNodes[count-1].childNodes[0]
	last_item.removeAttribute("translated")
	/*
	let amount = all_msj.childNodes[0].childElementCount
	all_msj.childNodes[0].childNodes.forEach((el, idx)=>{
		let nodes = el.childNodes
		if(el.childElementCount > 1){
			translate_element(nodes[1]) // translate
		}else{
			translate_element(nodes[0])  // trasnlate
		}
		if(idx == amount-1){
			el.removeAttribute('translated')
		}
	})*/
}

// function to disable interval
function disable_automatic_translation(){
	clearInterval(automatic_translation)
}

// function to enable interval
function enable_automatic_translation(){
	automatic_translation = setInterval(translateAll, 2000)
}

function init(){
	console.log("Custom Script Initialize!")
	enable_automatic_translation()
	// Press 'ShiftRight' to translate input message
	document.onkeydown = (event)=>{
		if(event.code=='ShiftRight'){
			translate_input()
		}
	}
}

init()