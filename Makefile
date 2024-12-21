# Simple Makefile for a Go project

# Build the application
# all: build test

build:
	@echo "Building..."
	@go build -o van-nav .

run-ui:
	@cd ./ui/website && pnpm start

run-api:
	@go run .

# Run the application
run:
	@go run .  &
	@cd ./ui && pnpm run start

# Clean the binary
clean:
	@echo "Cleaning..."
	@rm -f main

# Live Reload
watch:
	@if command -v air > /dev/null; then \
            air; \
            echo "Watching...";\
        else \
            read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
            if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
                go install github.com/air-verse/air@latest; \
                air; \
                echo "Watching...";\
            else \
                echo "You chose not to install air. Exiting..."; \
                exit 1; \
            fi; \
        fi

.PHONY: build run clean watch