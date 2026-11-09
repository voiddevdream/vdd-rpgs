/**
 * =====================================================================
 *  RPG SURVIVAL HORROR SYSTEM (RPGSHS v3.2 / v4.0)
 *  Core Variables & Mechanics Configuration
 * =====================================================================
 *  @authors     Red Alice (Game Designer) & Lexi Night (Technomancer Dev)
 * =====================================================================
 */

(function(window) {
    'use strict';

    window.RPGSHS_CONFIG = {
        // =================================================================
        // 1. ИГРОВЫЕ СЕТТИНГИ (THEMES)
        // =================================================================
        themes: {
            twd: {
                id: 'twd',
                name: 'The Walking Dead: Origins',
                setting: 'Лонг-Айленд, 2014 г. Постапокалипсис, зомби-вирус, патронная экономика.',
                currency: 'Патронные доллары',
                currency_short: 'КР'
            },
            wfr: {
                id: 'wfr',
                name: 'Warframe: Whisper of the Void',
                setting: 'Хёльвания, 1999 г. Постсоветский техно-готический сеттинг, чума Техноцит.',
                currency: 'Кредиты',
                currency_short: 'КР'
            }
        },

        // =================================================================
        // 2. БАЗОВЫЕ ИНДЕКСЫ АКТИВНОСТИ (ACTIVITY INDICES)
        // =================================================================
        indices: {
            eng: {
                id: 'eng',
                name: 'engagement',
                label: 'Вовлечённость',
                desc: 'Эмоциональная и смысловая вовлеченность игрока в посты.',
                calculate: function(user_positive, user_posts) {
                    return Math.max(1, user_positive) / Math.max(1, user_posts);
                }
            },
            soc: {
                id: 'soc',
                name: 'sociability',
                label: 'Общительность',
                desc: 'Социальная интеграция и авторитет среди соигроков.',
                calculate: function(user_respect, user_posts) {
                    return Math.max(1, user_respect) / Math.max(1, user_posts);
                }
            },
            knd: {
                id: 'knd',
                name: 'kindness',
                label: 'Доброжелательность',
                desc: 'Индекс альтруизма и позитивного отклика.',
                calculate: function(user_positive, user_respect) {
                    return Math.max(1, user_positive) / Math.max(1, user_respect);
                }
            }
        },

        // =================================================================
        // 3. ОСНОВНЫЕ ХАРАКТЕРИСТИКИ ПЕРСОНАЖА (STATS)
        // =================================================================
        stats: {
            thr: {
                id: 'thr',
                name: 'threat',
                short: 'thr',
                label: 'Угроза', // Общее базовое название
                themes: {
                    twd: { name: 'Инфицирование', name_en: 'infestation' },
                    wfr: { name: 'Заражение', name_en: 'infection' }
                },
                min: 0,
                max: 100,
                calculate: function(posts, eng, soc, knd) {
                    let val = (posts / 10) + (eng * 3) + (soc * 2) - (knd * 5);
                    return Math.min(100, Math.max(0, Math.round(val)));
                }
            },
            psy: {
                id: 'psy',
                name: 'psychosis',
                short: 'psy',
                label: 'Психоз', // Общее базовое название
                themes: {
                    twd: { name: 'Дикость', name_en: 'feralism' },
                    wfr: { name: 'Шёпот', name_en: 'whisper' }
                },
                min: 0,
                max: 100,
                calculate: function(eng, soc, knd) {
                    let val = 50 - (knd * 10) - (soc * 5) + (eng * 5);
                    return Math.min(100, Math.max(0, Math.round(val)));
                }
            },
            lck: {
                id: 'lck',
                name: 'luck',
                short: 'lck',
                label: 'Удача', // Общее базовое название
                themes: {
                    twd: { name: 'Удача', name_en: 'luck' },
                    wfr: { name: 'Везение', name_en: 'luck' }
                },
                min: 0,
                max: 100,
                calculate: function(soc, knd, psy) {
                    let val = 50 + (soc * 3) + (knd * 5) - (psy * 0.5);
                    return Math.min(100, Math.max(0, Math.round(val)));
                }
            },
            crd: {
                id: 'crd',
                name: 'credits',
                short: 'crd',
                label: 'Кредиты', // Общее базовое название
                themes: {
                    twd: { name: 'Патронные доллары', name_en: 'bullet_dollars' },
                    wfr: { name: 'Кредиты', name_en: 'credits' }
                },
                min: 0,
                max: Infinity,
                calculate: function(eng, soc, knd) {
                    let val = (soc * 50) + (eng * 20) - (knd * 30);
                    return Math.max(0, Math.round(val));
                }
            }
        },

        // =================================================================
        // 4. НАВЫКИ МАСТЕРСТВА (MASTERY SKILLS)
        // =================================================================
        mastery: {
            mst1: {
                id: 'mst1',
                key: 'primary',
                short: 'mst1',
                name: 'Первый навык (Чутьё)',
                max: 30
            },
            mst2: {
                id: 'mst2',
                key: 'secondary',
                short: 'mst2',
                name: 'Второй навык (Коммуникация)',
                max: 30
            },
            mst3: {
                id: 'mst3',
                key: 'utility',
                short: 'mst3',
                name: 'Третий навык (Командная работа)',
                max: 30
            },
            mst4: {
                id: 'mst4',
                key: 'special',
                short: 'mst4',
                name: 'Четвёртый навык (Боевое ремесло)',
                max: 30
            },
            calculate_rank: function(m1, m2, m3, m4, sig_penalties = 0) {
                let baseRank = Math.min(m1, m2, m3, m4);
                return Math.max(0, baseRank - sig_penalties);
            }
        },

        // =================================================================
        // 5. РАСЫ И МЕХАНИКА ПРЕВРАЩЕНИЙ (RACES & TRANSFORMATIONS)
        // =================================================================
        races: {
            rce: {
                id: 'rce',
                name: 'race',
                categories: {
                    human: {
                        id: 'human',
                        short: 'hm',
                        name: 'Обычный человек',
                        subraces: {
                            hmo: {
                                id: 'hmo',
                                name_internal: 'orthodox',
                                label: 'Обычный человек без особенностей',
                                themes: {
                                    twd: { name: 'Выживший', id: 'survivor' },
                                    wfr: { name: 'Гражданский', id: 'civilian' }
                                }
                            },
                            hmh: {
                                id: 'hmh',
                                name_internal: 'healthy',
                                label: 'Человек, не заражённый вирусом',
                                themes: {
                                    twd: { name: 'Незаражённый', id: 'uninfected' },
                                    wfr: { name: 'Оператор', id: 'operator' }
                                }
                            },
                            hme: {
                                id: 'hme',
                                name_internal: 'exceptional',
                                label: 'Человек с выдающимися особенностями',
                                themes: {
                                    twd: { name: 'Вектор', id: 'vector' },
                                    wfr: { name: 'Скиталец', id: 'drifter' }
                                }
                            }
                        }
                    },
                    superman: {
                        id: 'superman',
                        short: 'hms',
                        name: 'Человек с особыми силами',
                        themes: {
                            twd: { name: 'Резистент', id: 'resistant' },
                            wfr: { name: 'Протофрейм', id: 'protoframe' }
                        }
                    },
                    anomal: {
                        id: 'anomal',
                        short: 'anm',
                        name: 'Аномальные',
                        themes: {
                            twd: { name: 'Мутант', id: 'mutant' },
                            wfr: { name: 'Умбрафрейм', id: 'umbraframe' }
                        }
                    },
                    monster: {
                        id: 'monster',
                        short: 'mns',
                        name: 'Чудовище',
                        themes: {
                            twd: { name: 'Ходячий', id: 'walker' },
                            wfr: { name: 'Варфрейм', id: 'warframe' }
                        }
                    },
                    inhuman: {
                        id: 'inhuman',
                        short: 'ihm',
                        name: 'Не человек',
                        themes: {
                            twd: { name: 'Зомби', id: 'zombie' },
                            wfr: { name: 'Техрот', id: 'techrot' }
                        }
                    }
                },
                // Правила трансформаций расы на основе thr и psy
                transform: function(current_race, thr, psy) {
                    if (current_race === 'human') {
                        if (thr >= 100 && psy < 50) return 'superman';
                        if (thr >= 100 && psy >= 50) return 'monster';
                    }
                    if (current_race === 'superman') {
                        if (thr >= 100 && psy < 75) return 'anomal';
                        if (thr >= 100 && psy >= 75) return 'monster';
                    }
                    if (current_race === 'anomal') {
                        if (thr >= 100 && psy >= 75) return 'monster';
                    }
                    if (current_race === 'monster') {
                        if (thr >= 100) return 'inhuman'; // По истечении 30 дней
                    }
                    return current_race;
                }
            }
        },

        // =================================================================
        // 6. СИГНАТУРЫ (SIGNATURES)
        // =================================================================
        signatures: {
            lkb: {
                id: 'LUCKBOT',
                short: 'lkb',
                type: 'buff',
                themes: {
                    twd: { name: 'Fortuna Subreptio (Воровская удача)' },
                    wfr: { name: 'SYS_LUCK_BOOT.OVR (Загрузка удачи)' }
                },
                checkCondition: function(lck, knd) {
                    return lck >= 60 && knd <= 0.8;
                }
            },
            vrv: {
                id: 'VIRVACC',
                short: 'vrv',
                type: 'buff',
                themes: {
                    twd: { name: 'Immunitas Viralis (Вакцинация)' },
                    wfr: { name: 'VIR_VACCINE.EXE (Вакцинация)' }
                },
                checkCondition: function(thr, lck) {
                    return thr >= 40 && thr <= 80 && lck >= 50;
                }
            },
            cdr: {
                id: 'CACHODR',
                short: 'cdr',
                type: 'buff',
                themes: {
                    twd: { name: 'Fortuna Excessiva (Невероятное везение)' },
                    wfr: { name: 'CACHE_OVERDRIVE (Перезагрузка кэша)' }
                },
                checkCondition: function(crd, soc) {
                    return crd <= 500 && soc >= 1.2;
                }
            },
            scm: {
                id: 'SOCMIMC',
                short: 'scm',
                type: 'buff',
                themes: {
                    twd: { name: 'Custodia Firma (Надёжное хранилище)' },
                    wfr: { name: 'SOCIAL_MIMICRON (Мимикрон)' }
                },
                checkCondition: function(soc, knd) {
                    return soc >= 1.5 && knd >= 1.0;
                }
            },
            qtm: {
                id: 'QUANTUM',
                short: 'qtm',
                type: 'buff',
                themes: {
                    twd: { name: 'Quaesitor Felix (Удачливый искатель)' },
                    wfr: { name: 'QUANTUM_MAGNET (Магнит добычи)' }
                },
                checkCondition: function(eng, lck) {
                    return eng >= 1.5 && lck >= 50;
                }
            },
            erb: {
                id: 'ERRFUMB',
                short: 'erb',
                type: 'debuff',
                themes: {
                    twd: { name: 'Tempus Infelix (Неудачная пора)' },
                    wfr: { name: 'ERR_FUMBLE_0x7A (Код: промах)' }
                },
                checkCondition: function(lck, psy) {
                    return lck <= 25 && psy >= 70;
                }
            },
            osh: {
                id: 'OSHAEMO',
                short: 'osh',
                type: 'debuff',
                themes: {
                    twd: { name: 'Febris Haemorrhagica (Лихорадка)' },
                    wfr: { name: 'OS_HAEMO_FEVER (Геморрагическая лихорадка)' }
                },
                checkCondition: function(thr, crd) {
                    return thr >= 70 && crd <= 200;
                }
            },
            ecc: {
                id: 'ECONCOL',
                short: 'ecc',
                type: 'debuff',
                themes: {
                    twd: { name: 'Paupertas (Разорение)' },
                    wfr: { name: 'ECON_COLLAPSE (Коллапс экономики)' }
                },
                checkCondition: function(crd, knd) {
                    return crd <= 100 && knd <= 0.7;
                }
            },
            cdb: {
                id: 'CORPDBT',
                short: 'cdb',
                type: 'debuff',
                themes: {
                    twd: { name: 'Vinculum Debitoris (Всеобщий должник)' },
                    wfr: { name: 'CORP_DEBT_SHACKLE (Долговые кандалы)' }
                },
                checkCondition: function(soc, knd) {
                    return soc <= 0.6 && knd <= 0.7;
                }
            },
            cth: {
                id: 'CREATHL',
                short: 'cth',
                type: 'debuff',
                themes: {
                    twd: { name: 'Maledictus (Абсолютный неудачник)' },
                    wfr: { name: 'CRIT_HEAT_LEVEL (Критический перегрев)' }
                },
                checkCondition: function(lck, psy) {
                    return lck <= 15 && psy >= 80;
                }
            }
        },

        // =================================================================
        // 7. СОЦИАЛЬНЫЕ СТАТУСЫ (SOCIAL STATUSES)
        // =================================================================
        social_statuses: {
            variable: 'social_score',
            short: 'scs',
            bounds: { min: -100, max: 100 },
            levels: [
                {
                    max: -60,
                    name: 'Хищник',
                    short: 'st_prd',
                    icon: 'fa-skull',
                    color: '#1a1a1a',
                    desc: 'В этом человеке преобладает тьма. В каждом видит добычу или угрозу. Опасен для всех без исключения.'
                },
                {
                    max: -30,
                    name: 'Шакал',
                    short: 'st_jck',
                    icon: 'fa-crosshairs',
                    color: '#4a2e2e',
                    desc: 'Тьма в нём сильнее света. Идёт по головам, пока это выгодно, и оборачивается против тех, кто повернулся спиной. Стоит опасаться.'
                },
                {
                    max: -10,
                    name: 'Тень',
                    short: 'st_shd',
                    icon: 'fa-ghost',
                    color: '#5c5c6e',
                    desc: 'Холоден и нелюдим. Слова из него не вытянешь, а взгляд будто проходит сквозь тебя. Не будит приязни — но и злобы не будит. Просто держись в стороне.'
                },
                {
                    max: 9,
                    name: 'Путник',
                    short: 'st_trv',
                    icon: 'fa-compass',
                    color: '#9e9e9e',
                    desc: 'Свет и тьма в нём уравновешены. Ровен со всеми — ни тепла, ни холода. Поможет, если попросишь, но сам не подойдёт. Ничего не ждёт и ничего не обещает. Идёт своей дорогой — и ты иди своей.'
                },
                {
                    max: 29,
                    name: 'Соратник',
                    short: 'st_cmp',
                    icon: 'fa-handshake',
                    color: '#c9a227',
                    desc: 'Свет в нём преобладает. Открыт к другим, первым протягивает руку и делится последним. Вызывает симпатию.'
                },
                {
                    max: 59,
                    name: 'Хранитель',
                    short: 'st_grd',
                    icon: 'fa-shield-halved',
                    color: '#e67e22',
                    desc: 'Яркий, но с тенью. Заботится о своих, но помнит, что мир жесток, и не боится испачкать руки. Добро с ложкой тьмы.'
                },
                {
                    max: null,
                    name: 'Маяк',
                    short: 'st_bcn',
                    icon: 'fa-sun',
                    color: '#f1c40f',
                    desc: 'Абсолютный свет. К нему тянутся, как к огню в темноте, — согреться и переждать ночь. На такого можно положиться.'
                }
            ],
            getStatus: function(score) {
                for (let lvl of this.levels) {
                    if (lvl.max !== null && score <= lvl.max) return lvl;
                }
                return this.levels[this.levels.length - 1];
            }
        },

        // =================================================================
        // 8. ФРАКЦИИ И ДОВЕРИЕ (FACTIONS & REPUTATION)
        // =================================================================
        factions: {
            rep_variable: 'faction_rep',
            short: 'fcr',
            bounds: { min: -30, max: 30 },
            themes: {
                wfr: {
                    fop: { id: 'militia', name: 'Ополчение', short: 'fop', boss: 'Сестра', boss_gender: 'f' },
                    fsk: { id: 'skaldra', name: 'Скальдра', short: 'fsk', boss: 'Чистильщик', boss_gender: 'm' },
                    fut: { id: 'outsiders', name: 'Аутсайдеры', short: 'fut', boss: 'Цербер', boss_gender: 'm' },
                    fnw: { id: 'nightwave', name: 'Ночная волна', short: 'fnw', boss: null }
                },
                twd: {
                    fna: { id: 'new_america', name: 'Нью-Америка', short: 'fna', boss: 'Палач', boss_gender: 'm' },
                    ffm: { id: 'farmers', name: 'Фермеры', short: 'ffm', boss: null },
                    fsh: { id: 'shinnecock', name: 'Шиннекок', short: 'fsh', boss: null },
                    fmr: { id: 'marauders', name: 'Мародёры', short: 'fmr', boss: null },
                    fgh: { id: 'ghosts', name: 'Призраки', short: 'fgh', boss: null },
                    fvr: { id: 'vargas', name: 'Семья Варгас', short: 'fvr', boss: null, type: 'merchant' }
                }
            }
        }
    };

})(window);
