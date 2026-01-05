const inputBox = document.getElementById("websiteInput");
const button = document.getElementById("submitBtn");
const output = document.getElementById("outputBox");

button.addEventListener("click", async () => {
    const websiteURL = inputBox.value.trim();

    if (!websiteURL) {
        output.innerHTML = "Please enter a website URL";
        return;
    }

    output.innerHTML = "Scraping data, please wait...";

    try {
        const response = await fetch("http://127.0.0.1:5000/scrape", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: websiteURL })
        });

        const data = await response.json();

        let html = "";

        /* ---------- TITLE ---------- */
        if (data.title) {
            html += `<h2>${data.title}</h2>`;
        }

        /* ---------- HEADINGS ---------- */
        if (data.headings && data.headings.length > 0) {
            html += "<h3>Headings</h3>";
            data.headings.forEach(h => {
                html += `<p>${h}</p>`;
            });
        }

        /* ---------- PARAGRAPHS ---------- */
        if (data.paragraphs && data.paragraphs.length > 0) {
            html += "<h3>Paragraphs</h3>";
            data.paragraphs.slice(0, 6).forEach(p => {
                html += `<p>${p}</p>`;
            });
        }

        /* ---------- TABLES ---------- */
        if (data.tables && data.tables.length > 0) {
            html += "<h3>Tables</h3>";
            data.tables.forEach(table => {
                html += "<table border='1' style='margin-bottom:15px; border-collapse:collapse;'>";
                table.forEach(row => {
                    html += "<tr>";
                    row.forEach(cell => {
                        html += `<td style="padding:6px;">${cell}</td>`;
                    });
                    html += "</tr>";
                });
                html += "</table>";
            });
        }

        /* ---------- FALLBACK ---------- */
        if (html === "") {
            html = "No readable content found on this website.";
        }

        output.innerHTML = html;

    } catch (error) {
        output.innerHTML = "Error occurred while scraping the website.";
        console.error(error);
    }
});
