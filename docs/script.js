async function updatePlaylist() {
    try {
        const response = await fetch("https://logs.ivr.fi/channel/quin69/user/sheepfarmer/?reverse");
        const text = await response.text();

        const lines = text.split("\n");

        const { currentSongTitle, queueTitles } = parsePlaylist(lines);

        displayCurrentSong(currentSongTitle);
        displayQueue(queueTitles, currentSongTitle);
    } catch (error) {
        console.error("An error occurred while fetching or processing the playlist:", error);
    }
}

function parsePlaylist(lines) {
    let currentSongTitle = null;
    let queueTitles = [];

    for (const line of lines) {
        if (line.includes("🔊") && !line.includes("VIBE")) {
            currentSongTitle = line.substring(line.indexOf("🔊") + 2).trim();
            break;
        }
    }

    queueTitles = lines
        .filter(line => line.includes("➕"))
        .map(line => line.substring(line.indexOf("➕") + 2).trim());

    return { currentSongTitle, queueTitles };
}

function displayCurrentSong(song) {
    const currentSongElement = document.getElementById("currentSong");
    currentSongElement.innerHTML = ""; // Clear existing content

    if (song) {
        const link = document.createElement("a");
        link.textContent = song;
        link.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`;
        link.target = "_blank";

        currentSongElement.appendChild(link);
    } else {
        currentSongElement.textContent = "No song is currently playing.";
    }
}


function displayQueue(queue, currentSong) {
    const queueElement = document.getElementById("queue");
    queueElement.innerHTML = ""; 
	
	let songFound = false;

    for (const song of queue) {
        const li = document.createElement("li");
        const link = document.createElement("a");

        if (song === currentSong) {
			songFound = true;
			break;
        } else {
            link.textContent = song;
            link.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`;
            link.target = "_blank";
        }

        li.appendChild(link);
        queueElement.appendChild(li);
    }
	if (!songFound)
	{
		queueElement.innerHTML = ""; 
	}
		
    if (queueElement.childElementCount === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "The queue is empty.";
        queueElement.appendChild(emptyMessage);
    }
}

window.onload = updatePlaylist;
