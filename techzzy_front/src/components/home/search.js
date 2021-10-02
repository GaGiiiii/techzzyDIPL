import React from 'react'

export default function search() {
  return (
    <div>
      <div id="search">
        <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
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
