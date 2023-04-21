# GBC-Hunt
Scavenger hunt at GBC! 

Hello! This is the code for the app portion of my GBC Scavenger Hunt. Some loose history and documentation can be found in the following
resources:

Live code (this requires being run on a live server or local virtual server): http://natedavisdesign.com/hunt/
PDF Overview: http://natedavisdesign.com/hunt/scavengerHunt-Nate.pdf

Systems overview: https://www.figma.com/file/zHmxijLuNimT0O4P1AEZQJ/GBC-Fun-Palace-Hunt
Design table: https://www.figma.com/file/bwnDkeyoQAvwopxrCBaDSC/GBC-Hunt

It's not present here (for probably obvious reasons), but the ultimate use case for this is to read from RFID scans. This is handled by 
Node.JS and the serialport API (https://www.npmjs.com/package/serialport) - the hardware is off-the-shelf RFID to USB hardware. 
All data handling is live and working exactly as it would, only here the inputs aren't derived from a scanner but from buttons along 
the right to simulate UID entry. 

If you run into problems, especially where text reads "error", you can try disabling ad block! 
