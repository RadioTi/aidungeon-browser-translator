/*
 *  Created by: hwpoison
 *  Github: github.com/hwpoison
 */

const TRANSLATOR_SERVER = 'http://127.0.0.1:5000/translate/'
let selectedTranslator = 'deepl'
let selectLanguage = 'spanish' // All adventure will be translated to this language


const DEEPL = 'DeepL'

// Prepare Selectors
// User input box
const userInput = document.querySelector("[placeholder][maxlength='4000']")
// Submit the input
const submitInputBtn = document.querySelector("[aria-label='Submit']")
// All adventure content box
const adventureContent = document.querySelector("[style='display: flex; margin-top: 2%;']")

let notificationContainer

let controller = new AbortController();
let { signal } = controller;

function createSwitchLangButton() {
    // Switch for change translation service
    const switchBtn = document.createElement('button')
    switchBtn.id = 'switch-lang-btn'
    switchBtn.innerText = 'Switch Translator'
    switchBtn.title = 'Switch Translator service'
    switchBtn.style.position = 'fixed'
    switchBtn.style.top = '0px'
    switchBtn.style.left = 'calc(45% - 50px)'
    switchBtn.style.zIndex = '9999'
    switchBtn.style.backgroundColor = '#fff'
    switchBtn.style.border = '1px solid #000'
    switchBtn.style.padding = '5px'
    switchBtn.style.borderRadius = '5px'
    switchBtn.style.fontSize = '12px'
    switchBtn.style.cursor = 'pointer'
    switchBtn.style.margin = '5px'
    switchBtn.style.color = '#000'
    switchBtn.style.fontWeight = 'bold'
    switchBtn.style.textAlign = 'center'
    switchBtn.style.width = '100px'
    switchBtn.style.height = '30px'

    // switch  button click event
    switchBtn.innerText = DEEPL
    switchBtn.onclick = () => {
        switchBtn.innerText = switchBtn.innerText === DEEPL ? 'Google' : DEEPL
        selectedTranslator = switchBtn.innerText.toLowerCase()
        console.log('[+] Translator service changed to: ' + selectedTranslator)
    }
    document.body.appendChild(switchBtn)
}

// rotate icon each 5 seconds
function rotateIconAnimation() {

}
function createLangSelector() {
    // multiselect for translation language
    langSelector = document.createElement('select')
    langSelector.style.position = 'fixed'
    langSelector.style.top = '0px'
    langSelector.style.left = 'calc(53% - 50px)'
    langSelector.style.height = '30px'
    langSelector.style.margin = '5px'
    langSelector.style.borderRadius = '5px'
    langSelector.title = 'Select origin language'

    // all supported languages
    const languages = {
        es: 'Spanish',
        en: 'English',
        fr: 'French',
        it: 'Italian',
        de: 'German',
        pt: 'Portuguese',
        ru: 'Russian',
        ja: 'Japanese',
        ko: 'Korean',
        zh: 'Chinese',
        ar: 'Arabic',
        tr: 'Turkish',
        vi: 'Vietnamese',
        pl: 'Polish',
        nl: 'Dutch',
        sv: 'Swedish',
        da: 'Danish',
        fi: 'Finnish',
        no: 'Norwegian',
        el: 'Greek',
        hi: 'Hindi',
    }
    for (let lang in languages) {
        langSelector.innerHTML += `<option value="${lang}">${languages[lang]}</option>`
    }

    langSelector.addEventListener('change', (el) => {
        selectLanguage = el.target.value
    }
    )
    document.body.appendChild(langSelector)
}

function getOrCreateNotificationContainer() {
    if (notificationContainer) {
        return notificationContainer
    }
    message = document.createElement('div')
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
    return message
}

function showNotificationMessage(content, timeout = 5000) {
    notificationContainer = getOrCreateNotificationContainer()
    notificationContainer.innerText = content
    notificationContainer.style.display = 'block'
    setTimeout(() => {
        notificationContainer.style.display = 'none'
    }, timeout)
}

