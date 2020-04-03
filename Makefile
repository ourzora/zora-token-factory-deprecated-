.PHONY: all
all: test

.PHONY: install
install:
	npm install

.PHONY: compile
compile:
	npx buidler compile

.PHONY: test
test:
	npm test

.PHONY: deploy/ropsten
deploy/ropsten:
	test -n "$(PRIVATE_KEY)" # $$PRIVATE_KEY required
	npx buidler run --network ropsten scripts/deploy.js

.PHONY: deploy/rinkeby
deploy/rinkeby:
	test -n "$(PRIVATE_KEY)" # $$PRIVATE_KEY required
	npx buidler run --network rinkeby scripts/deploy.js

.PHONY: deploy/mainnet
deploy/mainnet:
	test -n "$(PRIVATE_KEY)" # $$PRIVATE_KEY required
	npx buidler run --network mainnet scripts/deploy.js

.PHONY: flatten
flatten:
	@ npx buidler flatten