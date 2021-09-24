import React from 'react'

export default function search() {
  return (
    <div>
      <div id="search">
        <input class="form-control" type="search" placeholder="Search" aria-label="Search" />
        <div id="search-results">
          <div class="search-result-item">
            <div class="search-result-item-img">
              <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg" alt="" />
            </div>
            <div class="search-result-item-info">
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
