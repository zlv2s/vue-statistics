import axios from 'axios'
export const api = {

  fetchData(period, inputPackage) {
    const url = `https://api.npmjs.org/downloads/range/${period}/${inputPackage}`

    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(res => {
          if (res.status === 200) {
            resolve(res.data)
          }
        }).catch(error => {
          reject(error)
        })
    })
  }
}
