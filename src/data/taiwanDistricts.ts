export interface District {
  name: string;
  zip: string;
}

export interface City {
  name: string;
  districts: District[];
}

export const TAIWAN_CITIES: City[] = [
  {
    name: "臺北市",
    districts: [
      { name: "中正區", zip: "100" },
      { name: "大同區", zip: "103" },
      { name: "中山區", zip: "104" },
      { name: "松山區", zip: "105" },
      { name: "大安區", zip: "106" },
      { name: "萬華區", zip: "108" },
      { name: "信義區", zip: "110" },
      { name: "士林區", zip: "111" },
      { name: "北投區", zip: "112" },
      { name: "內湖區", zip: "114" },
      { name: "南港區", zip: "115" },
      { name: "文山區", zip: "116" },
    ]
  },
  {
    name: "新北市",
    districts: [
      { name: "板橋區", zip: "220" },
      { name: "三重區", zip: "241" },
      { name: "中和區", zip: "235" },
      { name: "永和區", zip: "234" },
      { name: "新莊區", zip: "242" },
      { name: "新店區", zip: "231" },
      { name: "樹林區", zip: "238" },
      { name: "鶯歌區", zip: "239" },
      { name: "三峽區", zip: "237" },
      { name: "淡水區", zip: "251" },
      { name: "汐止區", zip: "221" },
      { name: "瑞芳區", zip: "224" },
      { name: "土城區", zip: "236" },
      { name: "蘆洲區", zip: "247" },
      { name: "五股區", zip: "248" },
      { name: "泰山區", zip: "243" },
      { name: "林口區", zip: "244" },
      { name: "深坑區", zip: "222" },
      { name: "石碇區", zip: "223" },
      { name: "坪林區", zip: "229" },
      { name: "三芝區", zip: "252" },
      { name: "石門區", zip: "253" },
      { name: "八里區", zip: "249" },
      { name: "平溪區", zip: "226" },
      { name: "雙溪區", zip: "227" },
      { name: "貢寮區", zip: "228" },
      { name: "金山區", zip: "208" },
      { name: "萬里區", zip: "207" },
      { name: "烏來區", zip: "233" }
    ]
  },
  {
    name: "桃園市",
    districts: [
      { name: "桃園區", zip: "330" },
      { name: "中壢區", zip: "320" },
      { name: "平鎮區", zip: "324" },
      { name: "八德區", zip: "334" },
      { name: "楊梅區", zip: "326" },
      { name: "蘆竹區", zip: "338" },
      { name: "大溪區", zip: "335" },
      { name: "龍潭區", zip: "325" },
      { name: "龜山區", zip: "333" },
      { name: "大園區", zip: "337" },
      { name: "觀音區", zip: "328" },
      { name: "新屋區", zip: "327" },
      { name: "復興區", zip: "336" }
    ]
  },
  {
    name: "臺中市",
    districts: [
      { name: "中區", zip: "400" },
      { name: "東區", zip: "401" },
      { name: "南區", zip: "402" },
      { name: "西區", zip: "403" },
      { name: "北區", zip: "404" },
      { name: "北屯區", zip: "406" },
      { name: "西屯區", zip: "407" },
      { name: "南屯區", zip: "408" },
      { name: "太平區", zip: "411" },
      { name: "大里區", zip: "412" },
      { name: "霧峰區", zip: "413" },
      { name: "烏日區", zip: "414" },
      { name: "豐原區", zip: "420" },
      { name: "后里區", zip: "421" },
      { name: "潭子區", zip: "427" },
      { name: "大雅區", zip: "428" },
      { name: "神岡區", zip: "429" },
      { name: "新社區", zip: "426" },
      { name: "東勢區", zip: "423" },
      { name: "和平區", zip: "424" },
      { name: "沙鹿區", zip: "433" },
      { name: "梧棲區", zip: "435" },
      { name: "清水區", zip: "436" },
      { name: "大甲區", zip: "437" },
      { name: "外埔區", zip: "438" },
      { name: "大安區", zip: "439" },
      { name: "龍井區", zip: "434" },
      { name: "大肚區", zip: "432" }
    ]
  },
  {
    name: "臺南市",
    districts: [
      { name: "中西區", zip: "700" },
      { name: "東區", zip: "701" },
      { name: "南區", zip: "702" },
      { name: "北區", zip: "704" },
      { name: "安平區", zip: "708" },
      { name: "安南區", zip: "709" },
      { name: "永康區", zip: "710" },
      { name: "歸仁區", zip: "711" },
      { name: "新化區", zip: "712" },
      { name: "左鎮區", zip: "713" },
      { name: "玉井區", zip: "714" },
      { name: "楠西區", zip: "715" },
      { name: "南化區", zip: "716" },
      { name: "仁德區", zip: "717" },
      { name: "關廟區", zip: "718" },
      { name: "龍崎區", zip: "719" },
      { name: "官田區", zip: "720" },
      { name: "麻豆區", zip: "721" },
      { name: "佳里區", zip: "722" },
      { name: "西港區", zip: "723" },
      { name: "七股區", zip: "724" },
      { name: "將軍區", zip: "725" },
      { name: "學甲區", zip: "726" },
      { name: "北門區", zip: "727" },
      { name: "新營區", zip: "730" },
      { name: "後壁區", zip: "731" },
      { name: "白河區", zip: "732" },
      { name: "東山區", zip: "733" },
      { name: "六甲區", zip: "734" },
      { name: "下營區", zip: "735" },
      { name: "柳營區", zip: "736" },
      { name: "鹽水區", zip: "737" },
      { name: "善化區", zip: "741" },
      { name: "大內區", zip: "742" },
      { name: "山上區", zip: "743" },
      { name: "新市區", zip: "744" },
      { name: "安定區", zip: "745" }
    ]
  },
  {
    name: "高雄市",
    districts: [
      { name: "新興區", zip: "800" },
      { name: "前金區", zip: "801" },
      { name: "苓雅區", zip: "802" },
      { name: "鹽埕區", zip: "803" },
      { name: "鼓山區", zip: "804" },
      { name: "旗津區", zip: "805" },
      { name: "前鎮區", zip: "806" },
      { name: "三民區", zip: "807" },
      { name: "楠梓區", zip: "811" },
      { name: "小港區", zip: "812" },
      { name: "左營區", zip: "813" },
      { name: "仁武區", zip: "814" },
      { name: "大社區", zip: "815" },
      { name: "岡山區", zip: "820" },
      { name: "路竹區", zip: "821" },
      { name: "阿蓮區", zip: "822" },
      { name: "田寮區", zip: "823" },
      { name: "燕巢區", zip: "824" },
      { name: "橋頭區", zip: "825" },
      { name: "梓官區", zip: "826" },
      { name: "彌陀區", zip: "827" },
      { name: "永安區", zip: "828" },
      { name: "湖內區", zip: "829" },
      { name: "鳳山區", zip: "830" },
      { name: "大寮區", zip: "831" },
      { name: "林園區", zip: "832" },
      { name: "鳥松區", zip: "833" },
      { name: "大樹區", zip: "840" },
      { name: "旗山區", zip: "842" },
      { name: "美濃區", zip: "843" },
      { name: "六龜區", zip: "844" },
      { name: "內門區", zip: "845" },
      { name: "杉林區", zip: "846" },
      { name: "甲仙區", zip: "847" },
      { name: "桃源區", zip: "848" },
      { name: "那瑪夏區", zip: "849" },
      { name: "茂林區", zip: "851" },
      { name: "茄萣區", zip: "852" }
    ]
  },
  {
    name: "新竹市",
    districts: [
      { name: "東區", zip: "300" },
      { name: "北區", zip: "300" },
      { name: "香山區", zip: "300" }
    ]
  },
  {
    name: "新竹縣",
    districts: [
      { name: "竹北市", zip: "302" },
      { name: "竹東鎮", zip: "310" },
      { name: "新埔鎮", zip: "305" },
      { name: "關西鎮", zip: "306" },
      { name: "湖口鄉", zip: "303" },
      { name: "新豐鄉", zip: "304" },
      { name: "芎林鄉", zip: "307" },
      { name: "橫山鄉", zip: "312" },
      { name: "北埔鄉", zip: "314" },
      { name: "寶山鄉", zip: "308" },
      { name: "峨眉鄉", zip: "315" },
      { name: "尖石鄉", zip: "313" },
      { name: "五峰鄉", zip: "311" }
    ]
  },
  {
    name: "基隆市",
    districts: [
      { name: "仁愛區", zip: "200" },
      { name: "信義區", zip: "201" },
      { name: "中正區", zip: "202" },
      { name: "中山區", zip: "203" },
      { name: "安樂區", zip: "204" },
      { name: "暖暖區", zip: "205" },
      { name: "七堵區", zip: "206" }
    ]
  },
  {
    name: "彰化縣",
    districts: [
      { name: "彰化市", zip: "500" },
      { name: "員林市", zip: "510" },
      { name: "和美鎮", zip: "508" },
      { name: "鹿港鎮", zip: "505" },
      { name: "溪湖鎮", zip: "514" },
      { name: "二林鎮", zip: "526" },
      { name: "田中鎮", zip: "520" },
      { name: "北斗鎮", zip: "521" }
    ]
  }
];
