python3 -m venv .venv/mkdocs
source .venv/mkdocs/bin/activate
pip3 install mkdocs-material
mkdocs new .
mkdocs serve -a 0.0.0.0:8000
mkdocs build -d static