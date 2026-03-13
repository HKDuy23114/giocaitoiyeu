import { useState } from "react";
import { ref, set, get, child } from "firebase/database";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
export default function HomePage() {
    const navigate = useNavigate();
    const [links, setLinks] = useState(null);
    const [team1Name, setTeam1Name] = useState("");
    const [team2Name, setTeam2Name] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const MAX_ATTEMPT = 5;
    const data = JSON.parse(localStorage.getItem("draftLogin"));
    const lockedToday =
        data &&
        data.date === new Date().toDateString() &&
        data.attempts >= MAX_ATTEMPT;
    const createRoom = () => {

        const roomID =
            Date.now().toString(36) +
            Math.random().toString(36).substring(2, 8);

        const hostLink =
            `${window.location.origin}/draft?room=${roomID}&team1=${team1Name}&team2=${team2Name}&role=host`;

        const team1Link =
            `${window.location.origin}/draft?room=${roomID}&team1=${team1Name}&team2=${team2Name}&role=team1`;

        const team2Link =
            `${window.location.origin}/draft?room=${roomID}&team1=${team1Name}&team2=${team2Name}&role=team2`;

        set(ref(db, "rooms/" + roomID), {
            draft: [],
            team1Name: team1Name,
            team2Name: team2Name,
            createdAt: Date.now()
        });

        setLinks({
            host: hostLink,
            team1: team1Link,
            team2: team2Link
        });
    };

    const handleStart = async () => {

        const today = new Date().toDateString();

        let attempts = 0;

        const data = JSON.parse(localStorage.getItem("draftLogin"));

        if (data && data.date === today) {
            attempts = data.attempts;
        }

        // khóa luôn nếu đủ 5
        if (attempts >= MAX_ATTEMPT) {
            alert("Bạn đã nhập sai quá 5 lần hôm nay");
            return;
        }

        try {

            const snapshot = await get(child(ref(db), "config/draftPassword"));
            const realPassword = snapshot.val();

            if (passwordInput !== realPassword) {

                attempts++;

                localStorage.setItem(
                    "draftLogin",
                    JSON.stringify({
                        date: today,
                        attempts: attempts
                    })
                );

                if (attempts >= MAX_ATTEMPT) {
                    alert("Sai mật khẩu (5/5) - Đã bị khóa hôm nay");
                } else {
                    alert(`Sai mật khẩu (${attempts}/5)`);
                }

                return;
            }

            setShowForm(true);

        } catch (err) {

            alert("Không thể kết nối Firebase");

        }

    };

    const copyLink = (link) => {
        navigator.clipboard.writeText(link);
        alert("Copied!");
    };

    return (

        <div style={styles.page}>

            <div style={styles.card}>

                <h1 style={styles.title}>HSR Draft Tool</h1>

                {!showForm && !links && (

                    <div style={styles.section}>

                        {!showPassword && (
                            <button
                                style={styles.button}
                                onClick={() => setShowPassword(true)}
                            >
                                Start Draft
                            </button>

                        )}

                        {showPassword && (
                            <>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={passwordInput}
                                    disabled={lockedToday}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !lockedToday) {
                                            handleStart();
                                        }
                                    }}
                                    style={styles.input}
                                />

                                <button
                                    style={styles.button}
                                    onClick={handleStart}
                                    disabled={lockedToday}
                                >
                                    {lockedToday ? "Locked Today" : "Confirm"}
                                </button>
                            </>
                        )}
                        <button
                            className="start-btn"
                            onClick={() => navigate("/data")}
                            style={styles.button}
                        >
                            View Data
                        </button>
                        <button
                            className="custom-btn"
                            onClick={() => navigate("/demo")}
                            style={styles.button}
                        >
                            Demo Draft
                        </button>
                        <button
                            className="home-btn"
                            onClick={()=>navigate("/calculator")}
                            style={styles.button}
                        >
                            Calculator
                        </button>
                    </div>



                )}

                {showForm && !links && (

                    <div style={styles.section}>

                        <input
                            placeholder="Team 1 Name"
                            value={team1Name}
                            onChange={(e) => setTeam1Name(e.target.value)}
                            style={styles.input}
                        />

                        <input
                            placeholder="Team 2 Name"
                            value={team2Name}
                            onChange={(e) => setTeam2Name(e.target.value)}
                            style={styles.input}
                        />

                        <button style={styles.button} onClick={createRoom}>
                            Create Room
                        </button>

                    </div>

                )}

                {links && (

                    <div style={styles.linksBox}>

                        <LinkRow
                            title="Host"
                            link={links.host}
                            copyLink={copyLink}
                        />

                        <LinkRow
                            title="Team 1"
                            link={links.team1}
                            copyLink={copyLink}
                        />

                        <LinkRow
                            title="Team 2"
                            link={links.team2}
                            copyLink={copyLink}
                        />

                    </div>

                )}

            </div>

        </div>
    );
}

function LinkRow({ title, link, copyLink }) {

    return (

        <div style={styles.linkRow}>

            <div style={styles.linkTitle}>{title}</div>

            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
            >
                {link}
            </a>

            <button
                style={styles.copyButton}
                onClick={() => copyLink(link)}
            >
                Copy
            </button>

        </div>

    );
}

const styles = {

    page: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
            "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
        fontFamily: "Arial"
    },

    card: {
        width: "600px",
        maxWidth: "90%",
        padding: "40px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 0 30px rgba(0,0,0,0.5)"
    },

    title: {
        textAlign: "center",
        color: "#fff",
        marginBottom: "30px",
        fontSize: "32px"
    },

    section: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        fontSize: "16px"
    },

    button: {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        background: "#7c3aed",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "16px"
    },

    linksBox: {
        display: "flex",
        flexDirection: "column",
        gap: "15px"
    },

    linkRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "rgba(255,255,255,0.05)",
        padding: "10px",
        borderRadius: "8px"
    },

    linkTitle: {
        width: "70px",
        color: "#fff",
        fontWeight: "bold"
    },

    link: {
        flex: 1,
        color: "#93c5fd",
        textDecoration: "none",
        fontSize: "14px",
        wordBreak: "break-all"
    },

    copyButton: {
        padding: "6px 12px",
        borderRadius: "6px",
        border: "none",
        background: "#22c55e",
        color: "white",
        cursor: "pointer"
    }

};