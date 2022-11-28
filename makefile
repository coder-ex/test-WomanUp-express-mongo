kill:
	@docker rm -f $$(docker ps -aq -f status=exited)

down:
	@docker-compose --env-file=.env.local -f "docker-compose.local.yml" down

up:
	@docker-compose --env-file=.env.local -f "docker-compose.local.yml" up -d

build:
	@docker-compose --env-file=.env.local -f "docker-compose.local.yml" up -d --build

stop:
	@docker-compose -f "docker-compose.local.yml" stop

start:
	@docker-compose -f "docker-compose.local.yml" start

ps:
	@docker ps -a
