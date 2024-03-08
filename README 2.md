# lunar gala 2024 website

file tree:

```
├── packages...
├── public...
├── src
│   ├── App.jsx <-- main app file, npm run dev in / runs overall page
│   ├── index.jsx
│   ├── ...
├── about <-- npm run in /about runs only about page, w/o nav
│   ├── packages...
│   ├── public...
│   ├── src
│   │   ├── App.jsx <-- about app file
│   │   ├── ... <-- might need other files but no necessarily, as /liminal/about/src/App.jsx imports /liminal/src/index.jsx, etc...
├── tickets
├── people
├── lines

```

/subpage/src/App.jsx must be formatted like this:
```
/** helper functions
  * no need to export, i don't care how you format these
*/
function foo() {
  return 0
}

/** contents of page
  * must be exported
  * name of funciton must be capitalized, camel-case
  *   ie AboutPage / TicketsPage / LinesPage / PeoplePage
  * @return: contents of page wrapped in <></> (no <Canvas>!!)
*/
export function SubPage() {
  foo() // use helpers
  return (
    <>
      <Text>tix page</Text>
    </>
  )
}

/** DO NOT MODIFY APP
  * don't. this is only for previewing this page in developemt.
  * anything you want displayed on the page should go in your
  *   SubPage() function. App() will never run in the actual website
*/
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Canvas>
        <SubPage />
      </Canvas>
    </>
  )
}

export default App
```
