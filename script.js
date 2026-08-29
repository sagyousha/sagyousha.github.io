console.log("作業者 Official Website Loaded!");

// スクロール時にヘッダーへ少し変化を付ける
window.addEventListener("scroll", () => {
    const header = document.querySelector("header");

    if (window.scrollY > 30) {
        header.style.background = "rgba(9, 9, 11, 0.85)";
        header.style.backdropFilter = "blur(15px)";
    } else {
        header.style.background = "transparent";
        header.style.backdropFilter = "none";
    }
});