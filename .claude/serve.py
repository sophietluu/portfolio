#!/usr/bin/env python3
import os, http.server

os.chdir('/Users/sophieluu/Documents/GitHub/portfolio')

handler = http.server.SimpleHTTPRequestHandler
with http.server.HTTPServer(('', 3000), handler) as httpd:
    httpd.serve_forever()
