export const NBCASTLE = {};

NBCASTLE.abilities = {
    "shin": "NBCASTLE.AbilityShin",
    "gi": "NBCASTLE.AbilityGi",
    "tai": "NBCASTLE.AbilityTai",
    "taikyu": "NBCASTLE.AbilityTaikyu"
};

NBCASTLE.attacks = {
    "ashigaru_phalanx_rush": { name: "足軽ファランクスの乱撃", damage: "1d8", effect: "", defense: "技DR12" },
    "ashigaru_phalanx_rush_heal": { name: "足軽ファランクスの乱撃と回復", damage: "1d8", effect: "回復", defense: "技DR12" },
    "mukade_surprise": { name: "百足衆の奇襲", damage: "2d6", effect: "", defense: "技DR15" },
    "farmers_hoe": { name: "百姓から奪った鍬", damage: "1d4", effect: "", defense: "技DR12" },
    "mukade_barrage": { name: "百足衆の乱射", damage: "2d6", effect: "", defense: "技DR12" },
    "youen": { name: "妖艶", damage: "1", effect: "妖艶状態", defense: "技DR12" },
    "hitouhen": { name: "飛頭変", damage: "1d6", effect: "", defense: "技DR16" },
    "sumo": { name: "相撲", damage: "1d6", effect: "尻子玉", defense: "体DR15" },
    "kanabo": { name: "金棒", damage: "1d10", effect: "吠える声", defense: "技DR12" },
    "elephant_trunk": { name: "戦象の鼻", damage: "1d8", effect: "", defense: "技DR12" },
    "elephant_foot": { name: "戦象の足", damage: "1d12", effect: "", defense: "技DR10" },
    "elephant_curse": { name: "戦象の呪い", damage: "1d3", effect: "麻痺１ターン", defense: "耐久DR12" },
    "elephant_dance": { name: "戦象の死人踊り", damage: "特殊", effect: "足軽ファランクス召喚", defense: "常に" },
    "tea_master": { name: "黒茶頭の茶", damage: "なし", effect: "宇宙の深淵", defense: "心DR15" },
    "charge": { name: "突撃", damage: "1d10", effect: "", defense: "技DR14" },
    "great_spear": { name: "大槍", damage: "1d8", effect: "", defense: "技DR12" },
    "ghost_attack": { name: "亡霊武者の攻撃", damage: "1d6", effect: "麻痺の吐息", defense: "技DR12" },
    "cowardly_surprise": { name: "姑息な奇襲", damage: "1d8", effect: "禿ネズミの感染", defense: "心DR15" },
    "heshikiri": { name: "へし切長谷部", damage: "1d12+1", effect: "信長の攻撃", defense: "技DR15" },
    "yamainu": { name: "山犬雑兵の攻撃", damage: "1d4", effect: "槍からの感染", defense: "技DR12" },
    "kamaitachi": { name: "鎌鼬の鎌", damage: "1d4", effect: "", defense: "技DR12" },
    "dark_curse": { name: "暗黒呪い", damage: "特殊", effect: "", defense: "心DR16" },
    "claw": { name: "鉤爪", damage: "1d3", effect: "", defense: "技DR12" },
    "spear": { name: "槍", damage: "1d6", effect: "", defense: "技DR12" }, // Assumed
    "frog_kick": { name: "蛙の蹴り", damage: "1d3", effect: "蹴りによる効果", defense: "技DR12" },
    "katana": { name: "刀", damage: "1d6", effect: "", defense: "技DR12" },
    "red_tongue": { name: "赤い舌", damage: "1d4", effect: "舐めて回復", defense: "技DR12" },
    "tanegashima_monkey": { name: "大ざるの種子島銃", damage: "2d6", effect: "", defense: "技DR12" },
    "horse_bone": { name: "馬の大腿骨", damage: "1d4", effect: "", defense: "技DR12" }, // Assumed
    "boar_rush": { name: "猪の突進", damage: "1d8", effect: "", defense: "技DR12" },
    "fox_temptation": { name: "狐の誘惑", damage: "1d8", effect: "装備外し", defense: "心DR14" },
    "fox_fang": { name: "狐の牙", damage: "1d4", effect: "", defense: "技DR12" },
    "tea_kettle_bomb": { name: "茶釜爆弾", damage: "1d4", effect: "範囲", defense: "技DR12" },
    "dance_of_duality": { name: "表裏の舞", damage: "なし", effect: "舞につられる", defense: "心DR14" },
    "hiragumo": { name: "平蜘蛛", damage: "1d6", effect: "", defense: "技DR12" },
    "tanuki_explosion": { name: "狸の自爆", damage: "1d10", effect: "範囲", defense: "技DR12" },
    "zanbato": { name: "斬馬刀", damage: "1d10", effect: "", defense: "技DR12" },
    "karakuri_shuriken": { name: "からくり巴の手裏剣", damage: "1d4", effect: "", defense: "技DR12" },
    "bow": { name: "弓矢", damage: "1d6", effect: "", defense: "技DR12" },
    "yoshitsune_sword": { name: "義経流霞の太刀", damage: "1d6", effect: "", defense: "技DR14" }
};

