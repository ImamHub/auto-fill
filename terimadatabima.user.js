// ==UserScript==
// @name         Kirim Data WorkOrder ke Laravel (Lengkap + Atribut)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Scrape data Joget + atribut WorkOrder lalu kirim ke Laravel API
// @match        https://wfm.telkom.co.id/jw/web/userview/new_wfm/v/_*
// @connect      redict.div-servo.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    /** =============================
     *  Utility Functions
     *  ============================= */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

     function extractItemCode(fullValue) {
        // Contoh input: "2-2544247948_2-9PLB2C_2-9PM47L_DELIVER"
        // Ambil hanya bagian pertama sebelum tanda underscore "_"
        if (!fullValue) return '';
        const parts = fullValue.split('_');
        return parts[0] || '';
    }

    /** =============================
     *  Main Scraping Function
     *  ============================= */
    async function collectAndSendData() {
        await delay(4000); // tunggu form Joget terbuka penuh

        const rawItemCode = document.querySelector('#parent_form_1_EBIS_form_workorder_scorderno')?.value || '';

        // 🔹 Ambil data utama
        const data = {
            item_code: extractItemCode(rawItemCode),
            commodity_order_id: document.querySelector('#parent_form_1_EBIS_form_workorder_crmordertype')?.value || '',
            commodity_regional_id: document.querySelector('#parent_form_1_EBIS_form_workorder_siteid')?.value || '',
            commodity_service_id: document.querySelector('#parent_form_1_EBIS_form_workorder_productname')?.value || '',
            commodity_task_id: document.querySelector('#parent_form_1_EBIS_form_workorder_description')?.value || '',
            name: document.querySelector('#parent_form_1_EBIS_form_workorder_customer_name')?.value || '',
            attributes: []
        };

        // 🔹 Ambil data atribut dari tabel grid-row
        const rows = document.querySelectorAll('tr.grid-row');
        rows.forEach(row => {
            const wonum = row.querySelector('[column_key="wonum"]')?.innerText.trim();
            const attrName = row.querySelector('[column_key="attr_name"]')?.innerText.trim();
            const attrValue = row.querySelector('[column_key="attr_value"]')?.innerText.trim();

            if (attrName && attrValue) {
                data.attributes.push({
                    wonum: wonum || data.item_code,
                    attr_name: attrName,
                    attr_value: attrValue
                });
            }
        });

        console.log('⭐ Data lengkap siap dikirim:', data);
        console.table(data.attributes);

        if (!data.item_code) {
            alert('❌ Work Order kosong, pastikan halaman sudah termuat penuh.');
            return;
        }

        // 🔹 Kirim ke Laravel API
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://redict.div-servo.com/api/joget-temp',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: JSON.stringify(data),
            onload: function (response) {
                console.log('✅ Respons Laravel:', response);
                alert('✅ Data Order berhasil dikirim ke Redict.');
            },
            onerror: function (err) {
                console.error('❌ Gagal kirim data:', err);
                alert('❌ Tidak dapat mengirim data ke Redict.');
            }
        });
    }

    /** =============================
     *  Keyboard Shortcut (Ctrl + K)
     *  ============================= */
    document.addEventListener('keydown', async (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            console.log('⌛ Mengambil data WorkOrder...');
            await collectAndSendData();
        }
    });

    console.log('%c🚀 Script Tampermonkey aktif! Tekan CTRL + K untuk kirim data ke Laravel.', 'color: lime; font-weight: bold;');
})();
