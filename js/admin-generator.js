/**
 * =====================================================================
 *  RPGSHS — Admin Character Profile & Status Generator
 * =====================================================================
 */
(function() {
    'use strict';

    function createAdminModal() {
        if (document.getElementById('rpgshs-admin-modal')) return;

        const cfg = window.RPGSHS_CONFIG;
        if (!cfg) return console.error('[AdminModal] Конфиг RPGSHS_CONFIG не найден!');

        const modal = document.createElement('div');
        modal.id = 'rpgshs-admin-modal';
        modal.className = 'rpgshs-modal';
        modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; justify-content:center; align-items:center; font-family:sans-serif;';

        // Генерация опций для рас (subraces/categories)
        let raceOptions = '<option value="">-- Выберите расу/подрасу --</option>';
        for (const [catKey, catVal] of Object.entries(cfg.races.rce.categories)) {
            if (catVal.subraces) {
                for (const [subKey, subVal] of Object.entries(catVal.subraces)) {
                    raceOptions += `<option value="${subVal.id}">${catVal.name} / ${subVal.label} (${subKey})</option>`;
                }
            } else {
                raceOptions += `<option value="${catVal.short}">${catVal.name} (${catKey})</option>`;
            }
        }

        // Генерация опций для фракций (берем текущую тему из конфига или twd по умолчанию)
        const currentTheme = 'twd'; 
        let factionOptions = '<option value="">-- Выберите фракцию --</option>';
        const factionsObj = cfg.factions.themes[currentTheme] || {};
        for (const [fKey, fVal] of Object.entries(factionsObj)) {
            factionOptions += `<option value="${fKey}">${fVal.name}</option>`;
        }

        // Генерация сигнатур (чекбоксы)
        let sigCheckboxes = '';
        for (const [sKey, sVal] of Object.entries(cfg.signatures)) {
            const sigName = sVal.themes[currentTheme]?.name || sVal.id;
            sigCheckboxes += `<label style="display:block; margin-bottom:4px;"><input type="checkbox" name="sig" value="${sVal.id.toLowerCase()}"> ${sigName} (${sVal.id})</label>`;
        }

        // Генерация полей фракций для ввода чисел
        let factionInputs = '';
        for (const [fKey, fVal] of Object.entries(factionsObj)) {
            factionInputs += `<div style="display:flex; justify-content:space-between; margin-bottom:5px;"><span style="font-size:12px;">${fVal.name}:</span><input type="text" data-faction="${fKey}" value="0" style="width:60px; text-align:center;"></div>`;
        }

        modal.innerHTML = `
            <div style="background:#1e1e1e; color:#fff; width:600px; max-height:90vh; overflow-y:auto; padding:20px; border-radius:4px; border:1px solid #c49a45;">
                <h3 style="margin-top:0; color:#c49a45; border-bottom:1px solid #444; padding-bottom:10px;"><i class="fas fa-cogs"></i> Управление профилем и статусом RPGSHS</h3>
                
                <!-- 1. ИНФО О ПЕРСЕ -->
                <fieldset style="border:1px solid #444; padding:10px; margin-bottom:15px;">
                    <legend style="color:#c49a45; font-weight:bold;"><i class="fas fa-user"></i> 1. Инфо о персонаже (Обязательно)</legend>
                    
                    <div style="margin-bottom:10px;">
                        <label style="display:block; font-size:12px; margin-bottom:3px;">Пол:</label>
                        <select id="rpg-gender" style="width:100%; padding:5px; background:#2a2a2a; color:#fff; border:1px solid #555;">
                            <option value="man">Мужской (man)</option>
                            <option value="fem">Женский (fem)</option>
                        </select>
                    </div>

                    <div style="margin-bottom:10px;">
                        <label style="display:block; font-size:12px; margin-bottom:3px;">Раса / Подраса:</label>
                        <select id="rpg-race" style="width:100%; padding:5px; background:#2a2a2a; color:#fff; border:1px solid #555;">
                            ${raceOptions}
                        </select>
                    </div>

                    <div style="margin-bottom:10px;">
                        <label style="display:block; font-size:12px; margin-bottom:3px;">Фракция:</label>
                        <select id="rpg-faction" style="width:100%; padding:5px; background:#2a2a2a; color:#fff; border:1px solid #555;">
                            ${factionOptions}
                        </select>
                    </div>
                </fieldset>

                <!-- 2. ЭФФЕКТЫ И СТАТЫ -->
                <fieldset style="border:1px solid #444; padding:10px; margin-bottom:15px;">
                    <legend style="color:#c49a45; font-weight:bold;"><i class="fas fa-chart-bar"></i> 2. Эффекты, Статы и Навыки (± числа)</legend>
                    
                    <div style="margin-bottom:10px;">
                        <label style="font-size:12px; display:block; margin-bottom:3px;">Сигнатуры (Баффы / Дебаффы):</label>
                        <div style="background:#252525; padding:8px; border:1px solid #444; max-height:100px; overflow-y:auto;">
                            ${sigCheckboxes}
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size:12px;">
                        <div><label>Социальный счёт (scs):</label><input type="text" id="rpg-scs" value="0" style="width:100%; background:#2a2a2a; color:#fff; border:1px solid #555; padding:3px;"></div>
                        <div><label>Угроза (thr):</label><input type="text" id="rpg-thr" value="0" style="width:100%; background:#2a2a2a; color:#fff; border:1px solid #555; padding:3px;"></div>
                        <div><label>Психоз (psy):</label><input type="text" id="rpg-psy" value="0" style="width:100%; background:#2a2a2a; color:#fff; border:1px solid #555; padding:3px;"></div>
                        <div><label>Удача (lck):</label><input type="text" id="rpg-lck" value="0" style="width:100%; background:#2a2a2a; color:#fff; border:1px solid #555; padding:3px;"></div>
                        <div><label>Кредиты / Доллары (crd):</label><input type="text" id="rpg-crd" value="0" style="width:100%; background:#2a2a2a; color:#fff; border:1px solid #555; padding:3px;"></div>
                        <div><label>Ранг мастерства:</label><input type="text" id="rpg-mrk" value="0" style="width:100%; background:#2a2a2a; color:#fff; border:1px solid #555; padding:3px;"></div>
                        <div><label>Навык 1 (Чутьё - mst1):</label><input type="text" id="rpg-mst1" value="0" style="width:100%; background:#2a2a2a; color:#fff; border:1px solid #555; padding:3px;"></div>
                        <div><label>Навык 2 (Коммуникация - mst2):</label><input type="text" id="rpg-mst2" value="0" style="width:100%; background:#2a2a2a; color:#fff; border:1px solid #555; padding:3px;"></div>
                        <div><label>Навык 3 (Командная - mst3):</label><input type="text" id="rpg-mst3" value="0" style="width:100%; background:#2a2a2a; color:#fff; border:1px solid #555; padding:3px;"></div>
                        <div><label>Навык 4 (Боевое - mst4):</label><input type="text" id="rpg-mst4" value="0" style="width:100%; background:#2a2a2a; color:#fff; border:1px solid #555; padding:3px;"></div>
                    </div>
                </fieldset>

                <!-- 3. ЭФФЕКТЫ ФРАКЦИЙ -->
                <fieldset style="border:1px solid #444; padding:10px; margin-bottom:15px;">
                    <legend style="color:#c49a45; font-weight:bold;"><i class="fas fa-flag"></i> 3. Репутация фракций</legend>
                    <div id="rpg-factions-container" style="font-size:12px;">
                        ${factionInputs}
                    </div>
                </fieldset>

                <!-- РЕЗУЛЬТАТ И КНОПКИ -->
                <div style="margin-bottom:15px;">
                    <label style="font-size:12px; display:block; margin-bottom:3px;"><i class="fas fa-code"></i> Сгенерированная строка статуса:</label>
                    <input type="text" id="rpg-result-string" readonly style="width:100%; background:#111; color:#00ff00; border:1px solid #444; padding:5px; font-family:monospace;">
                </div>

                <div style="display:flex; justify-content:flex-end; gap:10px;">
                    <button id="rpg-btn-generate" style="background:#444; color:#fff; border:none; padding:8px 15px; cursor:pointer; font-weight:bold;"><i class="fas fa-sync-alt"></i> Сгенерировать</button>
                    <button id="rpg-btn-save" style="background:#c49a45; color:#000; border:none; padding:8px 15px; cursor:pointer; font-weight:bold;"><i class="fas fa-cloud-upload-alt"></i> Сохранить в облако</button>
                    <button id="rpg-btn-close" style="background:#666; color:#fff; border:none; padding:8px 15px; cursor:pointer;"><i class="fas fa-times"></i> Закрыть</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Логика кнопок
        modal.querySelector('#rpg-btn-close').onclick = () => modal.style.display = 'none';
        modal.querySelector('#rpg-btn-generate').onclick = generateStatusString;
        modal.querySelector('#rpg-btn-save').onclick = saveCharacterData;
    }

    function generateStatusString() {
        const gender = document.getElementById('rpg-gender').value;
        const race = document.getElementById('rpg-race').value;
        const faction = document.getElementById('rpg-faction').value;

        // Валидация трех обязательных полей
        if (!gender || !race || !faction) {
            alert('Ошибка: Необходимо заполнить обязательные поля: Пол, Раса и Фракция!');
            return null;
        }

        let parts = [gender, race, faction];

        // Сигнатуры
        const checkedSigs = Array.from(document.querySelectorAll('input[name="sig"]:checked')).map(cb => cb.value);
        if (checkedSigs.length > 0) parts.push(...checkedSigs);

        // Соц счет и статы
        const fields = ['scs', 'thr', 'psy', 'lck', 'crd', 'mrk', 'mst1', 'mst2', 'mst3', 'mst4'];
        fields.forEach(f => {
            const val = document.getElementById(`rpg-${f}`).value.trim();
            if (val && val !== '0') parts.push(`${f}${val}`);
        });

        // Фракции
        document.querySelectorAll('#rpg-factions-container input').forEach(input => {
            const fKey = input.dataset.faction;
            const val = input.value.trim();
            if (val && val !== '0') parts.push(`${fKey}${val}`);
        });

        const resultStr = parts.join('|');
        document.getElementById('rpg-result-string').value = resultStr;
        return resultStr;
    }

    async function saveCharacterData() {
        const statusStr = generateStatusString();
        if (!statusStr) return;

        if (typeof window.CloudDB === 'undefined') {
            alert('Ошибка: CloudDB не подключен!');
            return;
        }

        // Сохраняем в облако (пример для текущего UserID)
        let data = await window.CloudDB.readAll() || { players: {} };
        const uid = typeof UserID !== 'undefined' ? UserID : '2';

        if (!data.players[uid]) data.players[uid] = {};
        data.players[uid].status_string = statusStr;
        data.players[uid].updated_at = new Date().toISOString();

        const success = await window.CloudDB.saveAll(data);
        if (success) {
            alert('Данные успешно сохранены в облако JSONBin!');
            document.getElementById('rpgshs-admin-modal').style.display = 'none';
        } else {
            alert('Ошибка сохранения в облако.');
        }
    }

    // Глобальная функция вызова модалки
    window.openRPGAdminModal = function() {
        createAdminModal();
        document.getElementById('rpgshs-admin-modal').style.display = 'flex';
    };

})(window);
