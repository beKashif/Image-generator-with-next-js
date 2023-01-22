import Head from 'next/head'
import { useState } from 'react'
import axios from 'axios';


export default function Home() {

  const [token, setToken] = useState("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")
  const [prompt, setPrompt] = useState("")
  const [number, setNumber] = useState(4)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [type, setType] = useState("png")

  function generateImages () {
    if (token != "" && prompt != "")
    {
      setError(false);
      setLoading(true);
      axios.post(`/api/images?t=${token}&p=${prompt}&n=${number}`).then(
        (res) => {
          setResults(res.data.result);
          setLoading(false);
        }
      )
      .catch((err) => {
        setLoading(false);
        setError(true);
      });
    } else {
      setError(true);
    }
  }

  function download(url) {
    axios.post(`/api/download`, {url: url, type: true}).then(
      (res) => {
        const link = document.createElement("a");
        link.href = res.data.result;
        link.download = `${prompt}.${type.toLowerCase()}`;
        link.click();
      }
    )
    .catch((err) => {console.log(err);})
  }

  return (
    <div className="container">
      <Head>
        <title>Next Image Generator</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          Create images with
          <span className="titleColor">NextJs + Dalle2</span>
        </h1>
        <p className="description">
        
          <input
          id="prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your query"
          />
          
          <input
          id="number"
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter the number of images"
          max="10"
          />

          <button onClick={generateImages}>
            Generate
          </button>

        </p>

        <div>
          Download as: {" "}
          <select className="dSelect" id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option className="dOption" value="webp">Webp</option>
            <option className="dOption" value="png">Png</option>
            <option className="dOption" value="jpg">Jpg</option>
            <option className="dOption" value="avif">Avif</option>
          </select>
          {" "}
          You can download the image with a single click
        </div>
        <br />
        {error ? ( <div className="error">Something went wrong. Try again.</div> ) : ( <></> )}
        {loading && <p>Loading...</p>}

        <div className="grid">
          {
            results.map((result) => {
              return (
                <div className="card">
                  <img
                  className="imgPreview"
                  src={result.url}
                  onClick={() => download(result.url)}
                  />
                </div>
              )
            })
          }
        </div>

      </main>

    </div>
  )
}