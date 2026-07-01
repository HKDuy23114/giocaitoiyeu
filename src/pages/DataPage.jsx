import "../styles/data.css";
import { useEffect, useState } from "react";

export default function DataPage() {

    const [characters, setCharacters] = useState([]);
    const [lightcones, setLightcones] = useState([]);

    const [charSearch, setCharSearch] = useState("");
    const [lcSearch, setLcSearch] = useState("");

    const [charSort, setCharSort] = useState("name");
    const [lcSort, setLcSort] = useState("name");

    const [charAsc, setCharAsc] = useState(true);
    const [lcAsc, setLcAsc] = useState(true);

    useEffect(() => {

        const CHAR_URL = "https://opensheet.elk.sh/1xxdHGKmcdNwWaVKMFCGRpKvFGnPqjVv8pQCvLofQGss/characters";
        const LC_URL = "https://opensheet.elk.sh/1xxdHGKmcdNwWaVKMFCGRpKvFGnPqjVv8pQCvLofQGss/lightcones";

        const normalize = (data) => {
            return data.map(item => {
                let obj = {};
                Object.keys(item).forEach(key => {
                    obj[key.trim()] = item[key];
                });
                return obj;
            });
        };

        const loadData = async () => {
            try {
                const [charRes, lcRes] = await Promise.all([
                    fetch(CHAR_URL),
                    fetch(LC_URL)
                ]);

                const charDataRaw = await charRes.json();
                const lcDataRaw = await lcRes.json();

                setCharacters(normalize(charDataRaw));
                setLightcones(normalize(lcDataRaw));

            } catch (err) {
                console.error(err);
            }
        };

        loadData();

    }, []);

    // ===== FILTER =====

    const filteredCharacters =
        characters
            .filter(c =>
                (c.characterName || "")
                    .toLowerCase()
                    .includes(charSearch.toLowerCase())
            )
            .sort((a, b) => {
                if (charSort === "name") {
                    return charAsc
                        ? (a.characterName || "").localeCompare(b.characterName || "")
                        : (b.characterName || "").localeCompare(a.characterName || "");
                }

                return charAsc
                    ? a[charSort] - b[charSort]
                    : b[charSort] - a[charSort];
            });

    const filteredLC =
        lightcones
            .filter(lc =>
                (lc.characterName || "")
                    .toLowerCase()
                    .includes(lcSearch.toLowerCase())
            )
            .sort((a, b) => {
                if (lcSort === "name") {
                    return lcAsc
                        ? (a.characterName || "").localeCompare(b.characterName || "")
                        : (b.characterName || "").localeCompare(a.characterName || "");
                }

                return lcAsc
                    ? a[lcSort] - b[lcSort]
                    : b[lcSort] - a[lcSort];
            });

    return (
        <div className="data-page">

            {/* ================= CHARACTERS ================= */}
            <div className="data-panel">

                <h2>Characters</h2>

                <div className="control-bar">
                    <input
                        placeholder="Search character..."
                        value={charSearch}
                        onChange={(e) => setCharSearch(e.target.value)}
                    />

                    <select
                        value={charSort}
                        onChange={(e) => setCharSort(e.target.value)}
                    >
                        <option value="name">Sort Name</option>
                        <option value="E0">E0</option>
                        <option value="E1">E1</option>
                        <option value="E2">E2</option>
                        <option value="E3">E3</option>
                        <option value="E4">E4</option>
                        <option value="E5">E5</option>
                        <option value="E6">E6</option>
                    </select>

                    <button onClick={() => setCharAsc(!charAsc)}>
                        {charAsc ? "ASC ↑" : "DESC ↓"}
                    </button>
                </div>

                {/* ===== DESKTOP TABLE ===== */}
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Name</th>
                            <th>E0</th>
                            <th>E1</th>
                            <th>E2</th>
                            <th>E3</th>
                            <th>E4</th>
                            <th>E5</th>
                            <th>E6</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredCharacters.map((c, i) => (
                            <tr key={i}>
                                <td><img src={c.imageIcon} className="icon-img" /></td>
                                <td>{c.characterName}</td>
                                <td>{c.E0}</td>
                                <td>{c.E1}</td>
                                <td>{c.E2}</td>
                                <td>{c.E3}</td>
                                <td>{c.E4}</td>
                                <td>{c.E5}</td>
                                <td>{c.E6}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* ===== MOBILE CARD ===== */}
                <div className="mobile-list">
                    {filteredCharacters.map((c, i) => (
                        <div className="mobile-card" key={i}>
                            <img src={c.imageIcon} />

                            <div className="mobile-content">
                                <div className="mobile-title">{c.characterName}</div>

                                <div className="mobile-stats">
                                    <div>E0: {c.E0}</div>
                                    <div>E1: {c.E1}</div>
                                    <div>E2: {c.E2}</div>
                                    <div>E3: {c.E3}</div>
                                    <div>E4: {c.E4}</div>
                                    <div>E5: {c.E5}</div>
                                    <div>E6: {c.E6}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>


            {/* ================= LIGHTCONES ================= */}
            <div className="data-panel">

                <h2>Lightcones</h2>

                <div className="control-bar">
                    <input
                        placeholder="Search lightcone..."
                        value={lcSearch}
                        onChange={(e) => setLcSearch(e.target.value)}
                    />

                    <select
                        value={lcSort}
                        onChange={(e) => setLcSort(e.target.value)}
                    >
                        <option value="name">Sort Name</option>
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                        <option value="S3">S3</option>
                        <option value="S4">S4</option>
                        <option value="S5">S5</option>
                    </select>

                    <button onClick={() => setLcAsc(!lcAsc)}>
                        {lcAsc ? "ASC ↑" : "DESC ↓"}
                    </button>
                </div>

                {/* TABLE */}
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Character</th>
                            <th>Name</th>
                            <th>S1</th>
                            <th>S2</th>
                            <th>S3</th>
                            <th>S4</th>
                            <th>S5</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredLC.map((lc, i) => (
                            <tr key={i}>
                                <td><img src={lc.imageUrl} className="icon-img" /></td>
                                <td>{lc.characterName}</td>
                                <td>{lc.lightConeName}</td>
                                <td>{lc.S1}</td>
                                <td>{lc.S2}</td>
                                <td>{lc.S3}</td>
                                <td>{lc.S4}</td>
                                <td>{lc.S5}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE */}
                <div className="mobile-list">
                    {filteredLC.map((lc, i) => (
                        <div className="mobile-card" key={i}>
                            <img src={lc.imageUrl} />

                            <div className="mobile-content">
                                <div className="mobile-title">{lc.lightConeName}</div>
                                <div style={{ fontSize: "12px", opacity: 0.7 }}>
                                    {lc.characterName}
                                </div>

                                <div className="mobile-stats">
                                    <div>S1: {lc.S1}</div>
                                    <div>S2: {lc.S2}</div>
                                    <div>S3: {lc.S3}</div>
                                    <div>S4: {lc.S4}</div>
                                    <div>S5: {lc.S5}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    );
}