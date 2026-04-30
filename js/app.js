const App = {
    currentDate: null,

    init: function() {
        this.currentDate = new Date();
        this.bindEvents();
        this.updateDisplay();
    },

    bindEvents: function() {
        document.getElementById('search-btn').addEventListener('click', () => this.search());
        document.getElementById('prev-btn').addEventListener('click', () => this.prevDay());
        document.getElementById('next-btn').addEventListener('click', () => this.nextDay());
        document.getElementById('today-btn').addEventListener('click', () => this.goToToday());
        
        document.getElementById('date-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.search();
            }
        });
    },

    search: function() {
        const dateInput = document.getElementById('date-input').value;
        if (!dateInput) {
            this.showError('请选择日期');
            return;
        }

        const date = new Date(dateInput);
        if (isNaN(date.getTime())) {
            this.showError('请输入有效的日期');
            return;
        }

        this.currentDate = date;
        this.updateDisplay();
    },

    prevDay: function() {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.updateDisplay();
    },

    nextDay: function() {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.updateDisplay();
    },

    goToToday: function() {
        this.currentDate = new Date();
        this.updateDisplay();
    },

    updateDisplay: function() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth() + 1;
        const day = this.currentDate.getDate();

        document.getElementById('date-input').value = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const lunarInfo = Lunar.solarToLunar(year, month, day);
        const almanac = Almanac.getAlmanac(year, month, day, lunarInfo);
        const constellation = Lunar.getConstellation(month, day);
        const solarTerm = Lunar.getSolarTerm(year, month, day);

        this.updateSolarInfo(year, month, day);
        this.updateLunarInfo(lunarInfo);
        this.updateAdditionalInfo(constellation, solarTerm);
        this.updateAlmanac(almanac);
    },

    updateSolarInfo: function(year, month, day) {
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekday = weekdays[this.currentDate.getDay()];
        
        document.getElementById('solar-date').textContent = `${year}年${month}月${day}日`;
        document.getElementById('weekday').textContent = `星期${weekday}`;
    },

    updateLunarInfo: function(lunarInfo) {
        document.getElementById('lunar-date').textContent = `${lunarInfo.monthName}${lunarInfo.dayName}`;
        document.getElementById('lunar-year').textContent = `${lunarInfo.year}年 ${lunarInfo.yearName}年`;
        document.getElementById('zodiac').textContent = lunarInfo.animal;
    },

    updateAdditionalInfo: function(constellation, solarTerm) {
        document.getElementById('constellation').textContent = constellation;
        
        const solarTermEl = document.getElementById('solar-term');
        if (solarTerm) {
            solarTermEl.textContent = solarTerm;
            solarTermEl.parentElement.style.display = 'block';
        } else {
            solarTermEl.parentElement.style.display = 'none';
        }
    },

    updateAlmanac: function(almanac) {
        const yiList = document.getElementById('yi-list');
        yiList.innerHTML = almanac.yi.map(item => `<span class="tag tag-yi">${item}</span>`).join('');

        const jiList = document.getElementById('ji-list');
        jiList.innerHTML = almanac.ji.map(item => `<span class="tag tag-ji">${item}</span>`).join('');

        document.getElementById('chong').textContent = `${almanac.chong}${almanac.sha}方`;
        document.getElementById('tai-shen').textContent = almanac.taiShen;
        document.getElementById('wu-xing').textContent = almanac.wuXing;
        document.getElementById('peng-zu').textContent = almanac.pengZu;
    },

    showError: function(message) {
        alert(message);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
