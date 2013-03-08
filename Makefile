build: components index.js
	component build --dev

components: component.json
	component install --dev

dist: dist-build dist-minify

dist-build: dist/webkit-svg-fixer.js

dist-minify: dist/webkit-svg-fixer.min.js

dist/webkit-svg-fixer.js: index.js
	component build --standalone webkitSvgFixer --out dist --name webkit-svg-fixer

dist/webkit-svg-fixer.min.js: dist/webkit-svg-fixer.js
	@echo "Minifying webkit-svg-fixer.js (http req)..."
	@curl -s \
		-d compilation_level=SIMPLE_OPTIMIZATIONS \
		-d output_format=text \
		-d output_info=compiled_code \
		--data-urlencode "js_code@$<" \
		http://closure-compiler.appspot.com/compile \
		> $<.tmp
	@mv $<.tmp dist/webkit-svg-fixer.min.js
	@echo "Done."

clean:
	rm -rf build components dist template.js

.PHONY: build components dist dist-build dist-minify clean
