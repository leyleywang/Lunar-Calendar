const Almanac = {
    Yi: [
        "嫁娶", "祭祀", "祈福", "求嗣", "开光", "出行", "拆卸", "修造", "动土", "上梁",
        "安床", "纳财", "入宅", "开市", "立券", "纳畜", "栽种", "破土", "启钻", "安葬",
        "订盟", "纳采", "挂匾", "安门", "开池", "开厕", "结网", "会亲友", "谢土", "赴任",
        "移徙", "入殓", "移柩", "成服", "除服", "探病", "词讼", "开仓", "出货"
    ],

    Ji: [
        "入宅", "嫁娶", "祭祀", "祈福", "求嗣", "开光", "出行", "拆卸", "修造", "动土",
        "上梁", "安床", "纳财", "开市", "立券", "纳畜", "栽种", "破土", "启钻", "安葬",
        "订盟", "纳采", "挂匾", "安门", "开池", "开厕", "结网", "会亲友", "谢土", "赴任",
        "移徙", "入殓", "移柩", "成服", "除服", "探病", "词讼", "开仓", "出货"
    ],

    Directions: ["东", "西", "南", "北", "东南", "东北", "西南", "西北"],
    Rooms: ["房床", "门床", "厨床", "炉床", "床门", "床窗", "床厕", "床厨"],

    getDayIndex: function(year, month, day) {
        return year * 366 + month * 31 + day;
    },

    shuffleArray: function(arr, seed) {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            const j = seed % (i + 1);
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    getYi: function(year, month, day) {
        const index = this.getDayIndex(year, month, day);
        const shuffled = this.shuffleArray(this.Yi, index);
        const count = (index % 5) + 4;
        return shuffled.slice(0, count);
    },

    getJi: function(year, month, day) {
        const index = this.getDayIndex(year, month, day);
        const shuffled = this.shuffleArray(this.Ji, index + 1000);
        const count = (index % 4) + 3;
        return shuffled.slice(0, count);
    },

    getChong: function(year, month, day) {
        const dayZhi = (year - 4 + month + day) % 12;
        const chongZhi = (dayZhi + 6) % 12;
        const zhiNames = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        const animalNames = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
        
        return `冲${zhiNames[chongZhi]}(${animalNames[chongZhi]})煞`;
    },

    getSha: function(year, month, day) {
        const shaNames = ["东", "西", "南", "北"];
        const index = (year + month + day) % 4;
        return shaNames[index];
    },

    getTaiShen: function(year, month, day) {
        const index = this.getDayIndex(year, month, day);
        const direction = this.Directions[index % this.Directions.length];
        const room = this.Rooms[(index + 7) % this.Rooms.length];
        return `${room}${direction}`;
    },

    getPengZu: function(year, month, day) {
        const pengZuJi = [
            "甲不开仓财物耗散", "乙不栽植千株不长", "丙不修灶必见灾殃", "丁不剃头头必生疮",
            "戊不受田田主不祥", "己不破券二比并亡", "庚不经络织机虚张", "辛不合酱主人不尝",
            "壬不决水更难提防", "癸不词讼理弱敌强", "子不问卜自惹祸殃", "丑不冠带主不还乡",
            "寅不祭祀神鬼不尝", "卯不穿井水泉不香", "辰不哭泣必主重丧", "巳不远行财物伏藏",
            "午不苫盖屋主更张", "未不服药毒气入肠", "申不安床鬼祟入房", "酉不会客醉坐颠狂",
            "戌不吃犬作怪上床", "亥不嫁娶不利新郎"
        ];
        
        const index = (year - 4 + month + day) % 22;
        return pengZuJi[index];
    },

    getWuXing: function(year, month, day) {
        const wuXing = ["金", "木", "水", "火", "土"];
        const index = (year + month + day) % 5;
        return wuXing[index];
    },

    getAlmanac: function(solarYear, solarMonth, solarDay, lunarInfo) {
        return {
            yi: this.getYi(solarYear, solarMonth, solarDay),
            ji: this.getJi(solarYear, solarMonth, solarDay),
            chong: this.getChong(solarYear, solarMonth, solarDay),
            sha: this.getSha(solarYear, solarMonth, solarDay),
            taiShen: this.getTaiShen(solarYear, solarMonth, solarDay),
            pengZu: this.getPengZu(solarYear, solarMonth, solarDay),
            wuXing: this.getWuXing(solarYear, solarMonth, solarDay)
        };
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Almanac;
}
