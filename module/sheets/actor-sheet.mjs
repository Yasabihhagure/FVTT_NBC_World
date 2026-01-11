/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class NobunagaActorSheet extends ActorSheet {

    /** @override */
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["nobunaga", "sheet", "actor"],
            template: "systems/nobunaga-black-castle/templates/actor/actor-character-sheet.hbs",
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    /** @override */
    get template() {
        return `systems/nobunaga-black-castle/templates/actor/actor-${this.actor.type}-sheet.hbs`;
    }

    /** @override */
    getData() {
        // Retrieve the data structure from the base sheet. You can inspect or log in the console
        // the value returned by this method to see what data is available to the sheet.
        const context = super.getData();

        // Use a safe clone of the actor data for further operations.
        const actorData = context.actor;

        // Add the actor's data to context.data for easier access, as well as flags.
        context.system = actorData.system;
        context.flags = actorData.flags;

        // Prepare character data and items.
        if (actorData.type == 'character') {
            this._prepareCharacterData(context);
        } else if (actorData.type == 'npc') {
            this._prepareNpcData(context);
        }

        return context;
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} context The actor to prepare.
     *
     * @return {undefined}
     */
    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} context The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareCharacterData(context) {
        // Handle Ability Labels
        for (let [k, v] of Object.entries(context.system.attributes)) {
            v.label = game.i18n.localize(CONFIG.NBCASTLE?.abilities?.[k] ?? k.toUpperCase());
        }
    }

    /**
     * Prepare data for NPC sheets.
     * @param {Object} context The actor to prepare.
     */
    _prepareNpcData(context) {
        context.config = CONFIG.NBCASTLE;

        // Dynamic Morale Link
        if (context.actor.flags?.nobunaga?.moraleLink) {
            context.system.morale.value = context.system.health.value;
        }

        // Prepare attacks for display
        const attacks = context.system.cycle?.attacks || [];
        const currentTurn = context.system.cycle?.current || 1;

        context.attacks = attacks.map(a => {
            const attackData = CONFIG.NBCASTLE.attacks[a.id] || { name: a.id, damage: "?", effect: "?" };
            return {
                ...a,
                name: attackData.name,
                damage: attackData.damage,
                effect: attackData.effect,
                active: parseInt(a.turn) === currentTurn || (isNaN(parseInt(a.turn)) && a.turn === "E") // Simple active check
            };
        });
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        // ... existing listeners ...

        // Create simple character
        html.find('.auto-create').click(this._onAutoCreate.bind(this));

        // NPC Preset Selection
        html.find('.npc-preset-select').change(this._onNpcPresetChange.bind(this));

        // Cycle Turn Change
        html.find('.cycle-change').click(this._onCycleChange.bind(this));

        // NPC Creation Count Change
        html.find('.count-change').click(this._onCountChange.bind(this));

        // Morale Check
        html.find('.morale-check').click(this._onMoraleRoll.bind(this));

        // Group Morale Check
        html.find('.group-morale-check').click(this._onGroupMoraleRoll.bind(this));
    }

    /**
     * Handle Group Morale Check
     * @param {Event} event
     * @private
     */
    async _onGroupMoraleRoll(event) {
        event.preventDefault();
        console.log("Nobunaga | _onGroupMoraleRoll started");

        // 1. Identify Group
        // Strategy: 
        // Strict: Must be in a Folder.

        const folder = this.actor.folder;
        if (!folder) {
            ui.notifications.warn(game.i18n.localize("NBCASTLE.ErrorNoFolder"));
            // Need to add this key to lang files or use hardcoded string for now
            console.warn("Nobunaga | Group Morale Check requires the Actor to be in a Folder.");
            return;
        }

        const groupMethod = "Folder";

        // Assume group membership based on base name (just for logging/display)
        const baseName = this.actor.name.replace(/[\s\d]+$/, "").trim();
        console.log(`Nobunaga | Grouping Method: ${groupMethod} | Folder: ${folder.name} (${folder.id})`);

        // Find all tokens in current scene that match
        let scene = null;
        if (this.actor.isToken && this.actor.token?.parent) {
            scene = this.actor.token.parent;
        } else {
            scene = canvas.scene;
            if (!scene && game.user.viewedScene) {
                scene = game.scenes.get(game.user.viewedScene);
            }
            if (!scene) {
                scene = game.scenes.active;
            }
        }

        if (!scene) {
            console.error("Nobunaga | Group Morale Check Failed: No scene found.", {
                isToken: this.actor.isToken,
                canvasScene: canvas.scene,
                viewedSceneId: game.user.viewedScene
            });
            ui.notifications.warn("シーンが見つかりません。グループ士気チェックを行うには、シーンを作成して開いた状態で、トークンを配置してください。");
            return;
        }

        console.log(`Nobunaga | Checking Scene: ${scene.name} (ID: ${scene.id})`);

        // Handle V10+ Collection vs Array
        const allTokens = scene.tokens;
        console.log(`Nobunaga | Total Tokens in scene: ${allTokens.size || allTokens.length}`);

        const tokens = (allTokens.contents || allTokens).filter(t => {
            const actor = t.actor;
            if (!actor) return false;

            // Folder Check (Strict)
            // Check if target actor is in the same folder
            const targetFolder = actor.folder;
            return targetFolder && (targetFolder.id === folder.id);
        });

        console.log(`Nobunaga | Matched Tokens count: ${tokens.length}`);

        if (tokens.length === 0) {
            ui.notifications.warn(game.i18n.localize("NBCASTLE.ErrorNoGroupMembers")); // Ensure this key exists or use fallback
            console.warn("Nobunaga | No group members found. Check naming convention.");
            return;
        }

        // 2. Aggregate Status
        const total = tokens.length;
        const livingTokens = tokens.filter(t => {
            const hp = t.actor?.system?.health?.value;
            const isAlive = hp > 0;
            console.log(`Nobunaga | Token ${t.name}: HP=${hp} Alive=${isAlive}`);
            return isAlive;
        });
        const livingCount = livingTokens.length;
        const deadCount = total - livingCount;

        console.log(`Nobunaga | Stat: Total=${total}, Living=${livingCount}, Dead=${deadCount}`);

        // Check for Leader death
        const leaderDefeated = tokens.some(t => {
            const isLeader = t.actor?.system?.attributes?.leader === true;
            const hp = t.actor?.system?.health?.value;
            const isDead = hp <= 0;
            console.log(`Nobunaga | Leader Check '${t.name}': LeaderFlag=${isLeader}, HP=${hp}, Defeated=${isLeader && isDead}`);
            return isLeader && isDead;
        });

        // 3. Check Conditions
        let conditionMet = false;
        let reasons = [];

        console.log(`Nobunaga | Condition Check Start. LeaderDefeated=${leaderDefeated}, DeadCount=${deadCount}, Total/2=${total / 2}`);

        // Condition A: Leader Defeated
        if (leaderDefeated) {
            conditionMet = true;
            reasons.push(game.i18n.localize("NBCASTLE.ConditionLeaderDefeated"));
        }

        // Condition B: > 50% Defeated
        // "Members > 50% disabled" -> Dead >= Total / 2 ? Or Dead > Total / 2 ?
        // Request says "half or more" usually implies >=, but let's stick to "half or more (>=)" or "more than half (>)"?
        // User said: "half or more... unavailable" -> >= 50%
        if (deadCount >= total / 2) {
            conditionMet = true;
            reasons.push(game.i18n.localize("NBCASTLE.ConditionHalfDefeated"));
        }

        // Condition C: Solo and < 1/3 HP
        if (livingCount === 1 && total === 1) { // total=1 means "only 1 in group" (start solo or last survivor?)
            // Requirement: "Only 1 body in group" -> implies started as group of 1? Or implies "Only 1 survivor"?
            // Reading request: "same group only 1 body... HP < 1/3"
            // Let's interpret as "livingCount == 1" regardless of starting size? No, request says "Same group has only 1 entity".
            // If it meant "Last survivor", it would be covered by "Half Defeated" usually.
            // Let's assume this applies to Single Monsters.

            const actor = livingTokens[0].actor;
            const max = actor.system.health.max;
            const value = actor.system.health.value;
            // 1/3 or less
            if (value <= max / 3) {
                conditionMet = true;
                reasons.push(game.i18n.localize("NBCASTLE.ConditionSoloLowHP"));
            }
        }

        // 4. Execute
        if (conditionMet) {
            let chatContent = `<h2>${game.i18n.localize("NBCASTLE.GroupMoraleCheck")}</h2>`;
            chatContent += `<p><strong>${game.i18n.localize("NBCASTLE.MoraleCheckTarget")}: ${baseName}</strong></p>`;
            chatContent += `<ul>`;
            for (let r of reasons) {
                chatContent += `<li>${r}</li>`;
            }
            chatContent += `</ul><hr>`;

            // Roll for each survivor
            for (let t of livingTokens) {
                const actor = t.actor;
                const moraleValue = actor.system.morale.value;
                const moraleInt = parseInt(moraleValue);

                // Display Name Logic: Use Token Name, fallback to Actor Name if generic
                let displayName = t.name;
                if (displayName === "キャラクター" || displayName === "Character") {
                    displayName = actor.name;
                }

                if (!isNaN(moraleInt)) {
                    const roll = await new Roll("2d6").evaluate();
                    const totalRoll = roll.total;

                    let resultText = "";
                    let resultColor = "";

                    if (totalRoll >= moraleInt) {
                        // Failure
                        resultColor = "red";
                        const resRoll = await new Roll("1d6").evaluate();
                        if (resRoll.total <= 3) resultText = `${game.i18n.localize("NBCASTLE.MoraleCheckFailure")} -> ${game.i18n.localize("NBCASTLE.MoraleCheckFlee")}`;
                        else resultText = `${game.i18n.localize("NBCASTLE.MoraleCheckFailure")} -> ${game.i18n.localize("NBCASTLE.MoraleCheckSurrender")}`;
                    } else {
                        // Success
                        resultColor = "green";
                        resultText = game.i18n.localize("NBCASTLE.MoraleCheckSuccess");
                    }

                    chatContent += `<div style="margin-bottom: 5px;">
                        <strong>${displayName}</strong> (Morale: ${moraleInt}): 
                        <span style="color: ${resultColor}; font-weight: bold;">${totalRoll}</span> - ${resultText}
                      </div>`;

                } else {
                    chatContent += `<div><strong>${displayName}</strong>: ${moraleValue}</div>`;
                }
            }

            ChatMessage.create({
                user: game.user.id,
                content: chatContent
            });

        } else {
            ui.notifications.info(game.i18n.localize("NBCASTLE.ConditionNotMet"));
        }
    }

    /**
     * Handle Morale Check
     * @param {Event} event
     * @private
     */
    async _onMoraleRoll(event) {
        event.preventDefault();

        const moraleValue = this.actor.system.morale.value;
        const moraleInt = parseInt(moraleValue);

        // If numeric, roll 2d6 against it
        if (!isNaN(moraleInt)) {
            const roll = await new Roll("2d6").evaluate();
            const total = roll.total;

            let message = `<h2>${game.i18n.localize("NBCASTLE.MoraleCheck")}</h2>`;
            message += `<p>${game.i18n.localize("NBCASTLE.MoraleCheckTarget")}: ${moraleInt}</p>`;
            message += `<p>${game.i18n.localize("NBCASTLE.MoraleCheckRoll")}: ${total} (${roll.formula})</p>`;

            if (total >= moraleInt) {
                // Failure (Morale Broken)
                message += `<div style="color: red; font-weight: bold;">${game.i18n.localize("NBCASTLE.MoraleCheckFailure")}</div>`;

                // Roll 1d6 for Result
                const resultRoll = await new Roll("1d6").evaluate();
                message += `<hr><p>${game.i18n.localize("NBCASTLE.MoraleCheckResult")}: ${resultRoll.total}</p>`;

                if (resultRoll.total <= 3) {
                    message += `<div style="font-weight: bold;">${game.i18n.localize("NBCASTLE.MoraleCheckFlee")}</div>`;
                } else {
                    message += `<div style="font-weight: bold;">${game.i18n.localize("NBCASTLE.MoraleCheckSurrender")}</div>`;
                }

            } else {
                // Success (Morale Maintained)
                message += `<div style="color: green; font-weight: bold;">${game.i18n.localize("NBCASTLE.MoraleCheckSuccess")}</div>`;
            }

            ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                content: message
            });
        } else {
            // Text condition
            let message = `<h2>${game.i18n.localize("NBCASTLE.MoraleCheck")}</h2>`;
            message += `<p>${game.i18n.localize("NBCASTLE.MoraleCheckTarget")}: ${moraleValue}</p>`;
            ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                content: message
            });
        }
    }

    /**
     * Handle NPC Creation Count change buttons
     * @param {Event} event
     * @private
     */
    async _onCountChange(event) {
        event.preventDefault();
        const action = event.currentTarget.dataset.action;
        const input = this.element.find('.npc-create-count');
        let value = parseInt(input.val()) || 1;

        if (action === "plus") value = Math.min(10, value + 1);
        else if (action === "minus") value = Math.max(1, value - 1);

        input.val(value);
    }

    /**
     * Handle Cycle Turn change buttons
     * @param {Event} event
     * @private
     */
    async _onCycleChange(event) {
        event.preventDefault();
        const action = event.currentTarget.dataset.action;
        let current = this.actor.system.cycle.current || 1;

        // Get available numeric turns
        const attacks = this.actor.system.cycle.attacks || [];
        const turns = attacks.map(a => parseInt(a.turn)).filter(t => !isNaN(t));

        if (turns.length > 0) {
            const min = Math.min(...turns);
            const max = Math.max(...turns);

            if (action === "next") {
                current++;
                if (current > max) current = min;
            } else if (action === "prev") {
                current--;
                if (current < min) current = max;
            }
        } else {
            // Fallback if no specific turns found
            if (action === "next") current++;
            else if (action === "prev") current = Math.max(1, current - 1);
        }

        await this.actor.update({ "system.cycle.current": current });
    }

    /**
     * Handle auto-creation of simple character (attributes and HP)
     * @param {Event} event The originating click event
     * @private
     */
    async _onAutoCreate(event) {
        event.preventDefault();

        // Helper to roll 3d6 and convert to attribute value based on table
        // 1-4: -3, 5-6: -2, 7-8: -1, 9-12: 0, 13-14: +1, 15-16: +2, 17-18: +3
        const rollAttribute = async () => {
            const roll = await new Roll("3d6").evaluate();
            const total = roll.total;
            if (total <= 4) return -3;
            if (total <= 6) return -2;
            if (total <= 8) return -1;
            if (total <= 12) return 0;
            if (total <= 14) return 1;
            if (total <= 16) return 2;
            return 3;
        };

        const shin = await rollAttribute();
        const gi = await rollAttribute();
        const tai = await rollAttribute();
        const taikyu = await rollAttribute();

        // HP = 1d8 + Taikyu (min 1)
        const hpRoll = await new Roll("1d8").evaluate();
        const hpMax = Math.max(1, hpRoll.total + taikyu);

        await this.actor.update({
            "system.attributes.shin.value": shin,
            "system.attributes.gi.value": gi,
            "system.attributes.tai.value": tai,
            "system.attributes.taikyu.value": taikyu,
            "system.health.max": hpMax,
            "system.health.value": hpMax
        });
    }

    /**
     * Handle NPC Preset selection
     * @param {Event} event
     * @private
     */
    async _onNpcPresetChange(event) {
        event.preventDefault();
        const key = event.target.value;
        if (!key) return;

        const preset = CONFIG.NBCASTLE.enemies[key];
        if (!preset) return;

        // Roll HP
        let hpMax = 0;
        if (typeof preset.hp === 'string' && preset.hp.includes('d')) {
            const roll = await new Roll(preset.hp).evaluate();
            hpMax = roll.total;
        } else {
            hpMax = parseInt(preset.hp) || 1;
        }

        // Determine Morale
        let morale = preset.morale;
        let moraleLink = false;
        if (morale === "hp") {
            morale = hpMax;
            moraleLink = true;
        }

        // Determine Armor Reduction
        let reduction = preset.armor.reduction || "";
        if (!reduction) {
            const level = preset.armor.level || 0;
            switch (level) {
                case 1: reduction = "-1d2"; break;
                case 2: reduction = "-1d3"; break;
                case 3: reduction = "-1d4"; break;
                case 4: reduction = "-1d6"; break;
                default: reduction = "";
            }
        }

        // Generate Description
        let description = "";

        // Special Rules (Enemy level)
        if (preset.special) {
            description += `<p><strong>特別ルール:</strong> ${preset.special}</p>`;
        }

        // Special Morale
        if (typeof morale === "string" && morale !== "hp") {
            description += `<p><strong>士気:</strong> ${morale}</p>`;
        }

        // List Attacks details
        if (preset.attacks && preset.attacks.length > 0) {
            description += `<h3>攻撃の詳細</h3><ul>`;
            for (let a of preset.attacks) {
                const attackKey = a.id;
                const attackData = CONFIG.NBCASTLE.attacks[attackKey];
                if (attackData) {
                    description += `<li><strong>${attackData.name}</strong>`;

                    // Check for special Hit Check (not 技DR12)
                    if (attackData.defense && attackData.defense !== "技DR12") {
                        description += ` (被命中: ${attackData.defense})`;
                    }

                    // Check for special Effect
                    if (attackData.effect) {
                        description += ` - 効果: ${attackData.effect}`;
                    }

                    // Custom damage note if "special" (though config usually says "特殊")
                    if (attackData.damage === "特殊" || attackData.damage === "なし") {
                        description += ` (ダメージ: ${attackData.damage})`;
                    }

                    description += `</li>`;
                }
            }
            description += `</ul>`;
        }

        // Create additional actors if count > 1
        const countInput = this.element.find('.npc-create-count');
        const count = Math.max(1, parseInt(countInput.val()) || 1);

        // Prepare data for the current actor
        let name = preset.name;
        if (count > 1) {
            name = `${preset.name} 1`;
        }

        const updateData = {
            "name": name,
            "system.biography": description, // Set generated description
            "system.health.max": hpMax,
            "system.health.value": hpMax,
            "system.morale.value": morale, // String or Number
            "system.armor.level": preset.armor.level || 0,
            "system.armor.reduction": reduction,
            "system.cycle.attacks": preset.attacks || [],
            "flags.nobunaga.moraleLink": moraleLink
        };

        await this.actor.update(updateData);

        // Create clones
        if (count > 1) {
            const clones = [];
            for (let i = 2; i <= count; i++) {
                // Reroll HP for each clone
                let cloneHp = 0;
                if (typeof preset.hp === 'string' && preset.hp.includes('d')) {
                    const roll = await new Roll(preset.hp).evaluate();
                    cloneHp = roll.total;
                } else {
                    cloneHp = parseInt(preset.hp) || 1;
                }

                let cloneMorale = preset.morale;
                if (cloneMorale === "hp") cloneMorale = cloneHp;

                const cloneData = {
                    name: `${preset.name} ${i}`,
                    type: "npc",
                    img: this.actor.img,
                    folder: this.actor.folder,
                    flags: { nobunaga: { moraleLink: moraleLink } },
                    system: {
                        biography: description,
                        health: { value: cloneHp, max: cloneHp },
                        morale: { value: cloneMorale },
                        armor: {
                            level: preset.armor.level || 0,
                            reduction: reduction
                        },
                        cycle: {
                            attacks: preset.attacks || [],
                            current: 1 // Default start cycle
                        },
                        attributes: this.actor.system.attributes // Clone attributes if needed, or default
                    }
                };
                clones.push(cloneData);
            }

            if (clones.length > 0) {
                await Actor.createDocuments(clones);
                ui.notifications.info(`${clones.length} bodies created.`);
            }
        }
    }
}
