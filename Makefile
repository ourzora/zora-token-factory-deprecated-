.PHONY: install
install:
	npm install

.PHONY: compile
compile:
	npx buidler compile

.PHONY: test
test:
	npm test

.PHONY: deploy
deploy:
	test -n "$(PRIVATE_KEY)" # $$PRIVATE_KEY required
	npx buidler run --network ropsten scripts/deploy.js
