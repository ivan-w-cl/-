#!/bin/sh
# Exports all five versions, two at a time.
cd "$(dirname "$0")/.."
(node tools/export-mp4.cjs xjtlu js && node tools/export-mp4.cjs cuhksz js && node tools/export-mp4.cjs silc all) &
(node tools/export-mp4.cjs xjtlu gd && node tools/export-mp4.cjs cuhksz gd) &
wait
