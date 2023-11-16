const btns = document.querySelectorAll(".play-btn");

for (let btn of btns) {
    btn.addEventListener("click", (e) => {
        chrome.runtime.sendMessage({
            type: "PLAY",
            sound: e.target.id
        });
    });
}