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
// FORMAT UPTIME
// ========================================

function formatUptime(seconds) {

    if (typeof seconds === "string") {
        return seconds;
    }

    if (!seconds || seconds < 0) {
        return "--";
    }

    seconds = Math.floor(seconds);

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];

    if (days > 0) {
        parts.push(`${days}d`);
    }

    if (hours > 0 || days > 0) {
        parts.push(`${hours}h`);
    }

    if (minutes > 0 || hours > 0 || days > 0) {
        parts.push(`${minutes}m`);
    }

    parts.push(`${secs}s`);

    return parts.join(" ");

}


// ========================================
// FORMAT NUMBER
// ========================================

function formatNumber(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "--";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
        return String(value);
    }

    return number.toLocaleString();

}


// ========================================
// FORMAT PING
// ========================================

function formatPing(value) {

    if (
        value === undefined ||
        value === null
    ) {
        return "--";
    }

    return `${Math.round(Number(value))}ms`;

}


// ========================================
// FORMAT LAST UPDATED
// ========================================

function formatLastUpdated(value) {

    if (!value) {
        return "--";
    }

    try {

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "--";
        }

        return date.toLocaleString(
            "ja-JP",
            {
                timeZone: "Asia/Tokyo",

                year: "numeric",

                month: "numeric",

                day: "numeric",

                hour: "2-digit",

                minute: "2-digit",

                second: "2-digit"
            }
        );

    } catch (error) {

        console.error(
            "日時変換エラー:",
            error
        );

        return "--";

    }

}


// ========================================
// SET STATUS BADGE
// ========================================

function setStatusBadge(
    status,
    message = null
) {

    const statusBadge =
        document.querySelector(
            ".status-online"
        );

    const statusMessage =
        document.querySelector(
            ".status-bot-info p"
        );

    if (!statusBadge) return;

    const normalizedStatus =
        String(status || "OFFLINE")
            .toUpperCase();


    // ========================================
    // ONLINE
    // ========================================

    if (
        normalizedStatus === "ONLINE" ||
        normalizedStatus === "ON"
    ) {

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

        if (statusMessage) {

            statusMessage.textContent =
                message ||
                "現在正常に稼働しています";

        }

        return;

    }


    // ========================================
    // ERROR
    // ========================================

    if (
        normalizedStatus === "ERROR"
    ) {

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

        if (statusMessage) {

            statusMessage.textContent =
                message ||
                "ステータス情報を取得できませんでした";

        }

        return;

    }


    // ========================================
    // OFFLINE
    // ========================================

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

    if (statusMessage) {

        statusMessage.textContent =
            message ||
            "現在Botはオフラインです";

    }

}


// ========================================
// GET STAT ELEMENTS
// ========================================

function getStatElements() {

    const statValues =
        document.querySelectorAll(
            ".stat-value"
        );

    return {

        ping:
            statValues[0] || null,

        uptime:
            statValues[1] || null,

        servers:
            statValues[2] || null,

        members:
            statValues[3] || null,

        updated:
            statValues[4] || null

    };

}


// ========================================
// UPDATE STAT VALUES
// ========================================

function updateStatValues(data) {

    const elements =
        getStatElements();


    // Ping

    if (elements.ping) {

        elements.ping.textContent =
            formatPing(
                data.ping
            );

    }


    // Uptime

    if (elements.uptime) {

        elements.uptime.textContent =
            formatUptime(
                data.uptime
            );

    }


    // Servers

    if (elements.servers) {

        elements.servers.textContent =
            formatNumber(
                data.servers
            );

    }


    // Members
    // members または users の両方に対応

    if (elements.members) {

        const memberCount =
            data.members ??
            data.users ??
            0;

        elements.members.textContent =
            formatNumber(
                memberCount
            );

    }


    // Last Updated
    // updated_at または last_updated の両方に対応

    if (elements.updated) {

        const updatedAt =
            data.updated_at ??
            data.last_updated ??
            null;

        elements.updated.textContent =
            formatLastUpdated(
                updatedAt
            );

    }

}


// ========================================
// BOT STATUS LOADER
// ========================================

async function loadBotStatus() {

    try {

        console.log(
            "🌐 ステータスを読み込み中..."
        );


        // ========================================
        // FETCH STATUS.JSON
        // キャッシュ回避
        // ========================================

        const response =
            await fetch(
                `./status.json?t=${Date.now()}`,
                {
                    method: "GET",

                    cache: "no-store",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        // ========================================
        // HTTP ERROR CHECK
        // ========================================

        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        // ========================================
        // JSON PARSE
        // ========================================

        const data =
            await response.json();


        console.log(
            "📊 Status Data:",
            data
        );


        // ========================================
        // STATUS
        // online / ONLINE 両対応
        // ========================================

        setStatusBadge(
            data.status,
            data.message
        );


        // ========================================
        // UPDATE STATS
        // ========================================

        updateStatValues(
            data
        );


        console.log(
            "✅ Website Status Updated"
        );


    } catch (error) {

        console.error(
            "❌ ステータス取得エラー:",
            error
        );


        // ERROR STATUS

        setStatusBadge(
            "ERROR",
            "ステータス情報を取得できませんでした"
        );


        // エラー時は値を -- にする

        const elements =
            getStatElements();


        if (elements.ping) {
            elements.ping.textContent =
                "--";
        }


        if (elements.uptime) {
            elements.uptime.textContent =
                "--";
        }


        if (elements.servers) {
            elements.servers.textContent =
                "--";
        }


        if (elements.members) {
            elements.members.textContent =
                "--";
        }


        if (elements.updated) {
            elements.updated.textContent =
                "--";
        }

    }

}


// ========================================
// INITIAL LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "🚀 Website initialized"
        );


        // 最初の読み込み

        loadBotStatus();


        // ========================================
        // AUTO REFRESH
        // 30秒ごと
        // ========================================

        setInterval(
            loadBotStatus,
            30000
        );

    }
);