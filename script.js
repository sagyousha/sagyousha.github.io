console.log("作業者 Official Website Loaded!");


// ========================================
// HEADER SCROLL EFFECT
// ========================================

window.addEventListener("scroll", () => {

    const header = document.querySelector("header");

    if (!header) return;


    if (window.scrollY > 30) {

        header.style.background =
            "rgba(9, 9, 11, 0.85)";

        header.style.backdropFilter =
            "blur(15px)";

    } else {

        header.style.background =
            "transparent";

        header.style.backdropFilter =
            "none";

    }

});


// ========================================
// BOT STATUS LOADER
// ========================================

async function loadBotStatus() {

    try {

        console.log("🌐 ステータスを読み込み中...");


        // キャッシュを使わず最新の status.json を取得
        const response = await fetch(
            "./status.json?timestamp=" + Date.now(),
            {
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        // JSON読み込み
        const data = await response.json();


        console.log(
            "📊 Status Data:",
            data
        );


        // ========================================
        // ELEMENTS
        // ========================================

        const statusBadge =
            document.querySelector(".status-online");

        const statusMessage =
            document.querySelector(
                ".status-bot-info p"
            );

        const statValues =
            document.querySelectorAll(".stat-value");


        const pingElement =
            statValues[0];

        const uptimeElement =
            statValues[1];

        const serversElement =
            statValues[2];

        const membersElement =
            statValues[3];

        const updatedElement =
            statValues[4];


        // ========================================
        // ONLINE STATUS
        // ========================================

        if (data.status === "ONLINE") {

            if (statusBadge) {

                statusBadge.innerHTML = `
                    <span class="status-dot online"></span>
                    ONLINE
                `;

                statusBadge.style.color =
                    "#4ade80";

                statusBadge.style.background =
                    "rgba(34, 197, 94, 0.1)";

                statusBadge.style.borderColor =
                    "rgba(34, 197, 94, 0.25)";

            }


            if (statusMessage) {

                statusMessage.textContent =
                    "現在正常に稼働しています";

            }


        // ========================================
        // OFFLINE STATUS
        // ========================================

        } else {

            if (statusBadge) {

                statusBadge.innerHTML = `
                    <span class="status-dot offline"></span>
                    OFFLINE
                `;

                statusBadge.style.color =
                    "#f87171";

                statusBadge.style.background =
                    "rgba(248, 113, 113, 0.1)";

                statusBadge.style.borderColor =
                    "rgba(248, 113, 113, 0.25)";

            }


            if (statusMessage) {

                statusMessage.textContent =
                    "現在Botはオフラインです";

            }

        }


        // ========================================
        // PING
        // ========================================

        if (pingElement) {

            pingElement.textContent =
                data.ping || "--";

        }


        // ========================================
        // UPTIME
        // ========================================

        if (uptimeElement) {

            uptimeElement.textContent =
                data.uptime || "--";

        }


        // ========================================
        // SERVERS
        // ========================================

        if (serversElement) {

            const serverCount =
                data.servers ?? 0;

            serversElement.textContent =
                Number(serverCount).toLocaleString();

        }


        // ========================================
        // MEMBERS
        // ========================================

        if (membersElement) {

            const memberCount =
                data.members ?? 0;

            membersElement.textContent =
                Number(memberCount).toLocaleString();

        }


        // ========================================
        // LAST UPDATED
        // ========================================

        if (updatedElement) {

            if (data.updated_at) {

                const date =
                    new Date(data.updated_at);


                updatedElement.textContent =
                    date.toLocaleString(
                        "ja-JP",
                        {
                            timeZone: "Asia/Tokyo",

                            month: "numeric",

                            day: "numeric",

                            hour: "2-digit",

                            minute: "2-digit"
                        }
                    );

            } else {

                updatedElement.textContent =
                    "--";

            }

        }


        console.log(
            "✅ Website Status Updated"
        );


    } catch (error) {

        console.error(
            "❌ ステータス取得エラー:",
            error
        );


        const statusBadge =
            document.querySelector(
                ".status-online"
            );

        const statusMessage =
            document.querySelector(
                ".status-bot-info p"
            );


        // ERROR表示
        if (statusBadge) {

            statusBadge.innerHTML = `
                <span class="status-dot offline"></span>
                ERROR
            `;

            statusBadge.style.color =
                "#f87171";

            statusBadge.style.background =
                "rgba(248, 113, 113, 0.1)";

            statusBadge.style.borderColor =
                "rgba(248, 113, 113, 0.25)";

        }


        if (statusMessage) {

            statusMessage.textContent =
                "ステータス情報を取得できませんでした";

        }

    }

}


// ========================================
// INITIAL LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // 最初に読み込み
        loadBotStatus();


        // 30秒ごとに更新
        setInterval(
            loadBotStatus,
            30000
        );

    }
);