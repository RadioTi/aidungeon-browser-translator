/*
 *  Created by: hwpoison
 *  Github: github.com/hwpoison
 */

var TURN_ON = true

const TRANSLATOR_SERVER = 'http://127.0.0.1:5000/translate/'
const ADVENTURE_URL_PREFIX = '/main/adventurePlay'

const USER_INPUT_SELECTOR = "[placeholder][maxlength='4000']"
const ADVENTURE_CONTENT_SELECTOR = "[aria-label='Story']"

let selectedTranslator = 'deepl'
let selectLanguage = 'spanish' // All adventure will be translated to this language

// supported Translators
const DEEPL = 'DeepL'
const GOOGLE = 'Google'

// signal controller
let controller = new AbortController();
let { signal } = controller;

const GUI = {
    elements: {},
    events: {},
    observers: {},
    active: false,
}

function selectUserInputBox() {
    // sometimes the webapp conserves the user input box, so we need to select the most recent one
    const textAreas = document.querySelectorAll(USER_INPUT_SELECTOR)
    GUI.elements.userInput = textAreas[textAreas.length - 1]
}

function selectAdventureContent() {
    GUI.elements.adventureContent = document.querySelector(ADVENTURE_CONTENT_SELECTOR)
}

function getOrCreateTranslatorSwitch() {
    let translatorSwitch = GUI.elements.switchLangButton
    if (translatorSwitch) {
        switchLangButton.style.display = 'block'
        return switchLangButton
    }

    // Switch for change translation service
    translatorSwitch = document.createElement('button')
    translatorSwitch.id = 'switch-lang-btn'
    translatorSwitch.innerText = 'Switch Translator'
    translatorSwitch.title = 'Switch Translator service'
    translatorSwitch.style.position = 'fixed'
    translatorSwitch.style.top = '0px'
    translatorSwitch.style.left = 'calc(45% - 50px)'
    translatorSwitch.style.zIndex = '9999'
    translatorSwitch.style.backgroundColor = '#fff'
    translatorSwitch.style.border = '1px solid #000'
    translatorSwitch.style.padding = '5px'
    translatorSwitch.style.borderRadius = '5px'
    translatorSwitch.style.fontSize = '12px'
    translatorSwitch.style.cursor = 'pointer'
    translatorSwitch.style.margin = '5px'
    translatorSwitch.style.color = '#000'
    translatorSwitch.style.fontWeight = 'bold'
    translatorSwitch.style.textAlign = 'center'
    translatorSwitch.style.width = '100px'
    translatorSwitch.style.height = '30px'

    // switch  button click event
    translatorSwitch.innerText = DEEPL
    translatorSwitch.onclick = () => {
        translatorSwitch.innerText = translatorSwitch.innerText === DEEPL ? GOOGLE : DEEPL
        selectedTranslator = translatorSwitch.innerText.toLowerCase()
        console.log('[+] Translator service changed to: ' + selectedTranslator)
    }
    document.body.appendChild(translatorSwitch)
    GUI.elements.translatorSwitch = translatorSwitch
}

function getOrCreateLangSelector() {
    let langSelector = GUI.elements.langSelector
    if (langSelector) {
        langSelector.style.display = 'block'
        return langSelector
    }
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
    // lang-codes reference: https://cloud.google.com/translate/docs/languages
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
        'zh-TW': 'Chinese (traditional)',
        'zh-CN': 'Chinese (simplified)',
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
    GUI.elements.langSelector = langSelector
}

function getOrCreateNotificationCenter() {
    let notificationCenter = GUI.elements.notificationCenter
    if (notificationCenter) {
        notificationCenter.style.display = 'block'
        return notificationCenter
    }
    notificationCenter = document.createElement('div')
    notificationCenter.style.position = 'fixed'
    notificationCenter.style.bottom = '0px'
    notificationCenter.style.left = '0px'
    notificationCenter.style.zIndex = '9999'
    notificationCenter.style.backgroundColor = '#fff'
    notificationCenter.style.border = '1px solid #000'
    notificationCenter.style.padding = '5px'
    notificationCenter.style.borderRadius = '5px'
    notificationCenter.style.fontSize = '12px'
    notificationCenter.style.color = '#000'
    notificationCenter.style.fontWeight = 'bold'
    notificationCenter.style.textAlign = 'center'
    notificationCenter.style.width = '200px'
    notificationCenter.style.height = '30px'
    notificationCenter.style.display = 'none'
    document.body.appendChild(notificationCenter)

    GUI.elements.notificationCenter = notificationCenter
}

function showNotificationMessage(content, timeout = 5000) {
    let notificationContainer = getOrCreateNotificationCenter()
    notificationContainer.innerText = content
    notificationContainer.style.display = 'block'
    setTimeout(() => {
        notificationContainer.style.display = 'none'
    }, timeout)
}

function hideNotificationMessage() {
    notificationContainer = getOrCreateNotificationCenter()
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
            showNotificationMessage('❌ Problem with translation server connection.')
        }
    }

    if (!response.ok) {
        showNotificationMessage('❌ Error while translating text.', response.status)
        return false
    }

    return response.json()
}

