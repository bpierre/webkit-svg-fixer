
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

dist: dist-build dist-minify

dist-build:
	@component build --standalone webkitSvgFixer --out dist --name webkit-svg-fixer

dist-minify: dist/webkit-svg-fixer.js
	@curl -s \
		-d compilation_level=SIMPLE_OPTIMIZATIONS \
		-d output_format=text \
		-d output_info=compiled_code \
		--data-urlencode "js_code@$<" \
		http://closure-compiler.appspot.com/compile \
		> $<.tmp
	@mv $<.tmp dist/webkit-svg-fixer.min.js

clean:
	rm -rf build components dist template.js

.PHONY: build components dist dist-build dist-minify clean
