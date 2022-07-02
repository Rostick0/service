const throttle = (func, ms) => { // объявляем функцию throttle

    let locked = false // переменная которая отвечает за блокировку вызова функции

    return function() { // эта функция запускается при каждом событии движения курсора

      if (locked) return // если заблокировано, то прекращаем выполнение этой функции

      const context = this // запоминаем передаваемую функцию func
      const args = arguments // запоминаем параметры передаваемой функции func

      locked = true // блокируем вызов функции

      setTimeout(() => { // устанавливаем время ожидания

        func.apply(context, args) // выполняем переданную функцию func
        locked = false // снимаем блокировку

      }, ms) // подставляем значение параметра ms

    }
}




// скролл навигации

const navigationLinks = document.querySelectorAll('.navigation__link[data-goto]');

if (navigationLinks) {
    navigationLinks.forEach(navigationLink => {
        navigationLink.addEventListener('click', e => {
            const navigationLink = e.target;
            
            if (navigationLink.dataset.goto && document.querySelector(navigationLink.dataset.goto)) {
                const gotoBlock = document.querySelector(navigationLink.dataset.goto);
                const gotoBlockValue = (gotoBlock.getBoundingClientRect().top + pageYOffset)*0.99;
                console.log(gotoBlockValue)
            

                // if (burgerMenu.classList.contains('_active')) {
                //     removeActive(burgerButton);
                //     removeActive(burgerMenu);
                //     removeActive(personLanguage);
                //     document.body.classList.remove('_lock');
                // }

                window.scrollTo({
                    top: gotoBlockValue,
                    behavior: 'smooth'
                });

                e.preventDefault();
            }
        });
    });
}




// стрелка для скролла

const arrowToTop = document.querySelector('.arrow__to-top');

if (arrowToTop) {
    function scrollTodsa() {
        console.log(pageYOffset);
    }

    window.addEventListener('scroll', throttle(function() {
        console.log(pageYOffset);
        if (pageYOffset >= 800) {
            arrowToTop.classList.remove('_no-active');
            return;
        }

        arrowToTop.classList.add('_no-active');
        return;
    }, 500));

    arrowToTop.addEventListener('click', e => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    })
}




// модальное окно

const modal = document.querySelector('.modal');
