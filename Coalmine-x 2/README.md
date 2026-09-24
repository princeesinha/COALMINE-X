# Coalmine-x

UGV Rover – Mine Subsidence Prevention Simulation.

## Project structure
- `index.html` — UI and simulation layout
- `css/style.css` — responsive styling
- `js/app.js` — rover, sensor, blast, borehole and PU-foaming simulation logic

## Borehole + PU Foaming
The button is now visibly active and clickable. It gives a clear event-log message when prerequisites are not yet met. Once the rover has deployed the sensor node and returned to the surface, clicking it starts:
1. Borehole drilling toward the void (60 m)
2. PU foam injection (400 L)
3. Void filling and stabilisation
4. Continued sensor monitoring

Open `index.html` in a modern browser to run the simulation.

# 🚀 Live Demo
https://coalmine-x-2.vercel.app