async function translateElement(element) {
    const text = element.innerText
    if (text.length > 2) {
        const translatedText = await translateSimpleText('en', selectLanguage, text)
        if (translatedText!=false) {
            element.innerText = translatedText.translation
            element.setAttribute('translated', 'true')
        } else {
            console.warn('❌ Error to translate element.')
            showNotificationMessage('❌ Error to translate element.', response.status)
        }
    }
}

// Translate node tree
function translateNodes(node, forceTranslation=false) {
    if (node.hasChildNodes()) {
        node.childNodes.forEach((childNode) => {
            if (childNode.hasChildNodes()) {
                return translateNodes(childNode, forceTranslation)
            }
            const wasTranslated = node.getAttribute('translated') !== 'true'
            if (wasTranslated || forceTranslation==true) {
                translateElement(node)
            }
        }
        )
    }
}

// translate adventureContent 
function translateAdventureContent(force=false) {
    const mainNode = GUI.elements.adventureContent
    translateNodes(mainNode, force)
}

// translate user input to english ( default language of dungeonai)
async function translateUserInput() {
    const userInput_ = GUI.elements.userInput
    if (userInput_.value) {
        showNotificationMessage('⌛ Translating user input...', 10000)
        const translatedText = await translateSimpleText(selectLanguage, 'en', userInput_.value, true)
        if (translatedText!=false) {
            userInput_.value = translatedText.translation// + ' '
        }
        hideNotificationMessage()
    }
}

function createKeyboardEvents() {
    // Press 'ShiftLeft' to force translation
    GUI.events.forceTranslation = document.onkeyup = (event) => {
        if (event.code == 'ShiftLeft') {
            translateAdventureContent(true)
        }
    }

    GUI.events.abortUserFetch = GUI.elements.userInput.addEventListener('keypress', (event) => {
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

function turnAutomaticTranslation() {
    const config = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    }
    // for each change in adventureContent
    const adventureContentObserver = new MutationObserver(debounce(() => translateAdventureContent()))
    adventureContentObserver.observe(GUI.elements.adventureContent, config)

    // for user input
    const userInputObserver = new MutationObserver(debounce(() => {
        translateUserInput()
    }, 500))
    userInputObserver.observe(GUI.elements.userInput, config)

    GUI.observers.adventure = adventureContentObserver
    GUI.observers.userInput = userInputObserver

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

function unload() {
    // disconnect observers
    if (GUI.observers.adventure) {
        GUI.observers.adventure.disconnect()
    }
    if (GUI.observers.userInput) {
        GUI.observers.userInput.disconnect()
    }
    // remove events listeners
    if (GUI.events.forceTranslation) {
        document.onkeyup = null
    }
    if (GUI.events.abortUserFetch) {
        userInput.removeEventListener('keypress', GUI.events.abortUserFetch)
    }
    // remove interface elements
    const notificationCenter = GUI.elements.notificationCenter
    if (notificationCenter) {
        notificationCenter.style.display = 'none'
    }

    const langSelector = GUI.elements.langSelector
    if (langSelector) {
        langSelector.style.display = 'none'
    }

    const translatorSwitch = GUI.elements.translatorSwitch
    if (translatorSwitch) {
        translatorSwitch.style.display = 'none'
    }
    GUI.active = false
}

// Initialize translation functions
async function init() {
    getOrCreateNotificationCenter()
    selectAdventureContent()
    selectUserInputBox()
    // Check selectors
    if (GUI.elements.userInput == undefined || GUI.elements.adventureContent == undefined) {
        console.warn('[+] GUI elements not found! (bad view or aidungeon gui update) Aborting script execution.')
        showNotificationMessage('😔 Aborting, some elements are not found, are you already on a adventure view?')
        return false
    }

    // Try connection with the server
    console.log('\n[+] Connecting with traslation server...')
    const isConnected = await testServerConnection()
    if (isConnected) {
        showNotificationMessage('✅ Server connection OK.')
    } else {
        showNotificationMessage('❌ Server connection failed.\nTrying in 5 seconds')
        setTimeout(init, 5000)
        return false
    }

    // Create events and interface
    getOrCreateTranslatorSwitch()
    getOrCreateLangSelector()
    translateAdventureContent()
    turnAutomaticTranslation()
    createKeyboardEvents()
    GUI.active = true

    showNotificationMessage('Translating! 😊')
}

function autoInit() {
    // detect if already in a dungeon adventure view
    const currentUrl = window.location.href
    const adventureInProgress = currentUrl.includes(ADVENTURE_URL_PREFIX)
    if (TURN_ON) {
        if (adventureInProgress) {
            if (!GUI.active)
                init()
        } else {
            unload()
        }
    } else {
        if (adventureInProgress)
            unload()
    }
}

console.log('[+] AIDungeon Translator loaded, Welcome!')

setInterval(autoInit, 2000)