(function () {
  // 宣告常、變數＆設定DOM節點
  const index = 'https://lighthouse-user-api.herokuapp.com/api/v1/users/'
  const data = []
  const dataPanel = document.querySelector('#data-panel')
  const searchField = document.querySelector('#search-field')
  let searchBox = document.querySelector('#keyword-search')
  const navbarButton = document.querySelector('.navbar-nav')
  const typeList = document.querySelector('#display-typing')
  let displayType = true
  const pageButtonGroup = document.querySelector('#pagination')
  const ITEM_PER_PAGE = 12
  let paginationData = []
  let currentPage = 1
  finalData(data)

  function finalData(data) {
    axios.get(index).then(response => {
      data.push(...response.data.results)
      data.forEach(item => item.favorite = false)
      for (let i = 0; i < data.length; i++) {
        data[i].index = i
      }
      getTotalPages(data)
      getPageData(1, data, displayType)
    }).catch(err => console.log(err))
  }

  // 組合版面
  function displayDataList(data, displayType) {
    let htmlContent = ''

    if (displayType) {
      data.forEach(function (item) {
        let userName = item.email.slice(0, item.email.indexOf('@'))
        item.favorite ? htmlContent += `
        <div class="col-sm-4 col-md-3 col-lg-3  mb-3" id="cards-container">
          <div class="card h-100">
            <img class="card-img-top show-info" src="${item.avatar}" alt="Card image cap" data-toggle="modal" data-target="#show-info-modal" data-id="${item.id}">
            <a class="favorite-icon" href="javascript:;" id="${item.index}"><i class="fa fa-heart fa-lg" aria-hidden="true"></i></a>
            <div class="card-body">
              <p class="card-title text-center mb-0 username">${userName}</p>
            </div>

            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-default btn-block btn-show-contact" data-toggle="modal" data-target="#show-contact-modal" data-id="${item.id}">
                <a href="mailto:${item.email}">Contact</a>
              </button>
            </div>
          </div>
        </div>
      ` : htmlContent += `
        <div class="col-sm-4 col-md-3 col-lg-3  mb-3" id="cards-container">
          <div class="card h-100">
            <img class="card-img-top show-info" src="${item.avatar}" alt="Card image cap" data-toggle="modal" data-target="#show-info-modal" data-id="${item.id}">
            <a class="favorite-icon" href="javascript:;" id="${item.index}"><i class="fa fa-heart-o fa-lg" aria-hidden="true"></i></a>
            <div class="card-body">
              <p class="card-title text-center mb-0 username">${userName}</p>
            </div>

            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-default btn-block btn-show-contact" data-toggle="modal" data-target="#show-contact-modal" data-id="${item.id}">
                <a href="mailto:${item.email}">Contact</a>
              </button>
            </div>
          </div>
        </div>
      `
      })
    } else {
      data.forEach(function (item) {
        let userName = item.email.slice(0, item.email.indexOf('@'))

        item.favorite ? htmlContent += `
          <li class="list-group-item col-12 border-right-0 border-left-0 d-flex align-items-center">
            <div class="title d-inline-flex col-10">
              <div class="favorite-icon-wrapper col-1">
                <a class="favorite-icon" href="javascript:;" id="${item.index}">
                  <i class="fa fa-heart fa-lg" aria-hidden="true"></i>
                </a>
              </div>
              <div class="username-wrapper col-9">
                <h5 class="username">${userName}</h5>
              </div>
            </div>
            <div class="button-group d-inline-flex mr-2">
              <button type="button" class="btn btn-info btn-default btn-block btn-show-info" data-toggle="modal" data-target="#show-info-modal" data-id="${item.id}">Info</button>
            </div>
            <div class="button-group d-inline-flex">
              <button type="button" class="btn btn-primary btn-default btn-block btn-show-contact" data-toggle="modal" data-target="#show-contact-modal" data-id="${item.id}">
                <a href="mailto:${item.email}">Contact</a>
              </button>
            </div>
          </li>
        ` : htmlContent += `
          <li class="list-group-item col-12 border-right-0 border-left-0 d-flex align-items-center">
            <div class="title d-inline-flex col-10">
              <div class="favorite-icon-wrapper col-1">
                <a class="favorite-icon" href="javascript:;" id="${item.index}">
                  <i class="fa fa-heart-o fa-lg" aria-hidden="true"></i>
                </a>
              </div>
              <div class="username-wrapper col-9">
                <h5 class="username">${userName}</h5>
              </div>
            </div>
            <div class="button-group d-inline-flex mr-2">
              <button type="button" class="btn btn-info btn-default btn-block btn-show-info" data-toggle="modal" data-target="#show-info-modal" data-id="${item.id}">Info</button>
            </div>
            <div class="button-group d-inline-flex">
              <button type="button" class="btn btn-primary btn-default btn-block btn-show-contact" data-toggle="modal" data-target="#show-contact-modal" data-id="${item.id}">
                <a href="mailto:${item.email}">Contact</a>
              </button>
            </div>
          </li>
        `
      })
    }

    dataPanel.innerHTML = htmlContent
  }

  // 依性別組成新array，調用版面頁數計算及頁面呈現函式 (精簡程式碼)
  function seperateGender(event) {
    let group = event.target
    let groupData = []
    if (group.textContent === 'Male') {
      groupData = data.filter(item => item.gender === 'male')
    } else if (group.textContent === 'Female') {
      groupData = data.filter(item => item.gender === 'female')
    } else {
      groupData = data
    }
    getTotalPages(groupData)
    getPageData(1, groupData, displayType)
  }

  // 頁數計算並寫回html
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pageButtonGroup.innerHTML = pageItemContent
  }

  // 切出各頁資料，調用頁面呈現函式
  function getPageData(pageNum, data, displayType) {
    paginationData = data || paginationData
    let startWith = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(startWith, startWith + ITEM_PER_PAGE)
    displayDataList(pageData, displayType)
  }

  //   組合url，call API取得資料後回傳
  function getInfo(id) {
    const url = index + id

    axios.get(url).then(response => {
      const personal = response.data
      showInfo(personal)
    })
  }

  // Modal頁面資料組合
  function showInfo(personal) {
    const modalTitle = document.querySelector('#show-info-title')
    const modalImage = document.querySelector('#show-info-image')
    const modalUpdateDate = document.querySelector('#show-update-date')
    const modalRegion = document.querySelector('#region')
    const modalGender = document.querySelector('#gender')
    const modalBirthday = document.querySelector('#dob')
    const modalEmail = document.querySelector('#email')

    modalTitle.textContent = `${personal.name} ${personal.surname}`
    modalImage.innerHTML = `<img src="${personal.avatar}" class="img-fluid" alt="Resposive image">`
    modalUpdateDate.textContent = `Last updated on ${personal.updated_at.slice(0, personal.updated_at.indexOf('T'))}`
    modalRegion.textContent = `Region: ${personal.region}`
    modalGender.textContent = `Gender: ${personal.gender}`
    modalBirthday.textContent = `Birthday: ${personal.birthday}`
    modalEmail.innerHTML = `E-mail: <a href="mailto:${personal.email}">${personal.email}</a>`
  }

  // 導覽列按鈕監聽器設置
  navbarButton.addEventListener('click', event => {
    if (event.target.textContent === 'Male' || event.target.textContent === 'Female') {
      seperateGender(event)
    } else if (event.target.textContent === 'Favorite') {
      const favoriteItems = []
      data.map(item => {
        if (item.favorite === true) {
          favoriteItems.push(item)
        }
      })
      getTotalPages(favoriteItems)
      getPageData(1, favoriteItems, displayType)
    } else {
      getTotalPages(data)
      getPageData(1, data, displayType)
    }
  })

  // 搜尋欄位監聽器設置 & 搜尋功能 & 頁面呈現
  searchBox.addEventListener('input', event => {
    let results = []
    const regex = new RegExp(searchBox.value, 'i')

    results = data.filter(account => account.email.slice(0, account.email.indexOf('@')).match(regex))
    getTotalPages(results)
    getPageData(1, results, displayType)
  })
  searchField.addEventListener('submit', event => {
    event.preventDefault()
  })

  // 選擇模式監聽器設置 & 判斷式 (精簡程式碼)
  typeList.addEventListener('click', event => {
    if (event.target.className === 'fa fa-th fa-2x' || event.target.innerHTML.includes('fa fa-th')) {
      displayType = true
    } else if (event.target.className === 'fa fa-bars fa-2x' || event.target.innerHTML.includes('fa fa-bars')) {
      displayType = false
    }
    getTotalPages(paginationData)
    getPageData(currentPage, paginationData, displayType)
  })

  // 使用者頭像(圖片模式)＆ info button(列表模式)監聽器設置
  dataPanel.addEventListener('click', event => {
    if (event.target.matches('.show-info') || event.target.matches('.btn-show-info')) {
      getInfo(event.target.dataset.id)
    } else if (event.target.matches('.fa-heart-o')) {
      data[event.target.parentElement.id].favorite = true
      event.target.classList.add('fa-heart')
      event.target.classList.remove('fa-heart-o')
    } else if (event.target.matches('.fa-heart')) {
      data[event.target.parentElement.id].favorite = false
      event.target.classList.add('fa-heart-o')
      event.target.classList.remove('fa-heart')
    }
  })

  // 分頁監聽器設置，調用頁面呈現函式 (highlight當前頁面)
  pageButtonGroup.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      for (let listItem of pageButtonGroup.children) {
        listItem.classList.remove('active')
      }
      event.target.parentElement.classList.add('active')
      currentPage = event.target.dataset.page
      getPageData(currentPage, paginationData, displayType)
    }
  })
})()