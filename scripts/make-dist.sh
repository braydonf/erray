echo "Browserifying Erray..."
node_modules/.bin/browserify erray.js -s erray -o dist/erray.js
echo "Minifying Erray..."
node_modules/.bin/uglifyjs dist/erray.js --compress --mangle --source-map dist/erray.min.map --source-map-url erray.min.map -o dist/erray.min.js
echo "Done!"
