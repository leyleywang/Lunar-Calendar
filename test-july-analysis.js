const Lunar = require('./js/lunar.js');

console.log('=== 详细分析1987年七月天数问题 ===\n');

// 当前数据
const data1987 = Lunar.lunarInfo[1987 - 1900];
console.log(`1987年数据: 0x${data1987.toString(16)}`);
console.log(`二进制: ${data1987.toString(2).padStart(20, '0')}\n`);

// 解码各月大小
console.log('各月大小（位16-5，正月到腊月）:');
for (let month = 1; month <= 12; month++) {
    const mask = 1 << (16 - month);
    const is30 = (data1987 & mask) ? 1 : 0;
    const bitPos = 17 - month;
    console.log(`  ${month}月: ${is30 ? '30天' : '29天'} (位${bitPos}: ${is30})`);
}

console.log(`\n闰月: ${Lunar.leapMonth(1987)}月`);
console.log(`闰月天数: ${Lunar.leapDays(1987)}天`);
console.log(`1987年总天数: ${Lunar.lYearDays(1987)}天\n`);

// 验证从正月初一开始的各月初一日期
console.log('=== 验证各月初一日期 ===\n');

// 1987年正月初一是1987-01-29
const startDate = new Date(1987, 0, 29);
console.log(`1987年正月初一: 1987-01-29\n`);

// 根据各月天数计算各月初一应该是哪一天
const monthDays = [];
for (let m = 1; m <= 12; m++) {
    monthDays.push(Lunar.monthDays(1987, m));
}
const leapMonth = Lunar.leapMonth(1987);
const leapDays = Lunar.leapDays(1987);

