// ==UserScript==
// @name         Auto Fill Radio Datek
// @namespace    https://github.com/ImamHub/auto-fill
// @version      1.0.0
// @description  Otomatis mengisi form Datek di sistem WFM Telkom
// @author       Imam
// @match        https://wfm.telkom.co.id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telkom.co.id
// @updateURL    https://raw.githubusercontent.com/ImamHub/auto-fill/main/auto-fill-radio-datek.user.js
// @downloadURL  https://raw.githubusercontent.com/ImamHub/auto-fill/main/auto-fill-radio-datek.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log("🚀 Auto Fill Radio Datek aktif (versi GitHub)");

    // Cek apakah halaman WFM form aktif
    if (window.location.href.includes("inbox_ebis")) {
        console.log("🧩 Form WFM terdeteksi...");
        setTimeout(() => {
            try {
                // Contoh auto-fill field
                document.querySelector('input[name="order_id"]').value = "ORDER12345";
                document.querySelector('input[name="task"]').value = "Validasi Radio Datek";
                console.log("✅ Data berhasil diisi otomatis!");
            } catch (err) {
                console.warn("⚠️ Gagal mengisi form:", err);
            }
        }, 1500);
    }
})();
