
import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../firebase";

export default function HomePage() {

    const [links, setLinks] = useState(null);

    const createRoom = () => {

        const roomID =
            Date.now().toString(36) +
            Math.random().toString(36).substring(2, 8);

        const hostLink = `${window.location.origin}/draft?room=${roomID}&role=host`;
const team1Link = `${window.location.origin}/draft?room=${roomID}&role=team1`;
const team2Link = `${window.location.origin}/draft?room=${roomID}&role=team2`;

set(ref(db, "rooms/" + roomID), {
    draft: [],
    createdAt: Date.now(),
    createdDate: new Date().toISOString()
});

setLinks({
    host: hostLink,
    team1: team1Link,
    team2: team2Link
});
};

const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Copied!");
};

return (

    <div style={{ textAlign: "center", marginTop: "100px" }}>

        <h1>HSR Draft Tool</h1>

        <button onClick={createRoom}>
            Start Draft
        </button>

        {links && (

            <div style={{ marginTop: "30px" }}>

                <div style={{ marginBottom: "15px" }}>
                    <b>Host:</b>{" "}
                    <a href={links.host} target="_blank" rel="noopener noreferrer">
                        {links.host}
                    </a>
                    {" "}
                    <button onClick={() => copyLink(links.host)}>
                        Copy
                    </button>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <b>Team 1:</b>{" "}
                    <a href={links.team1} target="_blank" rel="noopener noreferrer">
                        {links.team1}
                    </a>
                    {" "}
                    <button onClick={() => copyLink(links.team1)}>
                        Copy
                    </button>
                </div>

                <div>
                    <b>Team 2:</b>{" "}
                    <a href={links.team2} target="_blank" rel="noopener noreferrer">
                        {links.team2}
                    </a>
                    {" "}
                    <button onClick={() => copyLink(links.team2)}>
                        Copy
                    </button>
                </div>

            </div>

        )}

    </div>
);
}
