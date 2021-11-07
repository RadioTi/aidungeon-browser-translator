/*
*  Created by: hwpoison
*  Github: github.com/hwpoison
*/

// User input box
input_box = document.querySelector("[placeholder][maxlength='4000']")

// Input mode (say, do, story)
mode_btn= document.querySelector("[style='background-color: rgba(35, 156, 158, 0.75); border-radius: 8px; display: flex; height: 24px; margin: 8px; max-width: 450px; padding: 24px 16px; transition-duration: 0s; width: 120px;']")

// Submit the input
submit_btn = document.querySelector("[aria-label='Submit']")

// All adventure content
all_msj = document.querySelectorAll("span")

// do, say, story
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

const TRANSLATOR_SERVER = "http://127.0.0.1:5000/translate/"

async function translate_text(input, from='es', to='en'){
	const url = TRANSLATOR_SERVER + encodeURIComponent(input) +'?from='+from + '&to=' + to
	return fetch(url).then(res=>res.json()).then(data=>{
		console.log(data)
		return data.translation
	})
}

async function translate_input(){
	const out = await translate_text(input_box.value, from='es', to='en')
	input_box.value = out
}

async function translate_element(element){
	const text = element.innerText
	const out = await translate_text(text, from='en', to='es')
	console.log("[+] Translating:", text, "\n   to:", out, )
	element.innerText = '\n' + out
	element.setAttribute('translated', 'true')
}

function translateAll(){
	// select all except traslated
	const elements = document.querySelectorAll("span:not([translated])").forEach((el)=>{
		translate_element(el)
	})
}

// Press 'ShiftRight' to translate input message
document.onkeydown = (event)=>{
	if(event.code=='ShiftRight'){
		translate_input()
	}
}

// interval to traslate all messages
automatic_translation = null

// function to disable interval
function disable_translation(){
	clearInterval(automatic_translation)
}

// function to enable interval
function enable_translation(){
	automatic_translation = setInterval(translateAll, 5000)
}