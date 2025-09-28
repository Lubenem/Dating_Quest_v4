#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Dating Quest server running at http://localhost:{PORT}")
        print("📱 Open this URL on your phone for mobile testing")
        print("🛑 Press Ctrl+C to stop the server")
        
        # Try to open browser automatically
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
            
        httpd.serve_forever()
