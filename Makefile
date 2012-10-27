#
# Makefile
# --------
#
#  Targets:
#
#     deps:
#     	install npm dependencies
#
#     tests:
#     	run mocha tests in node.js
#
NPM_MODULES = lodash requirejs coffee-script xregexp chai mocha amdefine

deps:
	sudo npm install $(NPM_MODULES)

tests:
	NODE_PATHS=../src mocha --compilers coffee:coffee-script -R list -r chai

# compile a js file using r.js
build:
	r.js build.js
