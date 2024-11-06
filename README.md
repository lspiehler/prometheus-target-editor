python3 -m venv .venv/mkdocs
source .venv/mkdocs/bin/activate
pip3 install mkdocs-material
mkdocs new .
mkdocs serve -a 0.0.0.0:8000
mkdocs build -d static

docker build -t lspiehler/prometheus-target-editor:c2be0b9 .
docker run --rm -it \
--name prometheus-target-editor \
-p 8000:8000 \
-v /var/docker/lcmc-prometheus/prometheus/file_sd_configs/ping:/var/node/prometheus-target-editor/target_dirs/ping \
lspiehler/prometheus-target-editor:c2be0b9