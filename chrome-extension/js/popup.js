const switcher = document.getElementById("activation-switch")

async function getCurrentTab() {
  return await chrome.tabs.query({ active: true, currentWindow: true })
}

async function checkHref() {
  const [currentTab] = await getCurrentTab()
  if (!currentTab.url.includes('aidungeon.io')) {
    document.body.innerHTML = '<center>You are not in aidungeon.</center>'
  }
}

checkHref()

async function executeScript(func, args = []) {
  const [currentTab] = await getCurrentTab()
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    func: func,
    args: args // [args]
  }).catch(
    (e) => console.log("Error:", e)
  )
}

// load last status button
chrome.storage.local.get(["scriptStatus"], (value) => {
  switcher.checked = value.scriptStatus;
})

switcher.addEventListener("click", async (evt) => {
  executeScript((switchStatus) => {
    TURN_ON = switchStatus
    chrome.storage.local.set({ scriptStatus: switchStatus })
  }, [switcher.checked])
})
