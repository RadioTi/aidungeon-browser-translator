/*
*  Created by: hwpoison
*  Github: github.com/hwpoison
*/

const TRANSLATOR_SERVER = "http://127.0.0.1:5000/translate/"
var DEFAULT_TRANSLATOR = 'deepl'
var USER_LANG = 'spanish' 

// interval to traslate all messages
automatic_translation = null

// User input box
const input_box = document.querySelector("[placeholder][maxlength='4000']")

// Input mode (say, do, story)
const mode_btn= document.querySelector("[style='background-color: rgba(35, 156, 158, 0.75); border-radius: 8px; display: flex; height: 24px; margin: 8px; max-width: 450px; padding: 24px 16px; transition-duration: 0s; width: 120px;']")

// Submit the input
const submit_btn = document.querySelector("[aria-label='Submit']")

// All adventure content box
const all_msj = document.querySelector("[style='display: flex; margin-top: 2%;']")

function load_switch_btn(){
    // Switch for change translation service
    let switch_btn = document.createElement('button')
    switch_btn.innerText = 'Switch Translator'
    switch_btn.title = 'Switch Translator service'
    switch_btn.style.position = 'fixed'
    switch_btn.style.top = '0px'
    switch_btn.style.left = 'calc(45% - 50px)'
    switch_btn.style.zIndex = '9999'
    switch_btn.style.backgroundColor = '#fff'
    switch_btn.style.border = '1px solid #000'
    switch_btn.style.padding = '5px'
    switch_btn.style.borderRadius = '5px'
    switch_btn.style.fontSize = '12px'
    switch_btn.style.cursor = 'pointer'
    switch_btn.style.margin = '5px'
    switch_btn.style.color = '#000'
    switch_btn.style.fontWeight = 'bold'
    switch_btn.style.textAlign = 'center'
    switch_btn.style.width = '100px'
    switch_btn.style.height = '30px'

    // switch  button click event
    switch_btn.innerText = 'DeepL'
    switch_btn.onclick = ()=>{
        if(switch_btn.innerText == 'Google'){
            switch_btn.innerText = 'DeepL'
            DEFAULT_TRANSLATOR = 'deepl'
        }else{
            switch_btn.innerText = 'Google'
            DEFAULT_TRANSLATOR = 'google'
        }
        console.log("[+] Translator service changed to: " + DEFAULT_TRANSLATOR)
    }
    document.body.appendChild(switch_btn)
}

function load_language_selector(){
    // multiselect for translation language
    select_lang = document.createElement('select')
    select_lang.style.position = 'fixed'
    select_lang.style.top = '0px'
    select_lang.style.left = 'calc(53% - 50px)'
    select_lang.style.height = '30px'
    select_lang.style.margin = '5px'
    select_lang.style.borderRadius = '5px'
    // title 
    select_lang.title = 'Select origin language'

    // all languages
    const languages = {
        'es': 'Spanish',
        'en': 'English',
        'fr': 'French',
        'it': 'Italian',
        'de': 'German',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'tr': 'Turkish',
        'vi': 'Vietnamese',
        'pl': 'Polish',
        'nl': 'Dutch',
        'sv': 'Swedish',
        'da': 'Danish',
        'fi': 'Finnish',
        'no': 'Norwegian',
        'el': 'Greek',
        'hi': 'Hindi',
    }
    for(let lang in languages){
        select_lang.innerHTML += `<option value="${lang}">${languages[lang]}</option>`
    }
    function on_selection(e){
        if(e.target.tagName == 'SELECT'){
            USER_LANG = e.target.value
        }
    }
    select_lang.addEventListener('change', on_selection)

    document.body.appendChild(select_lang)
}

const message = document.createElement('div')
message.style.position = 'fixed'
message.style.bottom = '0px'
message.style.left = '0px'
message.style.zIndex = '9999'
message.style.backgroundColor = '#fff'
message.style.border = '1px solid #000'
message.style.padding = '5px'
message.style.borderRadius = '5px'
message.style.fontSize = '12px'
message.style.color = '#000'
message.style.fontWeight = 'bold'
message.style.textAlign = 'center'
message.style.width = '200px'
message.style.height = '30px'
message.style.display = 'none'

document.body.appendChild(message)

function hidde_notification_message(){
    message.style.display = 'none'
}

function show_notification_message(content){
    message.innerText = content
    message.style.display = 'block'
    setTimeout(hidde_notification_message, 5000)
}

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

async function translate_text(input, from=USER_LANG, to='en'){
    if(input){
        const url = TRANSLATOR_SERVER + encodeURIComponent(input) +'?from='+from + '&to=' + to + '&translator=' + DEFAULT_TRANSLATOR
        return fetch(url).then(res=>{
            if(res.status == 500){
                show_notification_message('Problem with the translation service.')
            }
            return res.json()
        }).then(data=>{
            return decodeURI(data.translation)
        })
        // fetch and get status code 


    }
}

async function translate_input(){
	const out = await translate_text(input_box.value)
	input_box.value = out
}

async function translate_element(element){
	const text = element.innerText
    if(text){
        try {
        const out = await translate_text(text, from='en', to=USER_LANG)
        // console.log("[+] Translating:", text, "\n   to:", out, )
        element.innerText = out
        element.setAttribute('translated', 'true')
        }catch(e){
            console.log("[x] Error translating", e)
        }
	}
}

function translateAll(){
    // recursive search for all elements to translate
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

// Init main function
function init(){
    // try connection with translate server
    if(input_box == undefined || submit_btn == undefined || mode_btn == undefined || all_msj == undefined){
        console.log("[+] GUI elements not found! Aborting script execution.")
        alert("[+] Failed to find GUI elements! Aborting script execution.")
        return false
    }

    console.log("\n[+] Trying connection with translator server...")
    fetch(TRANSLATOR_SERVER).then(res=>{
        if(res.status == 200){
            console.log("[+] Translate server connected!")
            enable_automatic_translation()
	        // Press 'ShiftRight' to translate input message
            document.onkeydown = (event)=>{
                if(event.code=='ShiftRight'){
                    translate_input()
                }
            }
            // Press 'ShiftLeft' to force translation 
            document.onkeyup = (event)=>{
                if(event.code=='ShiftLeft'){
                    translateAll()
                }
            }
            load_switch_btn()
            load_language_selector()
            show_notification_message('Ready to translate!')
        }
    }).catch(e=>{
        console.log("[x] Error connecting to translate server! " + e)
        console.log("[+] Trying connection in 5 seconds...")
        setTimeout(init, 5000)
    })
}
console.log("[+] Script loaded!")
init()

