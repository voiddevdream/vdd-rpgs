// Главная функция синхронизации списка пользователей
    async function runPlayerSync() {
        if (typeof window.CloudDB === 'undefined') {
            alert('Ошибка: Модуль CloudDB не обнаружен!');
            return;
        }

        const cfg = window.RPGSHS_FORUM_CONFIG || window.RPGSHS_CONFIG;
        if (!cfg || !cfg.user_groups || !cfg.user_groups.players) {
            alert('Ошибка: В конфиге не найдены группы игроков (user_groups.players)!');
            return;
        }

        const btn = document.getElementById('rpg-sync-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Синхронизация...';
        }

        try {
            console.log('[Sync] Начинаем сканирование игровых групп...');
            let cloudData = await window.CloudDB.readAll() || { players: {}, market: {}, bases: {} };
            let totalUpdated = 0;

            // Проходим по всем группам игроков, заданным в конфиге
            for (const group of cfg.user_groups.players) {
                if (!group.url) continue;

                console.log(`[Sync] Запрос группы ID ${group.id}: ${group.url}`);
                let response = await fetch(group.url);
                let text = await response.text();

                let parser = new DOMParser();
                let doc = parser.parseFromString(text, 'text/html');

                let userRows = doc.querySelectorAll('#userlist tr, .usertable tr, table.table tr');

                for (let i = 1; i < userRows.length; i++) {
                    let row = userRows[i];
                    let profileLink = row.querySelector('a[href*="profile.php?id="]');
                    if (!profileLink) continue;

                    let href = profileLink.getAttribute('href');
                    let idMatch = href.match(/id=(\d+)/);
                    if (!idMatch) continue;
                    let userId = idMatch[1];

                    let username = profileLink.textContent.trim();
                    let textContent = row.textContent || '';

                    // Ищем нашу статусную строку (например, fem|hms|...)
                    let statusMatch = textContent.match(/(man|fem)\|([a-z0-9]+)\|([a-z0-9]+)\|?/i);

                    if (statusMatch) {
                        let rawStatusStr = textContent.substring(textContent.indexOf(statusMatch[0]));
                        rawStatusStr = rawStatusStr.split(/[\n\r]/)[0].trim();

                        let parsedData = parseStatusString(rawStatusStr);
                        if (parsedData) {
                            cloudData.players[userId] = {
                                username: username,
                                group_id: group.id,
                                status_string: rawStatusStr,
                                parsed: parsedData,
                                updated_at: new Date().toISOString()
                            };
                            totalUpdated++;
                        }
                    }
                }
            }

            // Сохраняем объединенные данные в облако JSONBin
            let success = await window.CloudDB.saveAll(cloudData);

            if (success) {
                alert(`Синхронизация успешно завершена! Обработано персонажей: ${totalUpdated}`);
            } else {
                alert('Ошибка при сохранении синхронизированных данных в облако.');
            }

        } catch (e) {
            console.error('[Sync] Ошибка во время синхронизации:', e);
            alert('Произошла ошибка в процессе синхронизации. Подробности в консоли.');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sync"></i> Синхронизировать игроков';
            }
        }
    }
