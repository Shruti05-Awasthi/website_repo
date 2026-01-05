from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route("/scrape", methods=["POST"])
def scrape_website():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL not provided"})

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/120 Safari/537.36"
        }

        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch website"})

        soup = BeautifulSoup(response.text, "html.parser")

        # -------- TITLE --------
        title = soup.title.text.strip() if soup.title else ""

        # -------- HEADINGS --------
        headings = []
        for h in soup.find_all(["h1", "h2", "h3"]):
            text = h.get_text(strip=True)
            if text:
                headings.append(text)

        # -------- PARAGRAPHS --------
        paragraphs = []
        for p in soup.find_all("p"):
            text = p.get_text(strip=True)
            if len(text) > 80:   # meaningful content
                paragraphs.append(text)

        # -------- TABLES --------
        tables = []
        for table in soup.find_all("table"):
            rows = []
            for row in table.find_all("tr"):
                cells = [
                    cell.get_text(strip=True)
                    for cell in row.find_all(["th", "td"])
                ]
                if cells:
                    rows.append(cells)
            if rows:
                tables.append(rows)

        return jsonify({
            "title": title,
            "headings": headings[:10],
            "paragraphs": paragraphs[:8],
            "tables": tables
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
