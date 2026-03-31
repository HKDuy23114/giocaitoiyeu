import "../styles/calculator.css";
import { useState, useEffect } from "react";

export default function DraftCalculator() {
    const [characters, setCharacters] = useState([]);
    const [lightcones, setLightcones] = useState([]);
    const [charSearch, setCharSearch] = useState("");
    const [lcSearch, setLcSearch] = useState("");
    const [draft, setDraft] = useState([null, null, null, null]);

    const [showLCModal, setShowLCModal] = useState(false);
    const [selectedLC, setSelectedLC] = useState(null);
    const [lcSlot, setLcSlot] = useState(null);

    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        const load = async () => {
            const charRes = await fetch("/data/characters.json");
            const charData = await charRes.json();
            setCharacters(charData);

            const lcRes = await fetch("/data/lightcones.json");
            const lcData = await lcRes.json();
            setLightcones(lcData);
        };
        load();
    }, []);

    // ✅ ALWAYS pick từ trái qua phải, không overwrite
    const pickCharacter = (char) => {
        const slot = draft.findIndex((s) => !s);
        if (slot === -1) return;

        const newDraft = [...draft];
        newDraft[slot] = {
            characterName: char.characterName,
            imageFull: char.imageFull,
            rarity: char.rarity,
            pointE0: char.E0,
            pointE1: char.E1,
            pointE2: char.E2,
            pointE3: char.E3,
            pointE4: char.E4,
            pointE5: char.E5,
            pointE6: char.E6,
            eidolon: "E0",
            superimposition: "S1",
        };

        setDraft(newDraft);

        setCharSearch("");
    };

    const removeCharacter = (slot) => {
        const newDraft = [...draft];
        newDraft[slot] = null;
        setDraft(newDraft);
    };

    const clearAll = () => {
        setDraft([null, null, null, null]);
    };

    const openLCModal = (slot) => {
        if (!draft[slot]) return;

        setLcSlot(slot);
        setSelectedLC(null);
        setLcSearch(""); // 🔥 reset search mỗi lần mở
        setShowLCModal(true);
    };

    const confirmLC = () => {
        if (lcSlot === null || !selectedLC) return;

        const newDraft = [...draft];

        if (selectedLC.lightConeName === "none") {
            newDraft[lcSlot].lightCone = null;
            newDraft[lcSlot].lightConeImage = null;
        } else {
            newDraft[lcSlot].lightCone = selectedLC;
            newDraft[lcSlot].lightConeImage = selectedLC.imageUrl;
        }

        setDraft(newDraft);
        setShowLCModal(false);
        setLcSearch("");
    };

    const changeEidolon = (slot, value) => {
        const newDraft = [...draft];
        newDraft[slot].eidolon = value;
        setDraft(newDraft);
    };

    const changeSuperimposition = (slot, value) => {
        const newDraft = [...draft];
        newDraft[slot].superimposition = value;
        setDraft(newDraft);
    };

    const calculateTotal = () => {
        let total = 0;
        draft.forEach((char) => {
            if (!char) return;

            const charPoint = char["point" + char.eidolon] || 0;
            const lcPoint =
                char.lightCone && char.superimposition
                    ? char.lightCone[char.superimposition] || 0
                    : 0;

            total += charPoint + lcPoint;
        });

        total += cycle * 5;
        return total;
    };

    const totalPoint = calculateTotal();

    const filteredCharacters = characters.filter((c) =>
        c.characterName.toLowerCase().includes(charSearch.toLowerCase())
    );

    const filteredLightcones = lightcones.filter((lc) =>
        lc.characterName.toLowerCase().includes(lcSearch.toLowerCase())
    );

    return (
        <div className="calc-page">
            <div className="calc-container">

                <h1 style={{ marginBottom: "30px", textAlign: "center" }}>
                    Draft Calculator
                </h1>

                <div className="top-layout">

                    {/* LEFT */}
                    <div className="left-panel">

                        <div className="slot-area">
                            {draft.map((char, index) => {

                                if (!char) {
                                    return (
                                        <div key={index} className="slot-column">

                                            <div className="slot-box">
                                                Empty Slot
                                            </div>

                                            <button className="slot-delete" disabled>
                                                Delete
                                            </button>

                                        </div>
                                    );
                                }

                                const charPoint = char["point" + char.eidolon];

                                const lcPoint =
                                    char.lightCone && char.superimposition
                                        ? char.lightCone[char.superimposition] || 0
                                        : 0;

                                return (
                                    <div key={index} className="slot-column">

                                        <div className="slot-box filled">

                                            <img
                                                src={char.imageFull}
                                                className="slot-image"
                                                alt={char.characterName}
                                            />

                                            <select
                                                value={char.eidolon}
                                                onChange={(e) => changeEidolon(index, e.target.value)}
                                                className="eidolon-select"
                                            >
                                                <option>E0</option>
                                                <option>E1</option>
                                                <option>E2</option>
                                                <option>E3</option>
                                                <option>E4</option>
                                                <option>E5</option>
                                                <option>E6</option>
                                            </select>

                                            <div className="char-point">
                                                {charPoint?.toFixed(1)}
                                            </div>

                                            <div
                                                onClick={() => openLCModal(index)}
                                                className="lc-thumb"
                                            >
                                                {char.lightConeImage && (
                                                    <img
                                                        src={char.lightConeImage}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                        alt="LC"
                                                    />
                                                )}
                                            </div>

                                            {char.lightCone && (
                                                <div className="lc-point">
                                                    {lcPoint}
                                                </div>
                                            )}

                                            {char.lightCone && (
                                                <select
                                                    value={char.superimposition}
                                                    onChange={(e) => changeSuperimposition(index, e.target.value)}
                                                    className="super-select"
                                                >
                                                    <option>S1</option>
                                                    <option>S2</option>
                                                    <option>S3</option>
                                                    <option>S4</option>
                                                    <option>S5</option>
                                                </select>
                                            )}

                                        </div>

                                        <button
                                            onClick={() => removeCharacter(index)}
                                            className="slot-delete"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                );
                            })}
                        </div>

                        <div className="control-panel">

                            <label style={{ fontWeight: 600 }}>Cycle</label>

                            <input
                                type="number"
                                value={cycle}
                                onChange={(e) => setCycle(Number(e.target.value))}
                            />

                            <h2 style={{ margin: 0 }}>
                                Total: {totalPoint.toFixed(2)}
                            </h2>

                            <button
                                onClick={clearAll}
                                className="clear-btn"
                            >
                                Clear All
                            </button>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="char-panel">

                        <h2>Characters</h2>

                        <input
                            type="text"
                            placeholder="Search character..."
                            value={charSearch}
                            onChange={(e) => setCharSearch(e.target.value)}
                            className="search-input"
                        />

                        <div className="char-grid">
                            {filteredCharacters.map((c, i) => (
                                <img
                                    key={i}
                                    src={c.imageIcon}
                                    className="char-icon"
                                    onClick={() => pickCharacter(c)}
                                    alt={c.characterName}
                                />
                            ))}
                        </div>

                    </div>

                </div>

                {/* LC MODAL */}
                {showLCModal && (
                    <div className="lc-modal" onClick={() => setShowLCModal(false)}>

                        <div
                            className="lc-box"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <h2>Select Lightcone</h2>

                            <input
                                type="text"
                                placeholder="Search lightcone..."
                                value={lcSearch}
                                onChange={(e) => setLcSearch(e.target.value)}
                                className="search-input"
                            />

                            <div className="lc-grid">

                                <div
                                    onClick={() => setSelectedLC({ lightConeName: "none" })}
                                    style={{
                                        border: "1px solid #999",
                                        height: "115px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "8px",
                                        cursor: "pointer"
                                    }}
                                >
                                    None
                                </div>

                                {filteredLightcones.map((lc, i) => (
                                    <img
                                        key={i}
                                        src={lc.imageUrl}
                                        className={`lc-icon ${
                                            selectedLC?.lightConeName === lc.lightConeName ? "selected" : ""
                                        }`}
                                        onClick={() => setSelectedLC(lc)}
                                        alt={lc.lightConeName}
                                    />
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

            </div>
        </div>
    );
}