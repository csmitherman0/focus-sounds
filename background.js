let tabPlayingAudioId;

const getTabId = async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    return tab.id;
};

const contentFunction = (sound) => {
    console.log("CONTENT SCRIPT RUNNING")
    const soundURL = chrome.runtime.getURL(`./assets/sounds/${sound}.mp3`);
    const audio = new Audio(soundURL);
    audio.play();

    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "STOP") {
            audio.pause();
        }
    });
};

chrome.runtime.onMessage.addListener(async (message) => {
    const { type, sound } = message;
    switch (type) {
        case "PLAY":
            if (tabPlayingAudioId) {
                chrome.tabs.sendMessage(tabPlayingAudioId, { type: "STOP" });
            }
            const tabId = await getTabId();
            tabPlayingAudioId = tabId;
            chrome.scripting.executeScript({
                target: { tabId },
                func: contentFunction,
                args: [sound]
            });
            break;
        default:
            break;
    }
})