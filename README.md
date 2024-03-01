# lunar gala 2024 website
file tree:
| packages...
| public...
| src
| -– App.jsx <-- main app file, npm run dev in /liminal runs overall page
| –– index.jsx
| –– ...
| –– about <-- subpage folders each have complete react build
| –– | –– packages
| –– | –– public
| –– | –– src
| –– | –– | –– App.jsx <-- about app file, npm run in /about runs only about page, w/o nav
| –– | –– | –– ... <-- might need other files but no necessarily, as /liminal/about/src/App.jsx imports /liminal/src/index.jsx, etc...
| –– tickets
| –– people
| –– lines
