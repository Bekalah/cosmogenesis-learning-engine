import os, json

# cycle traditions
traditions = [
    "solomonic","agrippa","avalon","mary_magdalene","alchemy","alpha_et_omega",
    "tibetan","gnostic","egyptian","slavic","hilma_atelier","reiki_grid",
    "planetary_hours","watchtowers"
]

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
mmh_rooms_root = os.path.join(repo_root, "magical-mystery-house", "rooms")
la_root = os.path.join(repo_root, "liber-arcanae")

# ensure base directories
for path in [mmh_rooms_root,
             os.path.join(la_root, "cards"),
             os.path.join(la_root, "companions"),
             os.path.join(la_root, "artifacts"),
             os.path.join(la_root, "scripts", "abilities"),
             os.path.join(la_root, "ui")]:
    os.makedirs(path, exist_ok=True)

special_names = {
    1: "Threshold",
    2: "Veil Chamber",
    3: "Empress Garden",
    4: "Emperor's Axis",
    5: "Alchemical Table",
    7: "Chariot Station (Tesseract Dock)",
    8: "Strength Grove",
    9: "Hermit Lantern",
    10: "Wheel Hall",
    12: "Zodiac Cross Annex",
    13: "Death Gate (Calm Passage)",
    14: "Temperance Well",
    15: "Alchemical Nuptiae",
    16: "Tower Observatory",
    17: "Star Basin",
    18: "Moon Pool",
    19: "Sun Atrium",
    20: "Justice Balance",
    21: "World Gate",
    23: "Hierophant Choir"
}

# helpers

def anchor_constants(num):
    anchors = [144]
    mapping = {11:11,12:12,33:33,72:72,78:78,99:99}
    if num in mapping:
        anchors.append(mapping[num])
    return anchors

def traditions_for(num, idx):
    tags = [traditions[idx % len(traditions)]]
    if num % 12 == 0:
        tags.append("zodiac")
    if num % 9 == 0:
        tags.append("serpent_path")
    return tags

def shrine_nodes_for(num):
    if num == 11: return ["ascii_figure_1"]
    if num == 12: return ["ascii_figure_2"]
    if num == 99: return ["ascii_figure_0"]
    return []

# generate rooms
for i in range(1,145):
    room_id = f"R{i:03d}"
    room_dir = os.path.join(mmh_rooms_root, room_id)
    os.makedirs(room_dir, exist_ok=True)
    for sub in ["artifacts","npc","audio","notes"]:
        os.makedirs(os.path.join(room_dir, sub), exist_ok=True)

    manifest = {
        "id": room_id,
        "name": special_names.get(i, f"Room {i:03d}"),
        "num": i,
        "tradition": traditions_for(i, i-1),
        "anchor_constants": anchor_constants(i),
        "shrine_nodes": shrine_nodes_for(i),
        "altar_sockets": ["altar_center","lectern"],
        "portals": [],
        "calm_mode": True,
        "locked": False,
        "provenance": {"generated":"auto"}
    }
    scene = {
        "glb_bundle": [],
        "materials": "Haute-Grimoire-PBR-01",
        "environment_hdr": "temple_soft_01.hdr",
        "camera_defaults": {"speed":1,"fov":60,"sensitivity":0.5},
        "accessibility": {"reduce_motion":True,"high_contrast":False,"captions":True},
        "lighting": {"ibl_intensity":1,"key_fill_ratio":0.8,"no_hard_strobe":True}
    }
    sockets = [
        {"name":"altar_center","position":[0,0,0],"rotation":[0,0,0],"accepts":["artifact_id","card_id","constant"],"onPlace":[]},
        {"name":"lectern","position":[1,0,0],"rotation":[0,0,0],"accepts":["card_id"],"onPlace":[]},
        {"name":"wall_north","position":[0,0,-1],"rotation":[0,0,0],"accepts":["artifact_id"],"onPlace":[]}
    ]
    # default portals: to previous and next room
    portals = []
    if i > 1:
        portals.append({"name":f"to_R{i-1:03d}","to_room":f"R{i-1:03d}","requires_constant":None,"requires_card":None,"visual_gate_state":"closed"})
    if i < 144:
        portals.append({"name":f"to_R{i+1:03d}","to_room":f"R{i+1:03d}","requires_constant":None,"requires_card":None,"visual_gate_state":"closed"})
    # special gating examples
    if i == 1:
        portals.append({"name":"to_R011","to_room":"R011","requires_constant":11,"requires_card":None,"visual_gate_state":"closed"})
    if i == 12:
        portals.append({"name":"to_R020","to_room":"R020","requires_constant":None,"requires_card":"MA11_Justice","visual_gate_state":"closed"})
    if i == 12:
        portals.append({"name":"to_R099","to_room":"R099","requires_constant":None,"requires_card":"Any_Ace","visual_gate_state":"closed"})

    # write files
    with open(os.path.join(room_dir,"manifest.json"),"w",encoding="utf-8") as f:
        json.dump(manifest,f,ensure_ascii=False,indent=2)
        f.write("\n")
    with open(os.path.join(room_dir,"scene.json"),"w",encoding="utf-8") as f:
        json.dump(scene,f,ensure_ascii=False,indent=2)
        f.write("\n")
    with open(os.path.join(room_dir,"sockets.json"),"w",encoding="utf-8") as f:
        json.dump(sockets,f,ensure_ascii=False,indent=2)
        f.write("\n")
    with open(os.path.join(room_dir,"portals.json"),"w",encoding="utf-8") as f:
        json.dump(portals,f,ensure_ascii=False,indent=2)
        f.write("\n")

