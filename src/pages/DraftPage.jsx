import {useState, useEffect} from "react";
import "../styles/draft.css";
import "../js/draft.js";
import {ref, set, onValue} from "firebase/database";
import {db} from "../firebase";
import {useSearchParams} from "react-router-dom";

export default function DraftPage() {

    const draftOrder = [
        "team1", //1
        "team2", //2
        "team1", //3
        "team2", //4
        "team2", //5
        "team1", //6
        "team2", //7
        "team1", //8
        "team2", //9
        "team1", //10
        "team1", //11
        "team2", //12
        "team2", //13
        "team1", //14
        "team1", //15
        "team2", //16
        "team2", //17
        "team1", //18
        "team1", //19
        "team2"  //20
    ];
    const [searchParams] = useSearchParams();
    const role = searchParams.get("role");
    const isAdmin = role === "host";
    const [lcSearch, setLcSearch] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showLCModal, setShowLCModal] = useState(false);
    const [selectedLC, setSelectedLC] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [lightcones, setLightcones] = useState([]);
    const [draft, setDraft] = useState([]);

    const nextPickIndex = draft.length;
    const currentTurn = draftOrder[nextPickIndex];

    const canPick =
        isAdmin ||
        (role === "team1" && currentTurn === "team1") ||
        (role === "team2" && currentTurn === "team2");
    const isSlot2Banned = draft.length > 1;
    const roomID = searchParams.get("room");


    const params = new URLSearchParams(window.location.search);

    const team1 = params.get("team1");
    const team2 = params.get("team2");



    const [search, setSearch] = useState("");

    const [team1FirstHalf, setTeam1FirstHalf] = useState(0);
    const [team1SecondHalf, setTeam1SecondHalf] = useState(0);
    const [team1Deaths, setTeam1Deaths] = useState(0);
    const [team1Penalty, setTeam1Penalty] = useState(0);

    const [team2FirstHalf, setTeam2FirstHalf] = useState(0);
    const [team2SecondHalf, setTeam2SecondHalf] = useState(0);
    const [team2Deaths, setTeam2Deaths] = useState(0);
    const [team2Penalty, setTeam2Penalty] = useState(0);

    const [timerData, setTimerData] = useState(null);
    useEffect(() => {

        const timerRef = ref(db, "rooms/" + roomID + "/timer");

        onValue(timerRef, (snapshot) => {

            const data = snapshot.val();

            if (!data) {

                const defaultTimer = {
                    activeTeam: "team1",
                    team1: {
                        reserve: 600,
                        penalty: 0
                    },
                    team2: {
                        reserve: 600,
                        penalty: 0
                    }
                };

                set(timerRef, defaultTimer);

            }

        }, { onlyOnce: true });

    }, [roomID]);
    const formatTime = (sec) => {

        const m = Math.floor(sec / 60);
        const s = sec % 60;

        return `${m}:${s.toString().padStart(2,"0")}`;

    };

    useEffect(() => {

        const timerRef = ref(db, "rooms/" + roomID + "/timer");

        onValue(timerRef, (snapshot) => {

            const data = snapshot.val();

            if (data) {
                setTimerData(data);
            }

        });

    }, [roomID]);

    useEffect(() => {

        if (!isAdmin || !timerData || !isSlot2Banned) return;

        // ❗ nếu draft đã đủ 20 thì dừng timer
        if (draft.length >= 20) return;

        const timerRef = ref(db, "rooms/" + roomID + "/timer");

        const interval = setInterval(() => {

            // nếu đủ 20 thì dừng luôn
            if (draft.length >= 20) return;

            let newTimer = {...timerData};

            if (newTimer.activeTeam === "team1") {

                if (newTimer.team1.reserve > 0) {
                    newTimer.team1.reserve -= 1;
                } else {
                    newTimer.team1.penalty += 1;
                }

            } else {

                if (newTimer.team2.reserve > 0) {
                    newTimer.team2.reserve -= 1;
                } else {
                    newTimer.team2.penalty += 1;
                }

            }

            set(timerRef, newTimer);

        }, 1000);

        return () => clearInterval(interval);

    }, [timerData, isAdmin, isSlot2Banned, draft.length]);

    // LOAD JSON
    useEffect(() => {

        const loadData = async () => {

            const charRes = await fetch("/data/characters.json");
            const charData = await charRes.json();
            setCharacters(charData);

            const lcRes = await fetch("/data/lightcones.json");
            const lcData = await lcRes.json();
            setLightcones(lcData);

        };

        loadData();

    }, []);

    // REALTIME FIREBASE
    useEffect(() => {

        const draftRef = ref(db, "rooms/" + roomID + "/draft");

        onValue(draftRef, (snapshot) => {

            const data = snapshot.val();

            if (data) {
                setDraft(data);
            } else {
                setDraft([]);
            }

        });

    }, [roomID]);



    const switchTurn = () => {
        if (draft.length >= 19) return;

        const nextIndex = draft.length + 1;

        if(nextIndex >= draftOrder.length) return;

        const nextTeam = draftOrder[nextIndex];

        const timerRef = ref(db, "rooms/" + roomID + "/timer");

        set(timerRef,{
            ...timerData,
            activeTeam: nextTeam
        });

    };

    const openLCModal = (index) => {

        const char = draft[index];

        if (!char) return;

        if (banSlots.includes(index)) return;

        setSelectedSlot(index);
        setSelectedLC(null);
        setShowLCModal(true);

    };
    const changeSuperimposition = (index, value) => {
        const newDraft = [...draft];
        newDraft[index].superimposition = value;
        saveDraft(newDraft);
    };
    const confirmLC = () => {

        if (selectedSlot === null || !selectedLC) return;

        const newDraft = [...draft];

        if (selectedLC.lightConeName === "none") {
            newDraft[selectedSlot].lightCone = null;
            newDraft[selectedSlot].lightConeImage = null;
            newDraft[selectedSlot].superimposition = null;
        } else {
            newDraft[selectedSlot].lightCone = selectedLC;
            newDraft[selectedSlot].lightConeImage = selectedLC.imageUrl;
            newDraft[selectedSlot].superimposition = "S1";
        }
        saveDraft(newDraft);

        setShowLCModal(false);
    };

    // SAVE FIREBASE
    const saveDraft = (data) => {
        set(ref(db, "rooms/" + roomID + "/draft"), data);
    };

    // PICK CHARACTER
    const pickCharacter = (character) => {
        if (!canPick) return;
        if (draft.find(c => c.characterName === character.characterName)) return;

        if (draft.length >= 20) return;

        const picked = {
            characterName: character.characterName,
            imageFull: character.imageFull,
            rarity: character.rarity,
            pointE0: character.E0,
            pointE1: character.E1,
            pointE2: character.E2,
            pointE3: character.E3,
            pointE4: character.E4,
            pointE5: character.E5,
            pointE6: character.E6,

            eidolon: "E0"
        };

        const newDraft = [...draft, picked];

        saveDraft(newDraft);
        switchTurn();
    };