function hideNotificationMessage() {
    notificationContainer = getOrCreateNotificationContainer()
    notificationContainer.style.display = 'none'
}

// translate text to user language
async function translateSimpleText(from, to, text, abortable = false) {
    const url = `${TRANSLATOR_SERVER}${encodeURIComponent(text)}?from=${from}&to=${to}&translator=${selectedTranslator}`

    let response
    if (abortable) {
        controller = new AbortController();
        signal = controller.signal;
        response = await fetch(url, { signal }).catch(() => {// do nothing
        })
        if (response == undefined) {
            return false
        }
    } else {
        try {
            response = await fetch(url)
        } catch (e) {
            showNotificationMessage('❌ Problem with translation server conection.')
        }
    }

    if (!response.ok) {
        showNotificationMessage('❌ Error while translating text.', response.status)
        return text
    }
    return response.json()
}

// translate user input to english ( default language of dungeonai)
async function translateUserInput() {
    if (userInput.value) {
        showNotificationMessage('⌛ Translating user input...')
        const translatedText = await translateSimpleText(selectLanguage, 'en', userInput.value, true)
        if (translatedText) {
            userInput.value = translatedText.translation// + ' '
        }
        hideNotificationMessage()
    }
}

async function translateElement(element) {
    const text = element.innerText
    if (text.length > 2) {
        const translatedText = await translateSimpleText('en', selectLanguage, text)
        if (translatedText) {
            element.innerText = translatedText.translation
            element.setAttribute('translated', 'true')
        } else {
            console.warn('❌ Error to translate element.')
        }
    }
}

// Translate node tree
function translateNodes(node) {
    if (node.hasChildNodes()) {
        node.childNodes.forEach((childNode) => {
            if (childNode.hasChildNodes()) {
                return translateNodes(childNode)
            }
            const wasTranslated = node.getAttribute('translated') !== 'true'
            if (wasTranslated) {
                translateElement(node)
            }
        }
        )
    }
}

// translate adventureContent 
function translateAdventureContent() {
    const mainNode = adventureContent
    translateNodes(mainNode)
}

function createKeyboardEvents() {
    // Press 'ShiftLeft' to force translation
    document.onkeyup = (event) => {
        if (event.code == 'ShiftLeft') {
            translateAdventureContent()
        }
    }

    userInput.addEventListener('keypress', (event) => {
        // abort only if controller is not aborted
        if (!controller.signal.aborted) {
            controller.abort()
        }
    })
}

function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args)
        }
            , timeout)
    }
}

// function to enable interval
function turnAutomaticTranslation() {
    const config = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    }
    // for each change in adventureContent
    new MutationObserver(debounce(() => translateAdventureContent()))
        .observe(adventureContent, config)

    // for user input
    new MutationObserver(debounce(() => {
        translateUserInput()
    }, 500))
        .observe(userInput, config)
}

// test connection with the server
async function testServerConnection() {
    return await fetch(TRANSLATOR_SERVER)
        .then(response => {
            if (response) {
                return true
            }
        }).catch(e => {
            return false
        })
}

// Initialize script
async function init() {

    notificationContainer = getOrCreateNotificationContainer()

    // Check selectors
    if (userInput == undefined || submitInputBtn == undefined || adventureContent == undefined) {
        console.warn('[+] GUI elements not found! Aborting script execution.')
        showNotificationMessage('Some elements are not found, aborting script execution... 😔')
        return false
    }

    // Try connection with the server
    console.log('\n[+] Conecting with traslation server...')
    const isConnected = await testServerConnection()
    if (isConnected) {
        showNotificationMessage('✅ Server connection OK.')
    } else {
        showNotificationMessage('❌ Server connection failed.\nTrying in 5 seconds')
        setTimeout(init, 5000)
        return false
    }

    // Create events and interface
    createSwitchLangButton()
    createLangSelector()
    translateAdventureContent()
    turnAutomaticTranslation()
    createKeyboardEvents()
    showNotificationMessage('Ready to translate! 😊')

}
console.log('[+] Script loaded!')
init()
