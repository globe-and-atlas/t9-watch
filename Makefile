.PHONY: install test build health help

install: ## Install Clay for the Pebble settings page
	npm install --prefix watchface

test: ## Run host C model checks
	python3 execution/build.py --host-only

build: ## Run host checks and build emery PBW
	python3 execution/build.py

health: ## Check project structure
	python3 scripts/health_check.py

help: ## Show commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-12s %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
