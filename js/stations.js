export class StationManager {
  stations = [];
  constructor() {}
  appendStation(line, name, floorNum, imgSrc) {
    this.stations.push(new Station(line, name, floorNum, imgSrc));
  }
  getStation(name) {
    for (let i = 0; i < this.stations.length; i++) {
      const station = this.stations[i];
      if (station.name === name){
        return station;
      }
    }
    console.error(`there is no station such name is "${name}."`);
    return;
  }
}
export class Station {
  line;
  name;
  floorNum;
  imgSrc;
  elevatorLocation;
  constructor(line, name, floorNum, imgSrc, elevatorLocation) {
    this.line = line; // Array[String]
    this.name = name; // String
    this.floorNum = floorNum; // Array[0: lowest floor 1: highest floor]
    this.imgSrc = imgSrc; // Array[String]
    this.elevatorLocation = elevatorLocation; // Array[{lat: latitude, lng: longitude}]
  }
  getLine() {
    return this.line;
  }
  getName() {
    return this.name;
  }
  getFloorNum() {
    return this.floorNum;
  }
  getImgSrc() {
    return this.imgSrc;
  }
  getElevatorLocation() {
    return this.elevatorLocation;
  }
}
export const stationManager = new StationManager();

stationManager.appendStation(["인천 1호선"], "계양", [0, 1], [], [{lat: 0, lng: 0}]); // 2번 출입구 근처 <환승역>
stationManager.appendStation(["인천 1호선"], "귤현", [0, 1], [], [{lat: 0, lng: 0}]); // 1번 출입구 휠체어리프트
stationManager.appendStation(["인천 1호선"], "박촌", [-2, -1], [], [{lat: 0, lng: 0}]); // 2번 출입구 근처
stationManager.appendStation(["인천 1호선"], "임학", [-2, -1], [], [{lat: 0, lng: 0}]); // 1번 출입구 근처
stationManager.appendStation(["인천 1호선"], "계산", [-3, -1], [], [{lat: 0, lng: 0}]); // 6번 출입구 근처
stationManager.appendStation(["인천 1호선"], "경인교대입구", [-3, -1], [], [{lat: 0, lng: 0}]); // 6번 출입구 근처
stationManager.appendStation(["인천 1호선"], "작전", [-2, -1], [], [{lat: 0, lng: 0}]); // 2번 출입구 근처
stationManager.appendStation(["인천 1호선"], "갈산", [-2, -1], [], [{lat: 0, lng: 0}]); // 4번 출입구 근처
stationManager.appendStation(["인천 1호선"], "부평구청", [-3, -1], [], [{lat: 0, lng: 0}]); // 3번, 4번 출입구 근처
stationManager.appendStation(["인천 1호선"], "부평시장", [-2, -1], [], [{lat: 0, lng: 0}]); // 1번 출입구 근처
stationManager.appendStation(["인천 1호선"], "부평", [-4, 0], [], [{lat: 0, lng: 0}]); // 6번 출입구 근처 <환승역>
stationManager.appendStation(["인천 1호선"], "동수", [-4, -1], [], [{lat: 0, lng: 0}]); // 2번 출입구 근처
stationManager.appendStation(["인천 1호선"], "부평삼거리", [-4, -1], [], [{lat: 0, lng: 0}]); // 2번 출입구 근처
stationManager.appendStation(["인천 1호선"], "간석오거리", [-4, -1], [], [{lat: 0, lng: 0}]); // 5번 출입구 근처
stationManager.appendStation(["인천 1호선", "인천 2호선"], "인천시청", [-4, -1], [require("../images/station_인천 1호선_인천시청_-4.jpg")], [{lat: 0, lng: 0}]); // 9번 출입구 근처 <환승역>
stationManager.appendStation(["인천 1호선"], "예술회관", [-3, -1], [], [{lat: 0, lng: 0}]); // 8번 출입구 근처
stationManager.appendStation(["인천 1호선"], "인천터미널", [-2, -1], [], [{lat: 0, lng: 0}]); // 4번 출입구 근처
stationManager.appendStation(["인천 1호선"], "문학경기장", [-2, -1], [], [{lat: 0, lng: 0}]); // 2번 출입구 근처
stationManager.appendStation(["인천 1호선"], "선학", [-2, -1], [], [{lat: 0, lng: 0}]); // 4번 출입구 근처 외부 승강기
stationManager.appendStation(["인천 1호선"], "신연수", [-2, -1], [], [{lat: 0, lng: 0}]); // 1번 출입구 근처
stationManager.appendStation(["인천 1호선"], "원인재", [-2, 1], [], [{lat: 0, lng: 0}]);  // 6번 출입구 근처 <환승역>
stationManager.appendStation(["인천 1호선"], "동춘", [-2, -1], [], [{lat: 0, lng: 0}]); // 3번 출입구 근처
stationManager.appendStation(["인천 1호선"], "동막", [-2, -1], [], [{lat: 0, lng: 0}]); // 1,3번 출입구 근처
stationManager.appendStation(["인천 1호선"], "캠퍼스타운", [-2, -1], [], [{lat: 37.387798, lng: 126.662127}, {lat: 37.387589, lng: 126.662516}, {lat: 37.388212, lng: 126.661691}]);
stationManager.appendStation(["인천 1호선"], "테크노파크", [-2, -1], [], [{lat: 37.382009, lng: 126.656393}]);
stationManager.appendStation(["인천 1호선"], "지식정보단지", [-2, -1], [], [{lat: 37.378277, lng: 126.645748}]);
stationManager.appendStation(["인천 1호선"], "인천대입구", [-2, -1], [], [{lat: 37.385912, lng: 126.639082}]);
stationManager.appendStation(["인천 1호선"], "센트럴파크", [-2, -1], [], [{lat: 37.393555, lng: 126.634813}]);
stationManager.appendStation(["인천 1호선"], "국제업무지구", [-2, -1], [], [{lat: 37.400033, lng: 126.629742}]);
stationManager.appendStation(["인천 1호선"], "송도달빛축제공원", [-2, -1], [], [{lat: 37.406769, lng: 126.625803}, {lat: 37.406957, lng: 126.626277}]);