NBCASTLE.enemies = {
    "ashigaru_phalanx": {
        name: "足軽ファランクス",
        hp: "2d6+8",
        morale: "hp", // Start morale = HP
        armor: { level: 2, reduction: "-1d2" },
        special: "",
        attacks: [
            { turn: "1", id: "ashigaru_phalanx_rush", count: 2 },
            { turn: "2", id: "ashigaru_phalanx_rush_heal", count: 1 }
        ]
    },
    "mukade_shu": {
        name: "百足衆",
        hp: "12",
        morale: "8",
        armor: { level: 2 },
        special: "",
        attacks: [
            { turn: "0", id: "mukade_surprise", count: 2 },
            { turn: "1", id: "farmers_hoe", count: 2 },
            { turn: "2", id: "mukade_barrage", count: 2 }
        ]
    },
    "rokurokubi": {
        name: "ろくろ首",
        hp: "8",
        morale: "4",
        armor: { level: 1 },
        special: "",
        attacks: [
            { turn: "1", id: "youen", count: 1 },
            { turn: "2", id: "hitouhen", count: 1 }
        ]
    },
    "kappa_suigun": {
        name: "河童水軍",
        hp: "10",
        morale: "9",
        armor: { level: 4 },
        special: "",
        attacks: [
            { turn: "1", id: "sumo", count: 1 }
        ]
    },
    "oni": {
        name: "鬼",
        hp: "30",
        morale: "damage>=10",
        armor: { level: 0, reduction: "-1d6" },
        special: "",
        attacks: [
            { turn: "1", id: "kanabo", count: 1 }
        ]
    },
    "black_elephant": {
        name: "黒母衣戦象",
        hp: "50",
        morale: "10",
        armor: { level: 4 },
        special: "",
        attacks: [
            { turn: "1", id: "elephant_trunk", count: 1 },
            { turn: "2", id: "elephant_foot", count: 1 },
            { turn: "3", id: "elephant_curse", count: 1 },
            { turn: "4", id: "elephant_dance", count: 1 }
        ]
    },
    "tea_master": {
        name: "黒茶頭",
        hp: "18",
        morale: "10",
        armor: { level: 4 },
        special: "",
        attacks: [
            { turn: "1", id: "tea_master", count: 1 }
        ]
    },
    "red_skull": {
        name: "赤母衣髑髏",
        hp: "12",
        morale: "10",
        armor: { level: 4 },
        special: "",
        attacks: [
            { turn: "0", id: "charge", count: 1 },
            { turn: "1", id: "great_spear", count: 1 }
        ]
    },
    "ghost_samurai": {
        name: "亡霊武者",
        hp: "5",
        morale: "お経を聞くと撤退",
        armor: { level: 0 },
        special: "亡霊への攻撃",
        attacks: [
            { turn: "1", id: "ghost_attack", count: 1 }
        ]
    },
    "rat_general": {
        name: "禿ネズミ武将",
        hp: "25",
        morale: "10",
        armor: { level: 4 },
        special: "",
        attacks: [
            { turn: "1", id: "cowardly_surprise", count: 1 }
        ]
    },
    "nobunaga": {
        name: "第六天魔王信長",
        hp: "108",
        morale: "none",
        armor: { level: 0, reduction: "-1d10" },
        special: "",
        attacks: [
            { turn: "1", id: "heshikiri", count: 1 }
        ]
    },
    "yamainu": {
        name: "山犬雑兵",
        hp: "4",
        morale: "7",
        armor: { level: 2 },
        special: "",
        attacks: [
            { turn: "1", id: "yamainu", count: 1 }
        ]
    },
    "kamaitachi": {
        name: "鎌鼬",
        hp: "4",
        morale: "8",
        armor: { level: 0, reduction: "-1d3" },
        special: "",
        attacks: [
            { turn: "1", id: "kamaitachi", count: 2 }
        ]
    },
    "smelly_monk": {
        name: "生臭坊主",
        hp: "3",
        morale: "none",
        armor: { level: 0 },
        special: "",
        attacks: [
            { turn: "1", id: "dark_curse", count: 1 },
            { turn: "2", id: "claw", count: 2 }
        ]
    },
    "spear_frog": {
        name: "槍かつぎのやせがえる",
        hp: "7",
        morale: "7",
        armor: { level: 2 },
        special: "",
        attacks: [
            { turn: "1", id: "spear", count: 1 },
            { turn: "2", id: "frog_kick", count: 2 }
        ]
    },
    "ashigaru_rabbit": {
        name: "足軽兎",
        hp: "3",
        morale: "1ダメで逃走",
        armor: { level: 2 },
        special: "",
        attacks: [
            { turn: "1", id: "katana", count: 1 }
        ]
    },
    "noppera": {
        name: "のっぺら荒武者",
        hp: "12",
        morale: "11",
        armor: { level: 3 },
        special: "",
        attacks: [
            { turn: "1", id: "great_spear", count: 1 },
            { turn: "2", id: "red_tongue", count: 1 }
        ]
    },
    "teppo_shojo": {
        name: "鉄砲猩々",
        hp: "10",
        morale: "9",
        armor: { level: 2 },
        special: "",
        attacks: [
            { turn: "1", id: "tanegashima_monkey", count: 1 },
            { turn: "R", id: "horse_bone", count: 1 }
        ]
    },
    "iron_boar": {
        name: "鉄騎猪",
        hp: "10",
        morale: "7",
        armor: { level: 4 },
        special: "",
        attacks: [
            { turn: "1", id: "boar_rush", count: 1 }
        ]
    },
    "kunoichi_fox": {
        name: "くのいち狐",
        hp: "10",
        morale: "7",
        armor: { level: 0, reduction: "-1d3" },
        special: "狐の躱し",
        attacks: [
            { turn: "1", id: "fox_temptation", count: 1 },
            { turn: "2", id: "fox_fang", count: 1 }
        ]
    },
    "danjo_tanuki": {
        name: "弾正狸",
        hp: "12",
        morale: "10",
        armor: { level: 3 },
        special: "",
        attacks: [
            { turn: "1", id: "tea_kettle_bomb", count: "1d4" },
            { turn: "2", id: "dance_of_duality", count: 1 },
            { turn: "3", id: "hiragumo", count: "1d6" },
            { turn: "E", id: "tanuki_explosion", count: 1 }
        ]
    },
    "karakuri_tomoe": {
        name: "からくり巴",
        hp: "15",
        morale: "12",
        armor: { level: 3 },
        special: "木製",
        attacks: [
            { turn: "1", id: "zanbato", count: 1 },
            { turn: "2", id: "katana", count: 1 },
            { turn: "3", id: "karakuri_shuriken", count: 2 }
        ]
    },
    "karasu_tengu": {
        name: "烏天狗",
        hp: "8",
        morale: "9",
        armor: { level: 0, reduction: "-1d3" },
        special: "飛翔体",
        attacks: [
            { turn: "1", id: "bow", count: 1 },
            { turn: "2", id: "yoshitsune_sword", count: 1 }
        ]
    }
};
