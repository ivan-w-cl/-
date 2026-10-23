#!/bin/sh
# 下载录制要用的字体（开源 OFL 授权）：标题用 Noto Sans SC，网页自己的手写字体 ZCOOL KuaiLe / Gochi Hand / Patrick Hand / Nunito。
# 放在 promo-video/fonts/（不进仓库）。需要 npm。
set -e
cd "$(dirname "$0")"; mkdir -p fonts/tmp
for p in noto-sans-sc@5.1.0 zcool-kuaile@5.3.0 gochi-hand@5.3.0 patrick-hand@5.3.0 nunito@5.3.0; do
  name=${p%@*}; (cd fonts/tmp && npm pack "@fontsource/$p" >/dev/null 2>&1)
  mkdir -p "fonts/$name" && tar xzf fonts/tmp/fontsource-$name-*.tgz -C "fonts/$name" --strip-components=1
done
rm -rf fonts/tmp; echo "fonts ready"
