// глобальные переменные

const BACKEND_URL = 'http://service/http';
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
    elements_selector: "img"
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
        if (pageYOffset >= 400) {
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
        if (window.screen.width < 768) return;

        if (pageYOffset >= navigationOffsetTop) {
            navigation.style.position = 'fixed';
            main.style.marginTop = navigation.offsetHeight + 50 + 'px';
            return;
        }

        main.style.marginTop = '0';
        navigation.style.position = 'static';
        return;
    }, 50));
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

        return fetch(`${BACKEND_URL}/mail.php`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);
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

        sendData(modalInputName.value.trim(), modalInputTelephone.value.trim(), modalInputText.value.trim());
    }

    function setError(elem, error, container) {
        const errors = container.querySelectorAll('p.p._error')

        if (errors) {
            errors.forEach(elem => {
                if (elem.textContent === error) {
                    elem.remove();
                }
            })
        }

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

    function createEvent() {
        const modalButton = document.querySelector('.modal__button');

        activeAnimation();

        modal.addEventListener('click', e => {
            if (e.target.classList[0] == 'modal') {
                removeModal();
            }
        })

        modalButton.addEventListener('click', async e => {
            const modalInputName = document.querySelector('.modal__input_name');
            const modalInputTelephone = document.querySelector('.modal__input_telephone');
            const modalInputText = document.querySelector('.modal__input_text');

            verificationData(modalInputName, modalInputTelephone, modalInputText);
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
            400: {
                slidesPerView: 2,
            },
            576: {
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