console.log('根据数据计算的各月初一:');
let currentDate = new Date(startDate);
for (let m = 1; m <= 12; m++) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    
    // 实际验证
    const actual = Lunar.solarToLunar(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    const isFirstDay = actual.month === m && actual.day === 1;
    
    console.log(`  ${m}月初一: ${dateStr} (${isFirstDay ? '✓' : '✗'} 实际: ${actual.monthName}${actual.dayName})`);
    
    // 检查闰月
    if (m === leapMonth) {
        currentDate = new Date(currentDate.getTime() + leapDays * 86400000);
        const leapDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        const leapActual = Lunar.solarToLunar(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
        const isLeapFirstDay = leapActual.month === m && leapActual.day === 1 && leapActual.isLeap;
        console.log(`  闰${m}月初一: ${leapDateStr} (${isLeapFirstDay ? '✓' : '✗'} 实际: ${leapActual.monthName}${leapActual.dayName}, isLeap:${leapActual.isLeap})`);
    }
    
    currentDate = new Date(currentDate.getTime() + monthDays[m - 1] * 86400000);
}

// 详细验证七月的日期
console.log('\n=== 详细验证七月日期 ===\n');

// 七月初一应该是1987-08-24
const july1 = new Date(1987, 7, 24);
const july1Lunar = Lunar.solarToLunar(1987, 8, 24);
console.log(`1987-08-24 (应该是七月初一): ${july1Lunar.monthName}${july1Lunar.dayName}`);

// 七月应该有30天（根据数据），所以七月三十应该是1987-09-22
// 从8月24日开始数30天：
// 8月剩余：31-24 = 7天（25,26,27,28,29,30,31）
// 9月：30-7 = 23天？不对，让我重新计算

// 8月24日是第1天（初一）
// 8月24日 + 29天 = 9月22日（三十）
// 8月24日 + 30天 = 9月23日（八月初一）

console.log('\n从七月初一(1987-08-24)开始计算:');
for (let i = 0; i <= 31; i++) {
    const d = new Date(1987, 7, 24);
    d.setDate(24 + i);
    const lunar = Lunar.solarToLunar(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    // 标记特殊日期
    let note = '';
    if (lunar.day === 1) note += ' [初一]';
    if (lunar.day === 30) note += ' [三十]';
    if (lunar.day === 29 && Lunar.monthDays(1987, lunar.month) === 29) note += ' [月末]';
    
    console.log(`  ${dateStr} -> 第${i + 1}天: ${lunar.monthName}${lunar.dayName}${note}`);
}

// 检查实际历史数据
console.log('\n=== 验证历史数据 ===\n');

// 根据历史记录，1987年农历：
// 七月初一: 1987-08-24
// 七月三十: 1987-09-22 (如果七月是30天)
// 或
// 七月廿九: 1987-09-21 (如果七月是29天)
// 八月初一: 1987-09-22 或 1987-09-23

console.log('关键日期验证:');
const keyDates = [
    { date: '1987-09-21', desc: '如果七月29天，应该是七月廿九' },
    { date: '1987-09-22', desc: '如果七月30天，应该是七月三十；如果七月29天，应该是八月初一' },
    { date: '1987-09-23', desc: '如果七月30天，应该是八月初一' },
];

keyDates.forEach(({ date, desc }) => {
    const [y, m, d] = date.split('-').map(Number);
    const lunar = Lunar.solarToLunar(y, m, d);
    console.log(`  ${date} -> ${lunar.monthName}${lunar.dayName} (${desc})`);
});

// 检查数据编码问题
console.log('\n=== 数据分析 ===\n');

// 当前数据 0xa766 = 0000 1010 0111 0110 0110
// 位16-5 (正月到腊月):
// 位16: 1 (正月30天)
// 位15: 0 (二月29天)
// 位14: 1 (三月30天)
// 位13: 0 (四月29天)
// 位12: 0 (五月29天) ✓ (之前修复的)
// 位11: 1 (六月30天)
// 位10: 1 (七月30天) ← 这里可能有问题？
// 位9: 1 (八月30天)
// 位8: 0 (九月29天)
// 位7: 1 (十月30天)
// 位6: 1 (冬月30天)
// 位5: 0 (腊月29天)

// 验证从正月初一到七月初一的总天数
console.log('从正月初一到七月初一的天数计算:');
console.log('  正月: 30天');
console.log('  二月: 29天');
console.log('  三月: 30天');
console.log('  四月: 29天');
console.log('  五月: 29天');
console.log('  六月: 30天');
console.log('  闰六月: 29天');
const totalToJuly1 = 30 + 29 + 30 + 29 + 29 + 30 + 29;
console.log(`  总计: ${totalToJuly1}天\n`);

console.log('从1987-01-29(正月初一)加${totalToJuly1}天:');
const testDate = new Date(1987, 0, 29);
testDate.setDate(testDate.getDate() + totalToJuly1);
console.log(`  ${testDate.getFullYear()}-${String(testDate.getMonth() + 1).padStart(2, '0')}-${String(testDate.getDate()).padStart(2, '0')}`);
console.log(`  期望: 1987-08-24 (七月初一)\n`);

// 如果七月是29天而不是30天，那么位10应该是0
// 0xa766 & ~0x200 = 0xa566

console.log('如果七月是29天（位10=0），数据应该是 0xa566');
const proposedData = 0xa566;
console.log(`  0xa766 (当前) -> 0xa566 (建议) = 减去 0x200\n`);

// 验证总天数变化
console.log('总天数验证:');
const currentExtraDays = 7; // 正月、三月、五月、六月、七月、八月、十月、冬月 - 等等让我重新数
// 位16=1, 位14=1, 位12=0, 位11=1, 位10=1, 位9=1, 位7=1, 位6=1
// 正月(30)、三月(30)、六月(30)、七月(30)、八月(30)、十月(30)、冬月(30) = 7个大月
const currentTotal = 348 + 7 + 29; // 基准348 + 7个大月 + 闰6月29天
console.log(`  当前总天数: 348 + 7 + 29 = ${currentTotal}天`);

// 如果七月改成29天，大月数量变成6，需要把另一个小月改成大月
// 之前修复时，我们把五月(30→29)，冬月(29→30)
// 现在如果七月(30→29)，需要把另一个小月改成大月

// 让我检查1988年正月初一是否正确
console.log('\n=== 验证1988年正月初一 ===\n');
const newYear1988 = Lunar.solarToLunar(1988, 2, 17);
console.log(`1988-02-17 (应该是1988年正月初一): ${newYear1988.year}年${newYear1988.monthName}${newYear1988.dayName}`);

// 1987年总天数应该是多少？
// 从1987-01-29到1988-02-16（除夕）应该是384天
const start1987 = new Date(1987, 0, 29);
const newYearEve1987 = new Date(1988, 1, 16);
const daysIn1987 = Math.floor((newYearEve1987 - start1987) / 86400000) + 1;
console.log(`\n从1987-01-29到1988-02-16的天数: ${daysIn1987}天`);
console.log(`1987年应该有${daysIn1987}天`);
console.log(`当前数据计算的1987年天数: ${Lunar.lYearDays(1987)}天`);
