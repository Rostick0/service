// глобальные функции

const throttle = (func, ms) => {

    let locked = false

    return function() {

      if (locked) return

      const context = this
      const args = arguments

      locked = true

      setTimeout(() => {

        func.apply(context, args)
        locked = false

      }, ms)

    }
}




// ленивая загрузка

new LazyLoad({
    elements_selector: "img"
});



// скролл навигации

const navigationLinks = document.querySelectorAll('.navigation__link[data-goto]');

if (navigationLinks) {
    navigationLinks.forEach(navigationLink => {
        navigationLink.addEventListener('click', e => {
            const navigationLink = e.target;
            
            if (navigationLink.dataset.goto && document.querySelector(navigationLink.dataset.goto)) {
                const gotoBlock = document.querySelector(navigationLink.dataset.goto);
                const gotoBlockValue = (gotoBlock.getBoundingClientRect().top + pageYOffset)*0.99;         

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




// стрелка для скролла до верха

const arrowToTop = document.querySelector('.arrow__to-top');

if (arrowToTop) {

    window.addEventListener('scroll', throttle(function() {
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




// активаця модального окно

(() => {
    const buttonTelephone = document.querySelectorAll('.button__telephone');
    const servicesListPrice = document.querySelectorAll('.services__list_price');

    const modal = document.querySelector('.modal');

    function createEvent() {
        const modalButton = document.querySelector('.modal__button');

        activeAnimation();

        modal.addEventListener('click', e => {
            if (e.target.classList[0] == 'modal') {
                removeModal();
            }
        })

        modalButton.addEventListener('click', async e => {
            const modalInputName = document.querySelector('.modal__input_name').value.trim();
            const modalInputTelephone = document.querySelector('.modal__input_telephone').value.trim();
            const modalInputText = document.querySelector('.modal__input_text').value.trim();

            const data = {
                name: modalInputName,
                telephone: modalInputTelephone,
                text: modalInputText
            };

            console.log(JSON.stringify(data))

            removeModal();

            // return await fetch('', {
            //     method: 'POST',
            //     body: JSON.stringify(data)
            // })
        })
    }

    function activeAnimation() {
        modal.style.top = '0';
        modal.style.animation = 'blackout-modal 1.5s forwards';
        document.body.classList.add('overflow-y-hidden');
    }

    function removeModal() {
        modal.style.animation = '';
        modal.style.top = '-100%';
        document.body.classList.remove('overflow-y-hidden');
    }

    if (buttonTelephone) {
        buttonTelephone.forEach(button => {
            button.addEventListener('click', e => createEvent())
        })
    }

    if (servicesListPrice) {
        servicesListPrice.forEach(button => {
            button.addEventListener('click', e => createEvent())
        })
    }
})()




// слайдер

const serviceBrand = document.querySelector('.service-brand');

if (serviceBrand) {
    new Swiper('.service-brand_slider_container', {
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1280: {
                slidesPerView: 5,
            }
        },
        slidesPerView: 5,
        spaceBetween: 45,
        loop: true,
        lazy: {
            loadOnTransitionStart: true,
            loadPrevNext: true
        },
        preloadImages: true,
        watchSlidesProgress: true,
        watchSlidesVisibility: false,
        navigation: {
            nextEl: '.slider__arrow_right',
            prevEl: '.slider__arrow_left'
        }
    })
  
}