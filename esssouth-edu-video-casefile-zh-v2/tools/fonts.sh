#!/usr/bin/env bash
# 下载本片用到的中文字体子集（Google Fonts 的 text= 参数，只含片中出现的字）到 public/fonts。
# 改了 src/CaseFileZh.tsx 或 src/script.json 里的中文后要重跑。字体均为 SIL 开源字体许可。
set -euo pipefail
cd "$(dirname "$0")/.."
TEXT=$(python3 -c "
import sys,re,urllib.parse
s=open('src/CaseFileZh.tsx',encoding='utf-8').read()+open('src/script.json',encoding='utf-8').read()
cs=sorted(set(c for c in s if ord(c)>127))+list('0123456789%/·:.-+=()ABCDEabcdefghijklmnopqrstuvwxyz ')
print(urllib.parse.quote(''.join(dict.fromkeys(cs))))")
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
get() { # family weight outfile
  local css url
  css=$(curl -fsS -A "$UA" "https://fonts.googleapis.com/css2?family=$1:wght@$2&text=$TEXT")
  url=$(printf '%s' "$css" | grep -o 'https://[^)]*' | head -1)
  curl -fsS -A "$UA" -o "public/fonts/$3" "$url"; echo "$3 $(stat -c %s public/fonts/$3) bytes"
}
get 'Noto+Sans+SC' 700 NotoSansSC-700.woff2
get 'Noto+Sans+SC' 900 NotoSansSC-900.woff2
get 'Noto+Serif+SC' 900 NotoSerifSC-900.woff2
get 'ZCOOL+KuaiLe' 400 ZCOOLKuaiLe.woff2
