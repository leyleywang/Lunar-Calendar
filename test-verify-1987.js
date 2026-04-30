const Lunar = require('./js/lunar.js');

console.log('=== 验证1987年数据修复 ===\n');

// 验证数据编码
const data1987 = Lunar.lunarInfo[1987 - 1900];
console.log(`1987年数据: 0x${data1987.toString(16)}`);
console.log(`二进制: ${data1987.toString(2).padStart(20, '0')}\n`);

// 解码各月大小
console.log('各月大小:');
for (let month = 1; month <= 12; month++) {
    const mask = 1 << (16 - month);
    const is30 = (data1987 & mask) ? 1 : 0;
    console.log(`  ${month}月: ${is30 ? '30天' : '29天'}`);
}
console.log(`\n闰月: ${Lunar.leapMonth(1987)}月 (${Lunar.leapDays(1987)}天)`);
console.log(`总天数: ${Lunar.lYearDays(1987)}天\n`);

// 验证各月初一
console.log('=== 验证各月初一 ===\n');

const testFirstDays = [
    { date: '1987-01-29', lunar: '正月初一' },
    { date: '1987-02-28', lunar: '二月初一' },
    { date: '1987-03-29', lunar: '三月初一' },
    { date: '1987-04-28', lunar: '四月初一' },
    { date: '1987-05-27', lunar: '五月初一' },
    { date: '1987-06-26', lunar: '六月初一' },
    { date: '1987-07-26', lunar: '闰六月初一', isLeap: true },
    { date: '1987-08-24', lunar: '七月初一' },
    { date: '1987-09-23', lunar: '八月初一' },
    { date: '1987-10-23', lunar: '九月初一' },
    { date: '1987-11-21', lunar: '十月初一' },
    { date: '1987-12-21', lunar: '冬月初一' },
    { date: '1988-01-19', lunar: '腊月初一' },
];

let allPassed = true;
testFirstDays.forEach(({ date, lunar, isLeap }) => {
    const [y, m, d] = date.split('-').map(Number);
    const result = Lunar.solarToLunar(y, m, d);
    const actual = `${result.isLeap ? '闰' : ''}${Lunar.lunarMonths[result.month - 1]}月${result.dayName}`;
    const match = actual === lunar && (isLeap === undefined || result.isLeap === isLeap);
    if (!match) allPassed = false;
    console.log(`${match ? '✓' : '✗'} ${date} -> 期望: ${lunar}, 实际: ${actual}`);
});

// 验证关键日期
console.log('\n=== 验证关键日期 ===\n');

const keyDates = [
    { date: '1987-09-12', lunar: '七月二十' },
    { date: '1987-09-13', lunar: '七月廿一' },
    { date: '1987-09-14', lunar: '七月廿二' },
    { date: '1987-09-21', lunar: '七月廿九' },
    { date: '1987-09-22', lunar: '七月三十' },
    { date: '1987-09-23', lunar: '八月初一' },
];

keyDates.forEach(({ date, lunar }) => {
    const [y, m, d] = date.split('-').map(Number);
    const result = Lunar.solarToLunar(y, m, d);
    const actual = `${result.monthName}${result.dayName}`;
    const match = actual === lunar;
    if (!match) allPassed = false;
    console.log(`${match ? '✓' : '✗'} ${date} -> 期望: ${lunar}, 实际: ${actual}`);
});

// 验证前后年份
console.log('\n=== 验证前后年份 ===\n');

const yearTests = [
    { date: '1986-02-09', lunar: '正月初一' },
    { date: '1987-01-29', lunar: '正月初一' },
    { date: '1988-02-17', lunar: '正月初一' },
];

yearTests.forEach(({ date, lunar }) => {
    const [y, m, d] = date.split('-').map(Number);
    const result = Lunar.solarToLunar(y, m, d);
    const actual = `${result.monthName}${result.dayName}`;
    const match = actual === lunar;
    if (!match) allPassed = false;
    console.log(`${match ? '✓' : '✗'} ${date} -> 期望: ${lunar}, 实际: ${actual}`);
});

// 详细验证七月的每一天
console.log('\n=== 详细验证七月日期 ===\n');

console.log('从七月初一(1987-08-24)开始:');
let julyPassed = true;
for (let i = 0; i <= 30; i++) {
    const d = new Date(1987, 7, 24);
    d.setDate(24 + i);
    const lunar = Lunar.solarToLunar(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    const expectedDay = i + 1;
    const expectedMonth = (i < 29) ? 7 : 8;
    const expectedDayName = (i < 29) ? Lunar.lunarDays[i] : Lunar.lunarDays[i - 29];
    
    const match = lunar.month === expectedMonth && lunar.day === expectedDay;
    if (!match) julyPassed = false;
    
    if (i === 0 || i === 19 || i === 20 || i === 21 || i === 28 || i === 29) {
        console.log(`${match ? '✓' : '✗'} ${dateStr} -> 第${i + 1}天: ${lunar.monthName}${lunar.dayName}`);
    }
}

console.log('\n=== 总结 ===');
console.log(`所有测试${allPassed && julyPassed ? '通过 ✓' : '失败 ✗'}`);
