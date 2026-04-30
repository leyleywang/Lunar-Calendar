const Lunar = require('./js/lunar.js');

console.log('=== 农历数据完整性检查 ===\n');

// 1. 检查数据范围
console.log('=== 1. 数据范围检查 ===');
const dataCount = Lunar.lunarInfo.length;
console.log(`数据条目数: ${dataCount}`);
console.log(`数据范围: 1900 - ${1900 + dataCount - 1} 年\n`);

// 2. 检查每年的正月初一是否正确衔接
console.log('=== 2. 每年正月初一连续性检查 ===\n');

// 已知的一些正确的正月初一日期（公历）
const knownNewYearDates = [
    { year: 1900, date: '1900-01-31' },
    { year: 1901, date: '1901-02-19' },
    { year: 1910, date: '1910-02-10' },
    { year: 1920, date: '1920-02-20' },
    { year: 1930, date: '1930-01-30' },
    { year: 1940, date: '1940-02-08' },
    { year: 1949, date: '1949-01-29' },
    { year: 1950, date: '1950-02-17' },
    { year: 1960, date: '1960-01-28' },
    { year: 1970, date: '1970-02-06' },
    { year: 1980, date: '1980-02-16' },
    { year: 1984, date: '1984-02-02' },
    { year: 1986, date: '1986-02-09' },
    { year: 1987, date: '1987-01-29' },
    { year: 1988, date: '1988-02-17' },
    { year: 1990, date: '1990-01-27' },
    { year: 2000, date: '2000-02-05' },
    { year: 2010, date: '2010-02-14' },
    { year: 2020, date: '2020-01-25' },
    { year: 2023, date: '2023-01-22' },
    { year: 2024, date: '2024-02-10' },
    { year: 2025, date: '2025-01-29' },
    { year: 2030, date: '2030-02-03' },
    { year: 2050, date: '2050-01-23' },
    { year: 2100, date: '2100-02-09' },
];

console.log('验证已知正月初一日期:');
knownNewYearDates.forEach(({ year, date }) => {
    const [y, m, d] = date.split('-').map(Number);
    const result = Lunar.solarToLunar(y, m, d);
    const isFirstDay = result.month === 1 && result.day === 1;
    const status = isFirstDay ? '✓' : '✗';
    if (!isFirstDay) {
        console.log(`${status} ${date} (${year}年正月初一) -> 实际: ${result.monthName}${result.dayName}`);
    } else {
        console.log(`${status} ${date} (${year}年正月初一) -> 正确`);
    }
});

// 3. 检查数据连续性：每年正月初一应该是前一年除夕的第二天
console.log('\n=== 3. 数据连续性检查 ===\n');

