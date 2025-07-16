.PHONY: help dcb dcd dcp dcu dcv

help:
	@echo "Available commands:"
	@echo "  dcb    - docker compose build"
	@echo "  dcd    - docker compose down"
	@echo "  dcp    - docker compose ps"
	@echo "  dcu    - docker compose up (detached)"
	@echo "  dcv    - docker compose down (with volumes)"
	@echo "  help   - Show this help message"

dcb:
	docker compose build

dcd:
	docker compose down

dcp:
	docker compose ps

dcu:
	docker compose up -d

dcv:
	docker compose down -v

