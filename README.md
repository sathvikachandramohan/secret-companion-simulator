# gachapan-simulator
A cozy, notebook-themed interactive web application featuring an animated chibi companion that reads, analyzes, and emotionally reacts to user-written messages in real time. 

## Description
The "Secret Message Simulator" is an aesthetic frontend project designed with a hand-drawn sketchbook appearance. It completely bypasses the need for external images or audio files by relying on modern native browser APIs. Using pure CSS geometry and an inline SVG displacement filter, it mimics an authentic hand-drawn journal where users can draft a letter, watch it fold itself into a 3D envelope, lock it with a heart sticker, and generate a customized shared gift card.

---

## Overview
This project was built to explore the boundaries of CSS illustration, complex UI animation states, and programmatic audio generation. Instead of building a sterile, corporate web interface, this application showcases how frontend technologies can be manipulated to create a whimsical, emotionally responsive, and highly tactile user experience (UX) reminiscent of cozy, indie digital stationery.

---

##  Project Objectives
- **Master UI/UX Micro-interactions:** Build a highly engaging interface where every user action (typing, clicking, sealing) triggers instant physical, visual, and auditory feedback.
- **Eliminate External Dependencies:** Recreate high-quality web assets (graphics, animations, sound effects) using purely local code structures rather than asset hosting.
- **Implement Real-Time State Engines:** Synchronize character animations, speech bubble content, and UI data tags dynamically using light sentiment analysis.

---

##  Features
- **Hand-Drawn Sketchy Filter:** Utilizes an inline SVG `<feTurbulence>` filter to give box borders and structural edges an organic, slightly imperfect "jittery" pen stroke style.
- **Real-Time Sentiment Mood Engine:** As you type into the typewriter console, JavaScript checks for custom keyphrases to update the **Mood Meter** and transition the chibi mascot across 6 distinct vector states:
  - ❤️ **Love:** Character blushes (`love`, `cute`, `marry`, `hug`)
  - 😢 **Sad:** Character cries custom falling teardrops (`miss you`, `sad`, `goodbye`)
  - 😲 **Shocked:** Character's eyes widen (`wow`, `omg`, `impossible`)
  - 😡 **Angry:** Character gets cross-eyed eyebrows (`hate`, `annoying`, `stupid`)
  - 🤔 **Thinking:** Character looks pensive (`think`, `maybe`, `perhaps`)
  - 😊 **Happy:** The peaceful default writing state.
- **🎵 Code-Synthesized Audio (Web Audio API):** Mechanical typewriter keystroke clicks and paper rustling fold sound effects are completely synthesized mathematically from oscillator nodes in real time.
- **✉️ 3D Sealing Automation Sequence:** Clicking the action button hides the console, moves the text into a stationary sheet, folds down a 3D envelope flap using perspective transforms, and pops up a springy heart sticker.
- **🌸 Decorative Gift Card Generation:** Spawns a dedicated summary card styled with custom digital washi tape textures and stars for the final presentation.
- **✨ Ambient Environment:** Features a floating background engine that generates and gently animates pastel stickers across the viewport.

---

## Technologies Used
- **HTML5:** Layout structuring, semantic markup, and embedded SVG filtering matrices.
- **CSS3:** Custom properties (variables), notebook line linear gradients, keyframe state machines, 3D perspective folding matrix, and responsive media queries.
- **Vanilla JavaScript (ES6+):** Programmatic audio synthesis, live sentiment scanning, runtime background element injection, and DOM class state modulation.

---
## Live Demo Link
https://sathvikachandramohan.github.io/gachapan-simulator/

## Project Structure
```text
secret-message-simulator/
│
├── index.html        # Main app entry, structural layout, SVG filter definitions
├── style.css         # Notebook theme, Chibi vector design, keyframes & 3D stages
└── script.js         # Web Audio API engine, mood dictionary, interacti
