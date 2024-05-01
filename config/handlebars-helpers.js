module.exports = {
    // 1. 리스트 길이 구하는 함수
    lengthOfList: (list = []) => list.length,
    // 2. 두 값이 같은지 비교하는 함수
    equal: (val1, val2) => val1 === val2,
    // 3. ISO 날짜 문자열에서 날짜만 반환
    dateString: (isoString) => new Date(isoString).toLocaleDateString(),
};