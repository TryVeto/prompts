#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
import argparse, os

ROOT = Path(__file__).resolve().parent

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def translate_path(self, path):
        rel = urlsplit(path).path.lstrip("/")
        return str(ROOT / rel)

    def do_GET(self):
        path = urlsplit(self.path).path
        if path.startswith("/prompt/"):
            self.path = "/index.html"
        return super().do_GET()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8926)
    args = parser.parse_args()
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"Veto Prompts on http://localhost:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
