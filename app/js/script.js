// глобальные переменные

const BACKEND_URL = `${document.URL}http`;
const main = document.querySelector('.main');

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
    elements_selector: "img.lazy-loading"
});




// загрузка яндекс карт при наводке

const contactsMap = document.querySelector('.contacts__map');

if (contactsMap) {
    function addMap() {
        contactsMap.innerHTML = `<iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A92a2604a7f331877543f32129745de455721afa2160a2df1bf49ae7229f4c614&amp;source=constructor" width="100%" height="339" frameborder="0"></iframe>`;
        
        contactsMap.removeEventListener('mouseover', addMap)
    }

    const mapHover = contactsMap.addEventListener('mouseover', addMap);
}



// скролл навигации

const navigationLinks = document.querySelectorAll('.navigation__link[data-goto]');

if (navigationLinks) {
    navigationLinks.forEach(navigationLink => {
        navigationLink.addEventListener('click', e => {
            const navigationLink = e.target;
            
            if (navigationLink.dataset.goto && document.querySelector(navigationLink.dataset.goto)) {
                const gotoBlock = document.querySelector(navigationLink.dataset.goto);

                // нахождение высоты для определенного блока

                let gotoBlockValue = (gotoBlock.getBoundingClientRect().top + pageYOffset)*0.97;

                if (window.screen.width <= 768) {
                    gotoBlockValue = (gotoBlock.getBoundingClientRect().top + pageYOffset)*0.99;
                }   

                if (headerBurgerMenu) {
                    headerBurgerMenu.classList.toggle('_active');
                }

                if (navigation) {
                    navigation.classList.toggle('_right-0');
                }

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
        if (pageYOffset >= 400) { // стрелка убирается, если высота <= 400
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




// фиксированное меню

const navigation = document.querySelector('.navigation');
const navigationOffsetTop = navigation.offsetTop;

if (navigation) {

    window.addEventListener('scroll', throttle(function() {

        // при экранах <= 768 ширины ничег не происходит

        if (window.screen.width <= 768) return;

        // фиксированное меню при скролле

        if (pageYOffset >= navigationOffsetTop) { // проверка высоты, если она больше, чем позиция навигации, то становится фиксированной
            navigation.style.position = 'fixed';
            main.style.marginTop = navigation.offsetHeight + 20 + 'px';
            return;
        }

        main.style.marginTop = '0';
        navigation.style.position = 'static';
        return;
    }, 10));
}




// активаця модального окно

(() => {
    const buttonTelephone = document.querySelectorAll('.button__telephone');
    const servicesListPrice = document.querySelectorAll('.services__list_price');

    const modal = document.querySelector('.modal');

    function sendData(modalInputName, modalInputTelephone, modalInputText) {
        const data = {
            name: modalInputName,
            telephone: modalInputTelephone,
            text: modalInputText
        };

        // отправка данных на почту, и после успеха, убирается модальное окно

        return fetch(`${BACKEND_URL}/mail.php`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
            .then(response => {
                removeModal();
            })
    }

    function verificationData(modalInputName, modalInputTelephone, modalInputText) {
        const consent = document.querySelector('.input-checkbox__input').checked;
        const modalInputs = document.querySelector('.modal__inputs');

        const errors = [];

        deleteErrorP(modalInputs.querySelectorAll('p.p._error'));

        if (!consent) {
            errors.push('Не подтверждено согласие на обработку');
            alert(errors[0]);
        }

        if (modalInputName.value.length <= 3) {
            errors.push('Имя меньше 3 символов');
            setError(modalInputName, errors.at(-1), modalInputs);
        }

        if (modalInputTelephone.value.length <= 5) {
            errors.push('Телефон меньше 5 символов');
            setError(modalInputTelephone, errors.at(-1), modalInputs);
        }

        if (modalInputText.value.length < 10) {
            errors.push('Сообщение меньше 10 символов');
            setError(modalInputText, errors.at(-1), modalInputs);
        }

        if (modalInputText.value.length > 1000) {
            errors.push('Сообщение больше 1000 символов');
            setError(modalInputText, errors.at(-1), modalInputs);
        }

        if (errors[0]) {
            [modalInputName, modalInputTelephone, modalInputText].forEach(elem => {
                elem.addEventListener('mouseover', function() {
                    deleteError(this)
                })
            })
            return;
        }

        // если нет ошибок, то данные отправляются в бэкенд, потом на почту

        sendData(modalInputName.value.trim(), modalInputTelephone.value.trim(), modalInputText.value.trim());
    }

    function setError(elem, error, container) {
        const errors = container.querySelectorAll('p.p._error')

        // удаление уже существующих схожих ошибок

        if (errors) {
            errors.forEach(elem => {
                if (elem.textContent === error) {
                    elem.remove();
                }
            })
        }

        // запись ошибки в html

        elem.insertAdjacentHTML('beforebegin', `<p class="p _error">${error}</p>`);
        return elem.classList.add('_error');
    }

    function deleteErrorP(errors) {
        errors.forEach(elem => {
            elem.remove()
        })
    }

    function deleteError(elem) {
        if (elem.classList.contains('_error')) {
            return elem.classList.remove('_error');
        }
    }

    // появление модального окна

    function createEvent() {
        const modalButton = document.querySelector('.modal__button');

        activeAnimation();

        // модальное окно убереться, если кликнуть по экрану не в зоне модального окна

        modal.addEventListener('click', e => {
            if (e.target.classList[0] == 'modal') {
                removeModal();
            }
        })

        // при нажатии происходит проверка валидации

        modalButton.addEventListener('click', async e => {
            const modalInputName = document.querySelector('.modal__input_name');
            const modalInputTelephone = document.querySelector('.modal__input_telephone');
            const modalInputText = document.querySelector('.modal__input_text');

            verificationData(modalInputName, modalInputTelephone, modalInputText);
        })
    }

    // добавление css свойств для анимации

    function activeAnimation() {
        modal.style.top = '0';
        modal.style.animation = 'blackout-modal 1.5s forwards';
        document.body.classList.add('overflow-y-hidden');
    }

    // удаление css свойств для анимации

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




// слайдер (Обслуживаем автомобили брендов)

const serviceBrandSlider = document.querySelector('.service-brand_slider_container');

if (serviceBrandSlider) {
    new Swiper('.service-brand_slider_container', {
        slidesPerView: 5,
        spaceBetween: 45,
        breakpoints: {
            280: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1280: {
                slidesPerView: 5,
                spaceBetween: 45,
            }
        },
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
    });
}

// слайдер (Отзывы)

const reviewsSlider = document.querySelector('.reviews_slider_container');

if (reviewsSlider) {
    new Swiper('.reviews_slider_container', {
        slidesPerView: 1, // количество показаных слайдов
        loop: true, // бесконечное проигрывание
        lazy: { // ленивая загрузка
            loadOnTransitionStart: true,
            loadPrevNext: true
        },
        preloadImages: true,
        watchSlidesProgress: true,
        watchSlidesVisibility: false,
        navigation: { // стрелки отвечающие за навигацию
            nextEl: '.reviews_slider__arrow_right',
            prevEl: '.reviews_slider__arrow_left'
        }
    })
  
}





// бургер меню 

const headerBurgerMenu = document.querySelector('.header__burger-menu');

if (headerBurgerMenu && navigation) {
    // при клике на бургер меню происходит удаление или добавление класса
    headerBurgerMenu.addEventListener('click', e => {
        headerBurgerMenu.classList.toggle('_active');
        navigation.classList.toggle('_right-0');
    })
}