let errors = 0;
for (let year = 1901; year <= 2100; year++) {
    // 获取今年正月初一
    let newYearDate = null;
    for (let month = 1; month <= 2; month++) {
        for (let day = 1; day <= 31; day++) {
            try {
                const lunar = Lunar.solarToLunar(year, month, day);
                if (lunar.month === 1 && lunar.day === 1) {
                    newYearDate = new Date(year, month - 1, day);
                    break;
                }
            } catch (e) {
                // 跳过无效日期
            }
        }
        if (newYearDate) break;
    }

    if (!newYearDate) {
        console.log(`✗ 找不到 ${year} 年正月初一`);
        errors++;
        continue;
    }

    // 检查前一天是否是去年除夕（腊月廿九或三十）
    const prevDate = new Date(newYearDate);
    prevDate.setDate(prevDate.getDate() - 1);
    
    const prevLunar = Lunar.solarToLunar(
        prevDate.getFullYear(), 
        prevDate.getMonth() + 1, 
        prevDate.getDate()
    );
    
    const isNewYearEve = prevLunar.month === 12 && (prevLunar.day === 29 || prevLunar.day === 30);
    
    if (!isNewYearEve) {
        const dateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}`;
        console.log(`✗ ${year}年正月初一前一天(${dateStr})应该是除夕，但实际是 ${prevLunar.monthName}${prevLunar.dayName}`);
        errors++;
    }
}

if (errors === 0) {
    console.log('✓ 所有年份的正月初一与前一年除夕衔接正确');
}

// 4. 检查1987年（已知有问题的年份）的数据
console.log('\n=== 4. 1987年数据详细检查 ===\n');

const testDates1987 = [
    { solar: '1987-01-29', lunar: '正月初一' },
    { solar: '1987-06-26', lunar: '六月初一' },
    { solar: '1987-07-26', lunar: '闰六月初一', isLeap: true },
    { solar: '1987-08-24', lunar: '七月初一' },
    { solar: '1987-09-13', lunar: '七月廿一' },
    { solar: '1987-09-22', lunar: '七月三十' },
    { solar: '1987-09-23', lunar: '八月初一' },
];

console.log('1987年关键日期验证:');
testDates1987.forEach(({ solar, lunar, isLeap }) => {
    const [year, month, day] = solar.split('-').map(Number);
    const result = Lunar.solarToLunar(year, month, day);
    const actual = `${result.isLeap ? '闰' : ''}${Lunar.lunarMonths[result.month - 1]}月${result.dayName}`;
    const match = actual === lunar && (isLeap === undefined || result.isLeap === isLeap);
    console.log(`${match ? '✓' : '✗'} ${solar} -> 期望: ${lunar}, 实际: ${actual}`);
});

// 5. 检查数据编码格式
console.log('\n=== 5. 数据编码分析 ===\n');

console.log('数据编码格式说明:');
console.log('  每个年份数据是一个20位的十六进制数');
console.log('  位17: 闰月大小 (1=30天, 0=29天)');
console.log('  位16-5: 12个月的大小 (1=30天, 0=29天) 正月到腊月');
console.log('  位4-1: 闰月月份 (0=无闰月)\n');

// 检查1900年的数据（基准）
const data1900 = Lunar.lunarInfo[0];
console.log('1900年数据:');
console.log(`  原始值: 0x${data1900.toString(16)}`);
console.log(`  二进制: ${data1900.toString(2).padStart(20, '0')}`);
console.log(`  闰月: ${Lunar.leapMonth(1900)}月`);
console.log(`  闰月天数: ${Lunar.leapDays(1900)}天`);
console.log(`  总天数: ${Lunar.lYearDays(1900)}天`);
console.log(`  各月天数: ${Array.from({length: 12}, (_, i) => Lunar.monthDays(1900, i + 1)).join(', ')}`);

// 6. 检查1897年数据情况
console.log('\n=== 6. 1897年数据检查 ===\n');

const year1897 = 1897;
if (year1897 - 1900 < 0) {
    console.log(`注意: 当前数据从1900年开始，缺少 ${year1897}-1899 年的数据`);
    console.log('1897-1899年的公历正月初一日期:');
    console.log('  1897年: 1897-02-02 (丁酉年正月初一)');
    console.log('  1898年: 1898-01-22 (戊戌年正月初一)');
    console.log('  1899年: 1899-02-10 (己亥年正月初一)');
}

// 7. 检查solarToLunar函数对1900年之前的处理
console.log('\n=== 7. solarToLunar函数边界检查 ===\n');

const testBefore1900 = Lunar.solarToLunar(1899, 12, 31);
console.log('1899-12-31 转换结果:');
console.log(`  农历: ${testBefore1900.year}年${testBefore1900.monthName}${testBefore1900.dayName}`);

const test1900Jan1 = Lunar.solarToLunar(1900, 1, 1);
console.log('\n1900-01-01 转换结果:');
console.log(`  农历: ${test1900Jan1.year}年${test1900Jan1.monthName}${test1900Jan1.dayName}`);

const test1900Jan31 = Lunar.solarToLunar(1900, 1, 31);
console.log('\n1900-01-31 转换结果(应该是正月初一):');
console.log(`  农历: ${test1900Jan31.year}年${test1900Jan31.monthName}${test1900Jan31.dayName}`);

// 8. 检查2100年之后的数据
console.log('\n=== 8. 2100年之后数据检查 ===\n');

const test2100 = Lunar.solarToLunar(2100, 2, 9);
console.log('2100-02-09 转换结果(应该是正月初一):');
console.log(`  农历: ${test2100.year}年${test2100.monthName}${test2100.dayName}`);

const test2101 = Lunar.solarToLunar(2101, 1, 1);
console.log('\n2101-01-01 转换结果:');
console.log(`  农历: ${test2101.year}年${test2101.monthName}${test2101.dayName}`);

console.log('\n=== 检查完成 ===');
