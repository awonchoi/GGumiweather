document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('location-search');
    const searchButton = document.getElementById('search-button');
    const weatherDisplay = document.getElementById('weather-display');
    const translatedLocationsDiv = document.getElementById('translated-locations');

    const apiKey = 'b7a15f2384404d5688424441252408'; // weatherapi.com API 키

    // 제한적인 한국어-영어 도시 이름 매핑
    const koreanToEnglishCities = {
        '서울': 'Seoul',
        '부산': 'Busan',
        '대구': 'Daegu',
        '인천': 'Incheon',
        '광주': 'Gwangju',
        '대전': 'Daejeon',
        '울산': 'Ulsan',
        '세종': 'Sejong',
        '수원': 'Suwon',
        '고양': 'Goyang',
        '용인': 'Yongin',
        '창원': 'Changwon',
        '성남': 'Seongnam',
        '청주': 'Cheongju',
        '천안': 'Cheonan',
        '전주': 'Jeonju',
        '안산': 'Ansan',
        '포항': 'Pohang',
        '김해': 'Gimhae',
        '제주': 'Jeju',
        '도쿄': 'Tokyo',
        '뉴욕': 'New York',
        '런던': 'London',
        '파리': 'Paris',
        '베이징': 'Beijing',
        '상하이': 'Shanghai'
    };

    async function getWeatherData(location) {
        try {
            console.log('날씨 데이터 요청:', location);
            // URL 인코딩을 추가하여 특수문자 처리
            const encodedLocation = encodeURIComponent(location);
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodedLocation}&aqi=no&lang=ko`);
            console.log('API 응답 상태:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API 에러:', errorData);
                throw new Error(`날씨 정보를 가져오는 데 실패했습니다. (${response.status}: ${errorData.error?.message || '알 수 없는 오류'})`);
            }
            
            const data = await response.json();
            console.log('날씨 데이터:', data);
            displayWeather(data);
        } catch (error) {
            console.error('에러 발생:', error);
            displayError(error.message);
        }
    }

    function displayError(message) {
        weatherDisplay.innerHTML = `<p class="error">${message}</p>`;
    }

    searchButton.addEventListener('click', () => {
        const inputLocation = searchInput.value.trim();
        if (inputLocation) {
            // 한국어 입력 시 번역된 선택지를 보여줍니다.
            if (koreanToEnglishCities[inputLocation]) {
                displayTranslatedOptions(inputLocation);
            } else {
                // 매핑된 도시가 없으면 직접 검색
                getWeatherData(inputLocation);
                translatedLocationsDiv.innerHTML = ''; // 선택지 초기화
            }
        } else {
            displayError('도시 이름을 입력해주세요.');
            translatedLocationsDiv.innerHTML = ''; // 선택지 초기화
        }
    });

    function displayTranslatedOptions(koreanCity) {
        translatedLocationsDiv.innerHTML = ''; // 이전 선택지 초기화
        const englishCity = koreanToEnglishCities[koreanCity];
        if (englishCity) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'translation-message';
            messageDiv.textContent = `이 도시를 검색하고 싶나요?`;
            translatedLocationsDiv.appendChild(messageDiv);
            
            const optionDiv = document.createElement('div');
            optionDiv.className = 'translated-option';
            optionDiv.textContent = `${koreanCity} (${englishCity})`;
            optionDiv.addEventListener('click', () => {
                getWeatherData(englishCity);
                translatedLocationsDiv.innerHTML = ''; // 선택지 초기화
            });
            translatedLocationsDiv.appendChild(optionDiv);
        } else {
            translatedLocationsDiv.innerHTML = `<p>번역된 도시를 찾을 수 없습니다.</p>`;
        }
    }

    function setWeatherBackground(weatherCode, isDay) {
        let gradient;
        
        // 날씨 코드에 따른 배경 그라데이션 설정
        switch(weatherCode) {
            case 1000: // 맑음
                gradient = isDay ? 'linear-gradient(135deg, #87CEEB, #98FB98)' : 'linear-gradient(135deg, #191970, #4169E1)';
                break;
            case 1003: // 대체로 맑음
                gradient = isDay ? 'linear-gradient(135deg, #B0E0E6, #F0F8FF)' : 'linear-gradient(135deg, #2F4F4F, #4682B4)';
                break;
            case 1006: // 흐림
            case 1009: // 흐림
                gradient = isDay ? 'linear-gradient(135deg, #D3D3D3, #F5F5F5)' : 'linear-gradient(135deg, #696969, #A9A9A9)';
                break;
            case 1030: // 안개
                gradient = isDay ? 'linear-gradient(135deg, #F0F8FF, #E6E6FA)' : 'linear-gradient(135deg, #708090, #C0C0C0)';
                break;
            case 1063: // 가벼운 비
            case 1180: // 가벼운 비
            case 1183: // 가벼운 비
            case 1186: // 가벼운 비
            case 1189: // 가벼운 비
            case 1192: // 중간 비
            case 1195: // 강한 비
                gradient = isDay ? 'linear-gradient(135deg, #4682B4, #87CEEB)' : 'linear-gradient(135deg, #191970, #4169E1)';
                break;
            case 1066: // 가벼운 눈
            case 1114: // 가벼운 눈
            case 1117: // 강한 눈
            case 1210: // 가벼운 눈
            case 1213: // 가벼운 눈
            case 1216: // 중간 눈
            case 1219: // 중간 눈
            case 1222: // 강한 눈
            case 1225: // 강한 눈
                gradient = isDay ? 'linear-gradient(135deg, #F0F8FF, #E6E6FA)' : 'linear-gradient(135deg, #F8F8FF, #E6E6FA)';
                break;
            case 1087: // 천둥번개
            case 1273: // 가벼운 천둥번개
            case 1276: // 강한 천둥번개
                gradient = isDay ? 'linear-gradient(135deg, #4B0082, #8A2BE2)' : 'linear-gradient(135deg, #2F4F4F, #4B0082)';
                break;
            default:
                gradient = isDay ? 'linear-gradient(135deg, #87CEEB, #98FB98)' : 'linear-gradient(135deg, #191970, #4169E1)';
        }
        
        document.body.style.background = gradient;
    }

    function displayWeather(data) {
        // 이미지 URL을 올바르게 처리 (API에서 반환되는 URL이 //로 시작하므로 https: 추가)
        const iconUrl = data.current.condition.icon.startsWith('//') 
            ? `https:${data.current.condition.icon}` 
            : data.current.condition.icon;
        
        // 날씨에 맞는 배경 설정
        setWeatherBackground(data.current.condition.code, data.current.is_day);
        
        weatherDisplay.innerHTML = `
            <h2>${data.location.name}, ${data.location.country}</h2>
            <p>온도: ${data.current.temp_c}°C</p>
            <p>날씨: ${data.current.condition.text}</p>
            <img src="${iconUrl}" alt="날씨 아이콘" style="width: 64px; height: 64px;">
            <p>습도: ${data.current.humidity}%</p>
            <p>바람: ${data.current.wind_kph} km/h</p>
        `;
    }

    // 페이지 로드 시 서울 날씨를 기본으로 표시
    getWeatherData('Seoul');
});
