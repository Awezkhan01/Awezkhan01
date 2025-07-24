#!/usr/bin/env python3
"""
Simple HTTP server for the Mobile Fighter game.
Run this to serve the game files locally for testing.
"""

import http.server
import socketserver
import webbrowser
import sys
from pathlib import Path

PORT = 8000

class GameHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    # Change to the directory containing the game files
    game_dir = Path(__file__).parent
    os.chdir(game_dir)
    
    with socketserver.TCPServer(("", PORT), GameHTTPRequestHandler) as httpd:
        print(f"🎮 Mobile Fighter Game Server")
        print(f"📱 Serving at http://localhost:{PORT}")
        print(f"🌐 Open this URL in your mobile browser or desktop for testing")
        print(f"🛑 Press Ctrl+C to stop the server")
        print()
        print("📋 Game Features:")
        print("  • Two unique characters: Warrior & Ninja")
        print("  • Touch controls optimized for mobile")
        print("  • Visual effects and particle systems")
        print("  • Health bars and round timer")
        print("  • Sound effects")
        print("  • Responsive design")
        print()
        
        # Auto-open browser on desktop
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped.")
            sys.exit(0)

if __name__ == "__main__":
    import os
    main()