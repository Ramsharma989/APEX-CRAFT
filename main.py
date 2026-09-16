import http.server
import socketserver
import webbrowser
import os
import sys

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    socketserver.TCPServer.allow_reuse_address = True
    url = f"http://localhost:{PORT}"
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print("=" * 55)
            print("ApexCraft Web Studio is running successfully!")
            print(f"Local URL: {url}")
            print(f"Serving directory: {DIRECTORY}")
            print("Press Ctrl+C in this terminal to stop.")
            print("=" * 55)
            webbrowser.open(url)
            httpd.serve_forever()
    except OSError:
        print("=" * 55)
        print(f"Website server is already running on port {PORT}!")
        print(f"Opening website in your default browser: {url}")
        print("=" * 55)
        webbrowser.open(url)

if __name__ == "__main__":
    run()
