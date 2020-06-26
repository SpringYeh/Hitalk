let query = () => {
  this.loading.show()
  let cq = this.commonQuery()
  cq.limit(this.pageSize)
    .skip(this.page * this.pageSize)
    .find()
    .then(rets => {

      addSmilies() // 填充表情

      let len = rets.length
      if (len) {
        this.el.querySelector('.vlist').innerHTML = ''
        for (let i = 0; i < len; i++) {
          insertDom(rets[i], !0)
        }
        let _count = this.el.querySelector('.num')
        if (!_count) {
          // addSmilies() // 填充表情

          cq.count().then(len => {
            const _pageCount = len / this.pageSize
            this.el.querySelector('.count').innerHTML = `评论(<span class="num">${len}</span>)`

            const _pageDom = (_class, _text) => `<span class="${_class} page-numbers">${_text}</span>`
            let vpageDom = _pageDom('prev dn', '&lt;')
            for (let index = 1; index < _pageCount; index++) {
              vpageDom += _pageDom(`numbers ${index == 1 ? 'current' : ''}`, index)
            }
            vpageDom += _pageDom('next dn', '&gt;')
            this.el.querySelector('.vpage').innerHTML = vpageDom
            pageHandle(len)

            Event.on('click', this.el.querySelector('.vpage'), e => {
              const inc = v => e.target.className.split(' ').includes(v)
              if (inc('current') || inc('vpage')) {
                return
              }
              if (inc('numbers')) {
                this.page = Number(e.target.innerText) - 1
              } else if (inc('prev')) {
                this.page--
              } else if (inc('next')) {
                this.page++
              }
              query()
            })
          })
        } else {
          pageHandle(_count.innerText)
        }
      }
      this.loading.hide()
    })
    .catch(ex => {
      this.loading.hide()
      this.throw(ex)
    })
}
query()

let pageHandle = _count => {
  if (this.el.querySelector('.vpage .numbers.current')) {
    this.el.querySelector('.vpage .numbers.current').classList.remove('current')
  }
  this.el.querySelectorAll('.vpage .numbers')[this.page].classList.add('current')

  const domClass = {
    0: '.prev',
    [parseInt(_count / this.pageSize, 10) - 1]: '.next'
  }

  Object.values(domClass).map(e => this.el.querySelector(`.vpage ${e}`).classList.remove('dn'))
  if (domClass[this.page]) {
    this.el.querySelector(`.vpage ${domClass[this.page]}`).classList.add('dn')
    return
  }
}