# ---- liber-arcanae cards ----

majors = [
    ("MA00_Fool","The Fool",0),
    ("MA01_Magician","The Magician",1),
    ("MA02_High_Priestess","The High Priestess",2),
    ("MA03_Empress","The Empress",3),
    ("MA04_Emperor","The Emperor",4),
    ("MA05_Hierophant","The Hierophant",5),
    ("MA06_Lovers","The Lovers",6),
    ("MA07_Chariot","The Chariot",7),
    ("MA08_Strength","Strength",8),
    ("MA09_Hermit","The Hermit",9),
    ("MA10_Wheel_of_Fortune","Wheel of Fortune",10),
    ("MA11_Justice","Justice",11),
    ("MA12_Hanged_Man","The Hanged Man",12),
    ("MA13_Death","Death",13),
    ("MA14_Temperance","Temperance",14),
    ("MA15_Devil","The Devil",15),
    ("MA16_Tower","The Tower",16),
    ("MA17_Star","The Star",17),
    ("MA18_Moon","The Moon",18),
    ("MA19_Sun","The Sun",19),
    ("MA20_Judgement","Judgement",20),
    ("MA21_World","The World",21)
]

# artifacts mapping for selected majors
major_artifacts = {
    "MA00_Fool": ["white_rose","staff","satchel","cliff_token"],
    "MA01_Magician": ["wand","cup","sword","pentacle","lemniscate_token"],
    "MA02_High_Priestess": ["scroll_TORA","lunar_crescent","veil_pomegranates"],
    "MA06_Lovers": ["alchemical_glass","cupid_token","twin_flame_crystal"],
    "MA10_Wheel_of_Fortune": ["wheel_mechanism","sphinx_token","alchemical_books"]
}

suits = ["Wands","Cups","Swords","Pentacles"]

