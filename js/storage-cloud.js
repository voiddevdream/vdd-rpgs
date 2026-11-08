/**
 * =====================================================================
 *  RPG SURVIVAL HORROR SYSTEM - Cloud Storage & Backup Manager
 *  Connected to JSONBin.io (Bin ID: 6af0ab46ffd5d16053b165f0)
 * =====================================================================
 */
(function() {
    'use strict';

    const BIN_ID = '6af0ab46ffd5d16053b165f0';
    const API_KEY = '$2a$10$.S3vyXBVdPkrLWwAo2tQ7O45JFHjT0yeQfIPZ06.XbiS3S5OJFMuW';
    const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

    window.CloudDB = {
        // Чтение всей динамической базы из облака
        async readAll() {
            try {
                let res = await fetch(BASE_URL + '/latest', {
                    headers: { 'X-Master-Key': API_KEY }
                });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                let json = await res.json();
                return json.record || { players: {}, market: {}, bases: {}, trade_sessions: {}, dice_sessions: {} };
            } catch (e) {
                console.error('[CloudDB] Ошибка чтения базы из облака:', e);
                return null;
            }
        },

        // Запись всей базы в облако (с заменой)
        async saveAll(data) {
            try {
                let res = await fetch(BASE_URL, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': API_KEY
                    },
                    body: JSON.stringify(data)
                });
                return res.ok;
            } catch (e) {
                console.error('[CloudDB] Ошибка сохранения базы в облако:', e);
                return false;
            }
        },

        // Автоматическое создание бэкапа (скачивание JSON-файла на ПК)
        async createBackup() {
            const data = await this.readAll();
            if (!data) return;
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `twd_cloud_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('[CloudDB] Резервная копия базы успешно сформирована и сохранена!');
        }
    };

    // Суточный авто-бэкап для администратора (UserID === 2)
    if (typeof UserID !== 'undefined' && Number(UserID) === 2) {
        const lastBackup = localStorage.getItem('twd_last_cloud_backup');
        const today = new Date().toISOString().split('T')[0];
        if (lastBackup !== today) {
            setTimeout(async () => {
                await window.CloudDB.createBackup();
                localStorage.setItem('twd_last_cloud_backup', today);
            }, 4000);
        }
    }

    console.log('%c[CloudDB] Облачный менеджер данных успешно инициализирован!', 'color: #4CAF50; font-weight: bold;');
})(window);
