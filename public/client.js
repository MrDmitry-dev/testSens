let pairsCoordinates = [] // Получить координаты попарно
let pairsCoordinatesReversed = []

let coordinates // Объект, содержащий координаты
let distance // Длина ломанной (в координатрых единицах)

function calculateDistanceLines(dots) {
    let sumOfRoute = 0
    for (let i = 0; i < dots.length - 1; i++) { // Расчет длины ломанной по координатам
        sumOfRoute += Math.sqrt(
            Math.pow(dots[i + 1][0] - dots[i][0], 2) +
            Math.pow(dots[i + 1][1] - dots[i][1], 2)
        )
    }
    return sumOfRoute
}

async function convertPair() { // Меняет оси X и Y (Без этого консоль выдает ошибку 400)
    pairsCoordinates.forEach(element => {
        pairsCoordinatesReversed.push(element.reverse())
    })
}

function drawMap() {
    ymaps.ready(function() {
        var myMap = new ymaps.Map('map', {
            center: [42.845404364, 132.44898522200018],
            zoom: 2,
            controls: []
        });

        // Создаем ломаную, используя класс GeoObject.
        var myGeoObject = new ymaps.GeoObject({
            // Описываем геометрию геообъекта.
            geometry: {
                // Тип геометрии - "Ломаная линия".
                type: "LineString",
                // Указываем координаты вершин ломаной.
                coordinates: pairsCoordinates
            },
            // Описываем свойства геообъекта.
            properties: {
                // Содержимое хинта.
                hintContent: distance,
                // Содержимое балуна.
                balloonContent: distance
            }
        }, {
            // Задаем опции геообъекта.
            draggable: false,
            // Цвет линии.
            strokeColor: "#10e69b",
            // Ширина линии.
            strokeWidth: 3
        });

        myMap.geoObjects
            .add(myGeoObject)


        for (let i = 0; i < pairsCoordinates.length; i++) { // Прорисовка точек по координатам
            var myGeoObject1 = new ymaps.GeoObject({
                geometry: {
                    type: "Point", // тип геометрии - точка
                    coordinates: pairsCoordinates[i] // координаты точки
                }
            });
            // Размещение геообъекта на карте.
            myMap.geoObjects.add(myGeoObject1);
        }
    });
}

async function transformToPairs(notPairs) { // Трансформация полученного объекта GeoJSON в массив координат.
    await notPairs.forEach(element => {
        pairsCoordinates.push(element[0][0])
    })

}

async function getCoordinates() { // Получение координат от сервера ОСНОВНАЯ ФУНКЦИЯ

    res = await fetch('/getCoordinates')
    coordinates = await res.json()

    await transformToPairs(coordinates)
    await convertPair(pairsCoordinates)

    distance = calculateDistanceLines(pairsCoordinatesReversed)
    drawMap()
    console.log(distance);

}

// Исполняемый код //
getCoordinates()
    ////////////////////