/* 真实配音时长（秒），按行号填写，例如 { "S01L1": 3.42, … }。为 null 时按字数估算。
   录好配音后可运行 node tools/set-voice.cjs voice/*.wav 自动生成。 */
window.VOICE_DURATIONS = null;
