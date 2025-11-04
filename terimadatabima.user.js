// ==UserScript==
// @name         Auto Fill Joget Form dari API (Lengkap + attr_value)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ambil data dari Laravel API lokal dan isi otomatis ke form Joget, termasuk atribut Package (ASTINet SME)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      redict.div-servo.com
// ==/UserScript==

(function() {
    const apiUrl = "https://redict.div-servo.com/api/joget-temp";

    // Fungsi bantu untuk pilih option berdasarkan teks (case-insensitive)
    function selectByText(selectEl, text) {
        if (!selectEl || !text) return;
        const options = Array.from(selectEl.options);
        const match = options.find(opt => opt.text.trim().toLowerCase() === text.trim().toLowerCase());
        if (match) {
            selectEl.value = match.value;
            selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // Ambil data dari API Laravel
    GM_xmlhttpRequest({
        method: "GET",
        url: apiUrl,
        headers: { "Content-Type": "application/json" },
        onload: function(response) {
            try {
                const data = JSON.parse(response.responseText);
                console.log("✅ Data diterima dari API:", data);

                // ---- Isi field input teks ----
                const itemCode = document.querySelector('input[name="item_code"]');
                const nameField = document.querySelector('input[name="name"]');

                if (itemCode) itemCode.value = data.item_code || '';
                if (nameField) nameField.value = data.name || '';

                // ---- Isi dropdown utama ----
                selectByText(document.querySelector('select[name="commodity_order_id"]'), data.commodity_order_id);
                selectByText(document.querySelector('select[name="commodity_regional_id"]'), data.commodity_regional_id);
                selectByText(document.querySelector('select[name="commodity_service_id"]'), data.commodity_service_id);
                selectByText(document.querySelector('select[name="commodity_task_id"]'), data.commodity_task_id);

                // ---- Cek apakah ada atribut Package ----
                const packageAttr = data.attributes?.find(attr => attr.attr_name === "Package");
                if (packageAttr) {
                    console.log("📦 Atribut Package ditemukan:", packageAttr.attr_value);
                    // Isi dropdown commodity_tservice_id berdasarkan attr_value (contoh: "ASTINet SME")
                    const serviceSelect = document.querySelector('select[name="commodity_tservice_id"]');
                    selectByText(serviceSelect, packageAttr.attr_value);
                } else {
                    console.warn("⚠️ Atribut 'Package' tidak ditemukan di data.attributes");
                }

                console.log("🎯 Form berhasil diisi otomatis.");
            } catch (e) {
                console.error("❌ Gagal parsing data JSON:", e);
            }
        },
        onerror: function(err) {
            console.error("❌ Gagal ambil data dari API:", err);
        }
    });
})();
