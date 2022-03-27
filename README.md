# curius-viz
a date night project

## Scraping
```bash
cd scraper

# only run once
npm i

# actually scrape, this will product a file called dump.json which you can then use
node index.js
```

## Running the test site
```bash
cd viz

# only run once
npm i

# run dev server on localhost:3000
npm run dev
```

## Notes for Anson tomorrow
morning sleepy head :') 

things you can do
1. check out `main.js` in the viz folder to see how its setup! most of the visualization stuff should be setup already, you can play around with the default config in the function parameters
2. play around with what data is visualized! right now it just takes each user as a node and each link is a following relationship (direction doesnt matter here) -- haven't included links at all yet

## Links
1. [Figma](https://www.figma.com/file/oLu1NZFepgSZcfDpgtMsUo/Curius-Viz?node-id=0%3A1)