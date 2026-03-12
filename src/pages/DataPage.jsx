
import { useEffect, useState } from "react";

export default function DataPage() {

    const [characters, setCharacters] = useState([]);
    const [lightcones, setLightcones] = useState([]);

    const [charSearch, setCharSearch] = useState("");
    const [lcSearch, setLcSearch] = useState("");

    const [charSort, setCharSort] = useState("name");
    const [lcSort, setLcSort] = useState("name");

    const [charAsc,setCharAsc] = useState(true);
    const [lcAsc,setLcAsc] = useState(true);

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


    const filteredCharacters =
        characters
            .filter(c =>
                c.characterName.toLowerCase().includes(charSearch.toLowerCase())
            )
            .sort((a, b) => {

                if (charSort === "name") {
                    return charAsc
                        ? a.characterName.localeCompare(b.characterName)
                        : b.characterName.localeCompare(a.characterName);
                }

                return charAsc
                    ? a[charSort] - b[charSort]
                    : b[charSort] - a[charSort];

            });


    const filteredLC =
        lightcones
            .filter(lc =>
                lc.characterName.toLowerCase().includes(lcSearch.toLowerCase())
            )
            .sort((a, b) => {

                if (lcSort === "name") {
                    return lcAsc
                        ? a.characterName.localeCompare(b.characterName)
                        : b.characterName.localeCompare(a.characterName);
                }

                return lcAsc
                    ? a[lcSort] - b[lcSort]
                    : b[lcSort] - a[lcSort];

            });


    return (

        <div
            style={{
                display: "flex",
                gap: "30px",
                padding: "20px 30px",
                background: "#0f0f14",
                minHeight: "100vh",
                width: "100vw",
                boxSizing: "border-box",
                color: "white"
            }}
        >

            {/* CHARACTERS */}

            <div style={{ flex: 1, minWidth: 0 }}>

                <h2 style={{ marginBottom: "10px" }}>Characters</h2>

                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>

                    <input
                        placeholder="Search character..."
                        value={charSearch}
                        onChange={(e) => setCharSearch(e.target.value)}
                        style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: "6px",
                            border: "none"
                        }}
                    />

                    <select
                        value={charSort}
                        onChange={(e) => setCharSort(e.target.value)}
                        style={{ padding: "8px" }}
                    >
                        <option value="name">Sort Name</option>
                        <option value="E0">Sort E0</option>
                        <option value="E1">Sort E1</option>
                        <option value="E2">Sort E2</option>
                        <option value="E3">Sort E3</option>
                        <option value="E4">Sort E4</option>
                        <option value="E5">Sort E5</option>
                        <option value="E6">Sort E6</option>
                    </select>

                    <button
                        onClick={() => setCharAsc(!charAsc)}
                        style={{
                            padding: "8px 12px",
                            background: "#2c2c3a",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        {charAsc ? "ASC ↑" : "DESC ↓"}
                    </button>

                </div>


                <div
                    style={{
                        background: "#1a1a24",
                        borderRadius: "10px",
                        padding: "10px",
                        maxHeight: "80vh",
                        overflow: "auto"
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            border: "1px solid #2c2c3a"
                        }}
                    >

                        <thead style={{ position: "sticky", top: 0, background: "#1a1a24" }}>

                            <tr>

                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>Icon</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>Name</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>E0</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>E1</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>E2</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>E3</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>E4</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>E5</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>E6</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredCharacters.map((c, i) => (

                                <tr key={i}>

                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>
                                        <img
                                            src={c.imageIcon}
                                            style={{ width: "40px" }}
                                        />
                                    </td>

                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{c.characterName}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{c.E0}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{c.E1}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{c.E2}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{c.E3}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{c.E4}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{c.E5}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{c.E6}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>



            {/* LIGHTCONES */}

            <div style={{ flex: 1, minWidth: 0 }}>

                <h2 style={{ marginBottom: "10px" }}>Lightcones</h2>

                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>

                    <input
                        placeholder="Search lightcone..."
                        value={lcSearch}
                        onChange={(e) => setLcSearch(e.target.value)}
                        style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: "6px",
                            border: "none"
                        }}
                    />

                    <select
                        value={lcSort}
                        onChange={(e) => setLcSort(e.target.value)}
                        style={{ padding: "8px" }}
                    >
                        <option value="name">Sort Name</option>
                        <option value="S1">Sort S1</option>
                        <option value="S2">Sort S2</option>
                        <option value="S3">Sort S3</option>
                        <option value="S4">Sort S4</option>
                        <option value="S5">Sort S5</option>
                    </select>

                    <button
                        onClick={() => setLcAsc(!lcAsc)}
                        style={{
                            padding: "8px 12px",
                            background: "#2c2c3a",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        {lcAsc ? "ASC ↑" : "DESC ↓"}
                    </button>

                </div>


                <div
                    style={{
                        background: "#1a1a24",
                        borderRadius: "10px",
                        padding: "10px",
                        maxHeight: "80vh",
                        overflow: "auto"
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            border: "1px solid #2c2c3a"
                        }}
                    >

                        <thead style={{ position: "sticky", top: 0, background: "#1a1a24" }}>

                            <tr>

                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>Icon</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>Character</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>Name</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>S1</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>S2</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>S3</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>S4</th>
                                <th style={{ border: "1px solid #2c2c3a", padding: "6px" }}>S5</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredLC.map((lc, i) => (

                                <tr key={i}>

                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>
                                        <img
                                            src={lc.imageUrl}
                                            style={{ width: "40px" }}
                                        />
                                    </td>

                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{lc.characterName}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{lc.lightConeName}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{lc.S1}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{lc.S2}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{lc.S3}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{lc.S4}</td>
                                    <td style={{ border: "1px solid #2c2c3a", padding: "6px" }}>{lc.S5}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

