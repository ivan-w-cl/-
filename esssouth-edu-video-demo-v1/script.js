/* 配音稿与分镜数据：一行旁白 = 一个字幕段的来源；[[ ]] 内为画面字幕高亮词（SRT 中去掉标记）。
   每行标注 kind：policy（官方规定）/ example（假设算例）/ advice（作者建议）/ product（产品画面）。
   src 对应 SOURCES 的键。时长按 1.25 倍语速约每秒 5.6 字估算，换成真实配音后用 tools/retime 重新对齐。 */
const SOURCES = {
  xj_js: ['西交利物浦大学 2026 年在江苏省综合评价招生简章', 'https://www.xjtlu.edu.cn/wp-content/uploads/2026/04/bf2775ec98e5c8b14e47a37c5218f575.pdf', '2026 · 江苏 · 西浦综合评价'],
  xj_gd: ['西交利物浦大学 2026 年在广东省综合评价招生简章', 'https://www.xjtlu.edu.cn/wp-content/uploads/2026/04/6e0b4d1bfbed86958729f625e16db083.pdf', '2026 · 广东 · 西浦综合评价'],
  cu_js: ['香港中文大学（深圳）2026 年江苏省综合评价招生简章', 'https://admissions.cuhk.edu.cn/article/2380', '2026 · 江苏 · 港中深综合评价'],
  cu_gd: ['香港中文大学（深圳）2026 年广东省综合评价招生简章', 'https://admissions.cuhk.edu.cn/article/2377', '2026 · 广东 · 港中深综合评价'],
};

const SCENES = [
  { id: 'hook', lines: [
    { kind: 'advice', t: '同样准备高考，有的同学还多参加了一场[[学校面试]]。' },
    { kind: 'advice', t: '这场面试，到底给了他什么？' },
  ] },
  { id: 'define', src: 'xj_js', lines: [
    { kind: 'policy', t: '综合评价，是在高考成绩之外，把[[学校自己的考核]]也算进总成绩。' },
    { kind: 'policy', t: '以西浦 2026 年江苏的简章为例，综合成绩满分 100 分：' },
    { kind: 'policy', t: '高考投档成绩折算成百分制，占 [[65%]]；学校面试，占 [[35%]]。' },
  ] },
  { id: 'example', lines: [
    { kind: 'example', t: '用一个[[假设]]的例子算一算。' },
    { kind: 'example', t: '小 A 高考 600 分、面试 90 分；小 B 高考 615 分、面试 70 分。' },
  ] },
  { id: 'calc', product: 'A-calculator', lines: [
    { kind: 'product', t: '按满分 750 折算，小 A 的综合成绩是 [[83.50]]，小 B 是 [[77.80]]。' },
    { kind: 'product', t: '高考少了 15 分，面试把差距反了过来。' },
  ] },
  { id: 'first', lines: [
    { kind: 'advice', t: '这是综评多给的第一样东西：高考之外，[[一块可以靠准备争取的分数]]。' },
  ] },
  { id: 'caveat', src: 'xj_js', lines: [
    { kind: 'example', t: '不过，算例只说明权重，[[不代表录取结果]]。' },
    { kind: 'policy', t: '投档成绩还要先达到[[特殊类型招生控制线]]；面试没准备好，同样会被反超。' },
  ] },
  { id: 'second', src: ['xj_js', 'cu_js', 'cu_gd'], lines: [
    { kind: 'policy', t: '第二样东西，是[[多一次录取机会]]。' },
    { kind: 'policy', t: '西浦写明，没被综评录取，还能走本科批次；' },
    { kind: 'policy', t: '港中深也写明，[[不影响]]后面的志愿和录取。' },
  ] },
  { id: 'province', product: 'B-province', src: 'xj_gd', lines: [
    { kind: 'policy', t: '但换一个省，办法可能就不一样。' },
    { kind: 'product', t: '在广东，西浦是高考 65%、面试 30%、[[学考 5%]]，报名截止是 [[5 月 20 日]]。' },
    { kind: 'advice', t: '所以先确认[[哪个省、哪一年]]的简章。' },
  ] },
  { id: 'time', src: 'xj_js', lines: [
    { kind: 'policy', t: '多一次机会，也多一段安排：四五月报名，[[高考结束后不久]]就是面试。' },
  ] },
  { id: 'interview', src: 'xj_js', lines: [
    { kind: 'policy', t: '面试看什么？简章写的是：英语水平、综合素养和综合能力，[[不考专业知识]]。' },
    { kind: 'advice', t: '落到练习上，就是能用英语把[[观点和理由]]连起来说清楚。' },
  ] },
  { id: 'drill', product: 'C-drill', lines: [
    { kind: 'product', t: '只写观点，提示会指出缺理由；补上 because，再看一遍。' },
  ] },
  { id: 'end', lines: [
    { kind: 'advice', t: '综评多给的，是[[一次额外的评价]]和[[一次额外的录取机会]]；代价是门槛、时间和准备。' },
    { kind: 'advice', t: '值不值得报，先看三件事：在哪个省，高考能否稳过控制线，愿不愿意留时间准备面试。' },
  ] },
];