for cid,title,num in majors:
    data = {
        "id": cid,
        "title": title,
        "arcana": "Major",
        "suit": None,
        "number": num,
        "court": None,
        "qabalistic_path": "",
        "sephira": None,
        "planet": "",
        "zodiac": "",
        "element": "",
        "colour_scales": {"King":"","Queen":"","Emperor":"","Empress":""},
        "seed_syllables": [],
        "daemon_echoes": [],
        "consecration_angels": [],
        "artifacts": major_artifacts.get(cid, []),
        "abilities": [],
        "companions": {"npc": cid + "_npc"},
        "rituals": [],
        "interactions": ["inspect","attune","place_on_altar","combine","harmonize"],
        "playable": True,
        "locked": True,
        "provenance": {"generated":"auto"}
    }
    path = os.path.join(la_root, "cards", cid + ".json")
    with open(path,"w",encoding="utf-8") as f:
        json.dump(data,f,ensure_ascii=False,indent=2)
        f.write("\n")
    companion = {
        "id": cid + "_companion",
        "behavior": {
            "idle_near_player": True,
            "offer_hint": True,
            "safe_follow": True
        },
        "hint_caption": "the colour wishes to breathe toward emerald"
    }
    with open(os.path.join(la_root,"companions",cid + ".json"),"w",encoding="utf-8") as f:
        json.dump(companion,f,ensure_ascii=False,indent=2)
        f.write("\n")

# generate minor cards
for suit in suits:
    for num in range(1,11):
        cid = f"{suit[:1]}{num:02d}_{suit}"  # e.g., W01_Wands
        data = {
            "id": cid,
            "title": f"{num} of {suit}",
            "arcana": "Minor",
            "suit": suit,
            "number": num,
            "court": None,
            "qabalistic_path": "",
            "sephira": None,
            "planet": "",
            "zodiac": "",
            "element": "",
            "colour_scales": {"King":"","Queen":"","Emperor":"","Empress":""},
            "seed_syllables": [],
            "daemon_echoes": [],
            "consecration_angels": [],
            "artifacts": [],
            "abilities": [],
            "companions": {"npc": cid + "_npc"},
            "rituals": [],
            "interactions": ["inspect","attune","place_on_altar"],
            "playable": True,
            "locked": True,
            "provenance": {"generated":"auto"}
        }
        with open(os.path.join(la_root,"cards",cid + ".json"),"w",encoding="utf-8") as f:
            json.dump(data,f,ensure_ascii=False,indent=2)
            f.write("\n")
        companion = {
            "id": cid + "_companion",
            "behavior": {
                "idle_near_player": True,
                "offer_hint": True,
                "safe_follow": True
            },
            "hint_caption": "the colour wishes to breathe toward emerald"
        }
        with open(os.path.join(la_root,"companions",cid + ".json"),"w",encoding="utf-8") as f:
            json.dump(companion,f,ensure_ascii=False,indent=2)
            f.write("\n")
    # court cards
    for court in ["Page","Knight","Queen","King"]:
        cid = f"{suit[:1]}{court}_{suit}"  # e.g., WPage_Wands
        data = {
            "id": cid,
            "title": f"{court} of {suit}",
            "arcana": "Minor",
            "suit": suit,
            "number": None,
            "court": court,
            "qabalistic_path": "",
            "sephira": None,
            "planet": "",
            "zodiac": "",
            "element": "",
            "colour_scales": {"King":"","Queen":"","Emperor":"","Empress":""},
            "seed_syllables": [],
            "daemon_echoes": [],
            "consecration_angels": [],
            "artifacts": [],
            "abilities": [],
            "companions": {"npc": cid + "_npc"},
            "rituals": [],
            "interactions": ["inspect","attune","place_on_altar"],
            "playable": True,
            "locked": True,
            "provenance": {"generated":"auto"}
        }
        with open(os.path.join(la_root,"cards",cid + ".json"),"w",encoding="utf-8") as f:
            json.dump(data,f,ensure_ascii=False,indent=2)
            f.write("\n")
        companion = {
            "id": cid + "_companion",
            "behavior": {
                "idle_near_player": True,
                "offer_hint": True,
                "safe_follow": True
            },
            "hint_caption": "the colour wishes to breathe toward emerald"
        }
        with open(os.path.join(la_root,"companions",cid + ".json"),"w",encoding="utf-8") as f:
            json.dump(companion,f,ensure_ascii=False,indent=2)
            f.write("\n")

print("generated")
