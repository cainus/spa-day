REPORTER = spec
test:
	$(MAKE) lint
	@NODE_ENV=test ./node_modules/.bin/mocha -b --reporter $(REPORTER) --recursive

lint:
	./node_modules/.bin/jshint ./test ./index.js

test-cov:
	$(MAKE) lint
	./node_modules/.bin/istanbul cover \
	./node_modules/mocha/bin/_mocha -- -b --reporter $(REPORTER) --check-leaks
	echo "See reports at ./coverage/lcov-report/index.html"

run :
	node index.js


.PHONY: test
