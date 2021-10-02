import React from 'react'
import './search.css';
import { useState } from 'react';

export default function Search({ products }) {
  const [input, setInput] = useState("");

  return (
    <div>
      <div id="search">
        <input className="form-control" type="search" placeholder="Search" aria-label="Search" value={input} onChange={(e) => setInput(e.target.value)} />
        <div id="search-results">
          <div className="search-result-item">
            <div className="search-result-item-img">
              <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg" alt="" />
            </div>
            <div className="search-result-item-info">
              <p>Ime | Kategorija</p>
              <p>Ocena</p>
              <p>Cena</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
