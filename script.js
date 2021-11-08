/*
*  Created by: hwpoison
*  Github: github.com/hwpoison
*/

const TRANSLATOR_SERVER = "http://127.0.0.1:5000/translate/"
const USER_LANG = 'es'

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
	const url = TRANSLATOR_SERVER + encodeURIComponent(input) +'?from='+from + '&to=' + to
	return fetch(url).then(res=>res.json()).then(data=>{
		return data.translation
	})
}

async function translate_input(){
	const out = await translate_text(input_box.value)
	input_box.value = out
}

async function translate_element(element){
	const text = element.innerText
	try{
		const out = await translate_text(text, from='en', to=USER_LANG)
		//console.log("[+] Translating:", text, "\n   to:", out, )
		element.innerText = out
		element.setAttribute('translated', 'true')
	}catch(e){
		console.log("[x] Error translating")
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
            alert("[+]Ready!")
        }
    }).catch(e=>{
        console.log("[x] Error connecting to translate server! " + e)
        console.log("[+] Trying connection in 5 seconds...")
        setTimeout(init, 5000)
    })
}
console.log("[+] Script loaded!")
init()