//Function đổi Eidolon
    const changeEidolon = (index, value) => {

        const newDraft = [...draft];

        newDraft[index].eidolon = value;

        saveDraft(newDraft);
    };



    // RESET
    const resetDraft = () => {

        saveDraft([]);

        const timerRef = ref(db, "rooms/" + roomID + "/timer");

        set(timerRef,{
            activeTeam:"team1",
            team1:{reserve:600,penalty:0},
            team2:{reserve:600,penalty:0}
        });

    };
    const filteredCharacters = characters.filter((c) =>
        c.characterName.toLowerCase().includes(search.toLowerCase())
    );

    const calculateTeamScore = (slots) => {

        let total = 0;

        slots.forEach((s) => {

            // ❌ bỏ slot ban
            if (banSlots.includes(s.index)) return;

            const char = draft[s.index];

            if (!char) return;

            const charPoint = char["point" + char.eidolon] || 0;

            const lcPoint =
                char.lightCone && char.superimposition
                    ? char.lightCone[char.superimposition] || 0
                    : 0;

            total += charPoint + lcPoint;

        });

        return total;

    };



    // SLOT RENDER
    const renderSlot = (index) => {

        const char = draft[index];

        if (!char) return null;

        const isBan = banSlots.includes(index);

        const bgColor =
            char.rarity === 5
                ? "#e6b741"
                : "#9b59b6";
        const point = char["point" + char.eidolon];
        const lcPoint =
            char.lightCone && char.superimposition
                ? char.lightCone[char.superimposition] || 0
                : 0;
        return (
            <div

                style={{
                    width: "100%",
                    height: "100%",
                    background: bgColor,
                    borderRadius: "10px",
                    overflow: "hidden",
                    position: "relative",
                    filter: isBan ? "grayscale(100%) brightness(100%)" : "none"
                }}
            >
                <img
                    src={char.imageFull}
                    alt={char.characterName}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                />
                {char.lightConeImage && (
                    <img
                        src={char.lightConeImage}
                        alt="LC"
                        style={{
                            position: "absolute",
                            bottom: "3px",
                            left: "3px",
                            width: "50px",
                            height: "70px",
                            borderRadius: "5px",
                            border: "2px solid black"
                        }}
                    />
                )}
                {char.lightCone && (
                    <div
                        style={{
                            position:"absolute",
                            bottom:"6px",
                            right:"6px",
                            background:"rgba(0,0,0,0.7)",
                            color:"#ffd700",
                            fontSize:"13px",
                            padding:"1px 5px",
                            borderRadius:"4px",
                            width:"35px",
                            textAlign:"center"
                        }}
                    >
                        {lcPoint}
                    </div>
                )}
                {char.lightConeImage && !isBan && (
                    <select
                        value={char.superimposition || "S1"}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => changeSuperimposition(index, e.target.value)}
                        style={{
                            position:"absolute",
                            bottom:"30px",
                            right:"5px",
                            width:"36px",
                            height:"22px",
                            fontSize:"12px",
                            borderRadius:"4px"
                        }}
                    >
                        <option>S1</option>
                        <option>S2</option>
                        <option>S3</option>
                        <option>S4</option>
                        <option>S5</option>
                    </select>
                )}
                {/* SELECT EIDOLON */}
                {!isBan && (
                    <select
                        value={char.eidolon}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => changeEidolon(index, e.target.value)}
                        style={{
                            position: "absolute",
                            top: "2px",
                            left: "2px",
                            fontSize: "14px",
                            borderRadius: "5px",
                            width: "55px",
                            height: "24px",
                            textAlign: "center"
                        }}
                    >
                        <option>E0</option>
                        <option>E1</option>
                        <option>E2</option>
                        <option>E3</option>
                        <option>E4</option>
                        <option>E5</option>
                        <option>E6</option>
                    </select>
                )}
                {/* POINT */}
                {!isBan && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "172.5px",
                            top: "3px",
                            right: "4px",
                            background: "rgba(0,0,0,0.6)",
                            color: "white",
                            fontSize: "14px",
                            padding: "1px 5px",
                            borderRadius: "4px",
                            width: "35px",
                            textAlign: "center"
                        }}
                    >
                        {point.toFixed(1)}
                    </div>
                )}
            </div>
        );
    };

    const banSlots = [0, 1, 6, 7];

    const team1Slots = [
        {cls: "slot slot-1", index: 0},
        {cls: "slot-half pick-slot-3", index: 2},
        {cls: "slot-half pick-slot-6", index: 5},
        {cls: "slot slot-8", index: 7},
        {cls: "slot-half pick-slot-10", index: 9},
        {cls: "slot-half pick-slot-11", index: 10},
        {cls: "slot-half pick-slot-14", index: 13},
        {cls: "slot-half pick-slot-15", index: 14},
        {cls: "slot-half pick-slot-18", index: 17},
        {cls: "slot-half pick-slot-19", index: 18}
    ];

    const team2Slots = [
        {cls: "slot slot-2", index: 1},
        {cls: "slot-half pick-slot-4", index: 3},
        {cls: "slot-half pick-slot-5", index: 4},
        {cls: "slot slot-7", index: 6},
        {cls: "slot-half pick-slot-9", index: 8},
        {cls: "slot-half pick-slot-12", index: 11},
        {cls: "slot-half pick-slot-13", index: 12},
        {cls: "slot-half pick-slot-16", index: 15},
        {cls: "slot-half pick-slot-17", index: 16},
        {cls: "slot-half pick-slot-20", index: 19}
    ];
    const team1Score = calculateTeamScore(team1Slots);
    const team2Score = calculateTeamScore(team2Slots);

    const team1BasePoint = (team1Score - 30) / 5;
    const team2BasePoint = (team2Score - 30) / 5;

    const team1Extra =
        Number(team1FirstHalf) +
        Number(team1SecondHalf) +
        Number(team1Deaths) +
        Number(team1Penalty);

    const team2Extra =
        Number(team2FirstHalf) +
        Number(team2SecondHalf) +
        Number(team2Deaths) +
        Number(team2Penalty);

    const team1TotalPoint = team1BasePoint + team1Extra;
    const team2TotalPoint = team2BasePoint + team2Extra;

    const undoPick = () => {

        if (draft.length === 0) return;

        const newDraft = draft.slice(0,-1);

        saveDraft(newDraft);

        const team = draftOrder[newDraft.length];

        const timerRef = ref(db,"rooms/"+roomID+"/timer");

        set(timerRef,{
            ...timerData,
            activeTeam: team
        });

    };

    const filteredLC = lightcones.filter(lc =>
        lc.characterName.toLowerCase().includes(lcSearch.toLowerCase())
    );
    return (
        <div>
            {/* toàn bộ code draft của bạn */}

            {showLCModal && (

                <div
                    className="lc-modal"
                    onClick={() => setShowLCModal(false)}   // click ngoài sẽ đóng
                >

                    <div
                        className="lc-box"
                        onClick={(e) => e.stopPropagation()} // ngăn click bên trong đóng
                    >

                        <h3>Select Lightcone</h3>
                        <input
                            className="lc-search"
                            placeholder="Search lightcone..."
                            value={lcSearch}
                            onChange={(e) => setLcSearch(e.target.value)}
                        />
                        <div className="lc-grid">
                            <div
                                className={`lc-tile blank ${selectedLC?.lightConeName === "none" ? "active" : ""}`}
                                onClick={() => setSelectedLC({ lightConeName: "none", imageUrl: "" })}
                            >
                                <p>None</p>
                            </div>
                            {filteredLC.map((lc, i) => (

                                <div
                                    key={i}
                                    className={`lc-tile ${selectedLC?.lightConeName === lc.lightConeName ? "active" : ""}`}
                                    onClick={() => setSelectedLC(lc)}
                                >

                                    <img src={lc.imageUrl} />

                                    <p>{lc.characterName}</p>

                                </div>

                            ))}

                        </div>

                        <div className="lc-buttons">

                            <button onClick={() => setShowLCModal(false)}>
                                Cancel
                            </button>

                            <button onClick={confirmLC}>
                                Confirm
                            </button>

                        </div>

                    </div>

                </div>

            )}
            <div className="draft-container">

                {/* TEAM 1 SCORE */}
                <div className="team-section">

                    <div className="score-panel">

                        <h2>{team1}</h2>

                        <p>Total cost:
                            <span>{team1Score.toFixed(1)}</span>
                        </p>

                        <label>First Half Cycle:</label>
                        <input
                            type="number"
                            value={team1FirstHalf}
                            onChange={(e)=>setTeam1FirstHalf(e.target.value)}
                        />

                        <label>Second Half Cycle:</label>
                        <input
                            type="number"
                            value={team1SecondHalf}
                            onChange={(e)=>setTeam1SecondHalf(e.target.value)}
                        />

                        <label>Deaths:</label>
                        <input
                            type="number"
                            value={team1Deaths}
                            onChange={(e)=>setTeam1Deaths(e.target.value)}
                        />

                        <label>Time penalty:</label>
                        <input
                            type="number"
                            value={team1Penalty}
                            onChange={(e)=>setTeam1Penalty(e.target.value)}
                        />

                        <p>Total Point:
                            <span>{team1TotalPoint.toFixed(4)}</span>
                        </p>

                    </div>

                </div>


                {/* CENTER PICK AREA */}

                <div className="team-slots-center">

                    {/* TEAM 1 SLOT */}

                    <div className="team-col">

                        <div className="team-top-row">

                            <div className={`team-header blue ${timerData?.activeTeam === "team1"?"active-turn":""}`}>
                                {team1}
                            </div>

                            <div className="team-times">


                                <div className="time-box">
                                    <div className="label">Reserve</div>
                                    <div className="value">
                                        {formatTime(timerData?.team1?.reserve ?? 0)}
                                    </div>
                                </div>

                                <div className="time-box">
                                    <div className="label">Penalty</div>
                                    <div className="value">
                                        {formatTime(timerData?.team1?.penalty ?? 0)}
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="team-slots">
                            <div className="slot-row">

                                {team1Slots.map((s, i) => (
                                    <div
                                        key={i}
                                        className={`${s.cls} ${nextPickIndex === s.index ? "blink-slot" : ""}`}
                                        onClick={() => openLCModal(s.index)}
                                    >
                                        {renderSlot(s.index)}
                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>


                    {/* WINNER */}

                    <div className="winner-container">
                        <div className="winner">
                            <div className="label"></div>
                        </div>
                    </div>


                    {/* TEAM 2 SLOT */}

                    <div className="team-col">

                        <div className="team-top-row">

                            <div className={`team-header red ${timerData?.activeTeam === "team2"?"active-turn":""}`}>
                                {team2}
                            </div>

                            <div className="team-times">

                                <div className="time-box">
                                    <div className="label">Reserve</div>
                                    <div className="value">
                                        {formatTime(timerData?.team2?.reserve ?? 0)}
                                    </div>
                                </div>

                                <div className="time-box">
                                    <div className="label">Penalty</div>
                                    <div className="value">
                                        {formatTime(timerData?.team2?.penalty ?? 0)}
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="team-slots">
                            <div className="slot-row">

                                {team2Slots.map((s, i) => (
                                    <div
                                        key={i}
                                        className={`${s.cls} ${nextPickIndex === s.index ? "blink-slot" : ""}`}
                                        onClick={() => openLCModal(s.index)}
                                    >
                                        {renderSlot(s.index)}
                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>

                </div>


                {/* TEAM 2 SCORE */}

                <div className="team-section">

                    <div className="score-panel">

                        <h2>{team2}</h2>

                        <p>Total cost:
                            <span>{team2Score.toFixed(1)}</span>
                        </p>

                        <label>First Half Cycle:</label>
                        <input
                            type="number"
                            value={team2FirstHalf}
                            onChange={(e)=>setTeam2FirstHalf(e.target.value)}
                        />

                        <label>Second Half Cycle:</label>
                        <input
                            type="number"
                            value={team2SecondHalf}
                            onChange={(e)=>setTeam2SecondHalf(e.target.value)}
                        />

                        <label>Deaths:</label>
                        <input
                            type="number"
                            value={team2Deaths}
                            onChange={(e)=>setTeam2Deaths(e.target.value)}
                        />

                        <label>Time penalty:</label>
                        <input
                            type="number"
                            value={team2Penalty}
                            onChange={(e)=>setTeam2Penalty(e.target.value)}
                        />

                        <p>Total Point:
                            <span>{team2TotalPoint.toFixed(4)}</span>
                        </p>

                    </div>

                </div>

            </div>


            {/* CHARACTER GRID */}

            <div className="grid-wrap">

                <div className="search-container">

                    <input
                        className="search-bar"
                        placeholder="Search characters"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="button-group">

                        {isAdmin && (
                            <button
                                className="custom-btn btn-undo"
                                onClick={undoPick}
                            >
                                Undo
                            </button>
                        )}

                        {isAdmin && (
                            <button
                                className="custom-btn btn-reset"
                                onClick={resetDraft}
                            >
                                Reset
                            </button>
                        )}

                    </div>

                </div>


                {/* GRID */}

                <div className="grid">

                    {filteredCharacters.map((character, index) => {

                        const isPicked = draft.some(
                            c => c.characterName === character.characterName
                        );

                        return (

                            <div
                                key={index}
                                className="tile"
                                onClick={() => !isPicked && canPick && pickCharacter(character)}
                                style={{
                                    background:
                                        character.rarity === 5
                                            ? "#e6b741"
                                            : "#9b59b6",

                                    opacity: !canPick || isPicked ? 0.35 : 1,
                                    pointerEvents: !canPick || isPicked ? "none" : "auto",
                                    filter: isPicked ? "grayscale(100%) brightness(100%)" : "none"
                                }}
                            >

                                <img
                                    src={character.imageIcon}
                                    alt={character.characterName}
                                />

                            </div>

                        );

                    })}

                </div>

            </div>

        </div>
    );

}