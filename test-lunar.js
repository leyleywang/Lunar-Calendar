const Lunar = require('./js/lunar.js');

console.log('=== 1987 年农历数据分析 ===');
console.log('');

const year1987 = 1987;
const lunarInfoIndex = year1987 - 1900;

console.log(`1987 年 lunarInfo 索引: ${lunarInfoIndex}`);
console.log(`lunarInfo[${lunarInfoIndex}] = 0x${Lunar.lunarInfo[lunarInfoIndex].toString(16)}`);
console.log('');

const leapMonth = Lunar.leapMonth(year1987);
console.log(`1987 年闰月: ${leapMonth} 月`);

const leapDays = Lunar.leapDays(year1987);
console.log(`1987 年闰月天数: ${leapDays} 天`);
console.log('');

console.log('=== 1987 年各月天数 ===');
for (let m = 1; m <= 12; m++) {
    const days = Lunar.monthDays(year1987, m);
    console.log(`农历 ${m} 月: ${days} 天`);
}
console.log('');

console.log('=== 1987 年全年天数 ===');
const yearDays = Lunar.lYearDays(year1987);
console.log(`1987 年农历全年天数: ${yearDays} 天`);
console.log('');

console.log('=== 测试 1987 年 9 月 14 日前后的日期 ===');
console.log('');

const testDates = [
    { y: 1987, m: 9, d: 10 },
    { y: 1987, m: 9, d: 11 },
    { y: 1987, m: 9, d: 12 },
    { y: 1987, m: 9, d: 13 },
    { y: 1987, m: 9, d: 14 },
    { y: 1987, m: 9, d: 15 },
    { y: 1987, m: 9, d: 16 },
    { y: 1987, m: 9, d: 17 },
    { y: 1987, m: 9, d: 18 },
];

console.log('公历日期 -> 农历日期');
console.log('-----------------------------------');
testDates.forEach(date => {
    const lunar = Lunar.solarToLunar(date.y, date.m, date.d);
    const leapStr = lunar.isLeap ? '(闰)' : '';
    console.log(`${date.y}-${date.m.toString().padStart(2, '0')}-${date.d.toString().padStart(2, '0')} -> 农历${lunar.year}年${leapStr}${lunar.monthName}${lunar.dayName} (${lunar.yearName}年 生肖:${lunar.animal})`);
});
console.log('');

console.log('=== 检查 1987 年农历七月的日期范围 ===');
console.log('');

const julyDates = [];
for (let d = 1; d <= 31; d++) {
    const lunar = Lunar.solarToLunar(1987, 9, d);
    if (lunar.month === 7 && !lunar.isLeap) {
        julyDates.push({
            solar: `1987-09-${d.toString().padStart(2, '0')}`,
            lunarDay: lunar.day
        });
    }
}

console.log('1987 年农历七月对应的公历日期:');
julyDates.forEach(d => {
    console.log(`${d.solar} -> 农历七月${Lunar.lunarDays[d.lunarDay - 1]}`);
});
console.log('');

if (julyDates.length > 0) {
    const days = julyDates.map(d => d.lunarDay);
    const minDay = Math.min(...days);
    const maxDay = Math.max(...days);
    console.log(`农历七月日期范围: ${minDay} - ${maxDay} 日`);
    console.log(`农历七月显示的天数: ${maxDay - minDay + 1} 天`);
}
