import { useEffect, useState } from 'react'
import './App.css'

interface Stops {
  [key: string]: number[]
}

interface Station {
  id: string
  location: number[]
  name: string
  stops: Stops
}

interface ArrivalTime {
  route: string
  time: string
}
interface ArrivalTimes {
  N?: ArrivalTime[]
  S?: ArrivalTime[]
}

function App() {
  const [stations, setStations] = useState<Station[]>([])
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [selectedArrivalTimes, setSelectedArrivalTimes] =
    useState<ArrivalTimes>({})

  useEffect(() => {
    if (stations.length === 0) {
      try {
        fetch(
          'https://raw.githubusercontent.com/jonthornton/MTAPI/master/data/stations.json',
        )
          .then((res) => res.json())
          .then((data) => {
            let stationArr = []
            for (const key in data) {
              stationArr.push(data[key])
            }

            setStations(stationArr)
          })
      } catch (error) {
        console.log(error)
      }
    }
  }, [])

  const handler = (id: string) => {
    return () => {
      setSelectedStation(id)
      try {
        fetch(
          `https://cors-anywhere.herokuapp.com/https://api.wheresthefuckingtrain.com/by-id/${id}`,
        )
          .then((res) => res.json())
          .then((data) => {
            setSelectedArrivalTimes(data.data[0])
          })
        console.log(selectedArrivalTimes)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stations</h1>
        <ul>
          {stations.map(({ id, name }) => (
            <li key={id}>
              <h3>{name}</h3>
              <button onClick={handler(id)}>Get Arrival Times</button>
              {id === selectedStation && (
                <div>
                  <h3>Northbound</h3>
                  <ul>
                    {selectedArrivalTimes.N &&
                      selectedArrivalTimes['N'].map(({ route, time }) => (
                        <li>{`route: ${route}, arrival time: ${time}`}</li>
                      ))}
                  </ul>
                  <h3>Southbound</h3>
                  <ul>
                    {selectedArrivalTimes.S &&
                      selectedArrivalTimes['S'].map(({ route, time }) => (
                        <li>{`route: ${route}, arrival time: ${time}`}</li>
                      ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </header>
    </div>
  )
}

export default App
