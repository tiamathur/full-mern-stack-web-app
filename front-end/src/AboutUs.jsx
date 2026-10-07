import { useState, useEffect } from 'react'
import axios from 'axios'

const AboutUs = () => {
  const [about, setAbout] = useState(null)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_HOSTNAME}/about`)
      .then(response => setAbout(response.data))
      .catch(err => console.error(err))
  }, [])

  if (!about) return <p>Loading...</p>

  return (
    <>
      <h1>About Us</h1>
      <img src={about.imageUrl} alt={about.name} width="250" />
      <h2>{about.name}</h2>
      <p>{about.about_me}</p>
    </>
  )
}

export default AboutUs