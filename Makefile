
help: 
	@printf "Available targets:\n\n"
	@awk '/^[a-zA-Z\-\0-9%:\\]+/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = $$1; \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
	gsub("\\\\", "", helpCommand); \
	gsub(":+$$", "", helpCommand); \
				printf "  \x1b[32;01m%-35s\x1b[0m %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST) | sort -u
	@printf "\n"

## Prepares the dev environment
dev: 
	./bin/pre-up
	docker-compose build

## Starts the dev environment (Mounts local folder)
dev-up:
	docker-compose up

## Builds the prod environment
prod:
	docker-compose -f ./docker-compose.prod.yaml build

## Starts the prod environment in daemon
prod-up:
	docker-compose -f ./docker-compose.prod.yaml up -d

## Cleans containers
clean:
	yes | docker-compose rm -s

## Cleans containers / node_modules in local folder
clean-all:
	yes | docker-compose rm -s
	sudo rm -rf ./client/node_modules
	sudo rm -rf ./server/node_modules
