"""把录好的帧拼成一张联系表（一排缩略图），检查排版用。
用法：python3 sheet.py <帧目录> <帧率> <输出.png> <秒> [<秒> …]"""
import sys
from PIL import Image
d, fps, out, ts = sys.argv[1], float(sys.argv[2]), sys.argv[3], [float(x) for x in sys.argv[4:]]
ims = [Image.open(f'{d}/{round(t * fps):05d}.jpg').convert('RGB').resize((240, 427)) for t in ts]
w = Image.new('RGB', (240 * len(ims), 427), 'white')
for i, im in enumerate(ims): w.paste(im, (i * 240, 0))
w.save(out); print(out)
