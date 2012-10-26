
NPM_MODULES = lodash requirejs coffee-script xregexp chai mocha

dependencies:
	sudo npm install -g $(NPM_MODULES)

tests:
	mocha --compilers coffee:coffee-script
